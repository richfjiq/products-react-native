import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({ navigation }: Props) => {
  const { errorMessage, signUp, removeError } = useContext(AuthContext);
  const { name, email, password, onChange } = useForm({
    name: '',
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

  const onRegister = () => {
    Keyboard.dismiss();
    signUp({ correo: email, password, nombre: name });
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          <WhiteLogo />

          <Text style={loginStyles.title}>Register</Text>

          <Text style={loginStyles.label}>Name:</Text>
          <TextInput
            placeholder="Enter Name"
            placeholderTextColor="rgba(255,255,255,0.4)"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.inputFieldIos,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onRegister}
            autoCapitalize="words"
            autoCorrect={false}
          />

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
            onSubmitEditing={onRegister}
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
            onSubmitEditing={onRegister}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />

          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onRegister}>
              <Text style={loginStyles.buttonText}>Create account</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('LoginScreen')}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity
            onPress={() => navigation.replace('LoginScreen')}
            activeOpacity={0.8}
            style={loginStyles.buttonBack}>
            <Text style={loginStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5856D6',
  },
});
