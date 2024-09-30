import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import { useUserContext } from "../context/AuthProvider"

const Map = () => {

  const { location, setLocation } = useUserContext()

  console.log(location)
  if (!location || !location.latitude || !location.longitude) return null
  
  const { latitude, longitude } = location
  console.log(latitude, longitude)

  return (

    <MapContainer center={[latitude, longitude]} zoom={12} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} >

      </Marker>

    </MapContainer>

  )
}

export default Map