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

export default class CameraPage extends Component {
    state = {
        image: null,
        text: null
    }

    saveImage = () => {
        this.props.navigation.state.params.saveImage(this.state.image);
        this.props.navigation.pop();
        // this.props.saveImage(this.state.image);
    }
    takePicture = () => {
        let image = '';
        this.camera.capture(true)
            .then(data => {
                image = data.base64;
                // this.setState((prevState, props) => {
                //     return { image: image, text: 'image is captured' }
                // })
                // this.props.navigation.state.params.saveImage(image);
                this.props.navigation.pop();

                //    this.saveImage(image);
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
            <View>
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
                {/* {this.state.image !== '' &&
                    <Image
                        style={{ width: 400, height: 600 }}
                        // source={{ uri: '/storage/emulated/0/DCIM/Camera/1518296786611.jpg' }}
                        source={{ uri: 'data:image/jpeg;base64,' + this.state.image }}
                    />
                } */}
                <Text onPress={this.takePicture}>Capture {this.state.text}</Text>
                <Text onPress={this.saveImage}>save Image </Text>
            </View>
        );
    }
}
