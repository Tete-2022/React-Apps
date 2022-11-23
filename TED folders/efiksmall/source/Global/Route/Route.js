import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../../Screen/Userscreens/Signup';
import Signin from '../../Screen/Userscreens/Signin';
import Splash from '../../Screen/Userscreens/Splash';
import DrawerView from '../../Component/Drawer';
import ForgotPassword from '../../Screen/Userscreens/ForgotPassword'
import ChangePassword from '../../Screen/Userscreens/ChangePassword';
import EditProfile from '../../Screen/Userscreens/EditProfile';
import Notification from '../../Screen/Notification/Notification';
import Subscription from '../../Screen/Subscription/Subscription';
import CustomPlayer from '../../Screen/CustomAudioPlayer/CustomAudioPlayer';
import PayWebview from '../../Screen/Subscription/PayWebview';
import PlanHistory from '../../Screen/Subscription/PlanHistory';
import SearchDetailOther from '../../Screen/Search/SearchDetailOther';

const Stack = createStackNavigator();
export const RootNavigators = baseroute => {
    return (
        <Stack.Navigator
            initialRouteName={baseroute}
            screenOptions={{
                animationEnabled: false,
            }}>
            <Stack.Screen
                name="Splash"
                component={Splash}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Signin"
                component={Signin}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Dashboard"
                component={DrawerView}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Notification"
                component={Notification}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Subscription"
                component={Subscription}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SearchDetailOther"
                component={SearchDetailOther}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CustomPlayer"
                component={CustomPlayer}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PayWebview"
                component={PayWebview}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PlanHistory"
                component={PlanHistory}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>

    );
};
