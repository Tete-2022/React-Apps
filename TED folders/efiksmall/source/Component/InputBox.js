import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { scale } from '../Theme/Scalling.js';
import GlobalFont from '../Theme/Fonts';
import GlobalColor from '../Theme/Colors';
import CountryCodePicker from '../Component/CodePicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import countries from '../Global/Helper/country.json';

import Assets from '../Theme/Assets'
let defaultCountry = countries[97];
const TextInputBox = props => {
  const [passwordsecure, setPasswordSecure] = useState(true);
  const [showPicker, setshowPicker] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)

  const inputElementRef = useRef(null);
  useEffect(() => {
    inputElementRef.current.setNativeProps({
      style: { fontFamily: GlobalFont.Medium },
    });
    for (let index = 0; index < countries.length; index++) {
      if (countries[index].callingCode === "91") {
        // console.log(index);
      }
    }
  });
  const clickPassword = () => {
    if (passwordsecure) {
      setPasswordSecure(false);
    } else {
      setPasswordSecure(true);
    }
  };

  let callingCode =
    selectedCountry != null ? '+' + selectedCountry.callingCode : '';
  let flagName = selectedCountry != null ? selectedCountry.flag : '';

  return (
    <View>
      {props.label && (
        <View
          style={{
            marginHorizontal: scale(20), marginBottom: scale(20), marginTop: scale(10)
          }}>
          <Text
            style={[{
              fontFamily: GlobalFont.Medium,
              fontSize: scale(14),
              fontStyle: 'normal',
              color: '#484848'
            }, props.labelStyle]}>
            {props.label}
          </Text>

        </View>
      )}
      <View style={[styles.textView, { marginTop: props.label ? scale(-10) : scale(15) }, props.viewStyle,]}>

        {props.showPhoneNumber ? (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.mobileView}
            onPress={() => { setshowPicker(true) }}>
            {props.color === undefined ?
              <Image source={{ uri: flagName }} style={styles.flag} /> : null}
            <Text
              style={
                styles.prefix}>
              {global.county_code_val}
            </Text>

          </TouchableOpacity>
        ) : <View></View>}
        <TextInput
          {...props}
          ref={inputElementRef}
          autoCorrect={true}
          style={[styles.textInputStyle, props.textInputStyle]}
          autoCapitalize={'none'}
          editable={props.editable}
          labelFontSize={scale(14)}
          defaultValue={props.defaultValue}
          secureTextEntry={props.secureTextEntry ? passwordsecure : false}
          fontSize={props.fontsize ? props.fontsize : scale(14)}
          value={props.value}
          onSubmitEditing={() => props.onSubmitEditing()}
          activeLineWidth={1}
          returnKeyType={props.returnKeyType ? props.returnKeyType : 'default'}
          keyboardType={props.keyboardType ? props.keyboardType : 'default'}
          inputStyle={{ fontFamily: GlobalFont.Regular }}
          tintColor="#3664554"
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor={
            props.placeholderTextColor ? props.placeholderTextColor : GlobalColor.lightGray
          }
          autoFocus={props.autoFocus}
          textAlignVertical="center"
          underlineColorAndroid="transparent"
          importantForAutofill={'noExcludeDescendants'}
          autoCompleteType={'off'}
          maxLength={props.maxLength}
        />

        {props.searchIcon && (
          <TouchableOpacity
            onPress={() => {
              props.onPressSearch();
            }}
          >
            <Image
              source={Assets.searchIcon}
              resizeMode={'contain'}
              style={[
                {
                  height: scale(22),
                  width: scale(25),
                  marginRight: scale(8),
                },
                props.menuStyle,
              ]}
            />
          </TouchableOpacity>
        )}

        {props.secureTextEntry ? (
          <TouchableOpacity
            onPress={() => clickPassword()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              width: scale(50),
              height: scale(35),
            }}>
            {passwordsecure ? (
              <Icon
                style={styles.icon}
                name="visibility-off"
                size={20}
                color={GlobalColor.themeColor}
              />
            ) : (
              <Icon
                style={styles.icon}
                name="visibility"
                size={20}
                color={GlobalColor.themeBlue}
              />
            )}
          </TouchableOpacity>
        ) : null}
        {showPicker ? (
          <CountryCodePicker
            action={(item) => {
              if (item != null) {
                let countryName = item.name;
                let callingCode = item.callingCode;
                global.county_code_val = '+' + item.callingCode;
                global.country_name = countryName;
                setSelectedCountry(item)
                setshowPicker(!showPicker)

              } else {
                global.county_code_val = '';
                global.country_name = '';
                setSelectedCountry(null)
                setshowPicker(!showPicker)

              }
            }}
          />
        ) : null}
      </View>
      {props.errortext !== '' ? (
        <Text
          style={styles.errorTextStyle}>
          {props.errortext}
        </Text>
      ) : null}
      {props.rightIcon && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: scale(10),
            top: scale(13),
          }}>
          <Image
            style={{ height: scale(18), width: scale(20) }}
            source={props.rightIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}

    </View>
  );
};
const styles = StyleSheet.create({
  textView: {
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1.4,
    flexShrink: 1,
    borderStyle: 'solid',
    flexWrap: 'wrap', alignItems: 'center',
    marginHorizontal: scale(10),
    justifyContent: 'center',
    borderRadius: scale(30)
  },
  errorTextStyle: {
    color: 'red', paddingTop: scale(5),
    paddingStart: scale(20),
    fontFamily: GlobalFont.Regular,
  },
  textInputStyle: {
    height: scale(45),
    paddingVertical: scale(9),
    paddingLeft: scale(15),
    paddingRight: scale(10),
    flex: 1,
    fontWeight: 'normal',
    fontFamily: GlobalFont.Medium,
    color: '#7a7a7a',

  },
  flag: {
    width: 20,
    height: 20,
    borderRadius: 0,
  },
  prefix: {
    paddingHorizontal: scale(5),
    fontFamily: GlobalFont.Medium,
    color: "#484848",
    textAlign: 'center',
    alignSelf: 'center',
  },
  mobileView: {

    alignItems: 'center',
    justifyContent: 'center', paddingTop: scale(0),
    flexDirection: 'row', alignSelf: 'center',
    // paddingLeft: scale(10)
    marginLeft: scale(10)

  },

});
export default TextInputBox;
