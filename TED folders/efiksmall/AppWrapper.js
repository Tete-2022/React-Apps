import App from './App';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import createStore from './source/Reducer';
import AsyncStorage from '@react-native-community/async-storage';
const AppWrapper = () => {
  const store = createStore();
  AsyncStorage.getItem("theme").then((value) => {
    global.theme = value
    if (value !== null && value !== undefined) {
      global.theme = value
    } else {
    }
  });
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
export default AppWrapper;