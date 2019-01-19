
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
import MeetingProvider from '../../provider/meeting-provider';
import CustomStatusBar from '../../components/StatusBar';

// import MapView from 'react-native-maps';

var { height, width } = Dimensions.get('screen');
let eventObj;
let startVisitId = null;
let userId = null;
let meetingId = null;
let orgName = null;
export default class OrderList extends Component {
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

        orderList: [],
        itemIndex: null,
        editItemData: null
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
        meetingId = this.props.navigation.state.params.meetingId;
        orgName = this.props.navigation.state.params.orgName;
        eventObj.on('updateOrder', this.updateOrderListener);
        Promise.all([
            UserProvider.getVisitStatus(),
            UserProvider.getUserIdFromLocalStorage()
        ]).then(data => {
            let visitStatus = null;
            let visitStatusString = data[0];
            let usersId = data[1];
            try {
                console.log("obj", visitStatusString);
                visitStatus = JSON.parse(visitStatusString);
                startVisitId = visitStatus.startVisitId;
                userId = usersId;
                console.log("\n\n userId : ", userId, "\n StartVisitId: ", startVisitId);
            } catch (e) {
                console.log("error while parsing visit status", e);
            }
        })
    }

    componentDidMount() {
        let orders = this.props.navigation.state.params.orders;
        this.setState({ orderList: orders });
        //"orders": [
        //         {
        //             "_id": "5aa8184c018c4120845ad103",
        //             "user_id": "5a8da717c283f71ec44f41e2",
        //             "item_name": "pencil",
        //             "item_quantity": "100",
        //             "item_price": "10000",
        //             "meeting_id": "5aa8183f018c4120845ad102",
        //             "created_at": "2018-03-13T18:28:28.804Z",
        //             "updated_at": "2018-03-13T18:28:28.804Z",
        //             "__v": 0
        //         }
        //     ]
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

    addOrder = (obj) => {
        this.props.navigation.push('UpdateOrder', { title: "add", orderDetail: null, meetingId: meetingId, orgName: orgName });
    }

    editOrder = (data, secId, rowId, rowMap) => {
        this.props.navigation.push('UpdateOrder', { title: "update", orderDetail: data });
    }


    deleteOrder = (data, secId, rowId) => {
        let arr = this.state.orderList;
        let orderId = data._id;
        // console.log("row Id", rowId);
        let obj = {
            orderId: orderId
        }
        MeetingProvider.deleteOrder(obj)
            .then(data => {
                if (data.success === true) {
                    eventObj.emit("updateOrder");
                } else {

                }
            })
        arr.splice(rowId, 1);
        this.setState({ orderList: arr });
    }


    updateOrderListener = (updatedOrder) => {
        if (updatedOrder) {
            index = this.state.orderList.findIndex(x => x._id === updatedOrder._id);
            let obj = this.state.orderList;
            if (index >= 0) {
                obj[index] = updatedOrder;                
            } else {
                obj.push(updatedOrder);
            }
            this.setState({ orderList: obj });
        } else {
            console.log("nothing to update");
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
                    <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Title>Orders</Title>
                    </Body>
                    <Left style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Button transparent onPress={this.addOrder}>
                            <Icon name='add' />
                        </Button>
                    </Left>
                </Header>
                <ScrollView contentContainerStyle={styles.container}>
                    <CustomStatusBar></CustomStatusBar>

                    <List style={{ width: width }}
                        dataSource={this.ds.cloneWithRows(this.state.orderList)}
                        renderRow={data =>
                            <ListItem style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Body style={{ paddingLeft: 20, paddingRight: 20 }}>
                                    <Text style={{ color: '#009688', fontWeight: 'bold' }}>{data.item_name}</Text>

                                </Body>
                                <Right>
                                    <Text style={{ fontWeight: 'bold' }}>{data.item_quantity} </Text>
                                </Right>
                                <Body style={{ alignContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Text note style={{ fontWeight: 'bold' }}>{data.item_price} Rs</Text>
                                </Body>
                            </ListItem>}
                        renderLeftHiddenRow={(data, secId, rowId) =>
                            <Button full danger onPress={() => this.deleteOrder(data, secId, rowId)}>
                                <Text style={{ color: '#fafafa' }}>Delete</Text>
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full onPress={() => this.editOrder(data, secId, rowId, rowMap)}>
                                <Text style={{ color: '#fafafa' }}>Edit</Text>
                            </Button>}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />


                    {/* </View> */}


                </ScrollView>
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