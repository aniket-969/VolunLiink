import React from 'react';

const CustomInput = ({
  register,
  className,
  type = 'text',
  placeholder,
  onChange,
  isTextarea = false,
  ...props
}) => {
  if (isTextarea) {
    return (
      <textarea
        {...register}
        className={`bg-[#F0F8FF] w-[100%] text-lg outline-none ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    );
  }

  return (
    <input
      {...register}
      className={`bg-[#F0F8FF] w-[100%] text-lg outline-none ${className}`}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      {...props}
    />
  );
};

export default CustomInput;