import React from 'react';
import toast from 'react-hot-toast';

const Filter = ({ filter, setFilter }) => {
  const { skillName, categoryName } = filter;

  const handleChange = (e) => {
    const selectedFilter = e.target.value;
    // Only preserve skills/category; drop any other old filters
    const base = { skillName, categoryName };

    switch (selectedFilter) {
      case 'Latest':
        setFilter({ ...base, sort: 'createdAt:desc' });
        break;
      case 'Volunteers Only':
        setFilter({ ...base, role: 'Volunteer' });
        break;
      case 'Organization Only':
        setFilter({ ...base, role: 'Organization' });
        break;
      case 'Nearest': {
        const stored = localStorage.getItem('location');
        if (stored) {
          const { latitude, longitude } = JSON.parse(stored);
          setFilter({ ...base, latitude, longitude });
        } else {
          toast.error('Allow location access');
        }
        break;
      }
      default:
        // Reset to base only
        setFilter({ ...base });
    }
  };

  // Determine which option is currently active
  let selectValue = 'Default';
  if (filter.sort === 'createdAt:desc') selectValue = 'Latest';
  else if (filter.role === 'Volunteer') selectValue = 'Volunteers Only';
  else if (filter.role === 'Organization') selectValue = 'Organization Only';
  else if (filter.latitude != null && filter.longitude != null) selectValue = 'Nearest';

  return (
    <div className='flex mt-5 justify-center items-center gap-3 min-h-[34px]'>
      <label>Filter by :</label>
      <select
        className='bl p-1.5 text-sm bg-white w-[50%]'
        onChange={handleChange}
        value={selectValue}
      >
        <option value='Default'>Default</option>
        <option value='Nearest'>Nearest</option>
        <option value='Volunteers Only'>Volunteers Only</option>
        <option value='Organization Only'>Organization Only</option>
        <option value='Latest'>Latest</option>
      </select>
    </div>
  );
};

export default Filter;
