import React from "react";
import { skills, opportunityCategories } from '../utils/formConfig.js';

const Search = ({ filter, setFilter }) => {
  const handleSkillChange = (e) => {
    const skillName = e.target.value;
    setFilter({
      skillName,
      categoryName: ""
    });
  };

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setFilter({
      categoryName,
      skillName: ""
    });
  };

  return (
    <div className="flex m-3 justify-center items-center gap-3 mx-6 min-h-[34px] ">
      <label htmlFor="skills">Search:</label>

      <select
        id="skills"
        className="p-1.5 w-[40%] text-sm bg-white truncate bl"
        onChange={handleSkillChange}
        value={filter.skillName || ""}
      >
        <option value="">Skills</option>
        {skills.map(group => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <select
        id="opportunityCategory"
        className="w-[40%] p-1.5 text-sm bg-white truncate bl"
        onChange={handleCategoryChange}
        value={filter.categoryName || ""}
      >
        <option value="">Opportunity</option>
        {opportunityCategories.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Search;
