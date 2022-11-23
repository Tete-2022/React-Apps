import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import GlobalAssets from '../Theme/Assets';
import GlobalFont from '../Theme/Fonts';
import { scale } from '../Theme/Scalling';
import GlobalColor from '../Theme/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import { APP_URL } from '../Global/Helper/Const';
import { useDispatch, connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
let deviceId = DeviceInfo.getDeviceId();
let notification_count = 0;
const Header = props => {
  const dispatch = useDispatch()
  notification_count = global.notification_count ? global.notification_count : 0
  // alert(notification_count)
  const navigation = useNavigation();
  useEffect(() => {
    notificationcountApi()
    const unsubscribe = navigation.addListener('focus', () => {
      notificationcountApi()
    });

    return () => {
      unsubscribe()

    };
  }, [])
  const notificationcountApi = () => {
    console.log(global.token_val, "from app");
    let headers = {
      'Authorization': 'Bearer ' + global.token_val
    }
    let data = global.user_id_val ? global.user_id_val : deviceId

    fetch(APP_URL + 'count_notifications/' + data, {
      method: "PUT",
      headers: headers,
    })
      .then((response) => response.json()).then((response) => {
        // console.log("ress counttt hh", response);
        global.notification_count = response.total
        dispatch({ type: "APPS.NOTIFICATIONCOUNT" });
      })
      .catch(err => {
        console.log('[notificationcountApi] Error : ', err.message)
      })
  }
  return (
    <View style={{ backgroundColor: GlobalColor.themeColor, height: scale(70), width: '100%' }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginHorizontal: scale(15), alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          {props.drawerIcon ? (
            <TouchableOpacity
              onPress={props.onPressDrawer}
              style={styles.iconBase}>
              <Image
                source={GlobalAssets.drawerIcon}
                resizeMode={'contain'}
                style={[
                  {
                    height: scale(22),
                    width: scale(22),
                  },
                  props.menuStyle,
                ]}
              />
            </TouchableOpacity>
          ) : null}
          {props.backIcon ? (
            <TouchableOpacity
              onPress={() => {
                props.onPressBack();
              }}
              style={styles.iconBase}>
              <Image
                source={GlobalAssets.backArrow}
                resizeMode={'contain'}
                style={[
                  {
                    height: scale(25),
                    width: scale(25),
                  },
                  props.menuStyle,
                ]}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{ flex: 6 }}>
          <Text style={[styles.headerText, props.textStyle]} numberOfLines={1}>
            {props.name}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {props.drawerIcon ? (
            <TouchableOpacity
              onPress={() => {
                props.onPressNotification();
              }}
              style={[styles.iconBase, { marginLeft: scale(15) }]}>
              <Image
                source={GlobalAssets.notificationIcon}
                resizeMode={'contain'}
                style={[
                  {
                    height: scale(20),
                    width: scale(20),
                  },
                  props.menuStyle,
                ]}
              />
              {global.notification_count > 0 ? (

                <View
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -1,
                    height: scale(50),
                  }}>
                  <Badge
                    textStyle={{ color: 'black', fontFamily: GlobalFont.Medium, fontSize: scale(7) }}
                    value={global.notification_count ? global.notification_count : 0}
                    badgeStyle={{ backgroundColor: '#fff', height: scale(18), borderRadius: scale(20) }}
                    style={{ width: scale(20), height: scale(20) }}
                  />
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}
          {props.deleteIcon ? (
            <TouchableOpacity
              onPress={() => {
                props.onPressDeleteIcon();
              }}
              style={[styles.iconBase, { marginLeft: scale(15) }]}>
              <Image
                source={GlobalAssets.clear}
                resizeMode={'contain'}
                style={[
                  {
                    height: scale(20),
                    width: scale(20),
                  },
                  props.menuStyle,
                ]}
              />

            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: scale(100),
    borderBottomLeftRadius: scale(40),
    borderBottomRightRadius: scale(40)
  },
  headerText: {
    fontFamily: GlobalFont.SemiBold,
    fontSize: scale(18),
    color: '#fff',
    textTransform: 'none',
    textAlign: 'center',

  },
  iconBase: {
    zIndex: 1,
    paddingVertical: scale(2),
  },
});
const mapStateToProps = (state) => ({

  notificationCount: {
    apps: state.apps.notificationCount,
  },



});
const mapDispatchToProps = (dispatch) => {
  dispatch({ type: "APPS.NOTIFICATIONCOUNT" });
  return {
    // dispatching plain actions
    appNotificationCount: () => dispatch({ type: "APPS.NOTIFICATIONCOUNT" })
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
