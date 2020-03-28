import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Platform, Alert} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import config from './config';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


export default class CameraComponent extends Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
    flashmode: Camera.Constants.FlashMode.off,
    capturing: false,

  }

  async componentDidMount() {
    this.getPermissionAsync()
  }
 
  getPermissionAsync = async () => {
    // Camera roll Permission 
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  handleCameraType = () => {
    const { cameraType } = this.state

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  }

  handleFlashMode = () => {
    const { flashMode } = this.state

    this.setState({
      flashMode:
        flashMode === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.on
          : Camera.Constants.FlashMode.off
    })
  }


  handleCaptureOut = () => {
    this.camera.stopRecording();
    this.setState({
      capturing: false
    });
  };

 translate = async (term) => {
     const { selectedValue } = this.props.route.params
     var url = "https://translation.googleapis.com/language/translate/v2";
     //Strings requiring translation
     url += "?q=" + term;
     //Target language
     url +="&target=" + selectedValue;
     //Replace with your API key
     url += "&key=AIzaSyB6YoT679YdcMPII-M1hDq0oM6RGLYOQzI";
     let googleTranslateRes = await fetch(url);
 
     googleTranslateRes.json()
         .then(googleTranslateRes => {
          console.log(googleTranslateRes.data.translations[0].translatedText);
          Alert.alert(
            '',
            'The object is ' + googleTranslateRes.data.translations[0].translatedText,
            [
              { text: 'Take Anothe Photo', onPress: () =>  console.log('Next Photo') },
            ],
            { cancelable: false }
          )
           return googleTranslateRes;
         }).catch((error) => { console.log(error) })
 
 }

  handlePress = async (base64) => {
    let googleVisionRes = await fetch(config.googleCloud.api + config.googleCloud.apiKey, {
      method: 'POST',
      body: JSON.stringify({
        "requests": [
          {
            "image": {
              "content": base64
            },
            "features": [
              {
                "maxResults": 10,
                "type": "OBJECT_LOCALIZATION"
              }
            ],
          }
        ]
      })
    });

    await googleVisionRes.json()
      .then(googleVisionRes => {
        console.log(googleVisionRes.responses[0].localizedObjectAnnotations[0].name)
         this.translate(googleVisionRes.responses[0].localizedObjectAnnotations[0].name)
        return googleVisionRes.responses[0].localizedObjectAnnotations[0];
      }).catch((error) => { console.log(error) })
  };



 takePicture = async () => {

    const options = { quality: 0.5, base64: true };
    let photo = await this.camera.takePictureAsync(options);
    this.setState({
      capturing: true
    });

    this.handlePress(photo.base64).then(googleVisionRes => {
      if (googleVisionRes) {
        console.log(googleVisionRes)
      }
    })
  }
  


  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    })
    this.handlePress(result.base64).then(googleVisionRes => {
      if (googleVisionRes) {
        console.log('OUTPUT', googleVisionRes);
         return googleVisionRes;
      }
    });
  }


  render() {
    const { hasPermission } = this.state
    const { flashMode } = this.state
    const { selectedValue } = this.props.route.params
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (

        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.cameraType} flashMode={flashMode} ref={ref => { this.camera = ref }}>
            <TouchableOpacity
              style={{
                marginTop: 30,
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
              onPress={() => this.handleFlashMode()}>
              <Ionicons
                name={flashMode === Camera.Constants.FlashMode.on ? "md-flash" : 'md-flash-off'}
                color="white"
                size={30}
              />
            </TouchableOpacity>
            <View style={{
              flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 30, backgroundColor: 'transparent',
            }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent'
                }}
                onPress={() => this.pickImage()}>
                <Ionicons
                  name="ios-photos"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
                onPressIn={() => this.takePicture()}
                onPressOut={() => this.handleCaptureOut()}>
                <FontAwesome
                  name="camera"
                  style={[{ color: "#fff", fontSize: 40 }, this.state.capturing && { color: "#FF0000", fontSize: 40 }]}
                />

              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.handleCameraType()}
              >
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
            </View>
            <Text>{ selectedValue }</Text>
          </Camera>
        </View>
      );
    }
  }

}