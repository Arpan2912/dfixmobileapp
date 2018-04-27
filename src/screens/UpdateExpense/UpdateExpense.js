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
    ToastAndroid,
    TouchableOpacity
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
import CameraModal from '../../modal/camera-modal';
import commonCss from '../../css/commonCss';

var { height, width } = Dimensions.get('screen');
let expenseData = null;
let eventObj = null;
let userId = null;
let expenseId = null;

export default class UpdateExpense extends Component {
    state = {
        image: null,
        text: null,

        description: null,
        descriptionError: true,
        descriptionErrorMsg: null,

        base64: null,
        base64Error: true,
        base64ErrorMsg: null,

        imgUrl: null,

        modalVisible: false,
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
                description: expenseDetail.description,
                expenseAmount: expenseDetail.expense_amount,
                imgUrl: expenseDetail.image_url
            });
        }
    }

    setItemName = (iname) => {
        this.setState({ description: iname })
        let inameError = Validation.onlyWhiteSpaceNotAllowed(iname);
        if (inameError) {
            this.setState({ descriptionError: inameError.error, descriptionErrorMsg: inameError.errorMsg });
        } else {
            this.setState({ descriptionError: false, descriptionErrorMsg: null });

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

    setExpenseAmount = (price) => {
        this.setState({ expenseAmount: price })
        let priceError = Validation.numberValidator(price);  //@NOTE :: add number validation here 
        if (priceError) {
            this.setState({ expenseAmountError: priceError.error, expenseAmountErrorMsg: priceError.errorMsg });
        } else {
            this.setState({ expenseAmountError: false, expenseAmountErrorMsg: null });
        }
    }

    saveImage = (base64) => {
        // this.setState({ modalVisible: false });
        this.setState({ base64: base64 });
        if (!base64) {
            this.setState({ base64Error: true, base64ErrorMsg: "Please capture image" });
        } else {
            this.setState({ base64Error: false, base64ErrorMsg: null, imgUrl: null });
        }
    }

    updateExpense = () => {
        let expense = {};
        // expense = Object.assign(expense, expenseData);
        expense.description = this.state.description;
        expense.expenseAmount = this.state.expenseAmount;
        // expense.base64 = this.state.base64;
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
        expense.description = this.state.description;
        expense.expenseAmount = this.state.expenseAmount;
        expense.base64 = this.state.base64;
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
                ToastAndroid.show(e.toString(), 5000);
                this.props.navigation.pop();
            })
    }

    openCameraModal = () => {
        this.setState({ modalVisible: true });
    }
    closeCameraModal = () => {
        this.setState({ modalVisible: false });
    }

    saveImage = (base64) => {
        this.setState({ modalVisible: false });
        this.setState({ base64: base64 });
        if (!base64) {
            this.setState({ base64Error: true, base64ErrorMsg: "Please capture image" });
        } else {
            this.setState({ base64Error: false, base64ErrorMsg: null, imgUrl: null });
        }
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
                        <Title>{title} Expense</Title>
                    </Body>
                    {/* <Right>
                        <Button transparent>
                            <Icon name='add' />
                        </Button>
                    </Right> */}
                </Header>
                <View style={styles.container}>
                    <CameraModal
                        modalVisible={this.state.modalVisible}
                        closeCameraModal={this.closeCameraModal}
                        saveImage={this.saveImage}
                    />
                    <TextInput style={styles.TextInput}
                        placeholder="Item Name"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(txt) => { this.setItemName(txt) }}
                    >{this.state.description}
                    </TextInput>
                    {this.state.descriptionErrorMsg && <Text style={commonCss.error}>{this.state.descriptionErrorMsg}</Text>}

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
                    {this.state.expenseAmountErrorMsg && <Text style={commonCss.error}>{this.state.expenseAmountErrorMsg}</Text>}


                    <TouchableHighlight style={styles.addButton}>
                        <Text style={styles.textInsideButton}
                            onPress={this.openCameraModal}
                        >
                            Capture Image
                        </Text>
                    </TouchableHighlight>
                    {this.state.base64 !== null &&
                        <Image
                            style={styles.ImageView}
                            // source={{ uri: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg' }}
                            source={{ uri: 'data:image/jpeg;base64,' + this.state.base64 }}
                        />
                    }

                    {this.state.imgUrl !== null &&
                        <Image
                            style={styles.ImageView}
                            // source={{ uri: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg' }}
                            source={{ uri: 'http://192.168.43.72:3333/' + this.state.imgUrl }}
                        />
                    }


                    {/* {title === 'update' && <TouchableHighlight style={styles.addButton} onPress={this.updateExpense}>
                        <Text style={styles.textInsideButton}>
                            Update
                    </Text>
                    </TouchableHighlight>} */}
                    {/* {title === 'add' && <TouchableHighlight style={styles.addButton} onPress={this.addExpense}>
                        <Text style={styles.textInsideButton}>
                            Add
                    </Text>
                    </TouchableHighlight>} */}
                </View>
                <Footer style={!(this.state.base64 && this.state.expenseAmount && this.state.description) ? styles.FooterDesignDisabled :styles.FooterDesign}>
                    {title === 'update' && <TouchableHighlight
                        style={!(this.state.base64 && this.state.expenseAmount && this.state.description) ? styles.FooterButtonDisabled : styles.FooterButton}
                        disabled={!(this.state.base64 && this.state.expenseAmount && this.state.description)}
                        onPress={this.updateExpense}>
                        <Text style={styles.FooterText}>
                            Update Expense
            </Text>
                    </TouchableHighlight>}
                    {title === 'add' && <TouchableHighlight
                        style={!(this.state.base64 && this.state.expenseAmount && this.state.description) ? styles.FooterButtonDisabled : styles.FooterButton}
                        disabled={!(this.state.base64 && this.state.expenseAmount && this.state.description)}
                        onPress={this.addExpense}>
                        <Text style={styles.FooterText}>
                            Add Expense
            </Text>
                    </TouchableHighlight>}
                </Footer>
            </Container>

        );
    }
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#fafafa",
        flex: 1,
        alignItems: 'center',
        paddingTop: 20
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
        marginTop: 20,
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
        marginTop: 20,
        height: 200,
        width: 300
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
    },
    FooterButtonDisabled: {
        width: width,
        backgroundColor: "#B2DFDB",
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    FooterDesignDisabled: {
        backgroundColor: '#B2DFDB',
        justifyContent: 'center',
        alignItems: 'center'
    },

})
