
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
    Alert,
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
import commonCss from '../../css/commonCss';
import Custom from '../../components/Custom';
import Loader from '../../components/Loader';
import Pdf from 'react-native-pdf';
import CustomStatusBar from '../../components/StatusBar';

// import my_lzma from 'lzma';

var { height, width } = Dimensions.get('screen');
let eventObj;
let id = null;
let title = null;

export default class PdfView extends Component {
    
    constructor(props) {
        super();
      
    }
    state = {
        
        loading: false
    }

    componentWillMount() {
    }

    static navigationOptions = {};

    static navigationOptions = ({ navigation }) => ({
        header: null,
        // title: navigation.state.params.title,
        headerStyle: {
            backgroundColor: '#009688'
        },
        headerTintColor: "#fafafa"
    });

    render() {
        let pdf = this.props.navigation.state.params.pdf;
        let url;
        if(pdf === 'flooring'){
            url = 'http://54.175.172.207:3333/flooring.pdf';
        } else if(pdf === 'enterprice'){
            url = 'http://54.175.172.207:3333/enterprice.pdf';
        } else {
            url = 'http://54.175.172.207:3333/profile.pdf';
        }
        const source = {uri:url,cache:true};
        return (
            <Container>
                <Header style={styles.Header}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body style={{alignContent:'center',alignItems:'center'}}>
                        <Title>About</Title>
                    </Body>
                    <Right>
                    {/* <Button transparent>
                        <Icon name='add' />
                    </Button> */}
                </Right>
                </Header>
                <Loader
                    loading={this.state.loading} />

                <View style={styles.container}>
                <CustomStatusBar></CustomStatusBar>

                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    style={styles.pdf}/>
                </View>
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
    },
    Header: {
        backgroundColor: '#009688'
    },
     pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }

})