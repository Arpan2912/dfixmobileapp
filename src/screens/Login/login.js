
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    Button,
    TextInput, TouchableOpacity
} from 'react-native';
import UserProvider from '../../provider/user-provider';

export default class Login extends Component {

    state = {
        email: null
    }

    static navigationOptions = {
        title: 'Home',
        header: null,
    };

    setEmail(email) {
        this.setState({ email: email });
    }

    verifyEmailExistOrNot = () => {
        UserProvider.getUserDetailsByEmail(this.state.email)
            .then(data1 => {
                let userId, email;
                let data = data1;
                if (data.success === true) {
                    let userId = data.data._id;
                    let email = this.state.email;
                    if (data.data.password == null)
                        this.props.navigation.navigate('Signup', { email: email, userId: userId });
                    else
                        this.props.navigation.navigate('Password', { email: email, data: data1 });
                } else {
                    // this.props.navigation.navigate('Signup');
                }
            })
            .catch(e => {

            })
    }

    render() {

        return (
            <View style={styles.container}>

                <View>
                    <Text style={styles.titleText}>Arpan Shah</Text>
                </View>
                <View style={styles.innerContainer}>
                    <TextInput style={styles.TextInput}
                        placeholder="Enter Email"
                        underlineColorAndroid='#fafafa'
                        placeholderTextColor="#26A69A"
                        onChangeText={(text) => this.setState({ email: text })}
                    >

                    </TextInput>
                    <TouchableOpacity style={styles.button} onPress={this.verifyEmailExistOrNot}>
                        <Text style={styles.textInsideButton}>
                            Next {this.state.email ? this.state.email : ''}
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