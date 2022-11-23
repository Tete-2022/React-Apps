import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native'
import Globalinclude from '../../Global/Globalinclude';
import { scale } from '../../Theme/Scalling';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { APP_URL } from '../../Global/Helper/Const';
import HTMLView from 'react-native-htmlview';
const AboutUs = (props) => {
    const [cmsDataAboutUs, setCmsDataAboutUs] = useState('')
    const [scheme, setScheme] = useState(props.theme.apps ? props.theme.apps : global.theme)
    useEffect(() => {
        getCms()
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
            getCms()
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
    const getCms = () => {
        global.global_loader_ref.show_loader(1);
        fetch(APP_URL + 'get_cms_pages', {
            method: "GET",
        })
            .then((response) => response.json()).then((response) => {
                if (response.status) {
                    if (response.data) {
                        setCmsDataAboutUs(response.data.about_us.description)
                        global.global_loader_ref.show_loader(0);
                    }
                    else {
                        setCmsDataAboutUs(null)
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
    return (
        <ImageBackground source={Globalinclude.GlobalAssets.screenBg}
            style={{ height: '100%', width: '100%' }}
        >
            <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)' }}>
                <Globalinclude.GlobalHeader name={'About Us'}
                    drawerIcon={false}
                    backIcon={true}
                    onPressBack={() => {
                        props.navigation.goBack()
                        props.navigation.openDrawer()
                    }}
                />
                <ScrollView>
                    <View style={{ paddingHorizontal: scale(20), paddingVertical: scale(20) }}>
                        <View style={{ paddingTop: scale(20) }}>
                            <HTMLView stylesheet={styles} value={cmsDataAboutUs}
                                textComponentProps={{ style: { color: scheme === 'dark' ? '#ddd' : Globalinclude.GlobalColor.themeBlack }, }}
                            ></HTMLView>
                        </View>
                    </View>
                </ScrollView>
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
    b: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14),
    },
    p: {
        fontFamily: Globalinclude.GlobalFont.Medium, fontSize: scale(14),
    }, span: {
        fontFamily: Globalinclude.GlobalFont.Regular, fontSize: scale(14),
    }, h1: {
        fontFamily: Globalinclude.GlobalFont.Bold, fontSize: scale(14),
    }, h2: {
        fontFamily: Globalinclude.GlobalFont.Bold, fontSize: scale(14),
    }, i: {
        fontFamily: Globalinclude.GlobalFont.Italic, fontSize: scale(14),
    },
})
const mapStateToProps = (state) => ({
    theme: {
        apps: state.apps.theme,
    },
});
export default connect(mapStateToProps)(AboutUs);