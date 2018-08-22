
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
    Alert
} from 'react-native';
import UserProvider from '../../provider/user-provider';
import commonCss from '../../css/commonCss';
import Validation from '../../provider/validation';
import CustomStatusBar from '../../components/StatusBar';


export default class Login extends Component {

    state = {
        email: null,
        emailError: true,
        emailErrorMsg: null,

        phone: null,
        phoneError: true,
        phoneErrorMsg: null,
    }

    static navigationOptions = {
        title: 'Home',
        header: null,
    };

    setEmail(email) {
        this.setState({ email: email });
        let emailError = Validation.emailValidator(email);
        if (emailError) {
            this.setState({ emailError: emailError.error,emailErrorMsg: emailError.errorMsg });
            // this.setState({  });
        } else {
            this.setState({ emailError: false,emailErrorMsg: null  });
            // this.setState({ });
        }
    }

    setPhone(phone) {
        this.setState({ phone: phone });
        let phoneError = Validation.mobileNumberValidator(phone);
        if (phoneError) {
            this.setState({ phoneError: phoneError.error, phoneErrorMsg: phoneError.errorMsg });
        } else {
            this.setState({ phoneError: false, phoneErrorMsg: null });
        }
    }

    componentWillMount() {
        // ToastAndroid.show("hello", 5000);
        // UserProvider.getUserIdFromLocalStorage()
        //     .then(data => {
        //         userId = data;
        //         ToastAndroid.show(userId, 5000);
        //         if (userId) {
        //             this.props.navigation.replace('Home');
        //         }
        //     })
    }

    verifyphoneExistOrNot = () => {
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
        UserProvider.getUserDetailsByPhone(this.state.phone)
            .then(data1 => {
                let userId, email;
                let data = data1;
                if (data.success === true) {
                    let userId = data.data._id;
                    let phone = this.state.phone;
                    if (data.data.password == null)
                        this.props.navigation.navigate('Signup', { phone: phone, userId: userId });
                    else
                        this.props.navigation.navigate('Password', { phone: phone, data: data1 });
                } else {
                    // this.props.navigation.navigate('Signup');
                }
            })
            .catch(e => {
                console.log("e", e);
                if(!e.hasOwnProperty('message')){
                    e.message ="Something went wrong";
                }
                Alert.alert(
                    'Login',
                    e.message,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: true }
                )
            })
    }

    render() {

        return (
            <View style={styles.container}>
                <CustomStatusBar></CustomStatusBar>

                <View>
                    <Text style={styles.titleText}>D Fix</Text>
                </View>
                <View style={styles.innerContainer}>
                    <TextInput style={styles.TextInput}
                        placeholder="Enter Phone Number"
                        underlineColorAndroid='#fafafa'
                        placeholderTextColor="#26A69A"
                        selectionColor="#fafafa"
                        onChangeText={(text) => this.setPhone(text)}
                    //onChangeText={(text) => this.setState({ phone: text })}
                    >
                    </TextInput>
                    {this.state.phoneErrorMsg && <Text style={commonCss.error}>{this.state.phoneErrorMsg}</Text>}

                    <TouchableOpacity
                        disabled={this.state.phoneErrorMsg}
                        style={styles.button} onPress={this.verifyphoneExistOrNot}>
                        <Text style={styles.textInsideButton}>
                            Next
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
    error: {
        color: "red"
    }


})