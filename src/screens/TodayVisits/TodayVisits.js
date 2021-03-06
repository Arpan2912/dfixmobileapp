
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
    ToastAndroid,
    ActivityIndicator
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
import moment from 'moment';
// import MapView from 'react-native-maps';

var { height, width } = Dimensions.get('screen');
let eventObj;
let startVisitId = null;
let userId = null;
let loading = true;
export default class TodayVisits extends Component {
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
        itemIndex: null,
        editItemData: null,
        visitList: []
    }

    componentWillMount() {
        loading = true;
        eventObj = EventSingleton.geteventEmitterObj();
        eventObj.on("updateOrder", this.getTodayVisits);
        Promise.all([
            UserProvider.getUserIdFromLocalStorage()
        ]).then(data => {
            let usersId = data[1];
            userId = usersId;
        })
    }

    componentDidUpdate() {
        //this.getTodayVisits();
    }
    componentDidMount() {
        this.getTodayVisits();
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


    getTodayVisits = () => {
        loading === true;
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
                return MeetingProvider.getTodayVisits(userId)
            })
            .then(data => {
                loading = false;
                // console.log("data", data);
                this.setState({ visitList: data.data });
            })
    }

    // {
    //     "todayMeeting": {
    //         "_id": "5aa8183f018c4120845ad102",
    //         "user_id": "5a8da717c283f71ec44f41e2",
    //         "start_time": "2018-03-13T18:28:15.687Z",
    //         "org_image": "5a8da717c283f71ec44f41e2/startVisit.jpg",
    //         "org_name": " hello",
    //         "org_location": {
    //             "latitude": 23.006486,
    //             "longitude": 72.5621458
    //         },
    //         "end_time": "2018-03-13T18:28:28.794Z",
    //         "created_at": "2018-03-13T18:28:15.687Z",
    //         "updated_at": "2018-03-13T18:28:28.794Z",
    //         "__v": 0
    //     },
    //     "orders": [
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
    // "orderAmount": 10000,
    // "numberOfOrders": 1
    // }


    goToOrderListPage = (meetingData) => {
        let orders = meetingData.orders;
        let meetingId = meetingData.todayMeeting._id;
        this.props.navigation.push('OrderList', { title: "Orders List", orders: orders, meetingId: meetingId });
    }


    render() {
        // let title = this.props.navigation.state.params.title;
        let latitude = this.state.latitude;
        let longitude = this.state.longitude;
        return (
            <Container>
                <Header style={styles.Header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Today Visits</Title>
                    </Body>
                    {/* <Right>
                        <Button transparent onPress={this.openOrderModal}>
                            <Icon name='add' />
                        </Button>
                    </Right> */}
                </Header>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* <View style={styles.innerContainer}> */}
                    <OrderModal
                        modalVisible={this.state.modalVisible}
                        closeOrderModal={this.closeOrderModal}
                        addOrder={this.addOrder}
                        saveImage={this.saveImage}
                        itemIndex={this.state.itemIndex}
                        editItemData={this.state.editItemData}
                    />

                    {this.state.visitList.length > 0 && <List style={{ width: width }}
                        dataSource={this.ds.cloneWithRows(this.state.visitList)}
                        renderRow={data =>
                            <ListItem style={{ paddingTop: 10, paddingBottom: 10 }}>
                                <Right style={{ alignContent: 'center', alignItems: 'center' }}>
                                    {/* <Body style={{width:width/100 * 10}}> */}
                                    <Text>{moment(data.todayMeeting.start_time).format("HH:mm").toString()}</Text>
                                    <Text>To</Text>
                                    <Text>{moment(data.todayMeeting.end_time).format("HH:mm").toString()}</Text>
                                    {/* </Body> */}
                                </Right>
                                <Body style={{ paddingLeft: 15 }}>
                                    <Text style={{ color: '#009688', fontWeight: 'bold' }}>{data.todayMeeting.org_name}</Text>
                                    <Text>Orders : {data.numberOfOrders}</Text>
                                    <Text>Amount : {data.orderAmount}</Text>
                                </Body>
                                <Right>
                                    <Text
                                        style={{ fontWeight: 'bold' }}
                                        onPress={() => this.goToOrderListPage(data)}
                                    >View Orders</Text>
                                </Right>
                            </ListItem>
                            }
                        renderLeftHiddenRow={(data, secId, rowId) =>
                            {/* <Button full danger onPress={() => this.deleteExpense(data, secId, rowId)}>
                                <Text style={{ color: '#fafafa' }}>Delete</Text>
                            </Button> */}
                            }
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            {/* <Button full onPress={() => this.editExpense(data, secId, rowId, rowMap)}>
                                <Text style={{ color: '#fafafa' }}>Edit</Text>
                            </Button> */}
                            }
                        leftOpenValue={0}
                        rightOpenValue={0}
                    />

                    }

                    {loading === true &&  <ActivityIndicator size="small" color="#00ff00" />}


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
    // TextInput: {
    //     width: 300,
    //     height: 50,
    //     fontSize: 10,
    //     color: '#009688',
    //     margin: 20,
    //     alignItems: 'center',
    //     textAlign: 'center'
    // },

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