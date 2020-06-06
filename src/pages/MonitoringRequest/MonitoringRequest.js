import React, { useEffect, useState } from 'react';
import { Input, BackgroundContainer, DefaultText, DefaultContainer, DefaultButton, DefaultModalView, DefaultSubmitButton } from '../../DefaultStyledComponents';
import Modal from 'react-native-modal';
import { connect, sendRequest} from '../../services/socket.js';
import Circle from 'react-native-progress/Circle';
import {Picker} from '@react-native-community/picker';
import { Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, AsyncStorage, FlatList, View } from 'react-native';
import api from '../../services/api.js';

const MonitoringRequest = ({ route }) => {
    const [userData, setUserData] = useState();
    const [subjects, setSubjects] = useState([]);
    const [monitors, setMonitors] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [isRequestModal, setRequestModalVisible] = useState(false);
    const [selectedMonitor, setSelectedMonitor] = useState({
        id: undefined,
        label: ''
    });
    const [selectedDay, setSelectedDay] = useState({
        id: undefined,
        label: ''
    });
    const [adicionalInformations, setAdicionalInformations] = useState('');
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

    const sendRequest = (dataToSend) => {
        const chat = connect(route.params.token)

        chat.on('ready', () => {
            chat.emit('request', dataToSend)
        })

        chat.on('success', msg => {
            Alert.alert(
                msg.message,
                '',
                [
                {text: 'OK', onPress: () => {
                    setRequestModalVisible(false);
                    setMonitors([]);
                    setSelectedMonitor([]);
                    setSelectedDay([]);
                }},
                ],
                {cancelable: false},
            );
        })
    
        chat.on('error', (error) => {
            Alert.alert(
                'Um erro inexperado ocorreu',
                'Tente novamente mais tarde',
                [
                {text: 'OK', onPress: () => {
                    setRequestModalVisible(false);
                    setMonitors([]);
                    setSelectedMonitor([]);
                    setSelectedDay([]);
                }},
                ],
                {cancelable: false},
            );
        })
    }

    useEffect(() => {
        const loadSubjects = async () => {
            api.get(`/course/${userData.course_id}/subject`, {headers: {Authorization: `Bearer ${userData.token}`}}).then(res => {
                if(res && res.data && res.data.data)
                setSubjects(res.data.data);
            })
            .catch(error => {
                console.log(error)
            });

        }
        if(userData)
            loadSubjects()
    }, [userData])

    const selectSubject = async (id) => {
        const allMonitors = await api.get(`/subject/${id}/monitor`, {headers: {Authorization: `Bearer ${userData.token}`}})
        if(allMonitors && allMonitors.data && allMonitors.data.data){
            allMonitors.data.data.unshift({
                id: undefined,
                student: {
                    user: {
                        name: 'Selecionar Monitor'
                    }
                }
            })
            if(userData.is_monitor)
                setMonitors(allMonitors.data.data.filter(d => d.student.id !== userData.id))
            else
                setMonitors(allMonitors.data.data)
        }
        setRequestModalVisible(true);
    }

    const getSchedules = (id) => {
        if(id !== 'undefined')
            api.get(`/monitor/${id}/schedule`, {headers: {Authorization: `Bearer ${userData.token}`}}).then(res => {
                if(res && res.data && res.data.schedules){
                    setSchedules(res.data.schedules);
                }else
                    setSchedules([])
            })
            .catch(error => {
                console.log(error.response)
            });
    }

    function RequestModal() {
        return (
            <Modal
                isVisible={isRequestModal}
                onBackdropPress={() => {
                    setRequestModalVisible(false);
                    setMonitors([]);
                    setSelectedMonitor([]);
                    setSelectedDay([]);
                }}
                style={{display: "flex", justifyContent: "center", alignItems: "center"}}
                animationIn='fadeIn'
                animationOut='fadeOut'
                backdropTransitionOutTiming={0}
            >
                <DefaultModalView
                    sizeY='468px'
                >
                    <DefaultText size='20px' weight='bold' style={{marginBottom: 50}}>Selecionar monitor e dia</DefaultText>
                    {
                        monitors.length ?
                            <View style={{
                                height: 50,
                                width: '70%',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 7,
                                backgroundColor: '#c8c8c8',
                                marginBottom: 10
                            }}>
                                <Picker
                                    selectedValue={selectedMonitor.label}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSchedules([]);
                                        setSelectedMonitor({id: itemIndex, label: itemValue});
                                        getSchedules(itemValue)
                                    }}
                                    mode='dropdown'
                                >
                                    {
                                        monitors.map((c, index) => <Picker.Item label={`${c.student.user.name}`} value={`${c.id}`} key={index}/>)
                                    }
                                </Picker>
                            </View>
                            :
                            <></>
                    }
                    {
                        selectedMonitor.id && schedules.length !== 0 ?
                            <View style={{
                                height: 50,
                                width: '70%',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 7,
                                backgroundColor: '#c8c8c8',
                                marginBottom: 10
                            }}>
                                <Picker
                                    selectedValue={selectedDay.label}
                                    onValueChange={(itemValue, itemIndex) =>{
                                        setSelectedDay({id: itemIndex, label: itemValue});
                                    }}
                                    mode='dropdown'
                                >
                                    <Picker.Item label={`Selecionar`} value={`Selecionar`}/>
                                    {
                                        schedules.length && schedules.map((c, index) => <Picker.Item label={`${c.day.split('-')[0]} - ${c.start.split(':')[0]}:${c.start.split(':')[1]}-${c.end.split(':')[0]}:${c.end.split(':')[1]}`} value={`${c.id}`} key={index}/>)
                                    }
                                </Picker>
                            </View>
                            :
                            <></>
                    }
                    {
                        selectedMonitor.id && schedules.length !== 0 ?
                            <View style={{width: '70%', marginBottom: 20}}>
                                <Input
                                    style={{height: 100, borderRadius: 7, textAlignVertical: "top", paddingTop: 5}}
                                    sizeX='100%'
                                    placeholder="Informações adicionais"
                                    placeholderTextColor="grey"
                                    onChangeText={setAdicionalInformations}
                                    numberOfLines={5}
                                    multiline={true}
                                />
                            </View>
                            :
                            <></>
                    }
                    {
                        selectedMonitor.id && selectedMonitor.length !== 0 ?
                        (<DefaultSubmitButton 
                            onPress={async () => {
                                sendRequest({
                                    schedule_id: selectedDay.label,
                                    message: adicionalInformations
                                })
                                // connect(`${userData.token}`).emit('request',{
                                //     schedule_id: selectedDay.id,
                                //     message: adicionalInformations
                                // })
                            }}
                        >
                            <Text style={{color: '#FFFFFF', fontSize: 19}}>Solicitar</Text>
                        </DefaultSubmitButton>)
                        : <></>
                    }
                    <TouchableOpacity
                        onPress={() => {
                            setRequestModalVisible(false);
                            setMonitors([]);
                            setSelectedMonitor([]);
                            setSelectedDay([]);
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
                    <DefaultText size='30px' weight='bold' style={{marginTop: 25, marginBottom: 50}}>Selecionar Disciplina</DefaultText>
                    {RequestModal()}
                    {
                        subjects.length > 0 && userData ?
                            <FlatList
                                style={{width: '90%'}}
                                data={subjects}
                                renderItem={({ item }) => {
                                    return (
                                            <DefaultButton
                                                key={item.id}
                                                onPress={() => selectSubject(item.id)}
                                                sizeX='100%'
                                                sizeY='60px'
                                            >
                                                <DefaultText size='25px' style={{color: 'white'}}>{item.name}</DefaultText>
                                            </DefaultButton>                                        
                                        )
                                    }
                                }
                                keyExtractor={item => item.id}
                            />
                        : 
                            <Circle size={40} endAngle={0.7} thickness={15} indeterminate={true}/>
                    }

                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default MonitoringRequest;