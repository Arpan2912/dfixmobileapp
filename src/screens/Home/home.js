
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    Button,
    TextInput,
    TouchableOpacity
} from 'react-native';
import UserProvider from '../../provider/user-provider';
let token;
export default class Home extends Component {
    state = {
        token: null
    }
    constructor() {
        super();
        UserProvider.getUserTokenFromLocalStorage()
            .then(data => {
                token = data;
            });
    }
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

        return (
            <View style={styles.container}>
                {/* <View style={styles.innerContainer}> */}
                <TouchableOpacity style={styles.button} title="Start Day" onPress={() => this.props.navigation.navigate('StartDay', { title: "Start Day" })}>
                    <Text style={styles.textInsideButton}>
                        Start Day {this.state.token}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} title="Stop Day" onPress={() => { this.setState({ token: token }) }}>
                    {/* <TouchableOpacity style={styles.button} title="Stop Day" onPress={() => this.props.navigation.navigate('StartDay', { title: "Stop Day" })}> */}
                    <Text style={styles.textInsideButton}>
                        Stop Day
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