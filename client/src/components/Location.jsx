import React from 'react'
import { useState, useEffect } from 'react';
import { fetchLocationDetails } from '../utils/fetchLocation';

const Location = ({location,setLocation}) => {

  const [error, setError] = useState(null);

  useEffect(()=>{
    const savedLocation = localStorage.getItem('location');
    if(savedLocation){
      setLocation(JSON.parse(savedLocation))
    }
    else{
      getLocation()
    }
  },[])

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude,longitude)
          getLocationDetails(latitude, longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }


  };

  async function getLocationDetails(latitude, longitude) {
    try {

      const data = await fetchLocationDetails(latitude, longitude, import.meta.env.VITE_LOCATIONKEY);
      console.log(data)
      console.log('Location Details:', data.components);
      if('components' in data){
        const updatedLocation = {
          ...data.components,
          latitude,
          longitude,
        }
        setLocation(updatedLocation)
        localStorage.setItem('location',JSON.stringify(updatedLocation))
      }
      else{
        setError(data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      setError("Error fetching location details")
    }
  }

  return (
    <div>
      {location ? (
        <div className='text-xs flex flex-col items-center justify-center'>
          <p >
            Your current location :
          </p>
          <p> Latitude {parseFloat(location.latitude.toFixed(3))} , Longitude {parseFloat(location.longitude.toFixed(3))}</p>
        </div>

      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p className='flex justify-center items-center'>Please allow location access</p>
      )}
    </div>
  )
}

export default Location