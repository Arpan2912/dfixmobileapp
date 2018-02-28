
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
} from 'react-native';
import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';

let token;
let eventObj;
let _id = null;

export default class Home extends Component {

    state = {
        token: null,
        startDay: 'false'
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
        UserProvider.getStartDayStatus()
            .then(status => {
                try {
                    status = JSON.parse(status);
                    this.setState({ startDay: (!!status) ? status.status : null });
                    _id = (!!status && status.startDayId) ? status.startDayId : null;
                } catch (e) {
                    console.error(e);
                }
            });

        eventObj.on('startday', (id, status) => {
            console.log("status", id, status);
            _id = id;
            this.setState({ startDay: status });
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


    render() {
        let dayTitle = (this.state.startDay === 'true') ? "Stop Day" : "Start Day";
        let visitTitle = (this.state.startVist === 'true')? "End Visit" :"Start Visit";
        return (
            <View style={styles.container}>
                {/* <View style={styles.innerContainer}> */}
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('StartDay', { title: dayTitle, _id: (!!_id) ? _id : null })}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        {dayTitle} {this.state.token ? this.state.token.toString() : null}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('StartVisit')}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        {visitTitle} {this.state.token ? this.state.token.toString() : null}
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