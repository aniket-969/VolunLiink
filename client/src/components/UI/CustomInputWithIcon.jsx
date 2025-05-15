// CustomInputWithIcon.jsx
import React, { useState } from "react";
import CustomInput from "./CustomInput";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const CustomInputWithIcon = ({
  icon: Icon,
  register,
  type = "text",
  placeholder,
  isTextarea = false,
  className = "",
  onChange,
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  return (
    <div
      className={`
        flex items-center gap-3
        bg-[#F0F8FF] p-2 rounded-lg
        focus-within:ring-2 ring-blue-300
        ${isTextarea ? "items-start" : "items-center"}
      `}
    >
      <Icon className="text-gray-600 w-5 h-5 flex-shrink-0" />

      <CustomInput
        register={register}
        type={type}
        placeholder={placeholder}
        isTextarea={isTextarea}
        className={className}
        onChange={onChange}
        passwordVisibility={passwordVisibility}
      />

      {type === "password" && (
        <button
          type="button"
          onClick={() => setPasswordVisibility((v) => !v)}
          className="text-gray-600 w-5 h-5 flex-shrink-0"
        >
          {passwordVisibility ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
};

export default CustomInputWithIcon;
