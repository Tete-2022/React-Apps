import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions, Linking, Alert, BackHandler } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import Tts from 'react-native-tts';

import { APP_URL, PACKAGE_NAME } from '../../Global/Helper/Const';
import Share from "react-native-share";
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import HTMLView from 'react-native-htmlview';
import { useWindowDimensions } from 'react-native';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import DeviceInfo from 'react-native-device-info';
var Sound = require('react-native-sound');
Sound.setCategory('Playback');
let deviceId = DeviceInfo.getDeviceId();
let scheme = global.theme;
let word_id = "", word_name = '', id_language = '';
const SearchDetail = (props) => {
    const { width } = useWindowDimensions();
    AsyncStorage.getItem("theme").then((value) => {
        global.theme = value
        if (value !== null && value !== undefined) {
            global.theme = value
        } else {
        }
    }).then(() => {
        scheme = global.theme;
    })
    if (props.route.params !== null && props.route.params !== undefined) {
        if (props.route.params.word_id !== null && props.route.params.word_id !== undefined) {
            word_id = props.route.params.word_id
        }
        if (props.route.params.word_name !== null && props.route.params.word_name !== undefined) {
            word_name = props.route.params.word_name
        }
        if (props.route.params.id_language !== null && props.route.params.id_language !== undefined) {
            id_language = props.route.params.id_language
        }
    }
    const [wordDetail, setWordDetail] = useState([])
    const [wordname, setWordName] = useState(word_name)
    const [isFav, setIsFav] = useState(0)
    const [audio, setAudio] = useState('')
    const [isLoad, setIsLoad] = useState(false)
    useEffect(() => {
        getDetail()
        const backAction = () => {
            global.isFrom = 'detail';
            props.navigation.goBack(null)
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        const unsubscribe = props.navigation.addListener('focus', () => {
            getDetail()
        });
        return () => {
            unsubscribe(); backHandler.remove()
        };
    }, [])
    const getDetail = () => {
        setIsLoad(false)
        global.global_loader_ref.show_loader(0);
        var formdata = new FormData();
        formdata.append('word_id', word_id);
        formdata.append('user_id', global.user_id_val ? JSON.parse(global.user_id_val) : deviceId)
        if (id_language == '2') {
            fetch(APP_URL + 'view_efik_word', {
                method: "POST",
                body: formdata,
            })
                .then((response) => response.json()).then((response) => {
                    global.global_loader_ref.show_loader(0);
                    console.log(response.data, "==here");
                    if (response.status) {
                        if (response.data) {
                            word_id = response.data[0].word_id;
                            setWordName(response.data[0].word_name.word)
                            setAudio(response.data[0].audio_file)
                            setWordDetail(response.data)
                            setIsFav(response.data[0].is_favorite)
                            setIsLoad(true)
                            global.global_loader_ref.show_loader(0);
                        }
                        else {
                            setIsLoad(true)
                            global.global_loader_ref.show_loader(0);
                        }
                        global.global_loader_ref.show_loader(0);
                    } else {
                        setWordName(response?.data?.word_name?.word)
                        setIsFav(response.data.is_favorite)
                        setIsLoad(true)
                        global.global_loader_ref.show_loader(0);
                    }
                }).catch((c) => {
                    global.global_loader_ref.show_loader(0);
                }).finally((f) => {
                    global.global_loader_ref.show_loader(0);
                })
        } else {
            fetch(APP_URL + 'view_english_word', {
                method: "POST",
                body: formdata,
            })
                .then((res) => res.json()).then((response) => {
                    global.global_loader_ref.show_loader(0);
                    if (response.status) {
                        setTimeout(() => {
                            setIsLoad(true)
                        }, 150);
                        let arr = [];
                        arr.push(response.data)
                        setWordDetail(arr)
                        setIsFav(response.data.is_favorite)
                        global.global_loader_ref.show_loader(0);
                    } else {
                        global.global_loader_ref.show_loader(0);
                        setIsLoad(true)
                    }
                }).catch((c) => {
                    global.global_loader_ref.show_loader(0);
                }).finally((f) => {
                    global.global_loader_ref.show_loader(0);
                })
        }
    }
    const addToFav = () => {
        let data_id = global.user_id_val ? JSON.parse(global.user_id_val) : deviceId;
        global.global_loader_ref.show_loader(1);
        var formdata = new FormData()
        formdata.append('user_id', data_id)
        formdata.append('word_id', word_id)
        formdata.append('language', id_language)
        console.log(word_id, "==for fav");
        fetch(APP_URL + 'add_favorite', {
            body: formdata,
            method: "POST"
        }).then((response) => response.json()).then((res) => {
            global.global_loader_ref.show_loader(0);
            if (res.status) {
                Globalinclude.showToast(res.message)
                getDetail()
                global.global_loader_ref.show_loader(0);
            } else {
                Globalinclude.showError(res.message)
                global.global_loader_ref.show_loader(0);
            }
        }).catch((c) => {
            global.global_loader_ref.show_loader(0);
        }).finally((f) => {
            global.global_loader_ref.show_loader(0);
        })
    }
    const shareWord = async () => {
        const shareOptions = {
            message: "Find out what " + '"' +
                word_name
                + '"' + " means in Tete's Efik Dictionary app. Download the app here:",
            title: word_name,
            url: "https://play.google.com/store/apps/details?id=" + PACKAGE_NAME,
            failOnCancel: false,
        };
        try {
            const ShareResponse = await Share.open(shareOptions);
        } catch (error) { }
    };
    const playSounds = (audio) => {
        global.global_loader_ref.show_loader(1);
        const track = new Sound(audio, null, (e) => {
            global.global_loader_ref.show_loader(0);
            if (e) {
                console.log(e, "error sound");
                global.global_loader_ref.show_loader(0);
            }
            global.global_loader_ref.show_loader(0);
            track.play()
        })
    }
    return (
        <ImageBackground source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ backgroundColor: "#FAE3E3", height: scale(230) }}>
                <Globalinclude.GlobalHeader name={''}
                    drawerIcon={false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.goBack(null)
                        global.isFrom = 'detail';
                    }}
                />
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1, }}>
                    <Globalinclude.GlobalText text={wordname}
                        underLineNot={true}
                        style={{ color: '#000', fontFamily: Globalinclude.GlobalFont.Bold }}
                    />
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)', marginTop: scale(-20) }}>
                <View style={{ flexDirection: "row", alignSelf: "center", marginTop: scheme === 'dark' ? scale(-20) : scale(-5) }}>
                    {id_language == '2' ? (
                        <TouchableOpacity style={styles.actionBase}
                            onPress={() => {
                                if (!audio) {
                                    Globalinclude.showError('Audio Not Available')
                                } else {
                                    playSounds(audio)
                                }
                            }}
                        >
                            <Image style={styles.imgSize}
                                source={Globalinclude.GlobalAssets.volume}
                            />
                        </TouchableOpacity>
                    ) : null}
                    {id_language == '1' ? (
                        <TouchableOpacity style={styles.actionBase}
                            onPress={() => {
                                Tts.getInitStatus().then(() => {
                                    Tts.speak(wordname);
                                });
                            }}
                        >
                            <Image style={styles.imgSize}
                                source={Globalinclude.GlobalAssets.volume}
                            />
                        </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity style={[styles.actionBase, { marginHorizontal: scale(15) }]}
                        onPress={() => {
                            addToFav()
                        }}
                    >
                        <Image style={styles.imgSize}
                            source={!isFav ? Globalinclude.GlobalAssets.favourite : Globalinclude.GlobalAssets.favouriteFill}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBase}
                        onPress={() => {
                            shareWord()
                        }}
                    >
                        <Image style={styles.imgSize}
                            source={Globalinclude.GlobalAssets.shareIcon}
                        />
                    </TouchableOpacity>
                </View>
                {isLoad ? (
                    <>
                        {wordDetail.length > 0 ? (
                            <ScrollView>
                                <View>
                                    {wordDetail.map((item, index) => {
                                        return (
                                            <>
                                                <View style={{ marginVertical: scale(19), marginHorizontal: scale(5) }}>
                                                    <View style={styles.transparentView}>
                                                        {id_language == '2' ? (
                                                            <View style={{ paddingHorizontal: scale(20), }}>
                                                                <Text style={[styles.heading, {
                                                                    color: scheme === 'dark' ?
                                                                        '#fff' : Globalinclude.GlobalColor.themeBlack
                                                                }]}>{item.word_type}</Text>
                                                                <Text style={[styles.description, {
                                                                    color: scheme === 'dark' ?
                                                                        '#fff' :
                                                                        Globalinclude.GlobalColor.themeBlack
                                                                }]}>{item.accents} {!item.phenomic_transaction !== null && !item.accents ? '' : '|'} {item.phenomic_transaction} </Text>
                                                            </View>
                                                        ) : null}
                                                        {id_language == '1' ? (
                                                            <>
                                                                {item.more_word.map((it) => {
                                                                    return (
                                                                        <View>
                                                                            <View style={{ paddingHorizontal: scale(20), paddingVertical: scale(10) }}>
                                                                                <Text style={[styles.description, {
                                                                                    color: scheme === 'dark' ?
                                                                                        '#fff' :
                                                                                        Globalinclude.GlobalColor.themeBlack, fontFamily: Globalinclude.GlobalFont.Bold, fontSize: scale(18)
                                                                                }]}>{it.word_type}  </Text>
                                                                            </View>
                                                                            {it.definition ? (
                                                                                <View style={{ paddingHorizontal: scale(20), }}>
                                                                                    <HTMLView
                                                                                        textComponentProps={{
                                                                                            style: {
                                                                                                fontSize: scale(15),
                                                                                                color: scheme === 'dark' ?
                                                                                                    '#fff' :
                                                                                                    Globalinclude.GlobalColor.themeBlack, fontFamily: Globalinclude.GlobalFont.Regular
                                                                                            }
                                                                                        }}
                                                                                        paragraphBreak={false}
                                                                                        lineBreak={false}
                                                                                        addLineBreaks={false} value={it.definition}></HTMLView>
                                                                                </View>
                                                                            ) : null}
                                                                        </View>
                                                                    )
                                                                })}
                                                            </>
                                                        ) : null}
                                                        {id_language == '2' ? (
                                                            <>
                                                                {item.definition ? (
                                                                    <View style={{ paddingHorizontal: scale(20), marginTop: scale(10) }}>
                                                                        <Text style={[styles.heading, {
                                                                            color: scheme === 'dark' ? '#fff' : Globalinclude.GlobalColor.themeBlack
                                                                        }]}>Definition</Text>
                                                                        <HTMLView
                                                                            stylesheet={htmlStyles}
                                                                            paragraphBreak={false}
                                                                            addLineBreaks={false}
                                                                            textComponentProps={{
                                                                                style: {
                                                                                    fontSize: scale(15),
                                                                                    color: scheme === 'dark' ?
                                                                                        '#fff' :
                                                                                        Globalinclude.GlobalColor.themeBlack, fontFamily: Globalinclude.GlobalFont.Regular
                                                                                }
                                                                            }}
                                                                            value={item.definition}
                                                                            lineBreak={false}
                                                                            onLinkPress={(url) => {
                                                                                console.log('entered Definition', url);
                                                                                if (url.includes("=")) {
                                                                                    const strCopy = url.split('=')
                                                                                    if (strCopy.length > 1) {
                                                                                        if (strCopy[0].includes('redirect_to_word')) {
                                                                                            console.log("FORWARD TO Detail ", strCopy[1])
                                                                                            props.navigation.navigate("SearchDetailOther", { word_id: strCopy[1], word_name: "", id_language: id_language })
                                                                                        } else {
                                                                                            Alert.alert("Unable to load link")
                                                                                        }
                                                                                    } else {
                                                                                        Alert.alert("Unable to load link")
                                                                                    }
                                                                                } else {
                                                                                    Linking.canOpenURL(url).then(status => {
                                                                                        if (status) {
                                                                                            Linking.openURL(url)
                                                                                        } else {
                                                                                            Alert.alert("Unable to load link")
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }}
                                                                        ></HTMLView>
                                                                    </View>
                                                                ) : null}
                                                            </>
                                                        ) : null}
                                                    </View>
                                                    {id_language == '2' ? (
                                                        <View style={{}}>
                                                            {item.example ? (
                                                                <View style={[styles.transparentView, { backgroundColor: Globalinclude.GlobalColor.lightPink }]}>
                                                                    <View style={{ paddingHorizontal: scale(20), paddingVertical: scale(8) }}>
                                                                        <Text style={[styles.heading, {
                                                                        }]}>Example</Text>
                                                                        <HTMLView value={item.example}
                                                                            stylesheet={htmlStyles}
                                                                            paragraphBreak={false}
                                                                            lineBreak={false}
                                                                            addLineBreaks={false}
                                                                            textComponentProps={{
                                                                                style: {
                                                                                    fontFamily: Globalinclude.GlobalFont.Regular
                                                                                }
                                                                            }}
                                                                            onLinkPress={(url) => {
                                                                                console.log('entered Example', url);
                                                                                if (url.includes("=")) {
                                                                                    const strCopy = url.split('=')
                                                                                    if (strCopy.length > 1) {
                                                                                        if (strCopy[0].includes('redirect_to_word')) {
                                                                                            console.log("FORWARD TO Detail ", strCopy[1])
                                                                                            props.navigation.navigate("SearchDetailOther", { word_id: strCopy[1], word_name: "", id_language: id_language })
                                                                                        } else {
                                                                                            Alert.alert("Unable to load link")
                                                                                        }
                                                                                    } else {
                                                                                        Alert.alert("Unable to load link")
                                                                                    }
                                                                                } else {
                                                                                    Linking.canOpenURL(url).then(status => {
                                                                                        if (status) {
                                                                                            Linking.openURL(url)
                                                                                        } else {
                                                                                            Alert.alert("Unable to load link")
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }}
                                                                        ></HTMLView>
                                                                    </View>
                                                                </View>
                                                            ) : null}
                                                        </View>
                                                    ) : null}
                                                    {id_language == '2' ? (
                                                        <View style={styles.transparentView}>
                                                            {item.synonym !== null && item.synonym !== undefined ?
                                                                <View style={{ paddingHorizontal: scale(20), }}>
                                                                    <Text style={[styles.heading, {
                                                                        color: scheme === 'dark' ?
                                                                            '#fff' : Globalinclude.GlobalColor.themeBlack
                                                                    }]}>Synonyms</Text>
                                                                    <View>
                                                                        {item?.synonym.map((child) => {
                                                                            return (
                                                                                <TouchableOpacity
                                                                                    disabled={child.synonym_details === null ? true : false}
                                                                                    onPress={() => {
                                                                                        props.navigation.navigate("SearchDetailOther", { word_id: child.id, word_name: child.word, id_language: id_language })
                                                                                    }}>
                                                                                    <Text style={[styles.description, { color: scheme === 'dark' ? child.synonym_details !== null ? '#fff' : 'gray' : child.synonym_details === null ? '#000' : Globalinclude.GlobalColor.themeColor }]}>{child.word}</Text>
                                                                                </TouchableOpacity>
                                                                            )
                                                                        })}
                                                                    </View>
                                                                </View>
                                                                : null}
                                                        </View>
                                                    ) : null}
                                                    {id_language == '2' ? (
                                                        <View style={styles.transparentView}>
                                                            {item.antonym !== null && item.antonym !== undefined ?
                                                                <View style={{ paddingHorizontal: scale(20), }}>
                                                                    <Text style={[styles.heading, {
                                                                        color: scheme === 'dark' ?
                                                                            '#fff' : Globalinclude.GlobalColor.themeBlack
                                                                    }]}>Antonyms</Text>
                                                                    <View>
                                                                        {item?.antonym.map((c) => {
                                                                            return (
                                                                                <TouchableOpacity
                                                                                    disabled={c.antonym_details === null ? true : false}
                                                                                    onPress={() => {
                                                                                        props.navigation.navigate("SearchDetailOther", { word_id: c.id, word_name: c.word, id_language: id_language })
                                                                                    }}>
                                                                                    <Text style={[styles.description, { color: scheme === 'dark' ? c.antonym_details !== null ? '#fff' : 'gray' : c.antonym_details === null ? '#000' : Globalinclude.GlobalColor.themeColor }]}>{c.word}</Text>
                                                                                </TouchableOpacity>
                                                                            )
                                                                        })}
                                                                    </View>
                                                                </View>
                                                                : null}
                                                        </View>
                                                    ) : null}
                                                    {id_language == '2' ? (
                                                        <View style={styles.transparentView}>
                                                            {item.history_etymlogy ? (
                                                                <View style={{ paddingHorizontal: scale(20), }}>
                                                                    <Text style={[styles.heading, {
                                                                        color: scheme === 'dark' ?
                                                                            '#fff' : Globalinclude.GlobalColor.themeBlack
                                                                    }]}>
                                                                        History & Etymology
                                                                    </Text>
                                                                    <HTMLView
                                                                        stylesheet={htmlStyles}
                                                                        paragraphBreak={false}
                                                                        lineBreak={false}
                                                                        addLineBreaks={false}
                                                                        textComponentProps={{ style: { color: scheme === 'dark' ? '#ddd' : Globalinclude.GlobalColor.themeBlack, fontFamily: Globalinclude.GlobalFont.Regular } }}
                                                                        value={item.history_etymlogy}
                                                                        onLinkPress={(url) => {
                                                                            console.log('entered', url);
                                                                            if (url.includes("=")) {
                                                                                const strCopy = url.split('=')
                                                                                if (strCopy.length > 1) {
                                                                                    if (strCopy[0].includes('redirect_to_word')) {
                                                                                        console.log("FORWARD TO Detail ", strCopy[1])
                                                                                        props.navigation.navigate("SearchDetailOther", { word_id: strCopy[1], word_name: "", id_language: id_language })
                                                                                    } else {
                                                                                        Alert.alert("Unable to load link")
                                                                                    }
                                                                                } else {
                                                                                    Alert.alert("Unable to load link")
                                                                                }
                                                                            } else {
                                                                                Linking.canOpenURL(url).then(status => {
                                                                                    if (status) {
                                                                                        Linking.openURL(url)
                                                                                    } else {
                                                                                        Alert.alert("Unable to load link")
                                                                                    }
                                                                                })
                                                                            }
                                                                        }}
                                                                    ></HTMLView>
                                                                </View>
                                                            ) : null}
                                                        </View>
                                                    ) : null}
                                                </View>
                                                {wordDetail.length > 0 ? (
                                                    <>
                                                        {wordDetail.length - 1 ? (
                                                            <View style={{ backgroundColor: Globalinclude.GlobalColor.lightPink, height: 1 }}></View>
                                                        ) : null}
                                                    </>
                                                ) : null}

                                                {/* {wordDetail.length - 1 ? (
                                                    <View style={styles.progressView}>
                                                        <View style={styles.progressBarStyle}>
                                                            <ProgressBar
                                                                progress={0}
                                                                indeterminate={true}
                                                                color={'#fff'}
                                                                unfilledColor={Globalinclude.GlobalColor.lightPink}
                                                                borderWidth={0}
                                                                width={Dimensions.get('screen').width}
                                                                borderRadius={0}
                                                                indeterminateAnimationDuration={500}
                                                                height={3}
                                                                animationType={'timing'}
                                                            />
                                                        </View>
                                                    </View>
                                                ) : null} */}
                                            </>
                                        )
                                    })}
                                </View>
                            </ScrollView >
                        ) : (
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.heading, {
                                    color: scheme === 'dark' ?
                                        '#fff' : Globalinclude.GlobalColor.themeGray, fontSize: scale(16)
                                }]}>Detail not available!</Text>
                            </View>
                        )}
                    </>
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
    loadingScreen: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    dotsWrapper: {
        width: 100
    },
    heading: {
        fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(15),
        color: Globalinclude.GlobalColor.themeBlack
    },
    description: {
        fontFamily: Globalinclude.GlobalFont.Regular, fontSize: scale(14),
    },
    imgSize: { height: scale(22), width: scale(22), resizeMode: "contain" },
    innerView: { margin: scale(10), borderRadius: scale(20), paddingTop: scale(20) },
    actionBase: { backgroundColor: Globalinclude.GlobalColor.themeGray, height: scale(40), paddingHorizontal: scale(10), alignItems: "center", justifyContent: "center", borderRadius: scale(50), width: scale(40), marginHorizontal: scale(6) },
    transparentView: { backgroundColor: "transparent", borderRadius: scale(20), marginTop: scale(9) },
    progressView: {
        marginTop: scale(0),
        flexDirection: 'row',
    },
    progressBarStyle: { margin: scale(3) },
    li: {
        borderRadius: scale(18),
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(18), color: Globalinclude.GlobalColor.themeBlack, },
    h3: { fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(18), color: Globalinclude.GlobalColor.themeBlack, },
    h2: { fontFamily: Globalinclude.GlobalFont.SemiBold, fontSize: scale(18), color: Globalinclude.GlobalColor.themeBlack, },
    p: {
        fontFamily: Globalinclude.GlobalFont.Regular,
        fontSize: scale(14),
        color: Globalinclude.GlobalColor.themeBlack,
    },
    span: {
        fontFamily: Globalinclude.GlobalFont.Regular,
        fontSize: scale(14),
        color: Globalinclude.GlobalColor.themeBlack,
    }, b: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14),
    },
    h1: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14),
    }, h2: {
        fontFamily: Globalinclude.GlobalFont.Bold, fontSize: scale(14),
    },
    i: {
        fontFamily: Globalinclude.GlobalFont.Italic, fontSize: scale(14),
    },
})
const htmlStyles = StyleSheet.create({
    a: {
        color: Globalinclude.GlobalColor.themeColor
    }
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(SearchDetail);
