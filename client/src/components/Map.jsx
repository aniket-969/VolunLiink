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
  // console.log(markers)
  const volunteerIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/10744/10744646.png", // URL for volunteer icon
    iconSize: [26, 26],
  });

  const organizationIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/252/252106.png", // URL for organization icon
    iconSize: [23, 23],
  });

  return (

    <div className="flex flex-col items-center my-4 gap-4">

      {/* Map legend */}
      <div className="flex gap-20 items-center w-[100%] justify-center ">
       
        <div className="flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/128/10744/10744646.png" alt="Volunteer Icon" className="w-[2rem]"/>
          <span>Volunteers</span>
        </div>
        <div className="flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/128/252/252106.png" alt="Organization Icon" className="w-[2rem]"/>
          <span>Organizations</span>
        </div>
      </div>

      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          markers.map(mark => (

            <Marker key={mark.postId} position={[mark.geocode[1], mark.geocode[0]]} icon={mark.role === "Volunteer" ? volunteerIcon : organizationIcon}>
              <Popup>
                <Link to={`/posts/${mark.postId}`}>
                  Go to post
                </Link></Popup>
            </Marker>
          ))
        }

      </MapContainer>
    </div>


  )
}

export default Map