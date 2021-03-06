'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Modal,
    Image,
    TextInput
} from 'react-native';
import Validation from '../../provider/validation';
import {
    Container,
    Footer,
    Header,
    Icon,
    Button,
    Body,
    Left,
    Right,
    Title
} from 'native-base';
import MeetingProvider from '../../provider/meeting-provider';
import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';
import commonCss from '../../css/commonCss';

var { height, width } = Dimensions.get('screen');
let orderData = null;
let eventObj = null;
let userId = null;
let meetingId = null;

export default class UpdateOrder extends Component {
    state = {
        image: null,
        text: null,

        itemName: null,
        itemNameError: true,
        itemNameErrorMsg: null,

        itemQuantity: null,
        itemQuantityError: true,
        itemQuantityErrorMsg: null,

        itemPrice: null,
        itemPriceError: true,
        itemPriceErrorMsg: null,
    }

    constructor(props) {
        super();

    }

    static navigationOptions = ({ navigation }) => ({
        //title: navigation.state.params.title,
        header: null,
        headerStyle: {
            backgroundColor: '#009688'
        },
        headerTintColor: "#fafafa"
    });

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
        meetingId = this.props.navigation.state.params.meetingId;
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
            })
    }

    componentDidMount() {
        let orderDetail = this.props.navigation.state.params.orderDetail;
        this.orderData = orderDetail;
        if (orderDetail) {
            this.setState({
                itemName: orderDetail.item_name,
                itemPrice: orderDetail.item_price,
                itemQuantity: orderDetail.item_quantity
            });
        }
    }

    setItemName = (iname) => {
        this.setState({ itemName: iname })
        let inameError = Validation.onlyWhiteSpaceNotAllowed(iname);
        if (inameError) {
            this.setState({ itemNameError: inameError.error, itemNameErrorMsg: inameError.errorMsg });
        } else {
            this.setState({ itemNameError: false, itemNameErrorMsg: null });

        }
    }

    setItemQuantity = (qty) => {
        this.setState({ itemQuantity: qty })
        let qtyError = Validation.numberValidator(qty);  //@NOTE :: add number validation here 
        if (qtyError) {
            this.setState({ itemQuantityError: qtyError.error, itemQuantityErrorMsg: qtyError.errorMsg });
        } else {
            this.setState({ itemQuantityError: false, itemQuantityErrorMsg: null });
        }
    }

    setItemPrice = (price) => {
        this.setState({ itemPrice: price })
        let priceError = Validation.numberValidator(price);  //@NOTE :: add number validation here 
        if (priceError) {
            this.setState({ itemPriceError: priceError.error, itemPriceErrorMsg: priceError.errorMsg });
        } else {
            this.setState({ itemPriceError: false, itemPriceErrorMsg: null });
        }
    }

    updateOrder = () => {
        let order = {};
        // order = Object.assign(order, orderData);
        order.itemName = this.state.itemName;
        order.itemPrice = this.state.itemPrice;
        order.itemQuantity = this.state.itemQuantity;
        order._id = this.orderData._id;
        MeetingProvider.updateOrder(order)
            .then(data => {
                if (data.success === true) {
                    if (eventObj) {
                        eventObj.emit('updateOrder', data.data);
                    }
                    this.props.navigation.pop();
                }
            })
            .catch(e => {

            })
    }

    addOrder = () => {
        let order = {};
        // order = Object.assign(order, orderData);
        order.userId = userId;
        order.itemName = this.state.itemName;
        order.itemPrice = this.state.itemPrice;
        order.itemQuantity = this.state.itemQuantity;
        order.meetingId = meetingId;
        //order._id = this.orderData._id;
        MeetingProvider.addOrder(order)
            .then(data => {
                if (data.success === true) {
                    if (eventObj) {
                        eventObj.emit('updateOrder', data.data);
                    }
                    this.props.navigation.pop();
                }
            })
            .catch(e => {

            })
    }

    render() {
        let title = this.props.navigation.state.params.title;
        return (

            <Container>
                <Header style={styles.Header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{title} Order</Title>
                    </Body>
                    {/* <Right>
                        <Button transparent>
                            <Icon name='add' />
                        </Button>
                    </Right> */}
                </Header>
                <View style={styles.container}>
                    <TextInput style={styles.TextInput}
                        placeholder="Item Name"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(txt) => { this.setItemName(txt) }}
                    >{this.state.itemName}
                    </TextInput>
                    {this.state.itemNameErrorMsg && <Text style={commonCss.error}>{this.state.itemNameErrorMsg}</Text>}

                    <TextInput style={styles.TextInput}
                        placeholder="Item Quantity"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(txt) => { this.setItemQuantity(txt) }}
                    >{this.state.itemQuantity}
                    </TextInput>
                    {this.state.itemQuantityErrorMsg && <Text style={commonCss.error}>{this.state.itemQuantityErrorMsg}</Text>}

                    <TextInput style={styles.TextInput}
                        placeholder="Item Price"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(txt) => { this.setItemPrice(txt) }}
                    >{this.state.itemPrice}
                    </TextInput>
                    {this.state.itemPriceErrorMsg && <Text style={commonCss.error}>{this.state.itemPriceErrorMsg}</Text>}

                    {title === 'update' && <TouchableHighlight style={styles.addButton} onPress={this.updateOrder}>
                        <Text style={styles.textInsideButton}>
                            Update
                    </Text>
                    </TouchableHighlight>}
                    {title === 'add' && <TouchableHighlight style={styles.addButton} onPress={this.addOrder}>
                        <Text style={styles.textInsideButton}>
                            Add
                    </Text>
                    </TouchableHighlight>}
                </View>
            </Container>

        );
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fafafa",
        flex: 1,
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
    addButton: {
        backgroundColor: "#009688",
        padding: 10,
        // width: width - 100,
        width:300,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0

    },
    textInsideButton: {
        color: "#fafafa"
    },
    TextInput: {
        width: 300,
        height: 50,
        fontSize: 15,
        color: '#009688',
        margin: 5,
        alignItems: 'center',
        // textAlign: 'center'
    },
    ImageView: {
        marginTop: 10,
        height: 200,
        width: 200
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
