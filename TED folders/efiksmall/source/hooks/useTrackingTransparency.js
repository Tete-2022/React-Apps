import { useCallback, useEffect, useState } from 'react'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';

const useTrackingTransparency = () => {
    const [isLoading, setLoading] = useState(true)
    const [requestPermission, setRequestPermission] = useState(false)
    const [trackingAllowed, setTrackingAllowed] = useState(false)

    const initHandler = useCallback(async () => {
        try {
            console.log('in initHandler')
            const checkPermissionRes = await getTrackingStatus()
            console.log('in checkPermissionRes : ', checkPermissionRes)
            switch(checkPermissionRes) {
                case 'authorized':
                case 'unavailable':
                    // enable tracking feature
                    setTrackingAllowed(true)
                    break
                case 'denied':
                case 'restricted':
                    break
                case 'not-determined':
                    // need to ask
                    {
                        console.log('asking permission')
                        const requestPermissionRes = await requestTrackingPermission()
                        console.log('requestPermissionRes : ', requestPermissionRes)
                        switch(requestPermissionRes) {
                            case 'authorized':
                            case 'unavailable':
                                // enable tracking feature
                                setTrackingAllowed(true)
                                break
                            case 'denied':
                            case 'restricted':
                                break
                            case 'not-determined':
                                await initHandler()
                                break
                        }
                    }
                    break
            }
            setLoading(false)
        } catch (err) {
            console.log('Error : ', err.message)
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (requestPermission) {
            initHandler()
        }
    }, [requestPermission])

    return {
        isLoading,
        setRequestPermission
    }
}

export default useTrackingTransparency
