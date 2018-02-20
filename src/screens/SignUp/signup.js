
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput, TouchableOpacity
} from 'react-native';

export default class Signup extends Component {
  
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            
            <View style={styles.container}>
                {/* <Text>{JSON.stringify(navigator.geolocation.getCurrentPosition())}</Text> */}
                <TextInput style={styles.TextInput}
                    placeholder="First Name"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"

                >
                </TextInput>
                <TextInput style={styles.TextInput}
                    placeholder="Last Name"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                >{global.val}
                </TextInput>
                <TextInput style={styles.TextInput}
                    placeholder="Address"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                >
                </TextInput>
                <TextInput style={styles.TextInput}
                    placeholder="Phone No"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                >
                </TextInput>
                <TextInput style={styles.TextInput}
                    placeholder="Confirm Password"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                >
                </TextInput>
                <TextInput style={styles.TextInput}
                    placeholder="Password"
                    underlineColorAndroid='#fafafa'
                    placeholderTextColor="#26A69A"
                >
                </TextInput>
                <TouchableOpacity style={styles.button} onPress={()=>{this.props.navigation.navigate('Password')}}>
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