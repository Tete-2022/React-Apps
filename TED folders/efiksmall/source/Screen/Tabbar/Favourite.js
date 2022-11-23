import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ScrollView, Animated, RefreshControl } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_URL } from '../../Global/Helper/Const';
import helpers from '../../Global/Helper/Helper';
import DeviceInfo from 'react-native-device-info';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
let deviceId = DeviceInfo.getDeviceId();
const Favourite = (props) => {
    const [btnName, setBtnName] = useState(global.language)
    const [language, setLanguage] = useState(global.language_id)
    const [word, setWord] = useState("")
    const [wordId, setWordId] = useState(0)
    const [wordData, setWordData] = useState([])
    const [wordDataLatest, setWordDataLatest] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showText, setShowText] = useState(true);
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    const [isLoad, setIsLoad] = useState(false)
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        getWords(language, "")
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    useEffect(() => {        
        const interval = setInterval(() => {
            setShowText((showText) => !showText);
        }, 3000);
        getWords(language, "")
        global.isFrom = "";
        setWordId(0)
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
            global.isFrom = "";
            getWords(global.language_id, "")
            setWordId(0)
            setBtnName('efik')
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
            unsubscribe(), clearInterval(interval)
        };
    }, [])
    const handleIndexChange = (index) => {
        setSelectedIndex(index);
        setWordId(0)
    };
    const getWords = (language) => {
        setIsLoad(false)
        var formdata = new FormData();
        formdata.append('user_id', global.user_id_val ? JSON.parse(global.user_id_val) : deviceId)
        formdata.append('language', language)
        fetch(APP_URL + 'get_favorite_word', {
            body: formdata,
            method: "POST",
        })
            .then((response) => response.json()).then((response) => {
                if (response.status) {
                    console.log(response);
                    if (response.words_latest && response.words) {
                        setWordData(response.words)
                        setWordDataLatest(response.words_latest)
                        setTimeout(() => {
                            setIsLoad(true)
                        }, 150);
                    }
                    else {
                        setWordData(null)
                        setWordDataLatest(null)
                        setIsLoad(true)
                    }
                } else {
                    setIsLoad(true)
                }
            }).catch((c) => {
                setIsLoad(true)
            }).finally((f) => {
                setIsLoad(true)
            })
    }
    const addToFav = (word_id) => {
        global.global_loader_ref.show_loader(1);
        var formdata = new FormData()
        let data_id = global.user_id_val ? JSON.parse(global.user_id_val) : deviceId;
        formdata.append('user_id', data_id)
        formdata.append('word_id', word_id)
        formdata.append('language', language)
        console.log(formdata);
        fetch(APP_URL + 'add_favorite', {
            body: formdata,
            method: "POST"
        }).then((response) => response.json()).then((res) => {
            console.log(res);
            global.global_loader_ref.show_loader(0);
            if (res.status) {
                global.global_loader_ref.show_loader(0);
                getWords(language)
                Globalinclude.showToast(res.message)
            } else {
                global.global_loader_ref.show_loader(0);
                Globalinclude.showError(res.message)
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
            {isLoad ? (
                <>
                    {wordData.length > 0 && wordDataLatest.length > 0 ? (
                        <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                            <Globalinclude.GlobalHeader name={'Favourite'}
                                drawerIcon={true}
                                onPressDrawer={() => {
                                    props.navigation.openDrawer()
                                }
                                }
                                onPressNotification={() => {
                                    props.navigation.navigate('Notification')
                                }}
                            />
                            <View style={{ marginHorizontal: scale(13), flexDirection: "row", marginBottom: scale(15), marginTop: scale(20) }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setBtnName("efik")
                                        setLanguage(2)
                                        getWords(2, "")
                                        global.language = "efik"
                                        global.language_id = 2
                                        helpers.storeData("language", "efik")
                                        helpers.storeData("language_id", "2")
                                    }}
                                    style={[styles.btnStyle, {
                                        backgroundColor: global.language === 'efik' ? Globalinclude.GlobalColor.lightTheme : Globalinclude.GlobalColor.lightColor,
                                        borderTopLeftRadius: scale(20), borderBottomLeftRadius: scale(20),
                                        flexDirection: "row"
                                    }]}
                                >
                                    {global.language === 'efik' ? (
                                        <Image source={Globalinclude.GlobalAssets.check}
                                            style={{ height: scale(14), width: scale(20), resizeMode: "contain", marginRight: scale(3) }}
                                        />
                                    ) : null}
                                    <Text style={[styles.btnText, { color: global.language === 'efik' ? 'white' : Globalinclude.GlobalColor.themeBlack }]}>EFIK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnStyle, {
                                    backgroundColor: global.language === 'english' ? Globalinclude.GlobalColor.lightTheme : Globalinclude.GlobalColor.lightColor, flexDirection: "row",
                                    borderTopRightRadius: scale(20), borderBottomRightRadius: scale(20)
                                }]}
                                    onPress={() => {
                                        setBtnName("english")
                                        setLanguage(1)
                                        getWords(1, "")
                                        global.language = "english"
                                        global.language_id = 1
                                        helpers.storeData("language", "english")
                                        helpers.storeData("language_id", "1")
                                    }}
                                >
                                    {global.language === 'english' ? (
                                        <Image source={Globalinclude.GlobalAssets.check}
                                            style={{ height: scale(14), width: scale(20), resizeMode: "contain", marginRight: scale(3) }}
                                        />
                                    ) : null}
                                    <Text style={[styles.btnText, { color: global.language === 'english' ? 'white' : Globalinclude.GlobalColor.themeBlack }]}>ENGLISH</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <SegmentedControlTab
                                    values={["Latest", " Alphabetical"]}
                                    selectedIndex={selectedIndex}
                                    onTabPress={handleIndexChange}
                                    tabsContainerStyle={styles.tabContainer}
                                    firstTabStyle={{
                                        borderRightWidth: 0,
                                        marginRight: scale(2)
                                    }}
                                    tabStyle={styles.tabstyle}
                                    activeTabStyle={[
                                        styles.tabstyle,
                                        {
                                            borderColor: Globalinclude.GlobalColor.themeColor,
                                        },
                                    ]}
                                    tabTextStyle={[styles.tabtextStyle, { color: scheme == 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack }]}
                                    activeTabTextStyle={styles.activeTabText}
                                />
                            </View>
                            {selectedIndex === 0 ? (
                                <ScrollView refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }>
                                    <View style={{ marginTop: scale(6) }}>
                                        {wordDataLatest !== null && wordDataLatest !== undefined ? (
                                            <View >
                                                {wordDataLatest.map((item) => {
                                                    return (
                                                        <>
                                                            {language == "1" ? (
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                                    <TouchableOpacity
                                                                        activeOpacity={0.1}
                                                                        onPress={() => {
                                                                            setWord(item.word)
                                                                            setWordId(item.efik_word_id)
                                                                            if (item.word_id !== null) {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            } else {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.efik_word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            }
                                                                        }}
                                                                        style={[styles.wordStyle, {
                                                                            // backgroundColor: item.efik_word_id === wordId ? scheme === 'dark' ? '#0000008a' : '#dadada' : 'transparent',
                                                                            borderRadius: item.efik_word_id === wordId ? scale(20) : scale(0), width: scale(100)
                                                                        }]}
                                                                    >
                                                                        <Text
                                                                            numberOfLines={1}
                                                                            style={[styles.itemName, { color: scheme == 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack }]}>
                                                                            {item.word}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                        addToFav(item.efik_word_id)
                                                                    }} style={{ marginRight: scale(15) }}>
                                                                        <Image
                                                                            source={Globalinclude.GlobalAssets.favouriteFill}
                                                                            style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            ) : (
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            setWord(item.word)
                                                                            setWordId(item.word_id)
                                                                            if (item.word_id !== null) {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            } else {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.efik_word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            }
                                                                        }}
                                                                        style={[styles.wordStyle, {
                                                                            // backgroundColor:
                                                                            //     item.word_id === wordId ? scheme === 'dark' ? '#0000008a' : '#dadada' : 'transparent', 
                                                                            borderRadius: item.word_id === wordId ? scale(20) : scale(0),
                                                                        }]}
                                                                    >
                                                                        <Text style={[styles.itemName, { color: scheme == 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack }]}>
                                                                            {item.word}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                        addToFav(item.word_id)
                                                                    }} style={{ marginRight: scale(15) }}>
                                                                        <Image
                                                                            source={Globalinclude.GlobalAssets.favouriteFill}
                                                                            style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )}
                                                        </>
                                                    )
                                                })}
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>
                            ) :
                                null}
                            {selectedIndex === 1 ? (
                                <ScrollView refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }>
                                    <View style={{ marginTop: scale(6) }}>
                                        {wordData !== null && wordData !== undefined ? (
                                            <View>
                                                {wordData.map((item) => {
                                                    return (
                                                        <>
                                                            {language == "1" ? (
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                                    <TouchableOpacity
                                                                        activeOpacity={0.1}
                                                                        onPress={() => {
                                                                            setWord(item.word)
                                                                            setWordId(item.efik_word_id)
                                                                            if (item.word_id !== null) {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            } else {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.efik_word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            }
                                                                        }}
                                                                        style={[styles.wordStyle, {
                                                                            // backgroundColor: item.efik_word_id === wordId ? scheme === 'dark' ? '#0000008a' : '#dadada' : 'transparent',
                                                                            borderRadius: item.efik_word_id === wordId ? scale(20) : scale(0),
                                                                        }]}
                                                                    >
                                                                        <Text style={[styles.itemName, { color: scheme == 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack }]}>
                                                                            {item.word}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                        addToFav(item.efik_word_id)
                                                                    }} style={{ marginRight: scale(15) }}>
                                                                        <Image
                                                                            source={Globalinclude.GlobalAssets.favouriteFill}
                                                                            style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            ) : (
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            setWord(item.word)
                                                                            setWordId(item.word_id)
                                                                            if (item.word_id !== null) {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            } else {
                                                                                setTimeout(() => {
                                                                                    props.navigation.navigate('SearchDetail', { word_id: item.efik_word_id, word_name: item.word, id_language: language })
                                                                                }, 100);
                                                                            }
                                                                        }}
                                                                        style={[styles.wordStyle, {
                                                                            // backgroundColor: item.word_id === wordId ? scheme === 'dark' ? '#0000008a' : '#dadada' : 'transparent',
                                                                            borderRadius: item.word_id === wordId ? scale(20) : scale(0),
                                                                        }]}
                                                                    >
                                                                        <Text style={[styles.itemName, { color: scheme == 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack }]}>
                                                                            {item.word}
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => {
                                                                        addToFav(item.word_id)
                                                                    }} style={{ marginRight: scale(15) }}>
                                                                        <Image
                                                                            source={Globalinclude.GlobalAssets.favouriteFill}
                                                                            style={{ height: scale(22), width: scale(22), resizeMode: "contain" }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )}
                                                        </>
                                                    )
                                                })}
                                            </View>
                                        ) : null}
                                    </View>
                                </ScrollView>
                            ) : null}
                        </View>
                    ) :
                        <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                            <Globalinclude.GlobalHeader name={'Favourite'}
                                drawerIcon={true}
                                onPressDrawer={() => {
                                    props.navigation.openDrawer()
                                }
                                }
                                onPressNotification={() => {
                                    props.navigation.navigate('Notification')
                                }}
                            />
                            <View style={{ marginHorizontal: scale(13), flexDirection: "row", marginBottom: scale(15), marginTop: scale(20) }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setBtnName("efik")
                                        setLanguage(2)
                                        getWords(2, "")
                                        global.language = "efik"
                                        global.language_id = 2
                                        helpers.storeData("language", "efik")
                                        helpers.storeData("language_id", "2")
                                    }}
                                    style={[styles.btnStyle, {
                                        backgroundColor: global.language === 'efik' ? Globalinclude.GlobalColor.lightTheme : Globalinclude.GlobalColor.lightColor,
                                        borderTopLeftRadius: scale(20), borderBottomLeftRadius: scale(20),
                                        flexDirection: "row"
                                    }]}
                                >
                                    {global.language === 'efik' ? (
                                        <Image source={Globalinclude.GlobalAssets.check}
                                            style={{ height: scale(14), width: scale(20), resizeMode: "contain", marginRight: scale(3) }}
                                        />
                                    ) : null}
                                    <Text style={[styles.btnText, { color: global.language === 'efik' ? 'white' : Globalinclude.GlobalColor.themeBlack }]}>EFIK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnStyle, {
                                    backgroundColor: global.language === 'english' ? Globalinclude.GlobalColor.lightTheme : Globalinclude.GlobalColor.lightColor, flexDirection: "row",
                                    borderTopRightRadius: scale(20), borderBottomRightRadius: scale(20)
                                }]}
                                    onPress={() => {
                                        setBtnName("english")
                                        setLanguage(1)
                                        getWords(1, "")
                                        global.language = "english"
                                        global.language_id = 1
                                        helpers.storeData("language", "english")
                                        helpers.storeData("language_id", "1")
                                    }}
                                >
                                    {global.language === 'english' ? (
                                        <Image source={Globalinclude.GlobalAssets.check}
                                            style={{ height: scale(14), width: scale(20), resizeMode: "contain", marginRight: scale(3) }}
                                        />
                                    ) : null}
                                    <Text style={[styles.btnText, { color: global.language === 'english' ? 'white' : Globalinclude.GlobalColor.themeBlack }]}>ENGLISH</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <SegmentedControlTab
                                    values={["Latest", " Alphabetical"]}
                                    selectedIndex={selectedIndex}
                                    onTabPress={handleIndexChange}
                                    tabsContainerStyle={styles.tabContainer}
                                    firstTabStyle={{
                                        borderRightWidth: 0,
                                        marginRight: scale(2)
                                    }}
                                    tabStyle={styles.tabstyle}
                                    activeTabStyle={[
                                        styles.tabstyle,
                                        {
                                            borderColor: Globalinclude.GlobalColor.themeColor,
                                        },
                                    ]}
                                    tabTextStyle={[styles.tabtextStyle, { color: scheme == 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack }]}
                                    activeTabTextStyle={styles.activeTabText}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                <Image
                                    source={Globalinclude.GlobalAssets.noFav}
                                    borderRadius={50}
                                    style={{
                                        height: scale(60),
                                        width: scale(60),
                                        borderRadius: scale(10),
                                        resizeMode: "contain"
                                    }}
                                />
                                <View style={{ width: scale(230), padding: scale(20) }}>
                                    <Text style={{ fontFamily: Globalinclude.GlobalFont.Medium, color: scheme === 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlue, fontSize: scale(16), textAlign: "center" }}>No Favourites Yet!</Text>
                                </View>
                            </View>
                        </View>
                    }
                </>
            ) : (
                <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                    <Globalinclude.GlobalHeader name={'Favourite'}
                        drawerIcon={true}
                        onPressDrawer={() => {
                            props.navigation.openDrawer()
                        }
                        }
                        onPressNotification={() => {
                            props.navigation.navigate('Notification')
                        }}
                    />
                    <View style={{ marginHorizontal: scale(13), flexDirection: "row", marginBottom: scale(15), marginTop: scale(20) }}>
                        <TouchableOpacity
                            onPress={() => {
                                global.isFrom = "";
                                setBtnName("efik")
                                setLanguage(2)
                                getWords(2, "")
                                global.language = "efik"
                                global.language_id = 2;
                                helpers.storeData("language", "efik")
                                helpers.storeData("language_id", "2")
                            }}
                            style={[styles.btnStyle, {
                                backgroundColor: global.language === 'efik' ? Globalinclude.GlobalColor.lightTheme : Globalinclude.GlobalColor.lightColor,
                                borderTopLeftRadius: scale(20), borderBottomLeftRadius: scale(20),
                                flexDirection: "row"
                            }]}
                        >
                            {global.language === 'efik' ? (
                                <Image source={Globalinclude.GlobalAssets.check}
                                    style={{ height: scale(14), width: scale(20), resizeMode: "contain", marginRight: scale(3) }}
                                />
                            ) : null}
                            <Text style={[styles.btnText, { color: global.language === 'efik' ? 'white' : Globalinclude.GlobalColor.themeBlack }]}>EFIK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnStyle, {
                            backgroundColor: global.language === 'english' ? Globalinclude.GlobalColor.lightTheme : Globalinclude.GlobalColor.lightColor, flexDirection: "row",
                            borderTopRightRadius: scale(20), borderBottomRightRadius: scale(20)
                        }]}
                            onPress={() => {
                                global.isFrom = "";
                                setBtnName("english")
                                setLanguage(1)
                                getWords(1, "")
                                global.language = "english"
                                global.language_id = 1;
                                helpers.storeData("language", "english")
                                helpers.storeData("language_id", "1")
                            }}
                        >
                            {global.language === 'english' ? (
                                <Image source={Globalinclude.GlobalAssets.check}
                                    style={{ height: scale(14), width: scale(20), resizeMode: "contain", marginRight: scale(3) }}
                                />
                            ) : null}
                            <Text style={[styles.btnText, { color: global.language === 'english' ? 'white' : Globalinclude.GlobalColor.themeBlack }]}>ENGLISH</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <SegmentedControlTab
                            values={["Latest", " Alphabetical"]}
                            selectedIndex={selectedIndex}
                            onTabPress={handleIndexChange}
                            tabsContainerStyle={styles.tabContainer}
                            firstTabStyle={{
                                borderRightWidth: 0,
                                marginRight: scale(2)
                            }}
                            tabStyle={styles.tabstyle}
                            activeTabStyle={[
                                styles.tabstyle,
                                {
                                    borderColor: Globalinclude.GlobalColor.themeColor,
                                },
                            ]}
                            tabTextStyle={[styles.tabtextStyle, { color: scheme == 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack }]}
                            activeTabTextStyle={styles.activeTabText}
                        />
                    </View>
                    <View style={{ alignItems: "center", flexDirection: "row", flex: 1, justifyContent: "center", marginBottom: scale(30) }}>
                        <Text style={{ fontSize: scale(20), fontFamily: Globalinclude.GlobalFont.Medium, color: Globalinclude.GlobalColor.themeGray }}>
                            Loading
                        </Text>
                        <AnimatedEllipsis
                            style={{ fontSize: scale(35), marginTop: -14, color: Globalinclude.GlobalColor.themeGray }}
                        />
                    </View>
                </View>
            )}
        </ImageBackground >
    )
}
const styles = StyleSheet.create({
    heading: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(17),
    },
    description: { fontFamily: Globalinclude.GlobalFont.Regular, fontSize: scale(14), color: Globalinclude.GlobalColor.themeGray },
    learnMoreView: { flexDirection: "row", alignItems: "center", paddingTop: scale(20), justifyContent: "space-between" },
    learnMore: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14), color: Globalinclude.GlobalColor.themeColor, marginRight: scale(6)
    },
    volumeBase: { backgroundColor: Globalinclude.GlobalColor.themeColor, height: scale(40), paddingHorizontal: scale(10), alignItems: "center", justifyContent: "center", borderBottomEndRadius: scale(17) },
    imgSize: { height: scale(22), width: scale(22), resizeMode: "contain" },
    innerView: { backgroundColor: '#e3e3e3', margin: scale(10), borderRadius: scale(20), paddingTop: scale(20) },
    // f0eded
    btnText: { color: 'white', fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(15) },
    btnStyle: {
        width: '50%', alignItems: "center", justifyContent: 'center',
        height: scale(43)
    },
    itemName: {
        fontFamily: Globalinclude.GlobalFont.Regular,
        fontSize: scale(16),
        color: Globalinclude.GlobalColor.themeBlack, width: scale(270),
    },
    wordStyle: {
        marginHorizontal: scale(10), paddingVertical: scale(9), paddingHorizontal: scale(10),
        justifyContent: "space-between", flexDirection: "row", alignItems: "center",
    }, tabContainer: {
        marginHorizontal: scale(0),
        marginVertical: scale(15),
    },
    tabstyle: {
        borderColor: '#DADADA',
        borderWidth: 0,
        borderBottomWidth: 2,
        backgroundColor: "transparent",
    },
    tabtextStyle: {
        fontFamily: Globalinclude.GlobalFont.Medium,
        color: Globalinclude.GlobalColor.themeBlack,
        fontSize: scale(15),
    },
    activeTabText: {
        fontFamily: Globalinclude.GlobalFont.Medium,
        color: Globalinclude.GlobalColor.themeColor,
        fontSize: scale(15),
    },
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(Favourite);