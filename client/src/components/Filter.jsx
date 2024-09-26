
const Filter = (filter,setFilter) => {

  return (
   <div className='flex mt-5 b justify-center items-center gap-3'>
        <label >Filter by :</label>
        <select className='bl p-1.5 text-sm bg-white w-[50%] ' onChange={(e) => setFilter(e.target.value)}>
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