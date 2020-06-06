import React from 'react';
import styled from 'styled-components/native';

export const SettingsSection = styled.View`
    display: flex;
    flex-direction: row;
    margin-top: 40%;
`;

export const SettingsButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 230px;
    height: 100px;
    border-radius: 5px;
    background-color: #95bfcc;
`;

export const LogoutButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 50px;
    border-radius: 5px;
    background-color: red;
    margin-top: 50px;
`;