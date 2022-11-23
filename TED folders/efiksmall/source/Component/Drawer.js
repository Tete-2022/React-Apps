import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  View,
  StatusBar,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerView from '../Component/CustomDrawer';
import Animated from 'react-native-reanimated';
//app screens

import TabNavigator from '../Global/Route/TabBar';
import SearchDetail from '../Screen/Search/SearchDetail';
import AboutUs from '../Screen/Userscreens/AboutUs';
import Setting from '../Screen/Userscreens/Setting';
import AboutEfik from '../Screen/Userscreens/AboutEfik';
import PrivacyPolicy from '../Screen/Userscreens/PrivacyPolicy'
import Terms from '../Screen/Userscreens/Terms'
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Screens = ({ navigation, style }) => {
  return (
    <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <Stack.Navigator>        
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {props => <TabNavigator {...props} navigation={navigation} />}
        </Stack.Screen>

        <Stack.Screen name="SearchDetail" options={{ headerShown: false }}>
          {props => <SearchDetail {...props} navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="AboutUs" options={{ headerShown: false }}>
          {props => <AboutUs {...props} navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="Setting" options={{ headerShown: false }}>
          {props => <Setting {...props} navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="AboutEfik" options={{ headerShown: false }}>
          {props => <AboutEfik {...props} navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="PrivacyPolicy" options={{ headerShown: false }}>
          {props => <PrivacyPolicy {...props} navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="Terms" options={{ headerShown: false }}>
          {props => <Terms {...props} navigation={navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    </Animated.View>
  );
};

export default () => {
  const [progress, setProgress] = useState(new Animated.Value(0));
  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],

  });
  const borderRadius = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 10],
  });
  const screensStyles = { borderRadius, transform: [{ scale }] };
  return (
    <Drawer.Navigator
      drawerType="slide"
      overlayColor="transparent"
      statusBarAnimation="fade"
      drawerContentOptions={{
        // activeBackgroundColor: 'black',

        // inactiveBackgroundColor: 'black',

      }}

      sceneContainerStyle={{ backgroundColor: '#7030A0' }}
      drawerStyle={{

        width: '55%',

      }}
      drawerContent={(props) => {
        setProgress(props.progress);
        return <DrawerView {...props} />;
      }}>
      <Drawer.Screen name="Screens">
        {(props) => <Screens {...props} style={screensStyles} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({});
