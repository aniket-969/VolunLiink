// CustomInput.jsx
import React from "react";

const CustomInput = ({
  register,
  className = "",
  type = "text",
  placeholder,
  onChange,
  isTextarea = false,
  passwordVisibility,
  ...props
}) => {
  const baseStyles =
    "flex-grow bg-transparent text-base placeholder-gray-500 outline-none";

  if (isTextarea) {
    return (
      <textarea
        {...register}
        className={`${baseStyles} min-h-[6rem] resize-none ${className}`}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    );
  }

  return (
    <input
      {...register}
      type={type === "password" && !passwordVisibility ? "password" : "text"}
      className={`${baseStyles} h-10 ${className}`}
      placeholder={placeholder}
      onChange={onChange}
      {...props}
    />
  );
};

export default CustomInput;
