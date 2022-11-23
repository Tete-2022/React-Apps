import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

import { scale } from '../Theme/Scalling.js';
import Colors from '../Theme/Colors';
import Fonts from '../Theme/Fonts';
import Assets from '../Theme/Assets';

const GlobalText = props => (
    <View style={[{ paddingHorizontal: scale(20) }, props.viewStyle]}>
        <Text {...props} style={[styles.headerText, props.style]} numberOfLines={props.numberOfLines}>
            {props.text}
        </Text>
        {!props.underLineNot ? (

            <View style={[{ backgroundColor: Colors.underLineColor, height: scale(3), width: scale(60), marginLeft: scale(6), alignSelf: "flex-start" }, props.underlineStyle]}>

            </View>
        ) : null}
    </View>
);
const styles = StyleSheet.create({
    headerText: {
        color: Colors.themeBlue,
        fontSize: scale(20),
        fontFamily: Fonts.SemiBold,
        textTransform: 'none',
        letterSpacing: 0,

        // lineHeight: 25
    },
});
export default GlobalText;
