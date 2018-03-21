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
    TextInput,
    ToastAndroid
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
import ExpenseProvider from '../../provider/expense-provider';
import UserProvider from '../../provider/user-provider';
import EventSingleton from '../../event/eventSingleton';

var { height, width } = Dimensions.get('screen');
let expenseData = null;
let eventObj = null;
let userId = null;
let expenseId = null;

export default class UpdateExpense extends Component {
    state = {
        image: null,
        text: null,

        itemName: null,
        itemNameError: true,
        itemNameErrorMsg: null,

        // itemQuantity: null,
        // itemQuantityError: true,
        // itemQuantityErrorMsg: null,

        expenseAmount: null,
        expenseAmountError: true,
        expenseAmountErrorMsg: null,
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
        expenseId = this.props.navigation.state.params.expenseId;
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                userId = data;
            })
    }

    //@Description should be add
    componentDidMount() {
        let expenseDetail = this.props.navigation.state.params.expenseDetail;
        this.expenseData = expenseDetail;
        if (expenseDetail) {
            this.setState({
                itemName: expenseDetail.item_name,
                expenseAmount: expenseDetail.expense_amount
            });
        }
    }

    setItemName = (iname) => {
        this.setState({ itemName: iname })
        let inameError = Validation.noWhiteSpaceAllowed(iname);
        if (inameError) {
            this.setState({ itemNameError: inameError.error, itemNameErrorMsg: inameError.errorMsg });
        } else {
            this.setState({ itemNameError: false, itemNameErrorMsg: null });

        }
    }

    setItemQuantity = (qty) => {
        this.setState({ itemQuantity: qty })
        let qtyError = Validation.noWhiteSpaceAllowed(qty);  //@NOTE :: add number validation here 
        if (qtyError) {
            this.setState({ itemQuantityError: qtyError.error, itemQuantityErrorMsg: qtyError.errorMsg });
        } else {
            this.setState({ itemQuantityError: false, itemQuantityErrorMsg: null });
        }
    }

    setExpenseAmount = (price) => {
        this.setState({ expenseAmount: price })
        let priceError = Validation.noWhiteSpaceAllowed(price);  //@NOTE :: add number validation here 
        if (priceError) {
            this.setState({ expenseAmountError: priceError.error, expenseAmountErrorMsg: priceError.errorMsg });
        } else {
            this.setState({ expenseAmountError: false, expenseAmountErrorMsg: null });
        }
    }

    updateExpense = () => {
        let expense = {};
        // expense = Object.assign(expense, expenseData);
        expense.itemName = this.state.itemName;
        expense.expenseAmount = this.state.expenseAmount;
        // expense.itemQuantity = this.state.itemQuantity;
        expense._id = this.expenseData._id;
        ExpenseProvider.updateExpense(expense)
            .then(data => {
                if (data.success === true) {
                    if (eventObj) {
                        eventObj.emit('updateExpense', data.data);
                    }
                    this.props.navigation.pop();
                }
            })
            .catch(e => {

            })
    }

    addExpense = () => {
        let expense = {};
        // expense = Object.assign(expense, expenseData);
        expense.userId = userId;
        expense.itemName = this.state.itemName;
        expense.expenseAmount = this.state.expenseAmount;
        // expense.itemQuantity = this.state.itemQuantity;
        expense.expenseId = expenseId;
        //expense._id = this.expenseData._id;
        ExpenseProvider.addExpense(expense)
            .then(data => {
                if (data.success === true) {
                    if (eventObj) {
                        eventObj.emit('addExpense', data.data);
                    }
                    this.props.navigation.pop();
                }
            })
            .catch(e => {
                ToastAndroid.show(e.toString(),5000);
                this.props.navigation.pop();
            })
    }

    render() {
        let title = this.props.navigation.state.params.title;
        return (

            <Container>
                <Header style={styles.Header}>
                    <Left>
                        <Button transparent>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{title} Expense</Title>
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
                    >{this.state.itemName}
                    </TextInput>
                    {this.state.itemNameErrorMsg && <Text>{this.state.itemNameErrorMsg}</Text>}

                    {/* <TextInput style={styles.TextInput}
                        placeholder="Item Quantity"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(txt) => { this.setItemQuantity(txt) }}
                    >{this.state.itemQuantity}
                    </TextInput>
                    {this.state.itemQuantityErrorMsg && <Text>{this.state.itemQuantityErrorMsg}</Text>} */}

                    <TextInput style={styles.TextInput}
                        placeholder="Item Price"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(txt) => { this.setExpenseAmount(txt) }}
                    >{this.state.expenseAmount}
                    </TextInput>
                    {this.state.expenseAmountErrorMsg && <Text>{this.state.expenseAmountErrorMsg}</Text>}

                    {title === 'update' && <TouchableHighlight style={styles.addButton} onPress={this.updateExpense}>
                        <Text style={styles.textInsideButton}>
                            Update
                    </Text>
                    </TouchableHighlight>}
                    {title === 'add' && <TouchableHighlight style={styles.addButton} onPress={this.addExpense}>
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
        width: width - 100,
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
        fontSize: 10,
        color: '#009688',
        margin: 5,
        alignItems: 'center',
        textAlign: 'center'
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
