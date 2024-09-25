import React, { useState } from 'react';
import CustomInput from './CustomInput';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const CustomInputWithIcon = ({
  icon: Icon,
  register,
  type = 'text',
  placeholder,
  isTextarea = false,
  className,
  onChange,
}) => {


  const[passwordVisibility,setPasswordVisibility] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisibility(prev => !prev);
  };

  return (
    <div className="flex items-center gap-2 bglight p-2">
      <Icon />
      <CustomInput
        register={register}
        type={type}
        placeholder={placeholder}
        isTextarea={isTextarea}
        className={className}
        onChange={onChange}
        passwordVisibility={passwordVisibility}
      />
      {type=="password" && (
        <span
          onClick={togglePasswordVisibility}
         
        >
          {passwordVisibility ? <FaEyeSlash /> : <FaEye />} 
        </span>
      ) }
    </div> 
   
  );
};

export default CustomInputWithIcon;