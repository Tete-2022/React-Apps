import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, FlatList, BackHandler } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_URL } from '../../Global/Helper/Const';

const Subscription = (props) => {
    const [planData, setPlanData] = useState([])
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    useEffect(() => {
        getPlan()
        AsyncStorage.getItem("theme").then((value) => {
            global.theme = value
            if (value !== null && value !== undefined) {
                global.theme = value
                setScheme(value)
            } else {
            }
        }).then(() => {
            setScheme(global.theme);
        })
        const unsubscribe = props.navigation.addListener('focus', () => {
            getPlan()
            AsyncStorage.getItem("theme").then((value) => {
                global.theme = value
                if (value !== null && value !== undefined) {
                    global.theme = value
                    setScheme(value)
                } else {
                }
            }).then(() => {
                setScheme(global.theme);
            })
        });

        return () => {
            unsubscribe();
        };
    }, [])

    const getPlan = () => {
        global.global_loader_ref.show_loader(1);
        let headers = {
            'Authorization': 'Bearer ' + global.token_val
        }
        var formdata = new FormData();
        formdata.append('customer_code', global.customer_code);
        fetch(APP_URL + 'plan-list', {
            method: "POST",
            body: formdata,
            headers: headers,
        })
            .then((res) => res.json()).then((response) => {
                console.log("HERE PLAN", response);

                if (response.status) {

                    if (response.data) {
                        setPlanData(response.data)
                        global.global_loader_ref.show_loader(0);
                    } else {
                        setPlanData([])
                        global.global_loader_ref.show_loader(0);
                    }
                } else {
                    setPlanData([])
                    global.global_loader_ref.show_loader(0);
                }
            }).catch((c) => {
                global.global_loader_ref.show_loader(0);
            }).finally((f) => {
                global.global_loader_ref.show_loader(0);
            })
    }

    return (
        <ImageBackground source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                <Globalinclude.GlobalHeader name={'Membership Plan'}
                    drawerIcon={false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.navigate("Dashboard")
                    }}
                />
                <ScrollView>
                    {planData.map((item) => {
                        return (
                            <View style={styles.baseView}>
                                <View style={{ paddingTop: scale(10) }}>
                                    <Text style={[styles.title, { color: scheme === 'dark' ? '#fff' : '#000' }]}>{item.name}</Text>
                                </View>
                                <View style={{ paddingTop: scale(15) }}>
                                    <View style={styles.roundBase}>
                                        <View style={styles.innerRound}>
                                            <Text style={styles.rsText}>
                                                {global.currency_val}{item.amount}
                                                <Text style={styles.rsTextSub}>
                                                    {/* /{item.interval.substring(0, 2)} */}
                                                    /{item.interval}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ paddingTop: scale(20) }}>
                                    <Text style={[styles.detailText, { color: scheme === 'dark' ? '#eee' : '#7A7A7A' }]}>{item.description}</Text>
                                    {/* <Text style={[styles.detailText, { color: scheme === 'dark' ? '#eee' : '#7A7A7A' }]}>There are many variations</Text>
                                    <Text style={[styles.detailText, { color: scheme === 'dark' ? '#eee' : '#7A7A7A' }]}>Contrary to popular</Text>
                                    <Text style={[styles.detailText, { color: scheme === 'dark' ? '#eee' : '#7A7A7A' }]}>There are many variations</Text> */}
                                </View>
                                <View style={{ marginTop: scale(20) }}>
                                    <Globalinclude.GlobalButton text={item.status ? 'ACTIVE' : 'BUY NOW'}
                                        disabled={item.status ? true : false}
                                        style={{ paddingHorizontal: scale(50), borderRadius: scale(10) }}
                                        onPress={() => {
                                            if (global.user_id_val) {
                                                props.navigation.navigate("PayWebview", { amount: item.amount, plan_code: item.plan_code })
                                            } else {
                                                props.navigation.navigate("Signin")
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    title:
        { fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(25), textAlign: "center" },
    baseView: {
        marginVertical: scale(20), marginHorizontal: scale(10), alignSelf: "center",
        borderWidth: 1.5, borderRadius: scale(5), width: scale(300),
        borderColor: "#E1E0E0", alignItems: "center", padding: scale(10)
    },
    detailText: { fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14) },
    roundBase: { height: scale(150), width: scale(150), backgroundColor: '#fff', borderRadius: scale(150), alignItems: 'center', justifyContent: "center", borderWidth: 1, borderColor: "#826388" },
    innerRound: { height: scale(140), width: scale(140), backgroundColor: Globalinclude.GlobalColor.themeColor, borderRadius: scale(150), alignItems: "center", alignSelf: "center", justifyContent: "center" }, rsText: { fontSize: scale(25), color: '#fff', textAlignVertical: 'top', fontFamily: Globalinclude.GlobalFont.Bold }, rsTextSub: { fontSize: scale(18) - 1.6, textAlignVertical: "bottom", fontFamily: Globalinclude.GlobalFont.Regular }
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(Subscription);