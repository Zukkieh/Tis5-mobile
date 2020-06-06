import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { Input, BackgroundContainer, DefaultText, DefaultContainer } from '../../DefaultStyledComponents';

import { SettingsSection, SettingsButton, LogoutButton } from './styles';

const Profile = ({ route, navigation }) => {
    const [userData, setUserData] = useState(); 
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
    return (
        <BackgroundContainer>
            <DefaultContainer>
                <DefaultText size='80px' weight='bold' style={{marginTop: 30}}>SGM</DefaultText>
                <DefaultText size='25px'>{`Seja bem vindo, ${route.params.user.split(' ')[0]}!`}</DefaultText>
                <SettingsSection>
                    <SettingsButton
                        onPress={() => navigation.navigate('UserSettings', {is_monitor: userData.is_monitor})}
                    >
                        <DefaultText size='25px' style={{color: 'white'}}>Gerenciar Perfil</DefaultText>
                    </SettingsButton>
                </SettingsSection>
                <LogoutButton
                    onPress={() => {AsyncStorage.clear(); navigation.navigate('Login')}}
                >
                    <DefaultText size='25px' style={{color: 'white'}}>Sair</DefaultText>
                </LogoutButton>
            </DefaultContainer>
        </BackgroundContainer>
    )
}

export default Profile;
