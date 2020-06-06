import React, {useState, useEffect} from 'react';
import { Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, AsyncStorage, View } from 'react-native';
import Modal from 'react-native-modal';
import { UserSettingsButton, UserSettingsModalView } from './styles';
import { Input, BackgroundContainer, DefaultText, DefaultButton, DefaultContainer } from '../../DefaultStyledComponents';
import api from '../../services/api.js'

const UserSettings = ({route, navigation}) => {
    const [settings, setSettings] = useState({
        'phone': '',
        'password': {
            'old': '',
            'new': ''
        }
    });
    const [userData, setUserData] = useState();
    const [isPhoneModal, setPhoneModalVisible] = useState(false);
    const [isPasswordModal, setPasswordModalVisible] = useState(false);
    
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

    const setField = (value, param) => {
        let newSettings = settings;
        if(param.includes('password')){
            const splited = param.split('.');
            newSettings[splited[0]][splited[1]] = value;
        }
        else newSettings[param] = value;
        setSettings(JSON.parse(JSON.stringify(newSettings)))
    }

    const sendUserSettings = (type) => {
        if(type === 'password')
            api.patch(`/auth/${userData.user_id}`, settings, {headers: {Authorization: `Bearer ${userData.token}`}})
            .then(res => {
                Alert.alert(
                    'Atualizado com sucesso',
                    '',
                    [
                    {text: 'OK', onPress: () => setPasswordModalVisible(false)},
                    ],
                    {cancelable: false},
                );
            })
            .catch(error => {
                const erro = error.response.data.errors ? error.response.data.errors[0].message : error.response.data.error
                Alert.alert(
                    erro,
                    'Corrija o campo e tente novamente',
                    [
                    {text: 'OK', onPress: () => []},
                    ],
                    {cancelable: false},
                );
            });
        if(type === 'phone')
            api.patch(`/student/${userData.id}`, settings, {headers: {Authorization: `Bearer ${userData.token}`}})
            .then(res => {
                Alert.alert(
                    'Atualizado com sucesso',
                    '',
                    [
                    {text: 'OK', onPress: () => setPhoneModalVisible(false)},
                    ],
                    {cancelable: false},
                );
            })
            .catch(error => {
                const erro = error.response.data.errors ? error.response.data.errors[0].message : error.response.data.error
                Alert.alert(
                    erro,
                    'Corrija o campo e tente novamente',
                    [
                    {text: 'OK', onPress: () => []},
                    ],
                    {cancelable: false},
                );
            });
    }

  
    const toggleModal = (type) => {
      type === 'phone' && setPhoneModalVisible(!isPhoneModal);
      type === 'password' && setPasswordModalVisible(!isPasswordModal);
    };

    function PasswordModal() {
        return (
            <Modal
                isVisible={isPasswordModal}
                onBackdropPress={() => setPasswordModalVisible(false)}
                style={{display: "flex", justifyContent: "center", alignItems: "center"}}
                animationIn='fadeIn'
                animationOut='fadeOut'
                backdropTransitionOutTiming={0}
            >
              <UserSettingsModalView>
                <View>
                    <DefaultText size='20px' weight='600' style={{marginBottom: 5}}>Mudar senha</DefaultText>
                    <Input
                        bottomMargin='5px'
                        topMargin='20px'
                        onChangeText={(value) => setField(value, 'password.old')}
                        secureTextEntry={true}
                        placeholder='Senha antiga'
                        placeholderTextColor='#6A6A6A'
                    />
                    <Input
                        bottomMargin='20px'
                        topMargin='5px'
                        onChangeText={(value) => setField(value, 'password.new')}
                        secureTextEntry={true}
                        placeholder='Senha nova'
                        placeholderTextColor='#6A6A6A'
                    />
                </View>
                <UserSettingsButton 
                onPress={() => sendUserSettings('password')}
                >
                    <Text style={{color: '#FFFFFF', fontSize: 19}}>Mudar</Text>
                </UserSettingsButton>
                <TouchableOpacity
                    onPress={() => toggleModal('password')}
                    style={{marginTop: 20}}
                >
                    <Text style={{color: '#707070', fontSize: 16}}>Cancelar</Text>
                </TouchableOpacity>
              </UserSettingsModalView>
            </Modal>
        )
      }

    function PhoneModal() {
        return (
            <Modal
                isVisible={isPhoneModal}
                onBackdropPress={() => setPhoneModalVisible(false)}
                style={{display: "flex", justifyContent: "center", alignItems: "center"}}
                animationIn='fadeIn'
                animationOut='fadeOut'
                backdropTransitionOutTiming={0}
            >
              <UserSettingsModalView>
                <DefaultText size='20px' weight='bold' style={{marginTop: 10}}>Mudar Telefone</DefaultText>
                <Input
                    bottomMargin='35px'
                    topMargin='40px'
                    onChangeText={(value) => setField(value, 'phone')}
                    placeholder='Telefone'
                    placeholderTextColor='#6A6A6A'
                    keyboardType='numeric'
                />
                <UserSettingsButton 
                    onPress={() => sendUserSettings('phone')}
                >
                    <Text style={{color: '#FFFFFF', fontSize: 19}}>Mudar</Text>
                </UserSettingsButton>
                <TouchableOpacity
                    onPress={() => toggleModal('phone')}
                    style={{marginTop: 20}}
                >
                    <Text style={{color: '#707070', fontSize: 16}}>Cancelar</Text>
                </TouchableOpacity>
              </UserSettingsModalView>
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
                    <DefaultText size='80px' weight='bold' style={{marginTop: 30}}>SGM</DefaultText>
                    <DefaultText size='14px' style={{marginBottom: 80}}>Sistema de Gestão de Monitoria</DefaultText>
                    <DefaultText size='25px' weight='600' style={{marginBottom: 48}}>Mude suas informações</DefaultText>
                    {PhoneModal()}
                    {PasswordModal()}
                    <DefaultButton
                        onPress={() => toggleModal('phone')}
                        sizeX='250px'
                        sizeY='60px'
                    >
                        <DefaultText size='25px' style={{color: 'white'}}>Mudar Telefone</DefaultText>
                    </DefaultButton>
                    <DefaultButton
                        onPress={() => toggleModal('password')}
                        sizeX='250px'
                        sizeY='60px'
                    >
                        <DefaultText size='25px' style={{color: 'white'}}>Mudar Senha</DefaultText>
                    </DefaultButton>

                    <TouchableOpacity
                        style={{marginTop: 80, marginBottom: 35}}
                        onPress={() => navigation.goBack()}
                    >
                            <Text style={{color: '#707070', fontSize: 16}}>← Perfil</Text>
                    </TouchableOpacity>
                </DefaultContainer>
            </BackgroundContainer>
        </KeyboardAvoidingView>
    );
}

export default UserSettings;
