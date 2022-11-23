import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground, Modal, FlatList, Keyboard, ActivityIndicator } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { APP_URL } from '../../Global/Helper/Const';
import { scale } from '../../Theme/Scalling';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import helpers from '../../Global/Helper/Helper';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import LottieView from 'lottie-react-native';
import debounce from 'lodash.debounce';
import useWords from '../../hooks/useWords';

let scheme = global.theme;

const Dictionary = (props) => {
    const openOrClose = useIsDrawerOpen()

    const {
        data,
        endReached,
        getWords,
        fetchMore
    } = useWords()
    
    const [language, setLanguage] = useState(global.language_id)
    const [wordId, setWordId] = useState("")
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        AsyncStorage.getItem("theme")
        .then((value) => {
            if (value !== null && value !== undefined) {
                global.theme = value
            }
        })
        .then(() => {
            scheme = global.theme;
        })
    }, [])

    useEffect(() => {
        getWords(global.language_id, "", true)
        setSearchText("")
        const unsubscribe = props.navigation.addListener('focus', () => {
            setLanguage(global.language_id)
            setWordId("")
        });
        return () => {
            unsubscribe();
        };
    }, [])

    const renderFooter = useMemo(() => {
        if (!endReached) {
            return (
                    <View
                        style={{
                            height: 60,
                            flexDirection: "row",
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

    const renderListItemHandler = useCallback(({ item }) => {
        try {
            return (
                <TouchableOpacity
                    onPress={() => {
                        setWordId(item.id)
                        props.navigation.navigate('SearchDetail', {
                            word_id: item.id,
                            word_name: item.word,
                            id_language: language
                        })
                    }}
                    style={[styles.wordStyle, {
                        backgroundColor: item.id === wordId
                            ? scheme === 'dark'
                                ? '#0000008a'
                                : '#dadada'
                            : 'transparent',
                        borderRadius: item.id === wordId ? scale(20) : scale(0),
                    }]}
                >
                    <Text
                        style={[
                            styles.itemName,
                            {
                                color: scheme === 'dark'
                                    ? '#fff'
                                    : Globalinclude.GlobalColor.themeBlack
                            }]
                        }
                    >
                        {item.word}
                    </Text>
                </TouchableOpacity>
            )
        } catch (err) {
            console.log('[renderListItemHandler] Error : ', err.message)
            return null
        }
    }, [props.navigation, language, wordId])

    const keyExtractorHandler = useCallback((_item, index) => index.toString(), [])

    const debounceGetWords = useRef(debounce((...nextValues) => {
        getWords(...nextValues)
    }, 800)).current

    return (
        <ImageBackground
            source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor:
                        scheme === 'dark'
                            ? 'rgba(0,0,0,0.8)'
                            : 'rgba(0,0,0,0)'
                }}
            >
                <Globalinclude.GlobalHeader
                    name={'Dictionary'}
                    drawerIcon={true}
                    onPressDrawer={() => {
                        if (openOrClose) {
                            setSearchText("")
                            props.navigation.openDrawer()
                        } else {
                            setSearchText("")
                            props.navigation.openDrawer()
                        }
                    }}
                    onPressNotification={() => {
                        props.navigation.navigate('Notification')
                    }}
                />
                <Globalinclude.GlobalTextBox
                    searchIcon={true}
                    placeholder="Search"
                    value={searchText}
                    onChangeText={value => {
                        setSearchText(value)
                        debounceGetWords(language, value, true)
                    }}
                    onSubmitEditing={() => {
                        Keyboard.dismiss()
                        debounceGetWords(global.language_id, searchText, true)
                    }}
                    onPressSearch={() => {
                        debounceGetWords(language, searchText, true)
                    }}
                    textInputStyle={{
                        color: scheme === 'dark' ? '#fff' : '#7a7a7a'
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        marginHorizontal: scale(13),
                        marginBottom: scale(15)
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            global.isFrom = "";
                            setLanguage(2)
                            getWords(2, "", true)
                            global.language = "efik"
                            global.language_id = 2
                            helpers.storeData("language", "efik")
                            helpers.storeData("language_id", "2")
                            setSearchText("")
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
                            setLanguage(1)
                            getWords(1, "", true)
                            global.language = "english"
                            global.language_id = 1
                            setSearchText("")
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
                <FlatList
                    data={data}
                    renderItem={renderListItemHandler}
                    keyExtractor={keyExtractorHandler}
                    contentContainerStyle={{ paddingBottom: scale(35) }}
                    ListFooterComponent={renderFooter}
                    onEndReached={fetchMore.bind(null, language, searchText, false)}
                    onEndReachedThreshold={0.01}
                />
            </View>
        </ImageBackground>
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
        fontSize: scale(15),
        color: Globalinclude.GlobalColor.themeBlack
    },
    wordStyle: {
        marginHorizontal: scale(10), paddingVertical: scale(9), paddingHorizontal: scale(10), width: '90%'
    }
})

const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});

export default connect(mapStateToProps)(Dictionary);
