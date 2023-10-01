import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import coffeeApi from '../api/coffeeApi';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  Usuario,
} from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './AuthReducer';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (obj: RegisterData) => void;
  signIn: (obj: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
};

const AuthInitialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, AuthInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      return dispatch({ type: 'notAuthenticated' });
    }

    const { status, data } = await coffeeApi.get<LoginResponse>('/auth');

    if (status !== 200) {
      return dispatch({ type: 'notAuthenticated' });
    }

    await AsyncStorage.setItem('token', data.token);

    dispatch({
      type: 'signUp',
      payload: {
        token: data.token,
        user: data.usuario,
      },
    });
  };

  const signIn = async ({ correo, password }: LoginData) => {
    try {
      const {
        data: { token, usuario },
      } = await coffeeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });
      dispatch({
        type: 'signUp',
        payload: {
          token,
          user: usuario,
        },
      });

      await AsyncStorage.setItem('token', token);
    } catch (error) {
      const errors = error as any;
      dispatch({
        type: 'addError',
        payload: errors.response.data.msg || 'Informacion incorrecta',
      });
    }
  };

  const signUp = async ({ correo, password, nombre }: RegisterData) => {
    try {
      const {
        data: { token, usuario },
      } = await coffeeApi.post<LoginResponse>('/usuarios', {
        correo,
        password,
        nombre,
      });
      dispatch({
        type: 'signUp',
        payload: {
          token,
          user: usuario,
        },
      });

      await AsyncStorage.setItem('token', token);
    } catch (error) {
      const errors = error as any;
      dispatch({
        type: 'addError',
        payload: errors.response.data.errors[0].msg || 'Revise la informacion.',
      });
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'logout' });
  };

  const removeError = () => {
    dispatch({ type: 'removeError' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
