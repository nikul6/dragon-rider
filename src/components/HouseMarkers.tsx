import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import * as Location from 'expo-location';
import houses from '../data/houses.json';
import { useHouse } from '../Context/HouseProvider';
import { useEffect, useState } from 'react';

export default function HouseMarkers() {
    const { setSelectedHouse } = useHouse();
    const points = houses.map((house) => point([house.longitude, house.latitude], { image: house.image, house }))

    const imageUrls = houses.reduce((acc, house) => {
        acc[house.image] = { uri: house.image };
        return acc;
    }, {});

    const onPointPress = async (event: OnPressEvent) => {
        if (event.features[0].properties?.house) {
            setSelectedHouse(event.features[0].properties.house);
        }
    };

    

    return (
        <ShapeSource id='houses' cluster shape={featureCollection(points)} onPress={onPointPress}>
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
    );
}