
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

// import MapView from 'react-native-maps';

var { height, width } = Dimensions.get('screen');
let eventObj;
let startVisitId = null;
let userId = null;
let meetingId = null;
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

    openOrderModal = () => {
        this.setState({ modalVisible: true });
    }

    closeOrderModal = () => {
        this.setState({ modalVisible: false, editItemData: null, itemIndex: null });
    }

    addOrder = (obj) => {
        this.props.navigation.push('UpdateOrder', { title: "add", orderDetail: null,meetingId:meetingId });
        // let arr = [];
        // arr = this.state.orderList;
        // console.log("item index", this.state.itemIndex !== null, this.state.itemIndex !== -1);
        // if (this.state.itemIndex == null || this.state.itemIndex == -1) {
        //     console.log("add order obj");
        //     arr.push(obj);
        //     this.setState({ orderList: arr });
        // } else {
        //     console.log("update order obj");
        //     let index = this.state.itemIndex;
        //     arr[index] = obj;
        //     this.setState({ orderList: arr, itemIndex: null, editItemData: null });
        // }

    }

    deleteOrder = (data, secId, rowId) => {
        let arr = this.state.orderList;
        console.log("row Id", rowId);
        arr.splice(rowId, 1);
        this.setState({ orderList: arr });
    }

    editOrder = (data, secId, rowId, rowMap) => {
        // this.setState({ itemIndex: rowId });
        this.props.navigation.push('UpdateOrder', { title: "update", orderDetail: data });
        // this.setState({ itemIndex: rowId, editItemData: data, modalVisible: true });

        // let arrList = this.state.orderList;
        // let index = arrList.findIndex((index)=>{
        //     return index === data;
        // });
        // this.setState({index:index})
    }

    updateOrderListener = (updatedOrder) => {
        if (updatedOrder) {
            index = this.state.orderList.findIndex(x => x._id === updatedOrder._id);
            let obj = this.state.orderList;
            obj[index] = updatedOrder;
            this.setState({ orderList: obj });
        } else {
            console.log("nothing to update");
        }
    }
    render() {
        // let title = this.props.navigation.state.params.title;
        let latitude = this.state.latitude;
        let longitude = this.state.longitude;
        return (
            <Container>
                <Header style={styles.Header}>
                    <Left>
                        <Button transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Orders</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.addOrder}>
                            <Icon name='add' />
                        </Button>
                    </Right>
                </Header>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* <View style={styles.innerContainer}> */}
                    {/* <OrderModal
                        modalVisible={this.state.modalVisible}
                        closeOrderModal={this.closeOrderModal}
                        addOrder={this.addOrder}
                        saveImage={this.saveImage}
                        itemIndex={this.state.itemIndex}
                        editItemData={this.state.editItemData}
                    /> */}
                    {/* <Text>{JSON.stringify(this.state.orderList)}</Text> */}


                    <List style={{ width: width }}
                        dataSource={this.ds.cloneWithRows(this.state.orderList)}
                        renderRow={data =>
                            <ListItem style={{ paddingTop: 10, paddingBottom: 10 }}>
                                <Body style={{ paddingLeft: 15, paddingRight: 15 }}>
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

                <Footer style={styles.FooterDesign} >
                    <TouchableOpacity onPress={() => this.stopVisit()}
                        style={styles.FooterButton}>
                        <Text style={styles.FooterText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </Footer>
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