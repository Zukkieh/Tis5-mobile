import React, {useState, useEffect} from 'react';
import { Text, TouchableOpacity, Image, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import {Picker} from '@react-native-community/picker';
import { Input, BackgroundContainer, DefaultText, DefaultContainer } from '../../DefaultStyledComponents';
import { RegisterButton } from './styles';

import api from '../../services/api.js'

const Register = ({navigation}) => {
    const [user, setUser] = useState({
        'person_code': '',
        'name': '',
        'email': '',
        'password': '',
        'course_id': '',
        'confirmPassword': '',
        'registration': '',
        'phone': '',
    });
    const [selected, setSelected] = useState('')
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const loadCourses = async () => {
            const allCourses = await api.get('/course?limit=1000');
            if(allCourses && allCourses.data && allCourses.data.data)
                allCourses.data.data.unshift({
                    name: 'Selecionar Curso',
                    id: 0
                })
                setCourses(allCourses.data.data.map(d => {
                    return {
                        label: d.name,
                        value: d.id
                    }
                }));
        }
        loadCourses()
    }, [])

    const setField = (value, param) => {
        let newUser = user;
        newUser[param] = value;
        setUser(JSON.parse(JSON.stringify(newUser)))
    }

    const sendRegister = () => {
        if(user.confirmPassword && user.confirmPassword === user.password)
            api.post('/student', user)
                .then(res => {
                    Alert.alert(
                        'Registrado com sucesso',
                        'Voltar para tela de login',
                        [
                        {text: 'OK', onPress: () => navigation.goBack()},
                        ],
                        {cancelable: false},
                    );
                })
                .catch(error => {
                    Alert.alert(
                        error.response.data.errors[0].message,
                        'Corrija o campo e tente novamente',
                        [
                        {text: 'OK', onPress: () => []},
                        ],
                        {cancelable: false},
                    );
                });
        else
            Alert.alert(
                user.confirmPassword ? 'As senhas devem ser iguais' : 'O campo "Confirmar senha" é obrigatório',
                'Corrija o campo e tente novamente',
                [
                {text: 'OK', onPress: () => []},
                ],
                {cancelable: false},
            );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.Os == "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <BackgroundContainer>
                <DefaultContainer>
                    <DefaultText size='40px' weight='bold' style={{marginTop: 20}}>SGM</DefaultText>
                    <DefaultText size='14px' style={{marginBottom: 10}}>Sistema de Gestão de Monitoria</DefaultText>
                    <DefaultText size='15px' weight='600' style={{marginBottom: 10}}>Cadastro</DefaultText>
                    <Input autoCompleteType="off" onChangeText={(value) => setField(value, 'name')} placeholder='Nome Completo' placeholderTextColor='#6A6A6A'/>
                    <Input autoCompleteType="off" onChangeText={(value) => setField(value, 'email')} keyboardType='email-address' placeholder='E-mail' placeholderTextColor='#6A6A6A'/>
                    <Input autoCompleteType="off" onChangeText={(value) => setField(value, 'person_code')} keyboardType='numeric' placeholder='Código de Pessoa' placeholderTextColor='#6A6A6A'/>
                    <Input autoCompleteType="off" onChangeText={(value) => setField(value, 'registration')} keyboardType='numeric' placeholder='Matrícula' placeholderTextColor='#6A6A6A'/>
                    <Input autoCompleteType="off" onChangeText={(value) => setField(value, 'phone')} keyboardType='numeric' placeholder='Telefone' placeholderTextColor='#6A6A6A'/>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Input style={{width: '36%'}} autoCompleteType="off" onChangeText={(value) => setField(value, 'password')} secureTextEntry={true} placeholder='Senha' placeholderTextColor='#6A6A6A'/>
                        <Input style={{width: '36%'}} autoCompleteType="off" onChangeText={(value) => setField(value, 'confirmPassword')} secureTextEntry={true} placeholder='Confirmar Senha' placeholderTextColor='#6A6A6A'/>
                    </View>
                    <DefaultText size='14px' weight='bold' style={{marginTop: -10}}>Curso</DefaultText>
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
                                setField(itemIndex, 'course_id');
                                setSelected(itemValue);
                            }}
                            mode='dropdown'
                        >
                            {
                                courses.map(c => <Picker.Item label={`${c.label}`} value={`${c.value}`} key={c.value}/>)
                            }
                        </Picker>
                    </View>
                    <RegisterButton
                        onPress={sendRegister}
                    >
                        <Text style={{color: '#FFFFFF', fontSize: 19}}>Fazer Cadastro</Text>
                    </RegisterButton>
                    <TouchableOpacity
                        style={{marginTop: 19, marginBottom: 45}}
                        onPress={() => navigation.goBack()}
                    >
                            <Text style={{color: '#707070', fontSize: 16}}>← Fazer Login</Text>
                    </TouchableOpacity>
                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default Register;
