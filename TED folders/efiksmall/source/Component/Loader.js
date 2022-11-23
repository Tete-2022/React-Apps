import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  ProgressBarAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { View, Card, Spinner, Container, Content } from 'native-base';
import Colors from '../Theme/Colors';
import { scale } from '../Theme/Scalling';
import LottieView from 'lottie-react-native';
export default class animated_loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: 0,
      is_load: 0
    };
    this.show_loader = this.showLoader.bind(this);
  }
  componentDidMount() {
    // ADD ORIENTATION LISTENER
    // setTimeout(() => {
    //   this.setState({ is_load: 1 })
    // }, 500);
  }
  componentWillUnmount() {
    // REMOVE ORIENTATION LISTENER
  }
  showLoader(is_loader) {
    this.setState({ is_loading: is_loader });
  }

  render() {    
    // setTimeout(() => {
    //   this.setState({ is_loading: 0 });
    // }, 5000);
    if (this.state.is_loading == 0) {
      return null
      // return <View></View>;
    }
    return (
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* BEGIN METHOD FOR DISPLAY LOADER VIEW */}

        {/* <Card
          style={{
            backgroundColor: Colors.themeColor,
            padding: scale(10),
            height: scale(70),
            justifyContent: 'center',
            width: scale(70),
            borderRadius: scale(10),
          }}>
    
          <Spinner color={"white"} />
        </Card> */}
        {/* {this.state.is_loading === 1 ? ( */}

          <LottieView
            style={{ height: scale(200), width: scale(200) }}
            source={require('../../Assets/Icons/loader.json')} autoPlay loop />
        {/* ) : null} */}
        {/* END METHOD FOR DISPLAY LOADER VIEW */}
      </View>
    );
  }
}
