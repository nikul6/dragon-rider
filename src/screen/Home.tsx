import Mapbox, { Camera, Images, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers'
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import pin from '../../assets/pin.png';
import LineRoute from '../components/LineRoute';
import { useHouse } from '../Context/HouseProvider';
import HouseMarkers from '../components/HouseMarkers';
import SelectedHouseSheet from '../components/SelectedHouseSheet';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function Home() {

  const [userLocation, setUserLocation] = useState(null);

  const { directionCoordinates } = useHouse();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation([location.coords.longitude, location.coords.latitude]);
    })();
  }, []);

  return (
    <MapView style={{ flex: 1 }} styleURL='mapbox://styles/mapbox/streets-v12'>
      <Camera zoomLevel={10} followUserLocation pitch={60} animationDuration={6000}/>
      {userLocation && (
        <ShapeSource id='userLocation' shape={featureCollection([point(userLocation)])}>
          <SymbolLayer
            id='userLocationIcon'
            style={{
              iconImage: 'customUserLocationIcon',
              iconSize: 0.8,
            }}
          />
          <Images images={{ customUserLocationIcon: pin }} />
        </ShapeSource>
      )}
      {/* <LocationPuck puckBearingEnabled puckBearing='course' pulsing={{ isEnabled: true }} /> */}
      <HouseMarkers/>
      {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
      <SelectedHouseSheet/>
    </MapView>
  );
}

