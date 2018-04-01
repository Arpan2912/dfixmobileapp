
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
    ToastAndroid,
    AppState,
    Dimensions
} from 'react-native';
import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';
import MeetingProvider from '../../provider/meeting-provider';
import StartDayProvider from '../../provider/startday-provider';
var { height, width } = Dimensions.get('screen');


let token;
let eventObj;
let startDayId = null;
let startVisitId = null;
let userId = null;

export default class Home extends Component {

    state = {
        token: null,
        startDay: 'false',
        startVisit: 'false'
    }

    componentWillMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        eventObj = EventSingleton.geteventEmitterObj();

        eventObj.on('startday', (id, status) => {
            console.log("status", id, status);
            startDayId = id;
            this.setState({ startDay: status });
        });

        eventObj.on('startvisit', (id, status) => {
            console.log("status", id, status);
            startVisitId = id;
            this.setState({ startVisit: status });
        });

        eventObj.on('stopVisit', () => {
            this.setState({ startVisit: 'false' })
        })

    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            this.resetStatus().then(data => {
                ToastAndroid.show("reset status promise resolved",5000);
                this.setLocalVaribles();
            })
                .catch(e => {
                    this.setLocalVaribles();
                })
        }
    }


    componentDidMount() {
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
                this.resetStatus()
                    .then(data => {
                        ToastAndroid.show("reset status promise resolved",5000);
                        this.setLocalVaribles()
                    })
                    .catch(e => {
                        this.setLocalVaribles();
                    })
            });
        // StartDayProvider.getStartDayDetails(userId)
        //     .then(data => {
        //         let startDayData = data;
        //         // let runningVisitData = data[1];

        //         if (startDayData.success === true) {
        //             if (startDayData.data && !startDayData.data.end_time) {
        //                 let status = {
        //                     startDayId: startDayData.data._id,
        //                     status: 'true'
        //                 }
        //                 UserProvider.setStartDayStatus(JSON.stringify(status));
        //             } else {
        //                 let status = {
        //                     startDayId: null,
        //                     status: 'false'
        //                 }
        //                 UserProvider.setStartDayStatus(JSON.stringify(status));
        //             }
        //         } else if (startDayData.success === false) {
        //             let status = {
        //                 startDayId: null,
        //                 status: 'false'
        //             }
        //             UserProvider.setStartDayStatus(JSON.stringify(status));
        //         }

        //         return MeetingProvider.getTodayLastRiunningVisit(userId)
        //     })
        //     .then(data => {
        //         let runningVisitData = data;
        //         if (runningVisitData.success === true) {
        //             if (runningVisitData.data && !runningVisitData.data.end_time) {
        //                 let status = {
        //                     startVisitId: data.data._id,
        //                     status: 'true'
        //                 }
        //                 UserProvider.setVisitStatus(JSON.stringify(status));

        //             } else {
        //                 UserProvider.resetVisitStatus();
        //             }
        //         } else if (runningVisitData.success === false) {
        //             UserProvider.resetVisitStatus();
        //         }
        //         ToastAndroid.show(JSON.stringify(data), 5000);
        //     })

        // Promise.all([UserProvider.getStartDayStatus(), UserProvider.getVisitStatus()])
        //     .then(status => {
        //         try {
        //             startDayStatus = JSON.parse(status[0]);
        //             visitStatus = JSON.parse(status[1]);
        //             this.setState({ startDay: (!!startDayStatus) ? startDayStatus.status : null });
        //             startDayId = (!!startDayStatus && startDayStatus.startDayId) ? startDayStatus.startDayId : null;
        //             startVisitId = (!!visitStatus && visitStatus.startVisitId) ? visitStatus.startVisitId : null;
        //             this.setState({ startVisit: (!!visitStatus) ? visitStatus.status : null });
        //             ToastAndroid.show(status[1], 5000);
        //         } catch (e) {
        //             console.error(e);
        //         }
        //     });
    }

    constructor() {
        super();
        UserProvider.getUserTokenFromLocalStorage()
            .then(data => {
                token = data;
            });
    };

    static navigationOptions = {
        title: 'Home',
        headerStyle: {
            backgroundColor: '#009688'
        },
        headerTintColor: "#fafafa"
    };

    setEmail(email) {
        this.setState({ email: email });
    }

    setTodayStatus() {
        return new Promise((resolve, reject) => {

            StartDayProvider.getStartDayDetails(userId)
                .then(data => {

                    let startDayData = data;
                    // ToastAndroid.show("start" + JSON.stringify(data), 5000);
                    // let runningVisitData = data[1];
                    if (startDayData.success === true) {
                        if (startDayData.data && !startDayData.data.end_time) {
                            // ToastAndroid.show("inside end time null");
                            let status = {
                                startDayId: startDayData.data._id,
                                status: 'true'
                            }
                            UserProvider.setStartDayStatus(JSON.stringify(status));
                        } else {
                            let status = {
                                startDayId: null,
                                status: 'false'
                            }
                            UserProvider.setStartDayStatus(JSON.stringify(status));
                        }
                    } else if (startDayData.success === false) {
                        let status = {
                            startDayId: null,
                            status: 'false'
                        }
                        UserProvider.setStartDayStatus(JSON.stringify(status));
                    }

                    return MeetingProvider.getTodayLastRiunningVisit(userId)
                })
                .then(data => {
                    // ToastAndroid.show("today visit" + JSON.stringify(data), 5000);
                    let runningVisitData = data;
                    if (runningVisitData.success === true) {
                        if (runningVisitData.data && !runningVisitData.data.end_time) {
                            let status = {
                                startVisitId: data.data._id,
                                status: 'true'
                            }
                            UserProvider.setVisitStatus(JSON.stringify(status));

                        } else {
                            UserProvider.resetVisitStatus();
                        }
                    } else if (runningVisitData.success === false) {
                        UserProvider.resetVisitStatus();
                    }
                    resolve(true);
                    // ToastAndroid.show(JSON.stringify(data), 5000);
                })
                .catch(e => {
                    this.resetStatus();
                    resolve(true);
                })
        })
    }

    resetStatus() {
        let date = new Date();
        let dateString;
        date.setHours(0, 0, 0, 0);
        date = new Date(date);
        dateString = date.toString();
        return new Promise((resolve, reject) => {
            UserProvider.getTodayDateFromLocalStorage()
                .then(data => {
                    if (data) {
                        let storedDate = new Date(data);
                        ToastAndroid.show("stored date"+data,5000);
                        if (storedDate < date) {
                            let startDatStatus = {
                                startDayId: null,
                                status: 'false'
                            }
                            UserProvider.setTodayDateToLocalStorage(dateString);
                            UserProvider.setStartDayStatus(JSON.stringify(startDatStatus));
                            UserProvider.resetVisitStatus();
                            return resolve(true);
                        } else {
                            // do nothing
                            this.setTodayStatus().then(data=>resolve(true));

                        }
                    } else {
                        UserProvider.setTodayDateToLocalStorage(dateString);
                        UserProvider.setStartDayStatus(JSON.stringify(startDatStatus));
                        UserProvider.resetVisitStatus();
                        return resolve(true);
                    }
                })
                .catch(e => {
                    return resolve(true);
                    // UserProvider.setTodayDateToLocalStorage(dateString);
                    // UserProvider.setStartDayStatus(JSON.stringify(startDatStatus));
                    // UserProvider.resetVisitStatus();
                })


        })
    }

    setLocalVaribles() {
        Promise.all([UserProvider.getStartDayStatus(), UserProvider.getVisitStatus()])
            .then(status => {
                try {
                    ToastAndroid.show("set local", 1000);
                    let startDayStatus = JSON.parse(status[0]);
                    let visitStatus = JSON.parse(status[1]);
                    this.setState({ startDay: (!!startDayStatus) ? startDayStatus.status : null });
                    startDayId = (!!startDayStatus && startDayStatus.startDayId) ? startDayStatus.startDayId : null;
                    startVisitId = (!!visitStatus && visitStatus.startVisitId) ? visitStatus.startVisitId : null;
                    this.setState({ startVisit: (!!visitStatus) ? visitStatus.status : null });
                    // ToastAndroid.show(status[1], 5000);
                } catch (e) {
                    console.error(e);
                }
            });
    }

    gotoStartOrStopVisitPage() {
        visitStatus = this.state.startVisit || 'false';
        if (visitStatus === 'true') {
            this.props.navigation.navigate('StopVisit', { title: "End Visit", startVisitId: (!!startVisitId) ? startVisitId : null });
        } else {
            this.props.navigation.navigate('StartVisit', { title: "Start Visit", startVisitId: (!!startVisitId) ? startVisitId : null });
        }
    }

    gotoTodayVisitsPage() {
        this.props.navigation.navigate('TodayVisits');
    }

    gotoTodayExpensePage() {
        this.props.navigation.navigate('ExpenseList');
    }

    render() {
        let dayTitle = (this.state.startDay === 'true') ? "Stop Day" : "Start Day";
        let visitTitle = (this.state.startVisit === 'true') ? "End Visit" : "Start Visit";
        return (
            <View style={styles.container}>
                {/* <View style={styles.innerContainer}> */}
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('StartDay', { title: dayTitle, startDayId: (!!startDayId) ? startDayId : null })}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        {dayTitle} {this.state.token ? this.state.token.toString() : null}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this.gotoStartOrStopVisitPage()}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        {visitTitle} {this.state.token ? this.state.token.toString() : null}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this.gotoTodayVisitsPage()}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        Today Visits
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => this.gotoTodayExpensePage()}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        Today Expense
                    </Text>
                </TouchableOpacity>

            </View>
            // </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fafafa",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },


    button: {
        backgroundColor: "#009688",
        margin: 10,
        padding: 10,
        width: width * 4 / 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInsideButton: {
        color: "#fafafa"
    }


})