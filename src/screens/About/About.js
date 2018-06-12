
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
    AppState,
    Dimensions,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';
import MeetingProvider from '../../provider/meeting-provider';
import StartDayProvider from '../../provider/startday-provider';
import Custom from '../../components/Custom';
var { height, width } = Dimensions.get('screen');


let token;
let eventObj;
let startDayId = null;
let startVisitId = null;
let userId = null;
let startDayDetails = null;
let dayTitle = "Start Day";
let visitTitle = null;

export default class AboutPage extends Component {

    state = {
        token: null,
        startDay: 'false',
        startVisit: 'false',
        isLoading: true
    }

    componentWillMount() {


    }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {

    }

    constructor() {
        super();
    };

    static navigationOptions = {
        title: 'About',
        headerStyle: {
            backgroundColor: '#009688'
        },
        headerTintColor: "#fafafa"
    };

    render() {
        // Custom.show("background is running", 2000);
        return (
            <View style={styles.container}>
                {/* <Image style={{ height: 100, width: 300 }} source={require('../../images/dfix.png')}></Image> */}

                <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.push('PdfView',{pdf:'profile'}); }}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        Dfix Profile
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.push('PdfView',{pdf:'flooring'}); }}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        Dfix Flooring
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.push('PdfView',{pdf:'enterprice'}); }}>
                    <Text style={styles.textInsideButton}>
                        {/* Start Day {this.state.token} */}
                        Dfix EnterPrise
                    </Text>
                </TouchableOpacity>
                {/* <Text>
                D FIX ENTERPRISE and its group companies 
                are engaged in manufacturing of industrial
                 goods since last 20 years to market high 
                 Quality Epoxy systems and polyurethane 
                 systems covering all fields like adhesives, 
                 floor-coatings, construction chemicals, 
                 electrical coating and insulation 
                 Industries with a wide market range 
                 for industrial- Architectural sectors 
                 along with consumer sectors
                </Text> */}
                <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.push('CameraPage',{pdf:'enterprice'}); }}>
                    <Text style={styles.textInsideButton}>
                      
                        Face Synopsis
                    </Text>
                </TouchableOpacity>
                {/* <Text>D Fix Enterprise has complete product solutions for all your needs.
                D Fix has a wide range of industrial products in consumer 
                range – Epoxy Adhesive range, construction chemicals, 
                stone care; Electricals & Electronics – Potting compounds, 
                Epoxy Transformer; FRP composites, Flooring & coating.
                </Text> */}

            </View>

            // </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fff",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },


    button: {
        backgroundColor: "#009688",
        margin: 10,
        padding: 10,
        width: width*4/5,
        justifyContent: 'center',
        alignItems: 'center'
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
    }




})