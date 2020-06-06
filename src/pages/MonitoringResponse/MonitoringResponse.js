import React, { useEffect, useState, useCallback } from 'react';
import { Input, BackgroundContainer, DefaultText, DefaultContainer, DefaultButton, DefaultModalView, DefaultSubmitButton } from '../../DefaultStyledComponents';
import Modal from 'react-native-modal';
import Circle from 'react-native-progress/Circle';
import { connect } from '../../services/socket.js';
import { Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, AsyncStorage, FlatList, View } from 'react-native';
import api from '../../services/api.js'
import { useFocusEffect } from '@react-navigation/native';

const MonitoringResponse = ({ route, navigation }) => {
    const [userData, setUserData] = useState();
    const [isResponseModal, setResponseModalVisible] = useState(false);
    const [aditionalInformations, setAditionalInformations] = useState('');
    const [data, setData] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState();

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
            api.get(`/monitor/${userData.monitoring[0].id}/request`, {headers: {Authorization: `Bearer ${userData.token}`}})
            .then(res => {
                setData(res.data.filter(d => d.status === 'Pendente'))
                fetchRealTimeData(res.data.filter(d => d.status === 'Pendente'))
            })
        }
    }

    const fetchRealTimeData = (newData) => {
        const chat = connect(route.params.token)
        chat.on('ready', () => {
            chat.on('request', req => {
                newData.push(req)
                setData(newData.map(d => d))
            })
        })
        chat.on('ready', () => {
            chat.on('delete', req => {
                setData(newData.filter(d => d.id !== req))
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

    const sendResponse = (res) => {
        const chat = connect(route.params.token)

        chat.on('ready', () => {
            chat.emit('response', {
                confirmed: res.confirmed,
                message: res.message,
                request_id: selectedRequest
            })
        })

        chat.on('success', msg => {
            setSelectedRequest(undefined);
            setData(data.filter(d => d.id !== selectedRequest))
            Alert.alert(
                msg.message,
                '',
                [
                {text: 'OK', onPress: () => {
                    setResponseModalVisible(false);
                }},
                ],
                {cancelable: false},
            );
        })
    
        chat.on('error', (error) => {
            console.log(error)
            Alert.alert(
                'Um erro inexperado ocorreu',
                'Tente novamente mais tarde',
                [
                {text: 'OK', onPress: () => {
                    setResponseModalVisible(false);
                }},
                ],
                {cancelable: false},
            );
        })
    }

    function ResponseModal() {
        return (
            <Modal
                isVisible={isResponseModal}
                onBackdropPress={() => {
                    setResponseModalVisible(false);
                }}
                style={{display: "flex", justifyContent: "center", alignItems: "center"}}
                animationIn='fadeIn'
                animationOut='fadeOut'
                backdropTransitionOutTiming={0}
            >
                <DefaultModalView
                    sizeY='468px'
                >
                    <DefaultText size='15px' weight='bold'>Mensagem do Aluno:</DefaultText>
                    <DefaultText size='10px' style={{ flexShrink: 1, marginBottom: 80, marginTop: 20 }}>{ selectedRequest && isResponseModal && data.length && data.find(d => d.id === selectedRequest).message}</DefaultText>
                    <View style={{width: '70%', marginBottom: 20}}>
                        <Input
                            style={{height: 100, borderRadius: 7, textAlignVertical: "top", paddingTop: 5}}
                            sizeX='100%'
                            placeholder="Informações adicionais"
                            placeholderTextColor="grey"
                            onChangeText={setAditionalInformations}
                            numberOfLines={5}
                            multiline={true}
                        />
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '70%'}}>
                        <DefaultSubmitButton
                            sizeX="100px"
                            onPress={async () => {
                                sendResponse({
                                    confirmed: true,
                                    message: aditionalInformations
                                })
                            }}
                        >
                            <Text style={{color: '#FFFFFF', fontSize: 19}}>Aceitar</Text>
                        </DefaultSubmitButton>
                        <DefaultSubmitButton 
                            sizeX="100px"
                            style={{backgroundColor: 'red'}}
                            onPress={async () => {
                                sendResponse({
                                    confirmed: false,
                                    message: aditionalInformations
                                })
                            }}
                        >
                            <Text style={{color: '#FFFFFF', fontSize: 19}}>Recusar</Text>
                        </DefaultSubmitButton>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            setResponseModalVisible(false);
                        }}
                        style={{marginTop: 20}}
                    >
                        <Text style={{color: '#707070', fontSize: 16}}>Cancelar</Text>
                    </TouchableOpacity>
                </DefaultModalView>
            </Modal>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.Os == "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <BackgroundContainer>
                <DefaultContainer>
                    <DefaultText size='30px' weight='bold' style={{marginTop: 25, marginBottom: 50}}>Suas solicitações</DefaultText>
                    {ResponseModal()}
                    {
                        data.length > 0 && userData ?
                            <FlatList
                                style={{width: '90%'}}
                                data={data}
                                renderItem={({ item }) => {
                                    return (
                                            <DefaultButton
                                                key={item.id}
                                                onPress={() => {
                                                    setResponseModalVisible(true);
                                                    setSelectedRequest(item.id);
                                                }}
                                                sizeX='100%'
                                                sizeY='60px'
                                            >
                                                <DefaultText size='25px' style={{color: 'white'}}>{`${item.schedule.day} - ${item.student.user.name}`}</DefaultText>
                                            </DefaultButton>                                        
                                        )
                                    }
                                }
                                keyExtractor={item => item.id}
                            />
                        : 
                            <DefaultText size='15px' weight='bold' style={{marginTop: 25}}>Sem novas solicitações</DefaultText>

                    }

                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default MonitoringResponse;