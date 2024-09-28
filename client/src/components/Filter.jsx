import toast from "react-hot-toast";

const Filter = ({ filter, setFilter }) => {

  const handleChange = (e) => {
    const selectedFilter = e.target.value;

    switch (selectedFilter) {
      case 'Latest':
        setFilter({ sort: 'createdAt:desc' });
        break;
      case 'Volunteers Only':
        setFilter({  role: 'Volunteer' });
        break;
      case 'Organization Only':
        setFilter({  role: 'Organization' });
        break;
      case 'Nearest':
        const location = localStorage.getItem('location')
        if (location) {
          const parsedLocation = JSON.parse(location)
          setFilter({ ...filter, latitude: parsedLocation.latitude, longitude: parsedLocation.longitude });
        }
        else toast.error("Allow location access")

        break;
      default:
        setFilter({sort:'createdAt:desc'});
        break;
    }
  }

  return (
    <div className='flex mt-5 b justify-center items-center gap-3'>
      <label >Filter by :</label>
      <select className='bl p-1.5 text-sm bg-white w-[50%] ' onChange={handleChange}>
        <option >Default</option>
        <option >Nearest</option>
        <option >Volunteers Only</option>
        <option > Organization Only</option>
        <option >Latest</option>

      </select>
    </div>
  )
}

export default Filter