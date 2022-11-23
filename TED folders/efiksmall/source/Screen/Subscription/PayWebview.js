import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Alert } from 'react-native';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native'
import Globalinclude from '../../Global/Globalinclude';
import { APP_URL, PAYSTACK_KEY, PAYSTACK_SECRET_KEY } from '../../Global/Helper/Const';
let amount = '';
let plan_code = '';
const PayWebview = ({ navigation, route }) => {
    const [publicKey, setPublicKey] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [currency, setCurrency] = useState("")
    if (route.params !== undefined && route.params !== null && route.params !== "") {
        if (route.params.amount !== undefined && route.params.amount !== null && route.params.amount !== "") {
            amount = route.params.amount
        }
        if (route.params.plan_code !== undefined && route.params.plan_code !== null && route.params.plan_code !== "") {
            plan_code = route.params.plan_code
        }
    }

    useEffect(() => {
        getPaymentKey()

    }, [])

    const getPaymentKey = () => {
        let headers = {

            "Content-Type": "application/json"
        }
        fetch(APP_URL + 'setting', {
            method: 'POST',
            headers: headers
        }).then((res) => res.json()).then((res) => {
            console.log(res, "========>response");
            if (res.status) {
                if (res.data) {
                    setPublicKey(res.data.paystack_public_key)
                    setSecretKey(res.data.paystack_secret_key)
                    setCurrency(res.data.currency)
                }
            }

        })
        .catch(err => {
            console.log('[getPaymentKey] Error : ', err.message)
        })
    }
    const creatSubcription = () => {
        let headers = {
            "Authorization": 'Bearer ' + secretKey,
            "Content-Type": "application/json"
        }
        let data = JSON.stringify({ "customer": global.customer_code, "plan": plan_code })
        console.log(data.replace, "REQ OBJECT")
        fetch('https://api.paystack.co/subscription', {
            method: 'POST',
            body: data,
            headers: headers
        }).then((res) => res.json()).then((res) => {
            console.log(res, "========>response from subscription");
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{ name: "Dashboard" }],
                }));
            Globalinclude.showToast("Subscription Plan Actived!")
        })
        .catch(err => {
            console.log('[creatSubcription] Error : ', err.message)
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <Paystack
                paystackKey={publicKey}
                handleBackButtonClick={() => alert('yes')}
                amount={amount + '.00'}
                billingEmail={global.email_address_val}
                activityIndicatorColor="green"
                onCancel={(e) => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: "Subscription" }],
                        }));
                    console.log(e, "cancell");
                }}
                onSuccess={(res) => {
                    if (res.data.transactionRef.status === 'success') {
                        creatSubcription()
                    }
                }}
                autoStart={true}
                currency={currency}
                onRequestClose={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: "Subscription" }],
                        }));
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
})
export default PayWebview;