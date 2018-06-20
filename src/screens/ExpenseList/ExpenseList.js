
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
    ListView,
    ActivityIndicator,
    Alert
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
    List,
} from 'native-base';
import Validation from '../../provider/validation';
import StartDayProvider from '../../provider/startday-provider';
import EventSingleton from '../../event/eventSingleton';
import UserProvider from '../../provider/user-provider';
import MapView, { Marker } from 'react-native-maps';
import ExpenseProvider from '../../provider/expense-provider';

// import MapView from 'react-native-maps';

var { height, width } = Dimensions.get('screen');
let eventObj;
let startVisitId = null;
let userId = null;
let expenseId = null;
export default class ExpenseList extends Component {
    title = 'Start'
    constructor(props) {
        super();
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        console.log("constructor calls");
        console.log("id", JSON.stringify(props));
    }
    state = {
        modalVisible: false,
        userId: null,
        startVisit: null,

        expenseList: [],
        itemIndex: null,
        editItemData: null,

        isLoading: true
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
        eventObj.on('updateExpense', this.updateExpenseListener);
        eventObj.on('addExpense', this.addEventListener);
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
            })
            .catch(e => {

            })

    }

    componentDidMount() {
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
                return ExpenseProvider.getTodayExpense(userId);
            })
            .then(data => {
                this.setState({ expenseList: data.data, isLoading: false });
            })
            .catch(e => {
                console.log("e", e);
                if(!e.hasOwnProperty('message')){
                    e.message ="Something went wrong";
                }
                Alert.alert(
                    'Alert',
                    e.message,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: true }
                )
            })
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

    addExpense = (obj) => {
        this.props.navigation.push('UpdateExpense', { title: "add", expenseDetail: null, expenseId: expenseId });
    }

    editExpense = (data, secId, rowId, rowMap) => {
        this.props.navigation.push('UpdateExpense', { title: "update", expenseDetail: data });
    }


    deleteExpense = (data, secId, rowId) => {
        let arr = this.state.expenseList;
        let expenseId = data._id;
        console.log("row Id", rowId);
        let obj = {
            expenseId: expenseId
        }
        ExpenseProvider.deleteExpense(obj)
            .then(data => {
                if (data.success === true) {
                    // eventObj.emit("updateExpense");
                    arr.splice(rowId, 1);
                    console.log("arr", JSON.stringify(arr));
                    this.setState({ expenseList: arr });

                } else {

                }
            })

    }


    updateExpenseListener = (updateExpense) => {
        if (updateExpense) {
            index = this.state.expenseList.findIndex(x => x._id === updateExpense._id);
            let obj = this.state.expenseList;
            obj[index] = updateExpense;
            this.setState({ expenseList: obj });
        } else {
            console.log("nothing to update");
        }
    }

    addEventListener = (addExpense) => {
        if (addExpense) {
            let obj = this.state.expenseList;
            obj.push(addExpense);
            this.setState({ expenseList: obj });
        }
    }

    render() {

        return (
            <Container>
                <Header style={styles.Header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body  style={{alignContent:'center',alignItems:'center'}}>
                        <Title>Expenses</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.addExpense}>
                            <Icon name='add' />
                        </Button>
                    </Right>
                </Header>
                {this.state.isLoading === false && <ScrollView contentContainerStyle={styles.container}>

                    <List style={{ width: width }}
                        dataSource={this.ds.cloneWithRows(this.state.expenseList)}
                        renderRow={data =>
                            <ListItem style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Body style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    <Text style={{ color: '#009688', fontWeight: 'bold' }}>{data.description}</Text>
                                </Body>
                                <Right>
                                    <Text style={{ fontWeight: 'bold' }}>{data.expense_amount} </Text>
                                </Right>
                                {/* <Body style={{ alignContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Text note style={{ fontWeight: 'bold' }}>{data.item_price} Rs</Text>
                                </Body> */}
                            </ListItem>
                        }
                        renderLeftHiddenRow={(data, secId, rowId) =>
                            <Button full danger onPress={() => this.deleteExpense(data, secId, rowId)}>
                                <Text style={{ color: '#fafafa' }}>Delete</Text>
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full onPress={() => this.editExpense(data, secId, rowId, rowMap)}>
                                <Text style={{ color: '#fafafa' }}>Edit</Text>
                            </Button>}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />


                    {/* </View> */}


                </ScrollView>}
                {this.state.isLoading === true && <View style={styles.containerLoading}>
                    <ActivityIndicator size="large" color="#009688" />
                </View>}
                {this.state.isLoading === false && this.state.expenseList.length === 0 && <View style={styles.containerLoading}>
                    <Text>Today you have added no expense</Text>
                </View>}

            </Container >
        )
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fafafa",
        ///flex: 1,
        alignItems: 'center',
        // justifyContent: 'center'
    },
    containerLoading: {
        backgroundColor: "#fafafa",
        ///flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height:height
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