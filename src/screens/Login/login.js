
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
import commonCss from '../../css/commonCss';
import Validation from '../../provider/validation';

export default class Login extends Component {

    state = {
        email: null,
        emailError: true,
        emailErrorMsg: null,
    }

    static navigationOptions = {
        title: 'Home',
        header: null,
    };

    setEmail(email) {
        this.setState({ email: email });
        let emailError = Validation.emailValidator(email);
        if (emailError) {
            this.setState({ emailError: emailError.error });
            this.setState({ emailErrorMsg: emailError.errorMsg });
        } else {
            this.setState({ emailError: false });
            this.setState({ emailErrorMsg: null });
        }
    }

    componentWillMount() {
        ToastAndroid.show("hello", 5000);
        // UserProvider.getUserIdFromLocalStorage()
        //     .then(data => {
        //         userId = data;
        //         ToastAndroid.show(userId, 5000);
        //         if (userId) {
        //             this.props.navigation.replace('Home');
        //         }
        //     })
    }

    verifyEmailExistOrNot = () => {
        // UserProvider.getStartDayStatus()
        // .then(data => {
        //     this.setState({ email: data });
        // });
        // UserProvider.removeAll()
        //     .then(data => {
        //         return UserProvider.getAll()
        //     })
        //     .then(data => {
        //         this.setState({ email: JSON.stringify(data) });
        //     });
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
                        {this.state.emailErrorMsg && <Text style={commonCss.error}>{this.state.emailErrorMsg}</Text>}
                    
                    <TouchableOpacity
                        disabled={this.state.emailErrorMsg}
                        style={styles.button} onPress={this.verifyEmailExistOrNot}>
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
    },
    error:{
        color:"red"
    }


})