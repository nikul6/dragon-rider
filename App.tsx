import Mapbox, { Camera, CircleLayer, Images, LineLayer, LocationPuck, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import houses from './data/houses.json';
import { featureCollection, point } from '@turf/helpers'
import { getDirections } from './services/directions';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import pin from './assets/pin.png';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function App() {

  const [direction, setDirection] = useState([])
  const points = houses.map((house) => point([house.longitude, house.latitude], { image: house.image }));
  const directionCoordinate = direction?.routes?.[0]?.geometry.coordinates;
  const [userLocation, setUserLocation] = useState(null);

  const imageUrls = houses.reduce((acc, house) => {
    acc[house.image] = { uri: house.image };
    return acc;
  }, {});

  const onPointPress = async (event: OnPressEvent) => {
    const newDirection = await getDirections([72.867509, 21.233012], [event.coordinates.longitude, event.coordinates.latitude]);
    setDirection(newDirection)
  }

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
      <Camera zoomLevel={10} followUserLocation pitch={60} animationDuration={6000} />
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
      <ShapeSource id='scooters' cluster shape={featureCollection(points)} onPress={onPointPress}>
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
      {directionCoordinate && (
        <ShapeSource
          id="routeSource"
          lineMetrics
          shape={{
            properties: {},
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: directionCoordinate,
            },
          }}>
          <LineLayer
            id="exampleLineLayer"
            style={{
              lineColor: '#F7782E',
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 4,
            }}
          />
        </ShapeSource>
      )}
    </MapView>
  );
}