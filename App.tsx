import { View } from 'react-native'
import React from 'react'
import Router from './src/navigation/Router';
import HouseProvider from './src/Context/HouseProvider';

export default function App() {
  return (
    <HouseProvider>
      <View style={{ flex: 1 }}>
        <Router />
      </View>
    </HouseProvider>
  )
}