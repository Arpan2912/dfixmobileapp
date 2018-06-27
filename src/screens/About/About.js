
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    AppState,
    Dimensions,
    ActivityIndicator,
    Alert,
    Image
} from 'react-native';
import {
    Container,
    Footer,
    Header,
    Icon,
    Body,
    Left,
    Right,
    Title,
    Button
} from 'native-base';
import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';
import MeetingProvider from '../../provider/meeting-provider';
import StartDayProvider from '../../provider/startday-provider';
import Custom from '../../components/Custom';
import CustomStatusBar from '../../components/StatusBar';

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
        header:null,
        title: 'About',
        headerStyle: {
            backgroundColor: '#009688'
        },
        headerTintColor: "#fafafa"
    };

    render() {
        // Custom.show("background is running", 2000);
        return (
            <Container>
                <Header style={styles.Header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Title>About</Title>
                    </Body>
                    <Left style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        
                    </Left>
                </Header>
                <View style={styles.container}>
                    {/* <Image style={{ height: 100, width: 300 }} source={require('../../images/dfix.png')}></Image> */}
                    <CustomStatusBar></CustomStatusBar>
                    <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.push('PdfView', { pdf: 'profile' }); }}>
                        <Text style={styles.textInsideButton}>
                            {/* Start Day {this.state.token} */}
                            Dfix Profile
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.push('PdfView', { pdf: 'flooring' }); }}>
                        <Text style={styles.textInsideButton}>
                            {/* Start Day {this.state.token} */}
                            Dfix Flooring
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.push('PdfView', { pdf: 'enterprice' }); }}>
                        <Text style={styles.textInsideButton}>
                            {/* Start Day {this.state.token} */}
                            Dfix EnterPrise
                    </Text>
                    </TouchableOpacity>


                </View>
            </Container>
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

    Header: {
        backgroundColor: '#009688'
    },
    button: {
        backgroundColor: "#009688",
        margin: 10,
        padding: 10,
        width: width * 4 / 5,
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