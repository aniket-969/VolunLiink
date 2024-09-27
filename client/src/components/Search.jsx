
import { skills,opportunityCategories } from '../utils/formConfig.js';


const Search = ({filter,setFilter})=>{

const handleSkillChange = (e)=>{
  const searchFilter = e.target.value
  setFilter({skillName:searchFilter})
}

const handleCategoryChange = (e)=>{
 const categoryFilter = e.target.value
 setFilter({categoryName:categoryFilter})
}

    return (
        <div className="flex m-3 justify-center items-center gap-3 mx-6">
        {/* Skills Dropdown */}
        <select id="skills" className="p-1.5 w-[40%] text-sm bg-white bl truncate" onChange={handleSkillChange}>
          <option value="">Skills</option>
          {skills.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
  
        {/* Opportunity Category Dropdown */}
        <select id="opportunityCategory" className="w-[40%] p-1.5 text-sm bl bg-white truncate" onChange={handleCategoryChange}>
          <option value="">Opportunity</option>
          {opportunityCategories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
}

export default Search