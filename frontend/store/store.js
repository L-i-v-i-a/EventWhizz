import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './userSlice';


const rootReducer = combineReducers({
  user: userReducer,
});


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'], 
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;


export const persistor = persistStore(store);
