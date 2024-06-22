import Mapbox, { Camera, CircleLayer, Images, LocationPuck, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import houses from './data/houses.json';
import { featureCollection, point } from '@turf/helpers'

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function App() {

  const points = houses.map((house) => point([house.longitude, house.latitude], { image: house.image }))

  const imageUrls = houses.reduce((acc, house) => {
    acc[house.image] = { uri: house.image };
    return acc;
  }, {});

  return (
    <MapView style={{ flex: 1 }} styleURL='mapbox://styles/mapbox/streets-v12'>
      <Camera zoomLevel={10} followUserLocation pitch={60} animationDuration={6000} />
      <LocationPuck puckBearingEnabled puckBearing='course' pulsing={{ isEnabled: true }} />
      <ShapeSource id='scooters' cluster shape={featureCollection(points)}>
        <SymbolLayer
          id='clusters-point'
          style={{
            textField: ['get', 'point_count'],
            textSize: 16,
            textColor: '#ffffff',
            textPitchAlignment: 'map',
          }}
        />
        <CircleLayer
          id='clusters'
          belowLayerID='clusters-point'
          filter={['!', ['has', 'point_count']]}
          style={{
            circlePitchAlignment: 'map',
            circleColor: '#F7782E',
            circleRadius: 10,
            circleOpacity: 1,
            circleStrokeWidth: 2,
            circleStrokeColor: 'white',
          }}
        />
        <SymbolLayer id='scooters'
          style={{
            iconImage: ['get', 'image'],
            iconSize: 0.5,
            iconAllowOverlap: false,
            iconAnchor: 'bottom'
          }}
        />
        <Images images={imageUrls} />
      </ShapeSource>
    </MapView>
  );
}