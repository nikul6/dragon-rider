import { View } from 'react-native'
import React from 'react'
import Router from './src/navigation/Router';
import HouseProvider from './src/Context/HouseProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HouseProvider>
        <View style={{ flex: 1 }}>
          <Router />
        </View>
      </HouseProvider>
    </GestureHandlerRootView>
  )
}