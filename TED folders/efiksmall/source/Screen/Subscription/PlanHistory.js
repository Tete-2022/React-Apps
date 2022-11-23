import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, FlatList, Image } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_URL } from '../../Global/Helper/Const';
import { CommonActions } from '@react-navigation/native'
import AnimatedEllipsis from 'react-native-animated-ellipsis';
const PlanHistory = (props) => {
    const [planData, setPlanData] = useState([])
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    const [load, setLoad] = useState(false)
    useEffect(() => {
        if (!global.user_id_val) {
            setLoad(true)
            setPlanData([])
        } else {
            getPlans()
        }
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
            getPlans()
            if (!global.user_id_val) {
                setPlanData([])
            } else {
                getPlans()
            }
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
    const getPlans = () => {
        var formdata = new FormData()
        formdata.append('customer_code', global.customer_code)

        setLoad(false)
        let headers = {
            'Authorization': 'Bearer ' + global.token_val,
            'Accept': 'application/json'
        }
        console.log(global.customer_code, global.token_val);
        fetch(APP_URL + 'transactions-list', {
            method: "POST",
            headers: headers,
            body: formdata
        })
            .then((res) => res.json()).then((response) => {
                console.log(response);
                global.global_loader_ref.show_loader(0);
                if (response.status) {
                    global.global_loader_ref.show_loader(0);
                    if (response.data) {
                        setPlanData(response.data)
                        setTimeout(() => {
                            setLoad(true)
                        }, 50);
                    } else {
                        setLoad(true)
                        setPlanData([])
                    }
                } else {
                    setLoad(true)
                    setPlanData([])
                    global.global_loader_ref.show_loader(0);
                }
            }).catch((c) => {
                global.global_loader_ref.show_loader(0);
            }).finally((f) => {
                global.global_loader_ref.show_loader(0);
            })
    }
    const PlanItem = ({ item }) => {
        return (
            <View>
                <View
                    style={styles.baseView}
                >
                    <View style={{ paddingHorizontal: scale(10), flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: "70%" }}>
                            <Text style={styles.title}>
                                {item.name}</Text>
                            <Text style={[styles.messageText, { color: 'gray' }]}>
                                {item.description}</Text>
                        </View>
                        <View style={{ width: "30%", alignItems: "flex-end" }}>
                            <Text style={styles.title}>
                                {global.currency_val}{item.amount}
                                <Text style={{ fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(10) }}>/{item.interval}</Text>
                            </Text>
                            <Text style={[styles.messageText, { color: 'green', fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(15) }]}>
                                {item.status}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <ImageBackground source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                <Globalinclude.GlobalHeader name={'Transaction History'}
                    drawerIcon={false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.goBack()
                    }}
                />
                {load ? (
                    <View style={{ flex: 1 }}>
                        <>
                            {planData.length > 0 ? (
                                <ScrollView>
                                    <View style={{ flex: 1, marginTop: scale(7) }}>
                                        <FlatList
                                            data={planData}
                                            renderItem={({ item }) => <PlanItem item={item} />}
                                            keyExtractor={item => item.id}
                                            vertical
                                            style={{ flex: 1 }}
                                        />
                                    </View>
                                </ScrollView>
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, alignSelf: 'center' }}>
                                    <View style={{ backgroundColor: "#fff", width: scale(230), padding: scale(10) }}>
                                        <Text style={{ fontFamily: Globalinclude.GlobalFont.Medium, color: Globalinclude.GlobalColor.themeBlue, fontSize: scale(16), textAlign: "center" }}>No data.. </Text>
                                    </View>
                                    <View style={{ marginTop: scale(20) }}>
                                        <Globalinclude.GlobalButton text={'Go To Home'}
                                            style={{ paddingHorizontal: scale(50), borderRadius: scale(10) }}
                                            onPress={() => {
                                                props.navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 1,
                                                        routes: [{ name: "Dashboard" }],
                                                    }));
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </>
                    </View>
                ) : <View style={{ alignItems: "center", flexDirection: "row", flex: 1, justifyContent: "center", marginBottom: scale(30) }}>
                    <Text style={{ fontSize: scale(20), fontFamily: Globalinclude.GlobalFont.Medium, color: Globalinclude.GlobalColor.themeGray }}>
                        Loading
                    </Text>
                    <AnimatedEllipsis
                        style={{ fontSize: scale(35), marginTop: -14, color: Globalinclude.GlobalColor.themeGray }}
                    />
                </View>}
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    heading: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(17),
        color: '#000'
    },
    description: { fontFamily: Globalinclude.GlobalFont.Regular, fontSize: scale(14), },
    dateTime: {
        fontFamily: Globalinclude.GlobalFont.Regular,
        fontSize: scale(10), color: Globalinclude.GlobalColor.themeBlue,
    },
    title: {
        fontFamily: Globalinclude.GlobalFont.Medium,
        fontSize: scale(15),
        color: Globalinclude.GlobalColor.themeBlack,
        paddingVertical: scale(3),
    },
    messageText: {
        fontFamily: Globalinclude.GlobalFont.Medium,
        fontSize: scale(13),
        color: Globalinclude.GlobalColor.themeBlack,
    },
    baseView: {
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: scale(10),
        padding: scale(10),
        elevation: 5,
        shadowColor: Globalinclude.GlobalColor.themeColor,
        shadowRadius: 10,
        shadowOpacity: 1,
    },
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(PlanHistory);