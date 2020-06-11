import React from 'react';

import { DefaultButton, DefaultText, DefaultContainer, BackgroundContainer } from '../../DefaultStyledComponents';

const Scheduling = ({ route, navigation }) => {
    return(
        <BackgroundContainer>
            <DefaultContainer>
                <DefaultText size='80px' weight='bold' style={{marginTop: 30}}>SGM</DefaultText>
                <DefaultText size='14px' style={{marginBottom: 70}}>Sistema de Gestão de Monitoria</DefaultText>
                <DefaultButton sizeX='80%'
                    onPress={() => navigation.navigate('MonitoringResponse', {token: route.params.token})}
                >
                    <DefaultText style={{color: '#FFFF'}} size='25px'>Solicitações</DefaultText>
                </DefaultButton>
                <DefaultButton sizeX='80%'
                    onPress={() => navigation.navigate('Confirmation')}
                >
                    <DefaultText style={{color: '#FFFF'}} size='25px'>Atendimentos</DefaultText>
                </DefaultButton>
            </DefaultContainer>
        </BackgroundContainer>
    )
}

export default Scheduling;