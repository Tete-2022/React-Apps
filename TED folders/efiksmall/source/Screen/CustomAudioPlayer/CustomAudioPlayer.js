import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AudioPlayer } from 'react-native-simple-audio-player';
import Globalinclude from '../../Global/Globalinclude';
let audio_file = '';
const CustomPlayer = (props) => {
    if (props.route.params !== null && props.route.params !== undefined) {
        if (props.route.params.audio !== null && props.route.params.audio !== undefined) {
            audio_file = props.route.params.audio
            console.log(audio_file, "audio_file");
        }
    }
    return (
        <>
            <Globalinclude.GlobalHeader name={''}
                drawerIcon={false}
                backIcon={true}
                onPressBack={() => {
                    props.navigation.goBack()
                }}
            />
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#313131',
                    justifyContent: 'center',
                }}>
                <AudioPlayer
                    url={audio_file}
                />
            </View>
        </>
    );
};
export default CustomPlayer;