import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Navigator } from './src/navigation/Navigator';
import { AuthProvider } from './src/context/AuthContext';
import { ProductsProvider } from './src/context/ProductsContext';

// const AppState = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
const AppState = ({ children }: any) => {
  return (
    <ProductsProvider>
      <AuthProvider>{children}</AuthProvider>
    </ProductsProvider>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
};

export default App;
