import React, {useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { setMapRef, setRobotRef } from '../store/actionCreators';
import { ReduxState } from '../store/types';

// Variables
const GOOGLE_MAP_API_KEY = "AIzaSyBXLWtitszgxow6ixws-ZbV7TDrsErfCv8";
let myLocation = { // CN Tower Landmark
    lat: 43.642567,
    lng: -79.387054
};
// styles

const mapStyles = {
    width: '100vw',
    height: '100vh'
  };

function GoogleMaps(props: any) {
    // refs
    const googleMapRef : any = React.createRef();
    const googleMap : any = useRef(null);
    const marker : any = useRef(null);


    // helper functions
    const createGoogleMap = () =>
        new window.google.maps.Map(googleMapRef.current, {
            zoom: 14,
            center: {
                lat: myLocation.lat,
                lng: myLocation.lng
            }
        });

    const createMarker = () =>
        new window.google.maps.Marker({
            position: {lat: myLocation.lat, lng: myLocation.lng},
            map: googleMap.current
        });

    // useEffect Hook
    useEffect(() => {
        const googleMapScript = document.createElement('script');
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`
        window.document.body.appendChild(googleMapScript);

        googleMapScript.addEventListener('load', () => {
            googleMap.current = createGoogleMap();
            marker.current = createMarker();
            props.setMapRefFunc(googleMap.current);
            props.setRobotRefFunc(marker.current);
            
        })
    });

    return (
        <div
            id="google-map"
            ref={googleMapRef as React.RefObject<HTMLDivElement>}
            style={mapStyles}
        />
    )

}

function mapStateToProps(state: ReduxState) {
    return {
    }
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
        setMapRefFunc: (map: any) => dispatch(setMapRef(map)),
        setRobotRefFunc: (robot: any) => dispatch(setRobotRef(robot))
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(GoogleMaps);