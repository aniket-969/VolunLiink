import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import { useUserContext } from "../context/AuthProvider"
import { useEffect, useState } from "react"
import { getMapData } from "../utils/fetchVolunteerData"
import { FaMapMarkerAlt } from "react-icons/fa";
import { Icon } from "leaflet"
import { Link } from "react-router-dom"

const Map = () => {

  const { location } = useUserContext()
  const { latitude, longitude } = location

  const [markers, setMarker] = useState([])
  const fetchMapData = async () => {
    const mapData = await getMapData(latitude, longitude)
    setMarker(mapData)
  }


  useEffect(() => {
    fetchMapData()
  }, [latitude, longitude])
  console.log(markers)

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/10744/10744646.png",
    iconSize: [23, 23]
  })

  return (

    <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        markers.map(mark => (

          <Marker key={mark.postId} position={[mark.geocode[1], mark.geocode[0]]} icon={customIcon}>
            <Popup>
              <Link to={`/posts/${mark.postId}`}>
                Go to post
              </Link></Popup>
          </Marker>
        ))
      }

    </MapContainer>

  )
}

export default Map