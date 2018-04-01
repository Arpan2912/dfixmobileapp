
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    Button,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    AsyncStorage
} from 'react-native';
import CameraModal from '../../modal/camera-modal';
import {
    Container,
    Footer
} from 'native-base';
import Validation from '../../provider/validation';
import StartDayProvider from '../../provider/startday-provider';
import EventSingleton from '../../event/eventSingleton';
import UserProvider from '../../provider/user-provider';

var { height, width } = Dimensions.get('screen');
let eventObj;
let id = null;


export default class StartDay extends Component {
    title = 'Start'
    constructor(props) {
        super();
        console.log("constructor calls");
        id = props.navigation.state.params.startDayId;
        console.log("id", JSON.stringify(props));
    }
    state = {
        modalVisible: false,
        userId: null,
        startday: null,

        base64: null,
        base64Error: true,
        base64ErrorMsg: null,

        km: null,
        kmError: true,
        kmErrorMsg: null
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
        UserProvider.getStartDayStatus()
            .then(data => {
                try {
                    this.setState({ startday: data })
                } catch (e) {

                }
            })
    }

    static navigationOptions = {};

    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title,
        headerStyle: {
            backgroundColor: '#009688'
        },
        headerTintColor: "#fafafa"
    });

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
            this.setState({ base64Error: false, base64ErrorMsg: null });
        }
    }

    setKm(text) {
        this.setState({ km: text });
        let numberError = Validation.numberValidation(text);
        if (numberError) {
            this.setState({ kmError: numberError.error, kmErrorMsg: numberError.errorMsg });
        } else {
            this.setState({ kmError: false, kmErrorMsg: null });
        }
    }

    startDay() {
        AsyncStorage.getItem('userId')
            .then(data => {
                this.setState({ userId: data });
            })
        StartDayProvider.startDay(this.state.km, this.state.base64, this.state.userId)
            .then(data => {
                if (data.success === true) {
                    let status = {
                        startDayId: data.data._id,
                        status: 'true'
                    }
                    // this.setState({ startday: status });
                    if (this.props.navigation.state.params.title === 'Start Day')
                        eventObj.emit('startday', data.data._id, 'true');
                    UserProvider.setStartDayStatus(JSON.stringify(status));
                    this.props.navigation.goBack();
                }
            })
    }

    stopDay() {
        Promise.all(UserProvider.getUserIdFromLocalStorage, UserProvider.getStartDayStatus)
            // AsyncStorage.getItem('userId')
            .then(data => {
                this.setState({ userId: data[0] });
            })
        console.log("id", id);
        StartDayProvider.stopDay(this.state.km, this.state.base64, this.state.userId, id)
            .then(data => {
                if (data.success === true) {
                    let status = {
                        startDayId: null,
                        status: 'false'
                    }
                    if (this.props.navigation.state.params.title === 'Stop Day')
                        eventObj.emit('startday', null, 'false');
                    UserProvider.setStartDayStatus(JSON.stringify(status));
                    this.props.navigation.goBack();
                }
            })
    }



    render() {
        let title = this.props.navigation.state.params.title;
        return (
            <Container>

                <View style={styles.container}>
                    {/* <View style={styles.innerContainer}> */}
                   
                    <CameraModal
                        modalVisible={this.state.modalVisible}
                        closeCameraModal={this.closeCameraModal}
                        saveImage={this.saveImage}
                    />
                    <TextInput style={styles.TextInput}
                        placeholder="Enter Km"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(text) => this.setKm(text)}
                    > 
                    {this.state.km}
                    </TextInput>
                    <TouchableOpacity style={styles.cameraButton}>
                        <Text style={styles.textInsideButton}
                            onPress={this.openCameraModal}
                        >
                            Capture Image
                        </Text>
                    </TouchableOpacity>
                    {this.state.base64 !== '' &&
                        <Image
                            style={styles.ImageView}
                            // source={{ uri: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg' }}
                            source={{ uri: 'data:image/jpeg;base64,' + this.state.base64 }}
                        />
                    }

                    {/* </View> */}

                    <Text>{JSON.stringify(this.state.startday)}   {(!!id) ? id.toString() : null}</Text>

                </View>

                <Footer style={styles.FooterDesign}>
                    <TouchableOpacity disabled={this.state.kmError || this.state.base64Error} style={styles.FooterButton} onPress={() => (title === 'Start Day') ? this.startDay() : this.stopDay()}>
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
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'center'
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
        // width: width - 100,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 20

    },
    textInsideButton: {
        color: "#fafafa"
    },
    TextInput: {
        width: 300,
        height: 50,
        fontSize: 15,
        color: '#009688',
        margin: 20,
        alignItems: 'center',
        // textAlign: 'center'
    },
    ImageView: {
        marginTop: 15,
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
    }

})