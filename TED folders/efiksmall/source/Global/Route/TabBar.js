import React from 'react';
import { Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from '../../Theme/Scalling';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../Screen/Tabbar/Home';
import Favourite from '../../Screen/Tabbar/Favourite'
import Dictionary from '../../Screen/Tabbar/Dictionary'
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../../Theme/Colors';
import Assets from '../../Theme/Assets';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: Colors.themeColor, paddingBottom: scale(5) }}
      tabBarPosition={'bottom'}
      tabBarOptions={{ style: { backgroundColor: Colors.themeColor, paddingVertical: scale(5), height: scale(60) } }}
      swipeEnabled={false}>
      <Tab.Screen
        name="Dictionary"
        component={Dictionary}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <>
                  <View style={{ position: "absolute", top: scale(-5), left: scale(28), right: 0 }}>
                    <Image source={Assets.tabbase} style={{ height: scale(13), width: scale(60) }}
                      resizeMode={'contain'} />
                    <View style={{ backgroundColor: Colors.themeColor, height: scale(6), width: scale(6), borderRadius: scale(50), marginTop: scale(-11), alignSelf: "center", marginLeft: scale(-25) }}></View>
                  </View>
                  <View style={{ marginTop: scale(10) }}>
                    <Image
                      source={require('../../../Assets/Icons/bookTheme.png')}
                      style={{ height: 30, width: 30 }}
                      resizeMode={'contain'}
                    />
                  </View>
                </>
              ) : (
                <View style={{ marginTop: scale(7) }}>
                  <Image
                    source={require('../../../Assets/Icons/bookWhite.png')}
                    style={{ height: 27, width: 27 }}
                    resizeMode={'contain'}
                  />
                </View>
              )}
            </>
          ),
          tabBarColor: Colors.themeColor,
          tabBarLabel: ''
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <>
                  <View style={{ position: "absolute", top: scale(-5), left: scale(28), right: 0 }}>
                    <Image source={Assets.tabbase} style={{ height: scale(13), width: scale(60) }}
                      resizeMode={'contain'} />
                    <View style={{ backgroundColor: Colors.themeColor, height: scale(6), width: scale(6), borderRadius: scale(50), marginTop: scale(-11), alignSelf: "center", marginLeft: scale(-25) }}></View>
                  </View>
                  <View style={{ marginTop: scale(10) }}>
                    <Image
                      source={require('../../../Assets/Icons/hometheme.png')}
                      style={{ height: 28, width: 30 }}
                      resizeMode={'contain'}
                    />
                  </View>
                </>
              ) : (
                <View style={{ marginTop: scale(7) }}>
                  <Image
                    source={require('../../../Assets/Icons/homeWhite.png')}
                    style={{ height: 27, width: 27 }}
                    resizeMode={'contain'}
                  />
                </View>
              )}
            </>
          ),
          tabBarLabel: '',
          tabBarColor: Colors.themeColor,
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={Favourite}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <>
              {focused ? (
                <>
                  <View style={{ position: "absolute", top: scale(-5), left: scale(28), right: 0 }}>
                    <Image source={Assets.tabbase} style={{ height: scale(13), width: scale(60) }}
                      resizeMode={'contain'} />
                    <View style={{ backgroundColor: Colors.themeColor, height: scale(6), width: scale(6), borderRadius: scale(50), marginTop: scale(-11), alignSelf: "center", marginLeft: scale(-25) }}></View>
                  </View>
                  <View style={{ marginTop: scale(10) }}>
                    <Image
                      source={require('../../../Assets/Icons/favTheme.png')}
                      style={{ height: 27, width: 27 }}
                      resizeMode={'contain'}
                    />
                  </View>
                </>
              ) : (
                <View style={{ marginTop: scale(7) }}>
                  <Image
                    source={require('../../../Assets/Icons/favWhite.png')}
                    style={{ height: 24, width: 24 }}
                    resizeMode={'contain'}
                  />
                </View>
              )}
            </>
          ),
          tabBarColor: Colors.themeColor,
          tabBarLabel: ''
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({});
export default TabBar;
