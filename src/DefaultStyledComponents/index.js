import React from 'react';
import styled from 'styled-components/native';

export const DefaultContainer = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 85%;
    height: 90%;
    margin-top: 10px;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border-radius: 15px;
`;

export const Input = styled.TextInput`
    border-radius: 35px;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    background: #C8C8C8 0% 0% no-repeat padding-box;
    width: ${props => props.sizeX || "241px"};
    height: ${props => props.sizeY || "39px"};
    margin-bottom: ${props => props.bottomMargin || "15px"};
    margin-top: ${props => props.topMargin || "0px"};
    padding-left: 10px;
`;

export const DefaultButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${props => props.sizeX || "100px"};
    height: ${props => props.sizeY || "100px"};
    margin-top: ${props => props.topMargin || "15px"};
    border-radius: 5px;
    background-color: #95bfcc;
`;

export const DefaultSubmitButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${props => props.sizeX || "241px"};
    height: ${props => props.sizeY || "39px"};
    background: #00DF1E 0% 0% no-repeat padding-box;
    border-radius: 35px;
`;

export const DefaultModalView = styled.View`
    display: flex;
    justifyContent: center;
    alignItems: center;
    backgroundColor: white;
    width: ${props => props.sizeX || "330px"};
    height: ${props => props.sizeY || "268px"};
    borderRadius: 15px;
`;

export const BackgroundContainer = styled.View`
    background-color: #7EA7B4;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const DefaultText = styled.Text`
    text-align: center;
    font-size: ${props => props.size || "14px"};
    font-weight: ${props => props.weight || "100"};
    color: #707070;
`;