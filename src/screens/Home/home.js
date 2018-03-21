
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
    ToastAndroid
} from 'react-native';
import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';

let token;
let eventObj;
let startDayId = null;
let startVisitId = null;

export default class Home extends Component {

    state = {
        token: null,
        startDay: 'false',
        startVisit: 'false'
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
        // Promise.all([UserProvider.getStartDayStatus(), UserProvider.getVisitStatus()])
        //     .then(status => {
        //         try {
        //             startDayStatus = JSON.parse(status[0]);
        //             visitStatus = JSON.parse(status[1]);
        //             this.setState({ startDay: (!!startDayStatus) ? startDayStatus.status : null });
        //             startDayId = (!!startDayStatus && startDayStatus.startDayId) ? startDayStatus.startDayId : null;
        //             startVisitId = (!!visitStatus && visitStatus.startVisitId) ? visitStatus.startVisitId : null;
        //             this.setState({ startVisit: visitStatus.status });
        //         } catch (e) {
        //             console.error(e);
        //         }
        //     });


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
    componentDidMount() {
        Promise.all([UserProvider.getStartDayStatus(), UserProvider.getVisitStatus()])
            .then(status => {
                try {
                    startDayStatus = JSON.parse(status[0]);
                    visitStatus = JSON.parse(status[1]);
                    this.setState({ startDay: (!!startDayStatus) ? startDayStatus.status : null });
                    startDayId = (!!startDayStatus && startDayStatus.startDayId) ? startDayStatus.startDayId : null;
                    startVisitId = (!!visitStatus && visitStatus.startVisitId) ? visitStatus.startVisitId : null;
                    this.setState({ startVisit: (!!visitStatus)?visitStatus.status:null });
                    ToastAndroid.show(status[1],5000);
                } catch (e) {
                    console.error(e);
                }
            });
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
        padding: 10,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInsideButton: {
        color: "#fafafa"
    }


})