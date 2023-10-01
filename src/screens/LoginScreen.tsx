import React, { useContext, useEffect } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({ navigation }: Props) => {
  const { signIn, errorMessage, removeError } = useContext(AuthContext);
  const { email, password, onChange } = useForm({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }

    Alert.alert('Login incorrecto', errorMessage, [
      {
        text: 'Ok',
        onPress: removeError,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  const onLogin = () => {
    console.log(email, password);
    Keyboard.dismiss();
    signIn({ correo: email, password });
  };

  return (
    <>
      <Background />

      <KeyboardAvoidingView
        style={loginStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          <WhiteLogo />

          <Text style={loginStyles.title}>Login</Text>

          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIos,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Password:</Text>
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor="rgba(255,255,255,0.4)"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIos,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onLogin}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />

          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onLogin}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('RegisterScreen')}>
              <Text style={loginStyles.buttonText}>New account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
