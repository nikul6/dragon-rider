    import React, { PropsWithChildren, createContext, useContext, useState } from 'react'

    const RideContext = createContext({});
    
    export default function RideProvider({children}: PropsWithChildren) {
        const [ride, setRide] = useState();
      return (
        <RideContext.Provider value={{}}>
            {children}
        </RideContext.Provider>
      )
    }
    
    export const useRide = () => useContext(RideContext);