import React from 'react';
import CustomInput from './CustomInput';

const CustomInputWithIcon = ({
  icon: Icon,
  register,
  type = 'text',
  placeholder,
  isTextarea = false,
  className,
  onChange,
}) => {
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
      />
    </div>
  );
};

export default CustomInputWithIcon;