import React, { useState, useEffect, useCallback, useRef, useMemo, } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground, Modal, KeyboardAvoidingView, Keyboard, Alert, Linking, FlatList, Pressable, Platform } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import Sound from 'react-native-sound'
import { connect, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
// import { TestIds, RewardedAd, RewardedAdEventType } from '@react-native-firebase/admob';

import { TestIds, useRewardedAd } from 'react-native-google-mobile-ads'
import { androidRewardAdId, APP_URL, iosRewardAdId } from '../../Global/Helper/Const';

import helpers from '../../Global/Helper/Helper';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import HTMLView from 'react-native-htmlview';
import debounce from "lodash.debounce";
import useWords from '../../hooks/useWords';
import LottieView from 'lottie-react-native';

let timeout = null;

// const adUnitId = "ca-app-pub-3940256099942544/5224354917" // Test ADs

const adUnitId = __DEV__
    ? "ca-app-pub-3940256099942544/5224354917" // Test Ad ID
    : Platform.OS=='android'
        ? androidRewardAdId // live android ad ID
        : iosRewardAdId; // live iOS ad ID

const Home = (props) => {
    const { navigation, route } = props

    const hasActivePlan = useRef(false)
    const {
        // isClicked,
        isClosed,
        isLoaded,
        // isOpened,
        isShowing,
        load,
        show,
        error,
        // isEarnedReward,
        // reward
    } = useRewardedAd(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['eduction', 'books'],
    })

    useEffect(() => {
        if (isClosed && !hasActivePlan.current) {
            load()
        }
    }, [isClosed, load])

    const intervalCallback = useCallback(() => {
        console.log('interval called : ', isLoaded, hasActivePlan.current, global.token_val)
        if (isLoaded && !hasActivePlan.current && !isShowing) {
            show()
        }
    }, [isLoaded, show, isShowing])

    useEffect(() => {
        let intervalId = -1;
        if (!hasActivePlan.current) {
            intervalId = setInterval(intervalCallback, 60000)
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [intervalCallback])

    const openOrClose = useIsDrawerOpen()

    const {
        data,
        endReached,
        getWords,
        fetchMore,
        clearSearchResults
    } = useWords()
    const [wordId, setWordId] = useState("")
    const [btnName, setBtnName] = useState(global.language)
    const [language, setLanguage] = useState(global.language_id)
    const [wordData, setWordData] = useState([])
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    const [homedata, setHomeData] = useState()
    const [selectedName, setselectedName] = useState('')
    const [searchText, setSearchText] = useState("")
    const [err, setErr] = useState('')

    useEffect(() => {
        getHomeData("")
        setSearchText("")
        getSetting()
        global.isFrom = "";
        // setWordData([])
        // getWords(global.language_id, "")
        clearSearchResults()
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
        const unsubscribe = navigation.addListener('focus', () => {
            global.isFrom = "";
            setSearchText("")
            getHomeData("")
            setBtnName("efik")
            setLanguage(global.language_id)
            getSetting()
            clearSearchResults()
            // getWords(global.language_id, "")
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
            clearInterval(timeout)
        };
    }, [])

    const getSetting = () =>{
        let headers = {
          'Authorization': 'Bearer ' + global.token_val
        }
        global.global_loader_ref.show_loader(1);
        fetch(APP_URL + 'setting' ,{
          method: "POST",
          headers: headers,
        })
        .then((response) => response.json())
        .then((response) => {
            global.global_loader_ref.show_loader(0);
            // console.log("MENU STATUS",response.data.app_menu_status)
            if (response.status) {                              
                global.setting_menu = response.data.app_menu_status;
            }
        }).catch((c) => {
            console.log("SETTING API ERROR",c)
            global.global_loader_ref.show_loader(0);
        })
    }

    const getProfile = () => {
        let headers = {
            'Authorization': 'Bearer ' + global.token_val
        }
        global.global_loader_ref.show_loader(1);
        fetch(APP_URL + 'edit_user/' + global.user_id_val, {
            method: "PUT",
            headers: headers,
        })
            .then((response) => response.json())
            .then((response) => {
                global.global_loader_ref.show_loader(0);
                console.log('response : ', response)
                if (response.status) {
                    if (response.plan) {
                        if (response.plan.subscription_status === 'active') {
                            hasActivePlan.current = true
                        } else {
                            load()
                        }
                    } else {
                        load()
                        // timeout = setInterval(() => {
                        // }, 600000);
                        // showRewardAd()
                    }
                } else {
                    load()
                }
            })
            .catch(err => {
                global.global_loader_ref.show_loader(0);
                console.log('getProfile Error : ', err?.message)
            })
    }

    useEffect(() => {
        if (global.token_val) {
            getProfile()
        } else {
            console.log('load ad from useEffect as no user logged In')
            load()
        }
    }, [])

    const getHomeData = (searchtext) => {
        var formdata = new FormData()
        formdata.append('search', searchtext)
        
        global.global_loader_ref.show_loader(1);
        fetch(APP_URL + 'word_of_day', {
            method: 'POST',
            body: formdata
        })
        .then((res) => res.json())
        .then((response) => {
            global.global_loader_ref.show_loader(0);
            if (response.status) {
                setHomeData(response.data)
            } else {
                setHomeData(null)
            }
        })
        .catch((c) => {   
            global.global_loader_ref.show_loader(0);
        })
    }

    const playSounds = (audio) => {
        global.global_loader_ref.show_loader(1);
        const track = new Sound(audio, null, (e) => {
            global.global_loader_ref.show_loader(0);
            if (e) {
                console.log(e, "error sound");
                global.global_loader_ref.show_loader(0);
                return
            }
            global.global_loader_ref.show_loader(0);
            track.play((success) => {
                console.log('success : ', success)
            })
        })
    }

    const debounceGetWords = useRef(debounce((...nextValues) => {
        getWords(...nextValues)
    }, 800)).current

    const drawerIconPressHandler = useCallback(() => {
        if (openOrClose) {
            setSearchText("")
            // getWords(global.language_id, "")
            navigation.openDrawer()
        } else {
            setSearchText("")
            // getWords(global.language_id, "")
            navigation.openDrawer()
        }
    }, [navigation])

    const notificationIconPressHandler = useCallback(() => {
        navigation.navigate('Notification')
    }, [navigation])

    const renderFooter = useMemo(() => {
        if (!endReached) {
            return (
                <View
                    style={{
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LottieView
                        source={Globalinclude.GlobalAssets.AnimatedLoader}
                        autoPlay
                        loop
                        style={{
                            height: scale(100),
                            width: scale(150),
                            alignSelf: "center",
                        }}
                    />
                </View>
            );
        } else {
            return null;
        }
    }, [endReached]);

    const renderListItemHandler = useCallback(({item, index}) => {
        try {
            return (
                <TouchableOpacity
                    key={index.toString()}
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 2,
                        borderStyle: "solid",
                        borderColor: "#ecf0f1",
                    }}
                    onPress={() => {
                        setTimeout(() => {
                            navigation.navigate('SearchDetail', {
                                word_id: item.id,
                                word_name: item.word,
                                id_language: global.language_id
                            })
                        }, 150);
                    }}
                >
                    <Text
                        style={{
                            fontFamily: Globalinclude.GlobalFont.Regular,
                            color: scheme === 'dark' ? "#fff" : Globalinclude.GlobalColor.themeBlack,
                            fontSize: scale(15)
                        }}
                    >
                        {item.word}
                    </Text>
                </TouchableOpacity>
            )
        } catch (err) {
            console.log('[renderListItemHandler] Error : ', err.message)
            return null
        }
    }, [navigation])

    const keyExtractorHandler = useCallback((_, index) => index.toString(), [])

    return (
        <ImageBackground
            source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View
                style={{
                    flexGrow: 1,
                    backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)'
                }}
            >
                <Globalinclude.GlobalHeader
                    name={'Home'}
                    drawerIcon={true}
                    onPressDrawer={drawerIconPressHandler}
                    onPressNotification={notificationIconPressHandler}
                />
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            marginHorizontal: scale(13),
                            marginVertical: scale(15)
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setBtnName("efik")
                                setLanguage(2)
                                clearSearchResults()
                                // getWords(2, "")
                                global.language = "efik"
                                global.isFrom = "";
                                global.language_id = 2
                                helpers.storeData("language", "efik")
                                helpers.storeData("language_id", "2")
                                setSearchText("")
                                setselectedName("")
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
                            backgroundColor: global.language === "english" ? Globalinclude.GlobalColor.lightTheme : Globalinclude.GlobalColor.lightColor, flexDirection: "row",
                            borderTopRightRadius: scale(20), borderBottomRightRadius: scale(20)
                        }]}
                            onPress={() => {
                                setBtnName("english")
                                setLanguage(1)
                                // getWords(1, "")
                                clearSearchResults()
                                global.language = "english"
                                global.language_id = 1;
                                global.isFrom = "";
                                helpers.storeData("language", "english")
                                helpers.storeData("language_id", "1")
                                setSearchText("")
                                setselectedName("")
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
                    <Globalinclude.GlobalTextBox
                        searchIcon={true}
                        placeholder="Search"
                        onChangeText={value => {
                            setSearchText(value)
                            if (value) {
                                debounceGetWords(global.language_id, value)
                            } else {
                                clearSearchResults()
                            }
                        }}
                        textInputStyle={{
                            color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                        }}
                        value={searchText}
                        onSubmitEditing={() => {
                            debounceGetWords(global.language_id, searchText)
                            Keyboard.dismiss()
                        }}
                        onPressSearch={() => {
                            debounceGetWords(global.language_id, searchText)
                        }}
                    />
                </>
                {
                    data?.length && searchText ? (
                        <View
                            style={{
                                flexGrow: 1,
                                paddingHorizontal: scale(10),
                                marginBottom: scale(0),
                                height: scale(150)
                            }}
                        >
                            <FlatList
                                data={data}
                                renderItem={renderListItemHandler}
                                keyExtractor={keyExtractorHandler}
                                // style={{ flex: 1}}
                                ListFooterComponent={renderFooter}
                                onEndReached={fetchMore.bind(null, language, searchText)}
                                onEndReachedThreshold={0.01}
                            />
                        </View>
                    ) : null
                }
                {searchText && err ? (
                    <View style={{ flex: 1, alignItems: "center", marginTop: scale(-5) }}>
                        <Text style={[styles.btnText, { color: Globalinclude.GlobalColor.themeBlue, fontFamily: Globalinclude.GlobalFont.Regular }]}>{err}</Text>
                    </View>
                ) : null}
                <View style={{ marginTop: scale(30) }}>
                    <Globalinclude.GlobalText text={'Word of the day'.toLocaleUpperCase()} style={{ color: scheme === 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack, fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(15) }} />
                </View>
                {homedata ? (
                    <View style={{ marginVertical: scale(10) }}>
                        <View style={styles.innerView}>
                            <View style={{ paddingHorizontal: scale(20), }}>
                                <Text style={styles.heading}>{homedata?.word}</Text>
                                {homedata?.more_word.length > 0 ? (
                                    <>
                                        <Text style={[styles.description, {
                                            color: scheme === 'dark' ?
                                                Globalinclude.GlobalColor.themeBlack :
                                                Globalinclude.GlobalColor.themeBlack
                                        }]}>{homedata?.accents} {!homedata?.more_word[0]?.phenomic_transaction && !homedata?.more_word[0]?.accents ? '' : '|'} {homedata?.more_word[0]?.phenomic_transaction} </Text>
                                        {/* <Text
                                            numberOfLines={1}
                                            style={[styles.description, { color: "#7A7A7A", paddingVertical: scale(3) }]}>{homedata?.more_word[0]?.definition}</Text> */}
                                        <HTMLView
                                            textComponentProps={{
                                                style: {
                                                    fontSize: scale(15),
                                                    color: scheme === 'dark' ?
                                                        '#000' :
                                                        Globalinclude.GlobalColor.themeBlack,
                                                    fontFamily: Globalinclude.GlobalFont.Regular,
                                                    height: scale(21),
                                                    flexWrap: 'wrap',
                                                    width: scale(300),
                                                }
                                            }}
                                            addLineBreaks={false}
                                            value={homedata?.more_word[0]?.definition}></HTMLView>
                                    </>
                                ) : null}
                            </View>
                            <TouchableOpacity style={styles.learnMoreView}
                                onPress={() => {
                                    navigation.navigate('SearchDetail', { word_id: homedata?.word_id, word_name: homedata?.word, id_language: 2 })
                                }}
                                activeOpacity={0.6}
                            >
                                <View style={{ flexDirection: "row", paddingLeft: scale(20), paddingBottom: scale(10) }}>
                                    <Text style={styles.learnMore}>Learn More</Text>
                                    <Image style={styles.imgSize}
                                        source={Globalinclude.GlobalAssets.rightArrow}
                                    />
                                </View>
                                <TouchableOpacity style={styles.volumeBase}
                                    onPress={() => {
                                        if (!homedata?.audio) {
                                            Globalinclude.showError('Audio Not Available')
                                        } else {
                                            playSounds(homedata?.audio)
                                        }
                                    }}
                                >
                                    <Image style={styles.imgSize}
                                        source={Globalinclude.GlobalAssets.volume}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(18),
    },
    description: { fontFamily: Globalinclude.GlobalFont.Regular, fontSize: scale(15), color: Globalinclude.GlobalColor.themeGray },
    learnMoreView: { flexDirection: "row", alignItems: "center", paddingTop: scale(20), justifyContent: "space-between" },
    learnMore: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14), color: Globalinclude.GlobalColor.themeColor, marginRight: scale(6)
    },
    volumeBase: { backgroundColor: Globalinclude.GlobalColor.themeColor, height: scale(40), paddingHorizontal: scale(10), alignItems: "center", justifyContent: "center", borderBottomEndRadius: scale(17) },
    imgSize: { height: scale(22), width: scale(22), resizeMode: "contain" },
    innerView: { backgroundColor: '#FAE3E3', margin: scale(10), borderRadius: scale(20), paddingTop: scale(20) },
    // f0eded
    btnText: { color: 'white', fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(15) },
    btnStyle: {
        width: '50%', alignItems: "center", justifyContent: 'center',
        height: scale(43)
    }, li: {
        borderRadius: scale(18),
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(18), color: Globalinclude.GlobalColor.themeGray, },
    h3: { fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(18), color: Globalinclude.GlobalColor.themeGray, },
    h2: { fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(18), color: Globalinclude.GlobalColor.themeGray, },
    p: {
        fontFamily: Globalinclude.GlobalFont.Regular,
        fontSize: scale(14),
        color: Globalinclude.GlobalColor.themeGray,
    },
    span: {
        fontFamily: Globalinclude.GlobalFont.Regular,
        fontSize: scale(14),
        color: Globalinclude.GlobalColor.themeGray,
    }, b: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14),
    },
    h1: {
        fontFamily: Globalinclude.GlobalFont.Bold, fontSize: scale(14),
    }, h2: {
        fontFamily: Globalinclude.GlobalFont.Bold, fontSize: scale(14),
    },
    i: {
        fontFamily: Globalinclude.GlobalFont.Italic, fontSize: scale(14),
    },
})

const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
    notificationCount: {
        apps: state.apps.notificationCount,
    },
});

const mapDispatchToProps = (dispatch) => {
    dispatch({ type: "APPS.NOTIFICATIONCOUNT" });
    return {
        // dispatching plain actions
        appNotificationCount: dispatch({ type: "APPS.NOTIFICATIONCOUNT" })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
