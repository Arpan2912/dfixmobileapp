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
import Validation from '../provider/validation';
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
var { height, width } = Dimensions.get('screen');
let orderData = null;

export default class OrderModal extends Component {
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

    constructor(props){
        super();
       
    }

    componentDidMount(){

    }
    
    closeModal = () => {
        this.props.closeOrderModal();
    }

    setItemName = (iname) => {
        this.setState({ itemName: iname })
        let inameError = Validation.noWhiteSpaceAllowed(iname);
        if (inameError) {
            this.setState({ itemNameError: inameError.error,itemNameErrorMsg: inameError.errorMsg });
        } else {
            this.setState({ itemNameError: false,itemNameErrorMsg: null });
           
        }
    }

    setItemQuantity = (qty) => {
        this.setState({ itemQuantity: qty })
        let qtyError = Validation.noWhiteSpaceAllowed(qty);  //@NOTE :: add number validation here 
        if (qtyError) {
            this.setState({ itemQuantityError: qtyError.error,itemQuantityErrorMsg: qtyError.errorMsg  });
        } else {
            this.setState({ itemQuantityError: false,itemQuantityErrorMsg: null });
        }
    }

    setItemPrice = (price) => {
        this.setState({ itemPrice: price })
        let priceError = Validation.noWhiteSpaceAllowed(price);  //@NOTE :: add number validation here 
        if (priceError) {
            this.setState({ itemPriceError: priceError.error, itemPriceErrorMsg: priceError.errorMsg  });
        } else {
            this.setState({ itemPriceError: false,itemPriceErrorMsg: null });
        }
    }

    addOrder = () => {
        let obj = {
            itemName: this.state.itemName || orderData.itemName ,
            itemPrice: this.state.itemPrice || orderData.itemPrice,
            itemQuantity: this.state.itemQuantity || orderData.itemQuantity
        };
        this.props.addOrder(obj);
        this.closeModal();
    }

    editOrder = ()=>{

    }

    render() {
        orderData = this.props.editItemData;
        console.log("order Data", orderData);
        if (orderData) {
            // state.itemName = orderData.itemName;
            // state.itemPrice = orderData.itemPrice;
            // state.itemQuantity = orderData.itemQuantity;
        }
        return (
            <Modal
                visible={this.props.modalVisible}
                animationType={'slide'}
                onRequestClose={() => this.closeModal()}
            >
                <Container>
                    <Header style={styles.Header}>
                        <Left>
                            <Button transparent>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Add Order</Title>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon name='add' />
                            </Button>
                        </Right>
                    </Header>
                    <View style={styles.container}>
                        <TextInput style={styles.TextInput}
                            placeholder="Item Name"
                            underlineColorAndroid='#009688'
                            placeholderTextColor="#26A69A"
                            onChangeText={(txt) => { this.setItemName(txt) }}
                        >{orderData && orderData.itemName}
                        </TextInput>
                        {this.state.itemNameErrorMsg && <Text>{this.state.itemNameErrorMsg}</Text>}

                        <TextInput style={styles.TextInput}
                            placeholder="Item Quantity"
                            underlineColorAndroid='#009688'
                            placeholderTextColor="#26A69A"
                            onChangeText={(txt) => { this.setItemQuantity(txt) }}
                        >{orderData && orderData.itemQuantity}
                        </TextInput>
                        {this.state.itemQuantityErrorMsg && <Text>{this.state.itemQuantityErrorMsg}</Text>}

                        <TextInput style={styles.TextInput}
                            placeholder="Item Price"
                            underlineColorAndroid='#009688'
                            placeholderTextColor="#26A69A"
                            onChangeText={(txt) => { this.setItemPrice(txt) }}
                        >{orderData && orderData.itemPrice}
                        </TextInput>
                        {this.state.itemPriceErrorMsg && <Text>{this.state.itemPriceErrorMsg}</Text>}

                        <TouchableHighlight style={styles.addButton} onPress={this.addOrder}>
                            <Text style={styles.textInsideButton}>
                                Add
                    </Text>
                        </TouchableHighlight>
                    </View>
                </Container>
            </Modal>
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
        marginTop:10,
        // width: width - 100,
        width: 300,
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
