
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
    Alert,
    ToastAndroid
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
import Loader from '../../components/Loader';
import CustomStatusBar from '../../components/StatusBar';

// import MapView from 'react-native-maps';

var { height, width } = Dimensions.get('screen');
let eventObj;
let startVisitId = null;
let userId = null;
let orgName, userName;

export default class StopVisit extends Component {
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
        editItemData: null,

        loading: false
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
        Promise.all([
            UserProvider.getVisitStatus(),
            UserProvider.getUserIdFromLocalStorage(),
            UserProvider.getUserNameFromLocalStorage()
        ]).then(data => {
            let visitStatus = null;
            let visitStatusString = data[0];
            let usersId = data[1];
            userName = data[2];
            try {
                console.log("obj", visitStatusString);
                visitStatus = JSON.parse(visitStatusString);
                startVisitId = visitStatus.startVisitId;
                orgName = visitStatus.orgName;
                userId = usersId;
                console.log("\n\n userId : ", userId, "\n StartVisitId: ", startVisitId);
            } catch (e) {
                console.log("error while parsing visit status", e);
            }
        })
    }

    componentDidMount() {
        let arrList = [];
        this.setState({ orderList: arrList });
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
        let arr = [];
        arr = this.state.orderList;
        console.log("item index", this.state.itemIndex !== null, this.state.itemIndex !== -1);
        if (this.state.itemIndex == null || this.state.itemIndex == -1) {
            console.log("add order obj");
            arr.push(obj);
            this.setState({ orderList: arr });
        } else {
            console.log("update order obj");
            let index = this.state.itemIndex;
            arr[index] = obj;
            this.setState({ orderList: arr, itemIndex: null, editItemData: null });
        }

    }

    deleteOrder = (data, secId, rowId) => {
        let arr = this.state.orderList;
        console.log("row Id", rowId);
        arr.splice(rowId, 1);
        this.setState({ orderList: arr });
    }

    editOrder = (data, secId, rowId, rowMap) => {

        this.setState({ itemIndex: rowId, editItemData: data, modalVisible: true });

        // let arrList = this.state.orderList;
        // let index = arrList.findIndex((index)=>{
        //     return index === data;
        // });
        // this.setState({index:index})
    }

    stopVisit = () => {
        let stopVisitObj = {
            id: startVisitId,
            userId: userId,
            orderArray: this.state.orderList,
            orgName: orgName,
            userName: userName
        }

        ToastAndroid.show(JSON.stringify(stopVisitObj), 1000);
        console.log("stop visit obj", JSON.stringify(stopVisitObj));
        this.setState({ loading: true });
        MeetingProvider.stopVisit(stopVisitObj)
            .then(data => {
                this.setState({ loading: false });
                if (data.success == true) {
                    Alert.alert(
                        'Success',
                        'Visit finish successfuly',
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: true }
                    )
                    UserProvider.resetVisitStatus();
                    this.props.navigation.goBack();
                    eventObj.emit('stopVisit');
                } else {

                }
            }).catch(e => {
                console.log("e", e);
                if(!e.hasOwnProperty('message')){
                    e.message ="Something went wrong";
                }
                Alert.alert(
                    'Stop Visit',
                    e.message,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: true }
                )
                this.setState({ loading: false });

            })
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
                    <Body style={{alignContent:'center',alignItems:'center'}}>
                        <Title>Orders</Title>
                    </Body>
                    <Left style={{justifyContent:'flex-end',alignItems:'flex-end'}}>
                        <Button transparent onPress={this.openOrderModal}>
                            <Icon name='add' />
                        </Button>
                    </Left>
                </Header>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* <View style={styles.innerContainer}> */}
                    <CustomStatusBar></CustomStatusBar>

                    <Loader
                        loading={this.state.loading} />
                    <OrderModal
                        modalVisible={this.state.modalVisible}
                        closeOrderModal={this.closeOrderModal}
                        addOrder={this.addOrder}
                        saveImage={this.saveImage}
                        itemIndex={this.state.itemIndex}
                        editItemData={this.state.editItemData}
                    />
                    {/* <Text>{JSON.stringify(this.state.orderList)}</Text> */}


                    <List style={{ width: width }}
                        dataSource={this.ds.cloneWithRows(this.state.orderList)}
                        renderRow={data =>
                            <ListItem style={{ paddingTop: 20, paddingBottom: 20 }}>
                                <Body style={{ paddingLeft: 15, paddingRight: 15 }}>
                                    <Text style={{ color: '#009688', fontWeight: 'bold' }}>{data.itemName}</Text>

                                </Body>
                                <Right>
                                    <Text style={{ fontWeight: 'bold' }}>{data.itemQuantity} </Text>
                                </Right>
                                <Body style={{ alignContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Text note style={{ fontWeight: 'bold' }}>{data.itemPrice} Rs</Text>
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