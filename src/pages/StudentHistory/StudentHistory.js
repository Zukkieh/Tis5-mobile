import React, { useEffect, useState, useCallback } from 'react';
import { Input, BackgroundContainer, DefaultText, DefaultContainer, DefaultButton, DefaultModalView, DefaultSubmitButton } from '../../DefaultStyledComponents';
import Circle from 'react-native-progress/Circle';
import { Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, AsyncStorage, FlatList, View } from 'react-native';
import api from '../../services/api.js';
import { ListItem } from './styles.js';
import {Picker} from '@react-native-community/picker';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from '../../services/socket.js';

const StudentHistory = ({route}) => {
    const [userData, setUserData] = useState();
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const getItems = async () => {
            try {
                const value = await AsyncStorage.getItem('data')
                if(value !== null) {
                    setUserData(JSON.parse(value))
                }
            } catch(e) {
                console.log(e)
             }
        }
        getItems();
    }, []);

    const fetchData = () => {
        if(userData){
            api.get(`/student/${userData.id}/request`, {headers: {Authorization: `Bearer ${userData.token}`}})
            .then(res => {
                setData(res.data)
                setAllData(res.data)
                fetchRealTimeData(res.data)
            })
        }
    }


    const fetchRealTimeData = (newData) => {
        const chat = connect(route.params.token)
        chat.on('ready', () => {
            chat.on('response', req => {
                const fechedData = newData.map(d => {
                    if(req.id === d.id)
                        return {
                            ...d,
                            status: req.status
                        }
                    else
                        return d
                });
                setSelectedOption('')
                setData(fechedData)
                setAllData(fechedData)
            })
        })
    }


    useFocusEffect(
        useCallback(() => {
            fetchData();

            return () => {
                setData([])
              };
        }, [userData])
    );

    const deleteRequest = (id) => {
        const chat = connect(route.params.token)

        chat.on('ready', () => {
            chat.emit('delete', id)
        })

        chat.on('error', (error) => {
            Alert.alert(
                'Um erro inexperado ocorreu',
                'Tente novamente mais tarde',
                [
                {text: 'OK'},
                ],
                {cancelable: false},
            );
        })

        chat.on('success', msg => {
            setData(data.filter(d => d.id !== id))
            setAllData(data.filter(d => d.id !== id))
            Alert.alert(
                msg.message,
                '',
                [
                {text: 'OK'},
                ],
                {cancelable: false},
            );
        })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.Os == "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <BackgroundContainer>
                <DefaultContainer>
                    <DefaultText size='30px' weight='bold' style={{marginTop: 25, marginBottom: 10}}>Histórico</DefaultText>
                    <View style={{
                        height: 50,
                        width: '90%',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: 'black',
                        borderRadius: 7,
                        backgroundColor: '#c8c8c8',
                        marginBottom: 10
                    }}>
                        <Picker
                            selectedValue={selectedOption}
                            onValueChange={(itemValue, itemIndex) =>{
                                setSelectedOption(itemValue)
                                const newData = allData;
                                setData(itemValue ? newData.filter(d => d.status === itemValue) : newData);
                            }}
                            mode='dropdown'
                        >
                            <Picker.Item label={'Todas'} value={''}/>
                            <Picker.Item label={'Pendente'} value={'Pendente'}/>
                            <Picker.Item label={'Recusada'} value={'Recusada'}/>
                            <Picker.Item label={'Confirmada'} value={'Confirmada'}/>
                        </Picker>
                    </View>
                    {
                        data.length > 0 && userData ?
                            <FlatList
                                style={{width: '90%'}}
                                data={data}
                                renderItem={({ item }) => {
                                    return (
                                            <ListItem>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                                    <DefaultButton
                                                        sizeX='20px'
                                                        sizeY='20px'
                                                        topMargin='0px'
                                                        style={{backgroundColor: 'red', marginRight: 10}}
                                                        onPress={() => Alert.alert(
                                                            'Apagar solicitação',
                                                            'Deseja mesmo apagar essa solicitação?',
                                                            [
                                                                {
                                                                    text: "Não",
                                                                    style: "cancel"
                                                                },
                                                                {text: 'Sim', onPress: () => deleteRequest(item.id)},
                                                            ],
                                                            {cancelable: false},
                                                        )}
                                                    >
                                                        <DefaultText size='15px' weight='bold' style={{color: '#FFFFFF'}}>X</DefaultText>
                                                    </DefaultButton>
                                                </View>
                                                <DefaultText style={{ marginBottom: 15 }} size='15px'>{`${item.schedule.day.split('-')[0]} - ${item.schedule.start.split(':')[0]}:${item.schedule.start.split(':')[1]}-${item.schedule.end.split(':')[0]}:${item.schedule.end.split(':')[1]}`}</DefaultText>
                                                <DefaultText style={{ marginBottom: 5 }} size='15px'>{item.monitor.subject.name}</DefaultText>
                                                <DefaultText style={{ flexShrink: 1, marginBottom: 5 }} size='10px'>{`Você: ${item.message}`}</DefaultText>
                                                <DefaultText style={{ flexShrink: 1, marginBottom: 20 }} size='10px'>{`${item.monitor.student.user.name.split(' ')[0]}: ${item.response ? item.response : ''}`}</DefaultText>
                                                <DefaultText size='15px'>{`${item.status}`}</DefaultText>
                                            </ListItem>                                       
                                        )
                                    }
                                }
                                keyExtractor={item => item.id}
                            />
                        : 
                            <DefaultText size='15px'>Nenhum histórico</DefaultText>
                    }

                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default StudentHistory;