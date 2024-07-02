import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useHouse } from '../Context/HouseProvider';
import pin from '../../assets/pin.png';
import FontAwesome6 from '@expo/vector-icons/FontAwesome5';

export default function SelectedHouseSheet() {
  const { selectedHouse, duration, distance, isNearby, setSelectedHouse } = useHouse();

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (selectedHouse) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [selectedHouse]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      onClose={() => setSelectedHouse(undefined)}
      backgroundStyle={{ backgroundColor: '#000' }}>
      {selectedHouse && (
        <BottomSheetView style={styles.bottomSheetConatiner}>
          <View style={styles.mainConatiner}>
            <Image source={pin} style={{ width: 60, height: 60 }} resizeMode='contain' />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Balerion the Black Dread</Text>
              <Text style={{ color: 'gray', fontSize: 18 }}>
                {selectedHouse.state}
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              <View
                style={styles.iconConiner}>
                <FontAwesome6 name="flag-checkered" size={18} color="#9e0200" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                  {(distance / 1000).toFixed(1)} km
                </Text>
              </View>
              <View
                style={styles.iconConiner}>
                <FontAwesome6 name="clock" size={18} color="#9e0200" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                  {(duration / 60).toFixed(0)} min
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.startButton}
            onPress={() => { }}
          >
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: '600' }} disabled={!isNearby}>Start journey</Text>
          </TouchableOpacity>
        </BottomSheetView>
      )}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  bottomSheetConatiner: {
    flex: 1, padding: 10, gap: 20
  },
  mainConatiner: {
    flexDirection: 'row', alignItems: 'center', gap: 10
  },
  iconConiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  startButton: {
    ustifyContent: 'center', alignItems: 'center', backgroundColor: '#9e0200', margin: 10, padding: 10, borderRadius: 10
  }
})