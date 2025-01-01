import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store'; 
import CreateServiceProvider from './screen/CreateServiceProvider';
import Login from './screen/Login';
import Register from './screen/Register';
import Verify from './screen/Verify';
import Forgot from './screen/Forgot';
import Reset from './screen/Reset';
import Profile from './screen/Profile';
import Home from './screen/Home'; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'home' : 'login'}>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="home"
              component={Home}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
           <Stack.Screen
              name="profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="registerService"
              component={CreateServiceProvider}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="verify"
              component={Verify}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="forgot"
              component={Forgot}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reset"
              component={Reset}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
