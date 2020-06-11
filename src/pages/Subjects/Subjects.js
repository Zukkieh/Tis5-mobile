import React, {useState, useEffect} from 'react';
import { KeyboardAvoidingView, Platform, AsyncStorage, View } from 'react-native';
import Circle from 'react-native-progress/Circle';
import { BackgroundContainer, DefaultText, DefaultButton, DefaultSubmitButton, DefaultModalView, DefaultContainer } from '../../DefaultStyledComponents';
import api from '../../services/api.js'

const UserSettings = ({route, navigation}) => {
    const [userData, setUserData] = useState();
    const [subjects, setSubjects] = useState([])
    
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.Os == "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <BackgroundContainer>
                <DefaultContainer>
                    <DefaultText size='80px' weight='bold'>SGM</DefaultText>
                    <DefaultText size='14px' style={{marginBottom: 80}}>Sistema de Gestão de Monitoria</DefaultText>
                    <DefaultText size='25px' weight='bold' style={{marginBottom: 150}}>Suas monitorias</DefaultText>

                    {
                        subjects.length > 0 && userData ? userData.monitoring.map((m, index) => {
                            const subjectName = subjects.find(s => s.id === m.subject_id).name;
                            return (
                                <DefaultButton
                                    key={index}
                                    onPress={() => navigation.navigate('Schedules', {monitor_id: m.id, subjectName: subjectName})}
                                    sizeX='250px'
                                    sizeY='60px'
                                >
                                    <DefaultText size='25px' style={{color: 'white'}}>{subjectName}</DefaultText>
                                </DefaultButton>
                            )
                        }) : <Circle size={40} endAngle={0.7} thickness={15} indeterminate={true}/>
                    }

                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default UserSettings;
