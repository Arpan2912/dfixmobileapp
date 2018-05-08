
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    AsyncStorage,
    ListView
} from 'react-native';
import OrderModal from '../../modal/order-modal';
import {
    Container,
    Footer,
    Header,
    Icon,
    Button,
    Body,
    Left,
    Right,
    Title,
    ListItem,
    List
} from 'native-base';
import Validation from '../../provider/validation';
import StartDayProvider from '../../provider/startday-provider';
import EventSingleton from '../../event/eventSingleton';
import UserProvider from '../../provider/user-provider';
import MapView, { Marker } from 'react-native-maps';
import ExpenseProvider from '../../provider/expense-provider';
import Custom from '../../components/Custom';

// import MapView from 'react-native-maps';

var { height, width } = Dimensions.get('screen');
let eventObj;
let startVisitId = null;
let userId = null;
let expenseId = null;
export default class Logout extends Component {
    title = 'Start'
    constructor(props) {
        super();
        // this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log("constructor calls");
        console.log("id", JSON.stringify(props));
    }
    state = {
        modalVisible: false,
        userId: null,
        startVisit: null,

        expenseList: [],
        itemIndex: null,
        editItemData: null
    }

    componentWillMount() {
        UserProvider.removeAll()
            .then(data => {
                Custom.stopService();
                this.props.navigation.replace('Login');
            })
            .catch(e => {

            })
    }

    componentDidMount() {

    }

    static navigationOptions = {};

    static navigationOptions = ({ navigation }) => ({
        //title: navigation.state.params.title,
        header: null,
        headerStyle: {
            backgroundColor: '#009688'
        },
        headerTintColor: "#fafafa"
    });

    render() {

        return (
            <Container>

            </Container >
        )
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fafafa",
        ///flex: 1,
        alignItems: 'center',
        //justifyContent: 'center'
    },
    Header: {
        backgroundColor: '#009688'
    },
    button: {
        backgroundColor: "#009688",
        padding: 10,
        marginTop: 10,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cameraButton: {
        backgroundColor: "#009688",
        padding: 10,
        margin: 10,
        width: width - 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20

    },
    textInsideButton: {
        color: "#fafafa"
    },
    TextInput: {
        width: 300,
        height: 50,
        fontSize: 10,
        color: '#009688',
        margin: 20,
        alignItems: 'center',
        textAlign: 'center'
    },

    FooterDesign: {
        backgroundColor: '#009688',
        justifyContent: 'center',
        alignItems: 'center'
    },
    FooterButton: {
        width: width,
        backgroundColor: "#009688",
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    FooterText: {
        color: '#fafafa',
        fontSize: 20,
        fontWeight: 'bold'
    }
})