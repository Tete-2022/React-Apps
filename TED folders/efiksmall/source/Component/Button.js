import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { scale } from '../Theme/Scalling.js';
import Colors from '../Theme/Colors';
import Fonts from '../Theme/Fonts';

const Button = props => {
  if (props.type === 'icon') {
  } else {
    return <LinearGradientButton {...props} />;
  }
};
Button.propTypes = {
  type: PropTypes.string,
};
const LinearGradientButton = props => (

  <TouchableOpacity
    onPress={() => props.onPress()} disabled={props.disabled}
    activeOpacity={0.5}
    style={[
      styles.button,
      props.style,
      props.inactive && { backgroundColor: '#133e59' },
    ]}>
    <View style={{
      flexDirection: 'row',
    }}>
      {props.leftIcon && (
        <Image
          source={props.leftIcon}
          style={{
            height: scale(12),
            width: scale(10),
            alignSelf: 'center',
          }}
          resizeMode={'contain'}
        />
      )}
      <Text {...props} style={[styles.text, props.textStyle]}>
        {props.text}
      </Text>
    </View>
  </TouchableOpacity>

);
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: Colors.themeColor,
    height: scale(45),
    borderRadius: scale(18),
    alignContent: "center",

    marginHorizontal: scale(10),
    marginVertical: scale(10),
    justifyContent: "center",

  },
  text: {
    color: 'white',
    fontFamily: Fonts.SemiBold,
    textAlign: 'center',
    fontSize: scale(15),
    textTransform: 'uppercase',

  },
});
export default Button;
