
import { skills,opportunityCategories } from '../utils/formConfig.js';

const Search = ()=>{
    return (
        <div className="flex m-3 justify-center items-center gap-3 mx-6">
        {/* Skills Dropdown */}
        <select id="skills" className="p-1.5 w-[40%] text-sm bg-white bl truncate">
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
        <select id="opportunityCategory" className="w-[40%] p-1.5 text-sm bl bg-white truncate">
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