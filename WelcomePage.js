import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Picker, Alert } from 'react-native';


export default class Homescreen extends Component {
  state = {
    selectedValue: "English",
    itemLabel: null,

  }


  label = (itemValue) => {
    this.setState({
      selectedValue: itemValue
    })

    // fix the problem with name 
    //if (itemValue === "de" ) { setItemLabel("German")}
    //  else if (itemValue === "es" ) { setItemLabel("Spanish")}
    // else if (itemValue === "it" ) { setItemLabel("Italian")}
    //  else if (itemValue === "sq" ) { setItemLabel("Albanian")}      

    Alert.alert(
      '',
      'The language you choosed is: ' + itemValue,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
        { text: 'Continue', onPress: () => this.props.navigation.navigate('CameraComponent') },
      ],
      { cancelable: false }
    )
  }


  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image
            source={require("./assets/welcome.jpg")}
            style={styles.image}>
          </Image>

          <Text style={styles.text}>Take a picture and detect what the object is!</Text>
          <Text style={styles.text}>Choose the language:</Text>

          <View style={styles.picker}>
            <Picker
              selectedValue={this.state.selectedValue}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue) => this.label(itemValue)}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="German" value="de" />
              <Picker.Item label="Spanish" value="es" />
              <Picker.Item label="French" value="fr" />
              <Picker.Item label="Italian" value="it" />
              <Picker.Item label="Albanian" value="sq" />
            </Picker>
          </View>

        </View>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  text: {
    color: "#000",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Georgia",
    top: 270,
    marginTop: 20
  },
  image: {
    top: 50,
    width: 370,
    height: 200,
    position: "absolute"
  },
  picker: {
    top: 250,
    alignItems: "center"
  }
});
