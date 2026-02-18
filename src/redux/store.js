import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import loadingSlice from "./slice/loadingSlice";
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // Defaults to localStorage for web
import { encryptTransform } from 'redux-persist-transform-encrypt';

const encryptor = encryptTransform({
  secretKey: 'aayu-care-secure-key-v1',
  onError: function (error) {
    console.error('Encryption Error:', error);
  },
});

const persistConfig = {
  key: 'root_v1',
  storage: sessionStorage,
  transforms: [encryptor],
  // whitelist: ['auth'], // Incorrect usage for single slice
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    loading: loadingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
