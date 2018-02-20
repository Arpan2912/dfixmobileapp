
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
    AsyncStorage
} from 'react-native';
import UserProvider from '../../provider/user-provider';

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
                    AsyncStorage.setItem('token', data.data.token)
                        .then(data => {
                            this.props.navigation.navigate('Home');
                        })
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