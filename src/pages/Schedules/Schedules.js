import React, {useState, useEffect} from 'react';
import { Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, AsyncStorage, View } from 'react-native';
import Modal from 'react-native-modal';
import Circle from 'react-native-progress/Circle';
import {Picker} from '@react-native-community/picker';
import SCHELULES_INITIAL_VALUES from './initialValues';
import { Input, BackgroundContainer, DefaultText, DefaultButton, DefaultSubmitButton, DefaultModalView, DefaultContainer } from '../../DefaultStyledComponents';
import api from '../../services/api.js'

const Schedules = ({route, navigation}) => {
    const [schedules, setSchedules] = useState(SCHELULES_INITIAL_VALUES)
    const [apiSchedules, setApiSchedules] = useState();
    const [userData, setUserData] = useState();
    const [isSchedulesModal, setSchedulesModalVisible] = useState(false);
    const [selected, setSelected] = useState('Segunda-feira');
    const [selectedId, setSelectedId] = useState(0);
    
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

    useEffect(() => {
        const getSchedules = async () => {
            api.get(`/monitor/${route.params.monitor_id}/schedule`, {headers: {Authorization: `Bearer ${userData.token}`}}).then(res => {
                if(res && res.data && res.data.schedules){
                    setApiSchedules(res.data.schedules);
                    updateSchedules(res.data.schedules);
                }else
                    setApiSchedules([])
            })
            .catch(error => {
                console.log(error)
            });
        }
        if(userData)
            getSchedules()
    }, [userData])


    const updateSchedules = (schedule) => {
        setSchedules(old => old.map(o => {
            schedule.forEach(r => {
                if(o.day === r.day){
                    o = r;
                    const [startHour, startMinute] = o.start.split(':');
                    const [endHour, endMinute] = o.end.split(':');
                    o.start = [startHour, startMinute].join(':');
                    o.end = [endHour, endMinute].join(':');
                    o.isDeletable = true;
                }
            })
            return o
        }))
    }


    const toggleModal = (type) => {
      type === 'schedules' && setSchedulesModalVisible(!isSchedulesModal);
    };

    const timeHandleChange = (value, index, type) => {
        let newSchedules = schedules;
        let tempStr = '';
        value = value.replace(/[\D]/g,'');
        value = value.replace(/^[0:]+/g, '');
        if(value.length < 4){
          for (let i=0; i<4-value.length; i++){
            tempStr = tempStr.concat('0');
          }
        }
        value = tempStr.concat(value);
        if(value.length > 4) return
        value = value.replace(/(\d{2})$/g, ":$1");
        newSchedules[index][type] = value;
        if(newSchedules[index][type] !== '00:00'){
            const [hour, min] = newSchedules[index][type].split(':');
            if(hour >= 24 && min <= 60)
                newSchedules[index][type] = '23:'+min;
            if(min >= 60 && hour >= 2)
                newSchedules[index][type] = hour+':59';
            if(hour >= 24 && min >= 60)
                newSchedules[index][type] = '23:59';
        }
        setSchedules(JSON.parse(JSON.stringify(newSchedules)))
    }

    const deleteSchedule = (scheduleId) => {
        return api.delete(`/schedule/${scheduleId}`, {headers: {Authorization: `Bearer ${userData.token}`}})
        .then(res => {
            setSchedules(old => old.map(o => {
                SCHELULES_INITIAL_VALUES.forEach(s => {
                    if(o.id && o.id === scheduleId && o.day === s.day){
                        o = s
                        o.start= '00:00';
                        o.end= '00:00';
                    }
                })
                return o
            }));
            setApiSchedules(old => old.filter(o => o.id !== scheduleId));
            return res;
        })
        .catch(error => {
            console.log(error)
        });
    }

    const sendSchedule = (schedule, remove) => {
        const newApiSchedules = remove ? apiSchedules.filter(a => a.id !== remove) : apiSchedules;
            api.post(`/monitor/${route.params.monitor_id}/schedule`, schedule, {headers: {Authorization: `Bearer ${userData.token}`}})
            .then(res => {
                Alert.alert(
                    'Registrado com sucesso',
                    '',
                    [
                    {text: 'OK', onPress: () => {
                        setApiSchedules([...newApiSchedules, res.data])
                        updateSchedules([...newApiSchedules, res.data]);
                    }},
                    ],
                    {cancelable: false},
                );
            })
            .catch(error => {
                console.log(error.response)
                Alert.alert(
                    error.response.data.error,
                    error.response.data.message,
                    [
                    {text: 'OK', onPress: () => []},
                    ],
                    {cancelable: false},
                );
            });
    }
    
    function ScheduleModal() {
        return (
            <Modal
                isVisible={isSchedulesModal}
                onBackdropPress={() => setSchedulesModalVisible(false)}
                style={{display: "flex", justifyContent: "center", alignItems: "center"}}
                animationIn='fadeIn'
                animationOut='fadeOut'
                backdropTransitionOutTiming={0}
            >
                <DefaultModalView
                    sizeY='368px'
                >
                <DefaultText size='20px' weight='bold' style={{marginBottom: 50}}>Mudar Horários</DefaultText>
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
                            selectedValue={selected}
                            onValueChange={(itemValue, itemIndex) =>{
                                setSelected(itemValue);
                                setSelectedId(itemIndex);
                            }}
                            mode='dropdown'
                        >
                            {
                                schedules.map((c, index) => <Picker.Item label={`${c.day}`} value={`${index}`} key={index}/>)
                            }
                        </Picker>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '70%'}}>
                        <Input
                            sizeX='100px'
                            value={schedules[selectedId].start}
                            onChangeText={(value) => timeHandleChange(value, selectedId, 'start')}
                            placeholder='Início'
                            placeholderTextColor='#6A6A6A'
                            keyboardType='numeric'
                        />
                        <Input
                            sizeX='100px'
                            value={schedules[selectedId].end}
                            onChangeText={(value) => timeHandleChange(value, selectedId, 'end')}
                            placeholder='Fim'
                            placeholderTextColor='#6A6A6A'
                            keyboardType='numeric'
                        />
                        {schedules[selectedId].isDeletable &&
                            <DefaultButton
                                sizeX='20px'
                                sizeY='20px'
                                topMargin='-15px'
                                style={{backgroundColor: 'red'}}
                                onPress={() => Alert.alert(
                                    'Apagar horário',
                                    'Deseja mesmo apagar esse horário?',
                                    [
                                        {
                                            text: "Não",
                                            style: "cancel"
                                        },
                                        {text: 'Sim', onPress: () => deleteSchedule(schedules[selectedId].id)},
                                    ],
                                    {cancelable: false},
                                )}
                            >
                                <DefaultText size='15px' weight='bold' style={{color: '#FFFFFF'}}>X</DefaultText>
                            </DefaultButton>
                        }

                    </View>
                <DefaultSubmitButton 
                    onPress={async () => {
                        if(schedules[selectedId].isDeletable){
                            const res = await deleteSchedule(schedules[selectedId].id)
                            if(res)
                                sendSchedule(schedules[selectedId], schedules[selectedId].id);
                            else
                                return;
                        }
                        else sendSchedule(schedules[selectedId], false);
                    }}
                >
                    <Text style={{color: '#FFFFFF', fontSize: 19}}>Mudar</Text>
                </DefaultSubmitButton>
                <TouchableOpacity
                    onPress={() => toggleModal('schedules')}
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
                    <DefaultText size='80px' weight='bold'>SGM</DefaultText>
                    <DefaultText size='14px' style={{marginBottom: 50}}>Sistema de Gestão de Monitoria</DefaultText>
                    <DefaultText size='25px' weight='600' style={{marginBottom: 25}}>Seu Horário</DefaultText>
                    {ScheduleModal()}
                    <View style={{display: 'flex', justifyContent: 'center', width: '70%', marginBottom: 100}}>
                        {
                            apiSchedules ? apiSchedules.length !== 0 ?
                                apiSchedules.map((a, index) => 
                                    <DefaultText size='15px' style={{textAlign: 'right'}} key={index}>{`${a.day} - de ${a.start} às ${a.end}`}</DefaultText>
                                )
                                :
                                <DefaultText size='20px' style={{marginTop: 40, color: 'red'}}>Sem horários cadastrados</DefaultText>
                            :
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <Circle size={30} endAngle={0.7} thickness={15} indeterminate={true}/>
                            </View>
                        }
                    </View>

                    <DefaultButton
                        onPress={() => toggleModal('schedules')}
                        sizeX='250px'
                        sizeY='60px'
                    >
                        <DefaultText size='25px' style={{color: 'white'}}>Mudar Horários</DefaultText>
                    </DefaultButton>

                    <TouchableOpacity
                        style={{marginTop: 90, marginBottom: 35}}
                        onPress={() => navigation.goBack()}
                    >
                            <Text style={{color: '#707070', fontSize: 16}}>← Disciplinas</Text>
                    </TouchableOpacity>
                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default Schedules;
