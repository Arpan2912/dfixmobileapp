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
    Image
} from 'react-native';
import { CameraKitCamera } from 'react-native-camera-kit';

export default class CameraModal extends Component {
    state = {
        image: '',
        text: ''
    }
    // onBottomButtonPressed(event) {
    //     const captureImages = JSON.stringify(event.captureImages);
    //     Alert.alert(
    //         `${event.type} button pressed`,
    //         `${captureImages}`,
    //         [
    //             { text: 'OK', onPress: () => console.log('OK Pressed') },
    //         ],
    //         { cancelable: false }
    //     )
    // }
    closeModal = () => {
        this.props.closeCameraModal();
    }

    saveImage=()=>{
        this.props.saveImage(this.state.image);
    }
    takePicture = () => {
        let image = '';
        this.camera.capture(true)
            .then(data => {
                image = data.base64;
                this.setState((prevState, props) => {
                    return { image: image, text: 'image is captured' }
                })
                // data: { height: 2304,
                //     width: 1296,
                //     name: '1518296786611.jpg',
                //     size: 140391,
                //     id: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg',
                //     uri: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg' 
                //     base64:/* base64 string */     }
                // console.log("image data", data);
            })

    }
    render() {
        return (
            <Modal
                visible={this.props.modalVisible}
                animationType={'slide'}
                onRequestClose={() => this.closeModal()}
            >
                <CameraKitCamera
                    ref={(cam) => {
                        this.camera = cam;
                        //console.log("cam",JSON.stringify(cam));
                    }
                    }
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}
                    cameraOptions={{
                        flashMode: 'auto',             // on/off/auto(default)
                        focusMode: 'on',               // off/on(default)
                        zoomMode: 'on',                // off/on(default)
                        ratioOverlay: '1:1',            // optional, ratio overlay on the camera and crop the image seamlessly
                        ratioOverlayColor: '#00000077' // optional
                    }}
                />
                {this.state.image !== '' &&
                    <Image
                        style={{ width: 300, height: 500 }}
                        // source={{ uri: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg' }}
                        source={{ uri: 'data:image/jpeg;base64,' + this.state.image }}
                    />
                }
                <Text onPress={this.takePicture}>Capture {this.state.text}</Text>
                <Text onPress={this.saveImage}>save Image </Text>
            </Modal>
        );
    }
}
// import Camera from 'react-native-camera';

// export default class CameraModal extends Component {
//     state = {
//         base64: 'image',
//         text: 'world'
//     }
//     closeModal = () => {
//         this.props.closeCameraModal()
//     }

//     render() {
//         return (
//             <Modal
//                 visible={this.props.modalVisible}
//                 animationType={'slide'}
//                 onRequestClose={() => this.closeModal()}
//             >
//                 <Camera
//                     ref={(cam) => {
//                         this.camera = cam;
//                     }}
//                     style={styles.preview}
//                     aspect={Camera.constants.Aspect.fill}>
//                     <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE] {this.state.base64}
//                         {this.state.text}
//                     </Text>
//                 </Camera>
//             </Modal>
//         );
//     }

//     takePicture() {
//         const options = {};
//         this.setState((prevState, props) => {
//             return { base64: '', text: "Hello" };
//         })
//         //options.location = ...
//         // this.camera.capture({ metadata: options })
//         //     .then((data) => {
//         //         this.setState((prevState, props) => {
//         //             return {base64: data.path,text:"Hello"};
//         //         })
//         //         console.log(data)
//         //     })
//         //     .catch(err => console.error(err));
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'row',
//     },
//     preview: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center'
//     },
//     capture: {
//         flex: 0,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         color: '#000',
//         padding: 10,
//         margin: 40
//     }
// });