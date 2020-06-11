import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Login,
  Profile,
  Register,
  UserSettings,
  Subjects,
  Schedules,
  MonitoringRequest,
  MonitoringResponse,
  StudentHistory,
  Confirmation,
  Scheduling,
} from './src/pages'
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab  = createBottomTabNavigator();

const Stack = createStackNavigator();

const NormalUserMainTabs = (props) => (
  <Tab.Navigator headerMode='none'
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      route.params = props.route.params.params;
      let iconName;

      if (route.name === 'Perfil') {
        iconName = focused
          ? 'ios-person'
          : 'ios-person';
      } 
      if (route.name === 'Solicitar') {
        iconName = focused
          ? 'ios-add-circle'
          : 'ios-add-circle';
      } 
      if (route.name === 'Histórico') {
        iconName = focused
          ? 'ios-time'
          : 'ios-time';
      } 
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
  >
    <Tab.Screen name="Perfil" component={Profile}/>
    <Tab.Screen name="Solicitar" component={MonitoringRequest}/>
    <Tab.Screen name="Histórico" component={StudentHistory}/>
  </Tab.Navigator>
)

const MonitorUserMainTabs = (props) => (
  <Tab.Navigator headerMode='none'
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      route.params = props.route.params.params;
      let iconName;
      if (route.name === 'Perfil') {
        iconName = focused
          ? 'ios-person'
          : 'ios-person';
      } 
      if (route.name === 'Horário') {
        iconName = focused
          ? 'ios-calendar'
          : 'ios-calendar';
      } 
      if (route.name === 'Agendamentos') {
        iconName = focused
          ? 'ios-list-box'
          : 'ios-list-box';
      }
      if (route.name === 'Solicitar') {
        iconName = focused
          ? 'ios-add-circle'
          : 'ios-add-circle';
      } 
      if (route.name === 'Histórico') {
        iconName = focused
          ? 'ios-time'
          : 'ios-time';
      } 
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
  >
    <Tab.Screen name="Perfil" component={Profile}/>
    <Tab.Screen name="Horário" component={Subjects}/>
    <Tab.Screen name="Agendamentos" component={Scheduling}/>
    <Tab.Screen name="Solicitar" component={MonitoringRequest}/>
    <Tab.Screen name="Histórico" component={StudentHistory}/>
  </Tab.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='none' initialRouteName='Login' navigationOptions={{ headerShown: false, gestureEnabled: false}}>
        <Stack.Screen name="Login" component={Login} options={{tabBarVisible: false}}/>
        <Stack.Screen name="NormalUserMainTabs" component={NormalUserMainTabs} />
        <Stack.Screen name="MonitorUserMainTabs" component={MonitorUserMainTabs} />
        <Stack.Screen name="Register" component={Register} options={{tabBarVisible: false}}/>
        <Stack.Screen name="Confirmation" component={Confirmation} options={{tabBarVisible: false}}/>
        <Stack.Screen name="MonitoringResponse" component={MonitoringResponse} options={{tabBarVisible: false}}/>
        <Stack.Screen name="UserSettings" component={UserSettings} options={{tabBarVisible: false}}/>
        <Stack.Screen name="Schedules" component={Schedules} options={{tabBarVisible: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}