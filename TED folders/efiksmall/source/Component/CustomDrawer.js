import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar, Linking, Platform
} from 'react-native';
import GlobalAssets from '../Theme/Assets';
import GlobalFont from '../Theme/Fonts';
import { scale } from '../Theme/Scalling';
import GlobalColor from '../Theme/Colors';
import Globalinclude from '../Global/Globalinclude';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_URL, PACKAGE_NAME } from '../Global/Helper/Const';
import firebase from '@react-native-firebase/app';
import DeviceInfo from 'react-native-device-info';
let deviceId = DeviceInfo.getDeviceId();
const CustomDrawer = ({ navigation }) => {
  const [menuData, setMenuData] = useState([])
  const [imagePath, setImagePath] = useState("");
  const [settings,setSettings] = useState(global.setting_menu);
  useEffect(() => {
    
    getProfile()    
    menuDisplay()    
    const unsubscribe = navigation.addListener("focus", () => {
      
      getProfile()      
      menuDisplay()      
    });
    return () => {
      unsubscribe();
    };
  }, [])
  const getProfile = () => {
    if (global.token_val) {
      let headers = {
        'Authorization': 'Bearer ' + global.token_val
      }
      global.global_loader_ref.show_loader(1);
      fetch(APP_URL + 'edit_user/' + global.user_id_val, {
        method: "PUT",
        headers: headers,
      })
        .then((response) => response.json()).then((response) => {
          console.log(response);
          if (response.status) {
            if (response.data) {
              global.profile_picture = response.data.image ? response.data.image : ""
              setImagePath(response.data.image ? response.data.image : null)
              global.global_loader_ref.show_loader(0);
            }
            global.global_loader_ref.show_loader(0);
          } else {
            global.global_loader_ref.show_loader(0);
          }
        }).catch((c) => {
          global.global_loader_ref.show_loader(0);
        }).finally((f) => {
          global.global_loader_ref.show_loader(0);
        })
    }
  }

  const getSetting = () =>{
    let headers = {
      'Authorization': 'Bearer ' + global.token_val
    }
    global.global_loader_ref.show_loader(1);
    fetch(APP_URL + 'setting' ,{
      method: "POST",
      headers: headers,
    })
      .then((response) => response.json()).then((response) => {
        // console.log("MENU STATUS",response.data.app_menu_status)
        if (response.status) {                              
          setSettings(response.data.app_menu_status);          
          global.global_loader_ref.show_loader(0);
        } else {
          global.global_loader_ref.show_loader(0);
        }
      }).catch((c) => {
        console.log("SETTING API ERROR",c)
        global.global_loader_ref.show_loader(0);
      }).finally((f) => {
        global.global_loader_ref.show_loader(0);
      })
  
  }
  const menuDisplay = () => {
    setMenuData([])
    if (global.user_id_val !== null && global.user_id_val !== "") {      
      if(settings=='off'){
        setMenuData([{
          id: "1",
          key: "rateapp",
          title: "Rate App",
        },
        {
          id: "3",
          key: "AboutEfik",
          title: "About the App",
        },
        // {
        //   id: "4",
        //   key: "PrivacyPolicy",
        //   title: "Privacy Policy",
        // }, {
        //   id: "5",
        //   key: "Terms",
        //   title: "Terms & Condition",
        // }, {
        //   id: "6",
        //   key: "ChangePassword",
        //   title: "Change Password",
        // }, 
        // {
        //   id: "7",
        //   key: "Subscription",
        //   title: "Subscription",
        // },
        //  {
        //   id: "8",
        //   key: "PlanHistory",
        //   title: "Transaction History",
        // }, 
        {
          id: "9",
          key: "Setting",
          title: "Settings",
        }])
      }else{
        setMenuData([{
          id: "1",
          key: "rateapp",
          title: "Rate App",
        },
        {
          id: "3",
          key: "AboutEfik",
          title: "About the App",
        },
        // {
        //   id: "4",
        //   key: "PrivacyPolicy",
        //   title: "Privacy Policy",
        // }, {
        //   id: "5",
        //   key: "Terms",
        //   title: "Terms & Condition",
        // }, {
        //   id: "6",
        //   key: "ChangePassword",
        //   title: "Change Password",
        // }, 
        {
          id: "7",
          key: "Subscription",
          title: "Subscription",
        },
        //  {
        //   id: "8",
        //   key: "PlanHistory",
        //   title: "Transaction History",
        // }, 
        {
          id: "9",
          key: "Setting",
          title: "Settings",
        }])
      }
     
    } else {
      if(settings=='off'){
        setMenuData([{
          id: "1",
          key: "rateapp",
          title: "Rate App",
        },
        {
          id: "3",
          key: "AboutEfik",
          title: "About The App",
        },
        //  {
        //   id: "4",
        //   key: "PrivacyPolicy",
        //   title: "Privacy Policy",
        // }, {
        //   id: "5",
        //   key: "Terms",
        //   title: "Terms & Condition",
        // },
        // {
        //   id: "6",
        //   key: "Subscription",
        //   title: "Subscription",
        // },
        {
          id: "7",
          key: "Setting",
          title: "Settings",
        }])
      }else{

        setMenuData([{
          id: "1",
          key: "rateapp",
          title: "Rate App",
        },
        {
          id: "3",
          key: "AboutEfik",
          title: "About The App",
        },
        //  {
        //   id: "4",
        //   key: "PrivacyPolicy",
        //   title: "Privacy Policy",
        // }, {
        //   id: "5",
        //   key: "Terms",
        //   title: "Terms & Condition",
        // },
        {
          id: "6",
          key: "Subscription",
          title: "Subscription",
        },
        {
          id: "7",
          key: "Setting",
          title: "Settings",
        }])
        
      }
      
    }
  }
  const Item = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item?.key === "rateapp") {
          openPlayStore();
        } else {
          navigation.navigate(item?.key);
        }
      }}
      style={styles.menuBase}
    >
      <Text style={styles.myTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
  const openPlayStore = () => {
    if (Platform.OS == "android") {
      Linking.openURL("market://details?id=" + PACKAGE_NAME);
    } else {
      Linking.openURL(
        "https://apps.apple.com/us/app/id1612430411"
      );
    }
  };
  const logoutApi = () => {
    if (global.token_val) {
      let headers = {
        'Authorization': 'Bearer ' + global.token_val
      }
      global.global_loader_ref.show_loader(0);
      fetch(APP_URL + 'logout', {
        method: "POST",
        headers: headers
      })
        .then((response) => response.json()).then((response) => {
          global.user_id_val = "";
          global.user_name_val = "Welcome";
          global.token_val = "";
          global.last_name_val = "";
          global.profile_picture = "";
          global.isFrom = "";
          navigation.navigate("Signin");
          navigation.closeDrawer();


          global.global_loader_ref.show_loader(0);
        })
        .catch(err => {
          console.log('[logoutApi] Error : ', err.message)
        })
        .finally((f) => {
          global.global_loader_ref.show_loader(0);
        })
    }
  }
  const registerDeviceToken = (fcmToken) => {
    var formdata = new FormData();
    formdata.append('device_type', Platform.OS);
    formdata.append('device_token', deviceId)
    formdata.append('notification_token', fcmToken)
    console.log("WHEN Logout APP", formdata);
    fetch(APP_URL + 'register-with-device-token', {
      body: formdata,
      method: "POST",
    })
      .then((response) => response.json()).then((response) => {
        console.log(formdata, "logoutttttttttttt");
        navigation.navigate("Signin");
        navigation.closeDrawer();

      }).catch((c) => {
      }).finally((f) => {
      })
  }
  const logoutApp = () => {
    AsyncStorage.removeItem('EmailId')
    AsyncStorage.removeItem("MobileNumber")
    AsyncStorage.removeItem("UserName")
    AsyncStorage.removeItem("LastName")
    AsyncStorage.removeItem("Token")
    AsyncStorage.removeItem("UserId")
    AsyncStorage.removeItem("ProfilePicture").then(() => {
      global.user_id_val = "";
      global.user_name_val = "Welcome";
      global.token_val = "";
      global.last_name_val = "";
      global.profile_picture = "";
      registerDeviceToken(global.notification_token)

      logoutApi()
    })
  }
  return (
    <View style={{ alignItems: "center", flex: 1, backgroundColor: GlobalColor.themeColor, justifyContent: "center" }}>
      <ScrollView contentContainerStyle={{}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: scale(70), alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              if (global.user_id_val !== null && global.user_id_val !== "") {
                navigation.navigate("EditProfile");
              }
            }}
          >
            {global.user_id_val ? (
              <View>
                {imagePath !== null ? (
                  <Image
                    source={{ uri: imagePath }}
                    style={{
                      height: scale(100),
                      width: scale(109),
                      borderRadius: scale(10),
                    }}
                  />
                ) : (
                  <Image
                    source={Globalinclude.GlobalAssets.placeholderProfile}
                    style={{
                      height: scale(80),
                      width: scale(80),
                      borderRadius: scale(50),
                    }}
                  />
                )}
              </View>
            ) : <Image
              source={Globalinclude.GlobalAssets.appIcon}
              style={{
                height: scale(100),
                width: scale(109),
                borderRadius: scale(10),
              }}
            />}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {
          if (global.user_id_val !== null && global.user_id_val !== "") {
            navigation.navigate("EditProfile");
          }
        }}>
          <Globalinclude.GlobalText
            underLineNot={true}
            numberOfLines={1}
            viewStyle={{ paddingHorizontal: scale(10), alignSelf: 'center' }}
            text={global.user_name_val ? global.user_name_val : 'Welcome'}
            style={{ color: '#fff', fontSize: scale(15), paddingVertical: scale(10) }} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: scale(20) }}>
          {menuData.map((item, i) => (
            <Item item={item} key={item.id} />
          ))}
        </View>
        {global.user_id_val ? (
          <View style={{ marginTop: scale(0) }}>
            <TouchableOpacity
              onPress={() => {
                logoutApp()
              }}
              style={styles.menuBase}
            >
              <Text style={styles.myTitle}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : <View style={{ marginTop: scale(0) }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signin");
              navigation.closeDrawer();
            }}
            style={styles.menuBase}
          >
            <Text style={styles.myTitle}>Login</Text>
          </TouchableOpacity>
        </View>}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  menuBase: {
    overflow: "hidden",
    paddingVertical: scale(10),
  },
  myTitle: {
    fontFamily: Globalinclude.GlobalFont.Medium,
    fontSize: scale(14),
    textTransform: "none",
    textAlign: "center",
    color: "#ffffff",
    paddingBottom: scale(5),
  },
});
export default CustomDrawer;
