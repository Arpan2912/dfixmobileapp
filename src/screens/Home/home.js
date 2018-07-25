
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    // Button,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    AppState,
    Dimensions,
    ActivityIndicator,
    Alert,
    Image,
    PermissionsAndroid,
    BackHandler
} from 'react-native';
import {
    Button,
    Title,
    Body,
    Right,
    Left,
    Footer,
    Card,
    CardItem,
    Container,
    Header,
    Content,
    Icon,
} from 'native-base';

import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';
import MeetingProvider from '../../provider/meeting-provider';
import StartDayProvider from '../../provider/startday-provider';
import Custom from '../../components/Custom';
import CustomStatusBar from '../../components/StatusBar';
import { Col, Row, Grid } from "react-native-easy-grid";
var { height, width } = Dimensions.get('screen');


let token;
let eventObj;
let startDayId = null;
let startVisitId = null;
let userId = null;
let startDayDetails = null;
let dayTitle = "Start Day";
let visitTitle = null;

export default class Home extends Component {

    state = {
        token: null,
        startDay: 'false',
        startVisit: 'false',
        isLoading: true
    }

    constructor() {
        super()
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
                ToastAndroid.show(userId, 5000);
                if (userId == null) {
                    // this.props.navigation.replace('Login');
                }
            })
    }
    componentWillMount() {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(isPermission => {
            // console.log("check permission",isPermission);
            ToastAndroid.show("ispermission"+isPermission,1000);
            if (isPermission) {

            } else {
                return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            }
        })
        .then(isGranted=>{
            // console.log("isgranted",isGranted);
            ToastAndroid.show("isGranted"+isGranted,1000);
            
            if (isGranted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log("You can use the app")
              } else {
                // console.log("location permission denied")
                BackHandler.exitApp();
              }
        })
        .catch(e=>{
            console.log("e",e);
        })

        UserProvider.getUserIdFromLocalStorage()
            .then(userId => {
                if (userId) {
                    this.setState({ isLoading: true });
                    AppState.addEventListener('change', this._handleAppStateChange);
                    eventObj = EventSingleton.geteventEmitterObj();

                    eventObj.on('startday', (id, status) => {
                        console.log("status", id, status);
                        startDayId = id;
                        startDayDetails.status = status;
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
            })

    }

    componentWillUnmount() {
        // ToastAndroid.show("COmponent unmount called", 1000);
        AppState.removeEventListener('change', this._handleAppStateChange);  
        // ToastAndroid.show("eventObj" + eventObj, 1000);
        // eventObj.removeEventListener('stopVisit');
        // eventObj.removeEventListener('startvisit');
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            ToastAndroid.show("active",1000);
            // console.log("handle app state change");
            // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            
            UserProvider.getUserIdFromLocalStorage()
                .then(userId => {
                    if (userId) {
                        this.setState({ isLoading: true });
                        this.resetStatus().then(data => {
                            ToastAndroid.show("reset status promise resolved", 5000);
                            this.setLocalVaribles();
                            this.setState({ isLoading: false });
                        }).catch(e => {
                            this.setLocalVaribles();
                            this.setState({ isLoading: false });

                        })
                    }
                })

        } else {

        }
    }


    componentDidMount() {
        ToastAndroid.show("Inside Did Mount", 5000);
        this.setState({ isLoading: true });
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
                if (userId) {
                    ToastAndroid.show("UserId Check Pass", 5000);
                    this.resetStatus()
                        .then(data => {
                            // ToastAndroid.show("reset status promise resolved", 5000);
                            this.setLocalVaribles();
                            this.setState({ isLoading: false });
                        })
                        .catch(e => {
                            this.setLocalVaribles();
                            this.setState({ isLoading: false });
                        })
                } else {
                    // this.setLocalVaribles();
                    // this.resetStatus()
                    //     .then(data => {
                    //         this.setState({ isLoading: false });
                    //     })
                }
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

    // constructor() {
    //     super();
    //     UserProvider.getUserTokenFromLocalStorage()
    //         .then(data => {
    //             token = data;
    //         });
    // };

    static navigationOptions = {
        header: null,
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
                            startDayDetails = status;
                        } else if (startDayData.data && startDayData.data._id) {
                            let status = {
                                startDayId: startDayData.data._id,
                                status: 'false'
                            }
                            UserProvider.setStartDayStatus(JSON.stringify(status));
                            startDayDetails = status;
                        } else {
                            let status = {
                                startDayId: null,
                                status: 'false'
                            }
                            UserProvider.setStartDayStatus(JSON.stringify(status));
                            startDayDetails = status;
                        }
                    } else if (startDayData.success === false) {
                        let status = {
                            startDayId: null,
                            status: 'false'
                        }
                        UserProvider.setStartDayStatus(JSON.stringify(status));
                        startDayDetails = status;
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
                    console.log("e", e);
                    if (!e.hasOwnProperty('message')) {
                        e.message = "Something went wrong";
                    }
                    Alert.alert(
                        'Alert',
                        e.message,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: true }
                    )
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
                        ToastAndroid.show("stored date" + data, 5000);
                        if (storedDate < date) {
                            let startDatStatus = {
                                startDayId: null,
                                status: 'false'
                            }
                            UserProvider.setTodayDateToLocalStorage(dateString);
                            UserProvider.setStartDayStatus(JSON.stringify(startDatStatus));
                            UserProvider.resetVisitStatus();
                            UserProvider.resetLocationFromLocalStorage();
                            startDayDetails = startDatStatus;
                            return resolve(true);
                        } else {
                            // do nothing
                            this.setTodayStatus().then(data => resolve(true));

                        }
                    } else {
                        let startDatStatus = {
                            startDayId: null,
                            status: 'false'
                        }
                        UserProvider.setTodayDateToLocalStorage(dateString);
                        UserProvider.setStartDayStatus(JSON.stringify(startDatStatus));
                        UserProvider.resetLocationFromLocalStorage();
                        UserProvider.resetVisitStatus();
                        startDayDetails = null;
                        return resolve(true);
                    }
                })
                .catch(e => {
                    Alert.alert(
                        'Error',
                        'Error in reset status' + e.toString()
                    )
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
                    Custom.stopService();
                    ToastAndroid.show("set local", 1000);
                    let startDayStatus = JSON.parse(status[0]);
                    if (!!startDayStatus && (startDayStatus.status == 'true' || startDayStatus.status == true)) {
                        Custom.show("Start Service", 1000);
                    }
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

    gotoStartOrStopVisitPage(visitTitle) {
        visitStatus = this.state.startVisit || 'false';
        if (visitStatus === 'true') {
            this.props.navigation.navigate('StopVisit', { title: visitTitle, startVisitId: (!!startVisitId) ? startVisitId : null });
        } else {
            this.props.navigation.navigate('StartVisit', { title: visitTitle, startVisitId: (!!startVisitId) ? startVisitId : null });
        }
    }

    gotoTodayVisitsPage() {
        this.props.navigation.push('TodayVisits');
    }

    gotoTodayExpensePage() {
        this.props.navigation.push('ExpenseList');
    }

    gotoAboutPage() {
        this.props.navigation.push('AboutPage');
    }

    gotoStartDayPage(dayTitle) {
        UserProvider.getStartDayStatus().then(data => {
            startDayDetails = JSON.parse(data);
            ToastAndroid.show(data, 1000);
            if (startDayDetails && startDayDetails.status === 'false' && startDayDetails.startDayId !== null) {
                Alert.alert(
                    'Warning',
                    'You have already completed day, Contact your manager',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: true }
                )
                // ToastAndroid.show("You have alrady completed day, Contact your manager",1000);
                return;
            }
            else
                this.props.navigation.navigate('StartDay', { title: dayTitle ? dayTitle : "Start Day", startDayId: (!!startDayId) ? startDayId : null });
        }).catch(e => {

        })

    }

    render() {
        // Custom.show("background is running", 2000);
        let dayTitle = (this.state.startDay === 'true') ? "Stop Day" : "Start Day";
        let visitTitle = (this.state.startVisit === 'true') ? "End Visit" : "Start Visit";
        return (
            <Container>
                <Header style={styles.Header}>
                    {/* <Left>
                        <Button transparent onPress={() => this.props.navigation.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left> */}
                    <Body style={styles.Header}>
                        <Title style={{ fontWeight: 'bold' }}>Home</Title>
                    </Body>
                    {/* <Right>
                    <Button transparent>
                        <Icon name='add' />
                    </Button>
                </Right> */}
                </Header>
                <View style={styles.container}>
                    <CustomStatusBar></CustomStatusBar>
                    {this.state.isLoading === false && <View style={styles.container}>
                        <Image resizeMethod="resize" resizeMode="stretch" style={{ height: 70, width: width / 1.5, padding: 50, margin: 20 }}
                            source={require('../../images/dfix-Copy.png')}
                        />
                        <Grid>
                            <Row style={{ height: 100 }}>
                                <Col
                                    style={{
                                        width: width / 2, backgroundColor: '#009688', alignItems: 'center',
                                        justifyContent: 'center', borderColor: '#fafafa', borderWidth: 1
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.gotoStartDayPage(dayTitle)}
                                        style={styles.buttonInsideCol}
                                    >
                                        <Icon name="power" style={{ color: "#fafafa" }}></Icon>
                                        <Text style={{ color: "#fafafa" }}>{dayTitle}</Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col
                                    style={!(startDayDetails && (startDayDetails.status === 'true')) ? styles.columnDisabled : styles.column}
                                //style={{
                                //  width: width / 2, backgroundColor: '#009688', alignItems: 'center',
                                //justifyContent: 'center', borderColor: '#fafafa', borderWidth: 1
                                //}}
                                >
                                    <TouchableOpacity
                                        style={!(startDayDetails && (startDayDetails.status === 'true')) ? styles.disabled : styles.buttonInsideCol} disabled={!(startDayDetails && (startDayDetails.status === 'true'))}
                                        onPress={() => this.gotoStartOrStopVisitPage(visitTitle)}
                                        //onPress={() => this.gotoStartDayPage(dayTitle)}
                                        style={styles.buttonInsideCol}
                                    >
                                        <Icon name="calendar" style={{ color: "#fafafa" }}></Icon>
                                        <Text style={{ color: "#fafafa" }}>{visitTitle}</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                            <Row style={{ height: 100 }}>
                                <Col style={{
                                    width: width / 2, backgroundColor: '#009688', alignItems: 'center',
                                    justifyContent: 'center', borderColor: '#fafafa', borderWidth: 1
                                }}>
                                    <TouchableOpacity
                                        onPress={() => this.gotoTodayVisitsPage()}
                                        style={styles.buttonInsideCol}
                                    >
                                        <Icon name="bicycle" style={{ color: "#fafafa" }}></Icon>
                                        <Text style={{ color: "#fafafa" }}>Today Visits</Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{
                                    width: width / 2, backgroundColor: '#009688', alignItems: 'center',
                                    justifyContent: 'center', borderColor: '#fafafa', borderWidth: 1
                                }}>
                                    <TouchableOpacity
                                        onPress={() => this.gotoTodayExpensePage()}
                                        style={styles.buttonInsideCol}
                                    >
                                        <Icon name="logo-usd" style={{ color: "#fafafa" }}></Icon>
                                        <Text style={{ color: "#fafafa" }}>Today Expense</Text>
                                    </TouchableOpacity>
                                </Col>
                            </Row>
                            <Row style={{ height: 100 }}>
                                <Col style={{
                                    width: width, backgroundColor: '#009688', alignItems: 'center',
                                    justifyContent: 'center', borderColor: '#fafafa', borderWidth: 1
                                }}>
                                    <TouchableOpacity
                                        onPress={() => this.gotoAboutPage()}
                                        style={styles.buttonInsideCol}
                                    >
                                        <Icon name="information-circle" style={{ color: "#fafafa" }}></Icon>
                                        <Text style={{ color: "#fafafa" }}>About</Text>
                                    </TouchableOpacity>
                                </Col>

                            </Row>
                        </Grid>
                    </View>}

                    {this.state.isLoading === true && <View style={styles.container}>
                        <ActivityIndicator size="large" color="#009688" />
                    </View>}

                </View>
            </Container>

            // </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#ffffff",
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
    buttonInsideCol: {
        alignItems: 'center',
        width: width / 2,
        height: 100,
        justifyContent: 'center'
    },
    textInsideButton: {
        color: "#fafafa"
    },
    disabled: {
        backgroundColor: "#B2DFDB",
        margin: 10,
        padding: 10,
        width: width * 4 / 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    column: {
        width: width / 2,
        backgroundColor: '#009688',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fafafa',
        borderWidth: 1
    },
    columnDisabled: {
        width: width / 2,
        backgroundColor: '#B2DFDB',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fafafa',
        borderWidth: 1
    },
    Header: {
        backgroundColor: '#009688',
        alignItems: 'center',
        justifyContent: 'center',

        // fontWeight:'bold'
    },




})