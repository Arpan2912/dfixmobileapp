import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Login from '../screens/Login/login';
import Signup from '../screens/SignUp/signup';
import Password from '../screens/Password/password';
import Home from '../screens/Home/home';
import StartDay from '../screens/StartDay/startday';
import StartVisit from '../screens/StartVisit/startVisit';
import StopVisit from '../screens/StopVisit/stopVisit';
import TodayVisits from '../screens/TodayVisits/TodayVisits';
import OrderList from '../screens/OrderList/OrderList';
import UpdateOrder from '../screens/UpdateOrder/UpdateOrder';
import ExpenseList from '../screens/ExpenseList/ExpenseList';
import UpdateExpense from '../screens/UpdateExpense/UpdateExpense';



const stack = StackNavigator({
    Login: {
        screen: Login
    },
    Signup: {
        screen: Signup
    },
    Password: {
        screen: Password
    },
    Home: {
        screen: Home
    },
    StartDay: {
        screen: StartDay
    },
    StartVisit: {
        screen: StartVisit
    },
    StopVisit: {
        screen: StopVisit,
    },
    OrderList: {
        screen: OrderList
    },
    UpdateOrder: {
        screen: UpdateOrder
    },
    TodayVisits: {
        screen: TodayVisits,
    },
    UpdateExpense: {
        screen: UpdateExpense
    },
    ExpenseList: {
        screen: ExpenseList,
    },

},
    {
        headerMode: 'screen',
    });

export const routes = DrawerNavigator({
    Dashboard: {
        screen: stack,
        navigationOptions: {
            title: 'Dashboard'
        }
    },
    TodayVisits: {
        screen: TodayVisits,
        // navigationOptions:{
        //     title:'Log out'
        // }

    },
},
    {
        drawerPosition: 'left',
        contentOptions: {
            activeTintColor: '#000',
        }

    });

// export const routes = StackNavigator({
//     Dashboard: { screen: drawer },
//     Login: {
//         screen: Login
//     },
//     Signup: {
//         screen: Signup
//     },
//     Password: {
//         screen: Password
//     },
//     Home: {
//         screen: Home
//     },
//     StartDay: {
//         screen: StartDay
//     },
//     StartVisit: {
//         screen: StartVisit
//     },
//     StopVisit: {
//         screen: StopVisit,
//     },
//     OrderList: {
//         screen: OrderList
//     },
//     UpdateOrder: {
//         screen: UpdateOrder
//     },
//     TodayVisits: {
//         screen: TodayVisits,
//     },
//     UpdateExpense: {
//         screen: UpdateExpense
//     },
//     ExpenseList: {
//         screen: ExpenseList,
//     },

// },
//     {
//         headerMode: 'screen',
//     });


