import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function App() {
  return (
    <MapView style={{ flex: 1 }} styleURL='mapbox://styles/mapbox/streets-v12'>
      <Camera zoomLevel={10} followUserLocation pitch={60} animationDuration={6000}/>
      <LocationPuck puckBearingEnabled puckBearing='course' pulsing={{ isEnabled: true }} />
    </MapView>
  );
}