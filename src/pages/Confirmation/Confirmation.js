import React, { useEffect, useState, useCallback } from 'react';
import { Input, BackgroundContainer, DefaultListItem, DefaultText, DefaultContainer, DefaultButton, DefaultModalView, DefaultSubmitButton } from '../../DefaultStyledComponents';
import Circle from 'react-native-progress/Circle';
import { Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, AsyncStorage, FlatList, View } from 'react-native';
import api from '../../services/api.js';
import {Picker} from '@react-native-community/picker';
import { useFocusEffect } from '@react-navigation/native';

const Confirmation = ({ navigation }) => {
    const [userData, setUserData] = useState();
    const [data, setData] = useState([]);

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
            api.get(`/monitor/${userData.monitoring[0].id}/attendance`, {headers: {Authorization: `Bearer ${userData.token}`}})
            .then(res => {
                setData(res.data.sort((a,b) => b.attendance.localeCompare(a.attendance)))
            })
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();

            return () => {
                setData([])
              };
        }, [userData])
    );

    const sendConfirmation = (completed, id) => {
        console.log(completed)
        api.patch(`/request/${id}/attendance`, {happened: completed}, {headers: {Authorization: `Bearer ${userData.token}`}})
            .then(res => {
                Alert.alert(
                    'Atualizado com sucesso',
                    '',
                    [
                    {text: 'OK', onPress: () => setData(data.map(d => {
                        if(d.id === id)
                            return {
                                ...d,
                                attendance: completed ? 'Concluído' : 'Cancelado'
                            }
                        return d;
                    }).sort((a,b) => b.attendance.localeCompare(a.attendance)))},
                    ],
                    {cancelable: false},
                );
            })
            .catch(error => {
                const erro = error.response.data.errors ? error.response.data.errors[0].message : error.response.data.error
                Alert.alert(
                    erro,
                    'Tente novamente',
                    [
                    {text: 'OK', onPress: () => []},
                    ],
                    {cancelable: false},
                );
            });
    }

    return(
        <BackgroundContainer>
            <DefaultContainer>
                <DefaultText size='30px' weight='bold' style={{marginTop: 25, marginBottom: 30}}>Seus atendimentos</DefaultText>
                {
                data.length > 0 && userData ?
                            <FlatList
                                style={{width: '90%'}}
                                data={data}
                                renderItem={({ item }) => {
                                    return (
                                        <DefaultListItem>
                                            <DefaultText style={{ marginBottom: 15 }} size='15px'>{`${item.schedule.day.split('-')[0]} - ${item.schedule.start.split(':')[0]}:${item.schedule.start.split(':')[1]}-${item.schedule.end.split(':')[0]}:${item.schedule.end.split(':')[1]}`}</DefaultText>
                                            <DefaultText style={{ marginBottom: 5 }} size='15px'>{item.monitor.subject.name}</DefaultText>
                                            <DefaultText style={{ flexShrink: 1, marginBottom: 5 }} size='10px'>{`Você: ${item.message}`}</DefaultText>
                                            <DefaultText style={{ flexShrink: 1, marginBottom: 10 }} size='10px'>{`${item.monitor.student.user.name.split(' ')[0]}: ${item.response ? item.response : ''}`}</DefaultText>
                                            {
                                                item.attendance !== 'Concluído' && item.attendance !== 'Cancelado' ?
                                                    <View style={{display: 'flex', flexDirection: 'row', paddingBottom: 10}}>
                                                        <DefaultButton sizeX='40%' sizeY='40px' style={{marginRight: 10, backgroundColor: 'red'}}
                                                            onPress={() => sendConfirmation(false, item.id)}
                                                        >
                                                            <DefaultText style={{color: 'white'}}>Cancelar</DefaultText>
                                                        </DefaultButton>
                                                        <DefaultButton sizeX='40%' sizeY='40px' style={{backgroundColor: 'green'}}
                                                            onPress={() => sendConfirmation(true, item.id)}
                                                        >
                                                            <DefaultText style={{color: 'white'}}>Concluir</DefaultText>
                                                        </DefaultButton>
                                                    </View>
                                                :
                                                    <DefaultText style={{ flexShrink: 1, marginBottom: 10 }} size='14px'>{`${item.attendance}`}</DefaultText>
                                            }
                                        </DefaultListItem>                                         
                                        )
                                    }
                                }
                                keyExtractor={item => item.id}
                            />
                        : 
                            <DefaultText size='15px' weight='bold' style={{marginTop: 25}}>Sem novos atendimentos</DefaultText>
                }
                <TouchableOpacity
                    style={{marginTop: 19, marginBottom: 45}}
                    onPress={() => navigation.goBack()}
                >
                        <Text style={{color: '#707070', fontSize: 16}}>← Agendamentos</Text>
                </TouchableOpacity>
            </DefaultContainer>
        </BackgroundContainer>
    )
}

export default Confirmation;