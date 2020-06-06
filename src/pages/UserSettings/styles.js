import React from 'react';
import styled from 'styled-components/native';

export const UserSettingsModalView = styled.View`
    display: flex;
    justifyContent: center;
    alignItems: center;
    backgroundColor: white;
    width: ${props => props.sizeX || "330px"};
    height: ${props => props.sizeY || "268px"};
    borderRadius: 15px;
`;

export const UserSettingsButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 241px;
    height: 39px;
    background: #00DF1E 0% 0% no-repeat padding-box;
    border-radius: 35px;
`;
