
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput, TouchableOpacity
} from 'react-native';
import UserProvider from '../../provider/user-provider';
import Validation from '../../provider/validation';
import commonCss from '../../css/commonCss';

export default class Signup extends Component {
    state = {
        firstName: null,
        firstNameError: true,
        firstNameErrorMsg: null,

        lastName: null,
        lastNameError: true,
        lastNameErrorMsg: null,

        address: null,
        addressError: true,
        addressErrorMsg: null,

        phone: null,
        phoneError: true,
        phoneErrorMsg: null,

        password: null,
        confirmPassword: null,
        passwordError: true,
        passwordErrorMsg: null,

    }

    static navigationOptions = {
        header: null,
    };

    setFirstName = (fname) => {
        this.setState({ firstName: fname })
        let fnameError = Validation.onlyWhiteSpaceNotAllowed(fname);
        if (fnameError) {
            this.setState({ firstNameError: fnameError.error });
            this.setState({ firstNameErrorMsg: fnameError.errorMsg });
        } else {
            this.setState({ firstNameError: false });
            this.setState({ firstNameErrorMsg: null });
        }
    }

    setLastName = (lname) => {
        this.setState({ lastName: lname });
        let lnameError = Validation.onlyWhiteSpaceNotAllowed(lname);
        if (lnameError) {
            this.setState({ lastNameError: lnameError.error });
            this.setState({ lastNameErrorMsg: lnameError.errorMsg });
        } else {
            this.setState({ lastNameError: false });
            this.setState({ lastNameErrorMsg: null });
        }
    }

    setAddress = (add) => {
        this.setState({ address: add });
        let addError = Validation.onlyWhiteSpaceNotAllowed(add);
        if (addError) {
            this.setState({ addressError: addError.error });
            this.setState({ addressErrorMsg: addError.errorMsg });
        } else {
            this.setState({ addressError: false });
            this.setState({ addressErrorMsg: null });
        }
    }

    setPhone = (phone) => {
        this.setState({ phone: phone })
        let phoneError = Validation.mobileNumberValidator(phone);
        if (phoneError) {
            this.setState({ phoneError: phoneError.error });
            this.setState({ phoneErrorMsg: phoneError.errorMsg });
        } else {
            this.setState({ phoneError: false });
            this.setState({ phoneErrorMsg: null });
        }
    }

    setPassword = (password) => {
        this.setState({ confirmPassword: password });
        let passwordError = Validation.passwordMatchValidator(this.state.password, password);
        if (passwordError) {
            this.setState({ passwordError: passwordError.error });
            this.setState({ passwordErrorMsg: passwordError.errorMsg });
        } else {
            this.setState({ passwordError: false });
            this.setState({ passwordErrorMsg: null });
        }

    }

    updateDetails = () => {
        let user = {};
        user.userId = this.props.navigation.state.params.userId;
        user.email = this.props.navigation.state.params.email;
        user.firstName = (!!this.state.firstName) ? this.state.firstName : null;
        user.lastName = (!!this.state.lastName) ? this.state.lastName : null;
        user.password = (!!this.state.password) ? this.state.password : null;
        user.phone = (!!this.state.phone) ? this.state.phone : null;
        user.address = (!!this.state.address) ? this.state.address : null;

        UserProvider.updateUserDetail(user)
            .then(data => {
                if (data.success == true) {
                    this.props.navigation.navigate('Password', { email: user.email });
                } else {

                }
            })
            .catch(e => {

            })
    }

    render() {
        return (

            <View style={styles.container}>
                {/* <Text>{JSON.stringify(navigator.geolocation.getCurrentPosition())}</Text> */}
                <TextInput style={styles.TextInput}
                    placeholder="First Name"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                    onChangeText={(txt) => { this.setFirstName(txt) }}
                >
                </TextInput>
                {this.state.firstNameErrorMsg && <Text style={commonCss.error}>{this.state.firstNameErrorMsg}</Text>}

                <TextInput style={styles.TextInput}
                    placeholder="Last Name"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                    onChangeText={(txt) => { this.setLastName(txt) }}
                >{global.val}
                </TextInput>
                {this.state.lastNameErrorMsg && <Text style={commonCss.error}>{this.state.lastNameErrorMsg}</Text>}

                <TextInput style={styles.TextInput}
                    placeholder="Address"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                    onChangeText={(txt) => { this.setAddress(txt) }}
                >
                </TextInput>
                {this.state.addressErrorMsg && <Text style={commonCss.error}>{this.state.addressErrorMsg}</Text>}

                <TextInput style={styles.TextInput}
                    placeholder="Phone No"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                    onChangeText={(txt) => { this.setPhone(txt) }}
                >
                </TextInput>
                {this.state.phoneErrorMsg && <Text style={commonCss.error}>{this.state.phoneErrorMsg}</Text>}

                <TextInput style={styles.TextInput}
                    placeholder="Password"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                    onChangeText={(txt) => { this.setState({ password: txt }) }}
                >
                </TextInput>

                <TextInput style={styles.TextInput}
                    placeholder="Confirm Password"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                    onChangeText={(txt) => { this.setPassword(txt) }}
                >
                </TextInput>
                {this.state.passwordErrorMsg && <Text style={commonCss.error}>{this.state.passwordErrorMsg}</Text>}

                <TouchableOpacity
                    disabled={this.state.firstNameError || this.state.lastNameError || this.state.addressError || this.state.phoneError || this.state.passwordError}
                    style={styles.button}
                    onPress={() => this.updateDetails()}>
                    <Text style={styles.textInsideButton}>
                        Login
                        </Text>
                </TouchableOpacity>

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
        // margin: 30,
        textAlign: 'center',
        padding: 0
    },
    // innerContainer: {
    //     alignItems: 'center'
    // },
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