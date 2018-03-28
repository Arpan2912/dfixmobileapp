
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    Button,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    ToastAndroid,
    AppState
} from 'react-native';
import UserProvider from '../../provider/user-provider';
import StartDayProvider from '../../provider/startday-provider';
import MeetingProvider from '../../provider/meeting-provider';
let userId = null;

export default class Password extends Component {
    static navigationOptions = {
        title: 'Password',
        header: null,
    };
    state = {
        title: ''
    }
    login = () => {
        let email = this.props.navigation.state.params.email;
        let password = this.state.password;
        UserProvider.authenticateUser(email, password)
            .then(data => {
                this.setState({ title: JSON.stringify(data) })
                if (data.success === true) {
                    Promise.all([
                        UserProvider.setUserIdToLocalStorage(data.data.userId),
                        UserProvider.setUserTokenToLocalStorage(data.data.token),
                    ])
                        // AsyncStorage.setItem('userId', data.data.userId);
                        // AsyncStorage.setItem('token', data.data.token)
                        .then(result => {
                            userId = data.data.userId;
                            ToastAndroid.show(data.data.userId, 5000);
                            this.props.navigation.navigate('Home');
                            // return Promise.all([
                            //     StartDayProvider.getStartDayDetails(data.data.userId),
                            //     MeetingProvider.getTodayLastRiunningVisit(data.data.userId)
                            // ])
                            //return StartDayProvider.getStartDayDetails(data.data.userId)
                        })
                        // .then(data => {
                        //     let startDayData = data;
                        //     // let runningVisitData = data[1];

                        //     if (startDayData.success === true) {
                        //         if (startDayData.data && !startDayData.data.end_time) {
                        //             let status = {
                        //                 startDayId: startDayData.data._id,
                        //                 status: 'true'
                        //             }
                        //             UserProvider.setStartDayStatus(JSON.stringify(status));
                        //         } else {
                        //             let status = {
                        //                 startDayId: null,
                        //                 status: 'false'
                        //             }
                        //             UserProvider.setStartDayStatus(JSON.stringify(status));
                        //         }
                        //     } else if (startDayData.success === false) {
                        //         let status = {
                        //             startDayId: null,
                        //             status: 'false'
                        //         }
                        //         UserProvider.setStartDayStatus(JSON.stringify(status));
                        //     }

                        //     return MeetingProvider.getTodayLastRiunningVisit(userId)
                        // })
                        // .then(data => {
                        //     let runningVisitData = data;
                        //     if (runningVisitData.success === true) {
                        //         if (runningVisitData.data && !runningVisitData.data.end_time) {
                        //             let status = {
                        //                 startVisitId: data.data._id,
                        //                 status: 'true'
                        //             }
                        //             UserProvider.setVisitStatus(JSON.stringify(status));

                        //         } else {
                        //             UserProvider.resetVisitStatus();
                        //         }
                        //     } else if (runningVisitData.success === false) {
                        //         UserProvider.resetVisitStatus();
                        //     }
                        //     ToastAndroid.show(JSON.stringify(data), 5000);
                        //     this.props.navigation.navigate('Home');
                        // })
                        .catch(e => {

                        })
                } else {

                }
            })
            .catch(e => {
                this.props.navigation.navigate('Home')
            })
    }
    render() {

        return (
            <View style={styles.container}>


                <View style={styles.innerContainer}>
                    <TextInput style={styles.TextInput}
                        placeholder="Enter Password"
                        underlineColorAndroid='#fafafa'
                        placeholderTextColor="#26A69A"
                        onChangeText={(text) => this.setState({ password: text })}
                    >

                    </TextInput>
                    <TouchableOpacity style={styles.button} onPress={this.login}>
                        <Text style={styles.textInsideButton}>
                            Login {this.state.title}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleText: {
        color: "#fafafa",
        fontWeight: 'bold',
        fontSize: 40
    },
    container: {
        backgroundColor: "#009688",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    TextInput: {
        width: 300,
        height: 50,
        fontSize: 20,
        color: '#fafafa',
        margin: 30,
        alignItems: 'center',
        textAlign: 'center'
    },
    innerContainer: {
        alignItems: 'center'
    },
    button: {
        backgroundColor: "#fafafa",
        padding: 10,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInsideButton: {
        color: "#009688"
    }


})