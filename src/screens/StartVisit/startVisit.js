
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
import CameraModal from '../../modal/camera-modal'
import {
    Container,
    Footer
} from 'native-base';
import Validation from '../../provider/validation';
import StartDayProvider from '../../provider/startday-provider';
import EventSingleton from '../../event/eventSingleton';
import UserProvider from '../../provider/user-provider';
// import { Marker } from 'react-native-maps';

var { height, width } = Dimensions.get('screen');
let eventObj;
let id = null;


export default class StartVisit extends Component {
    title = 'Start'
    constructor(props) {
        super();
        console.log("constructor calls");
        console.log("id", JSON.stringify(props));
    }
    state = {
        modalVisible: false,
        userId: null,
        startVisit: null,

        base64: null,
        base64Error: true,
        base64ErrorMsg: null,

        orgName: null,
        orgNameError: true,
        orgNameErrorMsg: null
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
    }

    static navigationOptions = {};

    static navigationOptions = ({ navigation }) => ({
        //title: navigation.state.params.title,
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

    setOrgName = (text) => {
        this.state({ orgName: text });
    }


    render() {
        let title = this.props.navigation.state.params.title;
        return (
            <Container>

                <View style={styles.container}>
                    {/* <View style={styles.innerContainer}> */}
                    <TextInput style={styles.TextInput}
                        placeholder="Enter Organization Name"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(text) => this.setOrgName(text)}
                    > </TextInput>
                    <CameraModal
                        modalVisible={this.state.modalVisible}
                        closeCameraModal={this.closeCameraModal}
                        saveImage={this.saveImage}
                    />
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