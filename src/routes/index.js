import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from '../screens/Login/login';
import Signup from '../screens/SignUp/signup';
import Password from '../screens/Password/password';
import Home from '../screens/Home/home';
import StartDay from '../screens/StartDay/startday';
import StartVisit from '../screens/StartVisit/startVisit';

export const routes = StackNavigator({
    Login: {
        screen: Login
    },
    Signup: {
        screen: Signup
    },
    Password:{
        screen:Password
    },
    Home:{
        screen:Home
    },
    StartDay:{
        screen:StartDay
    },
    StartVisit:{
        screen:StartVisit
    }
},
{
    headerMode:'screen',
});
