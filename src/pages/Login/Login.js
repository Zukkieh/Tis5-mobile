import React, {useState, useEffect} from 'react';
import { Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, AsyncStorage } from 'react-native';
import { LoginButton } from './styles';
import { Input, BackgroundContainer, DefaultText, DefaultContainer } from '../../DefaultStyledComponents';
import api from '../../services/api.js'

const Login = ({ navigation }) => {
    const [user, setUser] = useState({
        'person_code': '',
        'password': '',
    });

    const setField = (value, param) => {
        let newUser = user;
        newUser[param] = value;
        setUser(JSON.parse(JSON.stringify(newUser)))
    }

    useEffect(() => {
        const getItems = async () => {
            try {
                const value = await AsyncStorage.getItem('data')
                if(value !== null) {
                    const parsedValue = JSON.parse(value)
                    navigation.navigate(!parsedValue.is_monitor ? 'NormalUserMainTabs' : 'MonitorUserMainTabs',{ 
                        screen: 'Perfil',
                        params: {user: parsedValue.name, token: parsedValue.token}
                    })
                }
            } catch(e) {
                console.log(e)
                }
        }
        getItems();
    }, [])

    const sendLogin = () => {
        console.log("a")
        api.post('/auth', user)
            .then(async (res) => {
                try {
                    await AsyncStorage.setItem('data', JSON.stringify(
                        {
                            token: res.data.token,
                            type: res.data.user_type,
                            course_id: res.data.data.course_id,
                            id: res.data.data.id,
                            is_monitor: res.data.data.is_monitor,
                            monitoring: res.data.data.monitoring,
                            name: res.data.data.name,
                            person_code: res.data.data.person_code,
                            user_id: res.data.data.user_id,
                        }
                        ) , () => {
                        navigation.navigate(!res.data.data.is_monitor ? 'NormalUserMainTabs' : 'MonitorUserMainTabs',{ 
                            screen: 'Perfil',
                            params: {
                                user: res.data.data.name,
                                token: res.data.token
                            }
                        })
                    });
                } catch (e) {
                    console.log(e.response)
                }
            })
            .catch(error => {
                Alert.alert(
                    error.response.data[0].message,
                    'Corrija o campo e tente novamente',
                    [
                    {text: 'OK', onPress: () => []},
                    ],
                    {cancelable: false},
                );
            });
    }

    return(
        <KeyboardAvoidingView
            behavior={Platform.Os == "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <BackgroundContainer>
                <DefaultContainer>
                    <DefaultText size='80px' weight='bold' style={{marginTop: 30}}>SGM</DefaultText>
                    <DefaultText size='14px' style={{marginBottom: 70}}>Sistema de Gestão de Monitoria</DefaultText>
                    <DefaultText size='35px' weight='600' style={{marginBottom: 58}}>Faça Login</DefaultText>
                    <Input
                        bottomMargin='21px'
                        onChangeText={(value) => setField(value, 'person_code')}
                        placeholder='Código de pessoa'
                        placeholderTextColor='#6A6A6A'
                        keyboardType='numeric'
                    />
                    <Input
                        bottomMargin='10px'
                        onChangeText={(value) => setField(value, 'password')}
                        placeholder='Senha'
                        placeholderTextColor='#6A6A6A'
                        secureTextEntry={true}
                    />
                    <LoginButton 
                        onPress={sendLogin}
                    >
                        <Text style={{color: '#FFFFFF', fontSize: 19}}>Login</Text>
                    </LoginButton>
                    <TouchableOpacity
                        style={{marginTop: 60, marginBottom: 45}}
                        onPress={() => navigation.navigate('Register')}
                    >
                            <Text style={{color: '#707070', fontSize: 16}}>Crie sua conta →</Text>
                    </TouchableOpacity>
                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default Login;
