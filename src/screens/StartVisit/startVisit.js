
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Modal,
    // Button,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import CameraModal from '../../modal/camera-modal';
import {
    Container,
    Footer,
    Header,
    Left,
    Right,
    Body,
    Icon,
    Title,
    Button
} from 'native-base';
import Validation from '../../provider/validation';
import StartDayProvider from '../../provider/startday-provider';
import EventSingleton from '../../event/eventSingleton';
import UserProvider from '../../provider/user-provider';
import MapView, { Marker } from 'react-native-maps';
import MeetingProvider from '../../provider/meeting-provider';
import Loader from '../../components/Loader';


// import MapView from 'react-native-maps';

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
        orgNameErrorMsg: null,

        latitude: null,
        longitude: null,
        locationError: true,
        locationErrorMsg: null,

        loading: false
    }

    componentWillMount() {
        eventObj = EventSingleton.geteventEmitterObj();
    }

    static navigationOptions = {};

    static navigationOptions = ({ navigation }) => ({
        // title: navigation.state.params.title,
        header: null,
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
        this.setState({ orgName: text });
        let orgError = Validation.onlyWhiteSpaceNotAllowed(text);
        // this.setState({orgErrorMsg:orgError.toString()})
        if (orgError) {
            this.setState({ orgNameError: orgError.error, orgNameErrorMsg: orgError.errorMsg });
            // this.setState({ });
        } else {
            this.setState({ orgNameError: false, orgNameErrorMsg: null });
            // this.setState({ });
        }
    }

    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            let coordinates = position.coords;
            this.setState({ longitude: coordinates.longitude, latitude: coordinates.latitude, locationError: false })
        }, err => {

        });
    }

    startVisit = () => {
        let userId = null;
        UserProvider.getUserIdFromLocalStorage()
            .then(data => {
                this.userId = userId;

                let startVisitObj = {
                    base64: this.state.base64,
                    location: {
                        latitude: this.state.latitude,
                        longitude: this.state.longitude
                    },
                    orgName: this.state.orgName,
                    userId: userId,//get it from local storage
                }

                this.setState({ loading: true })
                MeetingProvider.startMeeting(startVisitObj)
                    .then(data => {
                        this.setState({ loading: false })
                        
                        if (data.success === true) {
                            ToastAndroid.show("meeting started",1000);
                            let status = {
                                startVisitId: data.data._id,
                                orgName : this.state.orgName,
                                status: 'true'
                            }
                            UserProvider.setVisitStatus(JSON.stringify(status));
                            eventObj.emit('startvisit', data.data._id, 'true');
                            // this.props.navigation.goBack();
                        }
                    })
                    .catch(e => {
                        this.setState({ loading: false })
                        console.error(e);
                    })
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
                    <Body>
                        <Title>Start Visit</Title>
                    </Body>
                    {/* <Right>
                    <Button transparent>
                        <Icon name='add' />
                    </Button>
                </Right> */}
                </Header>
                <ScrollView contentContainerStyle={styles.container}>
                    {/* <View style={styles.innerContainer}> */}
                    <Loader
                        loading={this.state.loading} />
                    <CameraModal
                        modalVisible={this.state.modalVisible}
                        closeCameraModal={this.closeCameraModal}
                        saveImage={this.saveImage}
                    />

                    <TextInput style={styles.TextInput}
                        placeholder="Enter Organization Name"
                        underlineColorAndroid='#009688'
                        placeholderTextColor="#26A69A"
                        onChangeText={(text) => this.setOrgName(text)}
                    >{this.state.orgName}
                    </TextInput>


                    <TouchableOpacity style={styles.cameraButton} onPress={this.openCameraModal}>
                        <Text style={styles.textInsideButton}

                        >
                            Capture Image
                        </Text>
                    </TouchableOpacity>
                    {this.state.base64 !== '' &&
                        <Image style={this.state.base64 ? styles.ImageView : { height: 0, width: 0 }}
                            // source={{ uri: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg' }}
                            source={{ uri: 'data:image/jpeg;base64,' + this.state.base64 }}
                        />
                    }

                    {/* </View> */}
                    <TouchableOpacity style={styles.cameraButton}
                        onPress={() => this.getCurrentLocation()}
                    >
                        <Text style={styles.textInsideButton}
                        >
                            Capture Location
                        </Text>
                    </TouchableOpacity>
                    {latitude && longitude && <MapView style={styles.Map}
                        initialRegion={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0.002,
                        }}
                        scrollEnabled={false}
                    ><Marker
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude
                        }}
                    >
                        </Marker>
                    </MapView>}

                </ScrollView>

                <Footer style={(this.state.base64Error || this.state.orgNameError || this.state.locationError) ? styles.FooterDesignDisabled : styles.FooterDesign}>
                    <TouchableOpacity
                        disabled={(this.state.base64Error || this.state.orgNameError || this.state.locationError)}
                        style={(this.state.base64Error || this.state.orgNameError || this.state.locationError) ? styles.FooterButtonDisabled : styles.FooterButton}
                        onPress={() => this.startVisit()}
                    >
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
        marginTop: 10,
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
    Map: {
        height: 300,
        width: 300
    },
    FooterDesignDisabled: {
        backgroundColor: '#B2DFDB',
        justifyContent: 'center',
        alignItems: 'center'
    },

    FooterButtonDisabled: {
        width: width,
        backgroundColor: "#B2DFDB",
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }, Header: {
        backgroundColor: '#009688'
    },

})