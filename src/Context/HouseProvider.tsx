import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { getDirections } from '../services/directions';

interface House {
    longitude: number;
    latitude: number;
}

interface Direction {
    routes: {
        geometry: {
            coordinates: [number, number][];
        };
        duration: number;
        distance: number;
    }[];
}

interface HouseContextType {
    selectedHouse: House | undefined;
    setSelectedHouse: React.Dispatch<React.SetStateAction<House | undefined>>;
    direction: Direction | undefined;
    directionCoordinates: [number, number][] | undefined;
    duration: number | undefined;
    distance: number | undefined;
    isNearby: boolean;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export default function HouseProvider({ children }: PropsWithChildren) {
    const [selectedHouse, setSelectedHouse] = useState<House | undefined>();
    const [direction, setDirection] = useState<Direction | undefined>();
    const [isNearby, setIsNearby] = useState(false);

    useEffect(() => {
        let subscription: Location.LocationSubscription | undefined;

        const watchLocation = async () => {
            subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
                const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
                const to = point([selectedHouse.longitude, selectedHouse.latitude]);
                const distance = getDistance(from, to, { units: 'meters' });
                if (distance < 100) {
                    setIsNearby(true);
                }
            });
        };

        if (selectedHouse) {
            watchLocation();
        }

        return () => {
            subscription?.remove();
        };
    }, [selectedHouse]);

    useEffect(() => {
        const fetchDirections = async () => {
            const myLocation = await Location.getCurrentPositionAsync();

            const newDirection = await getDirections(
                [myLocation.coords.longitude, myLocation.coords.latitude],
                [selectedHouse.longitude, selectedHouse.latitude]
            );
            setDirection(newDirection);
        };

        if (selectedHouse) {
            fetchDirections();
            setIsNearby(false);
        }
    }, [selectedHouse]);

    return (
        <HouseContext.Provider value={{
            selectedHouse,
            setSelectedHouse,
            direction,
            directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
            duration: direction?.routes?.[0]?.duration,
            distance: direction?.routes?.[0]?.distance,
            isNearby,
        }}>
            {children}
        </HouseContext.Provider>
    )
}

export const useHouse = () => useContext(HouseContext);