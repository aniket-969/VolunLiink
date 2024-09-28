
const CustomInput = ({
  register,
  className,
  type = 'text',
  placeholder,
  onChange,
  isTextarea = false,
  isPassword = false,
  passwordVisibility,
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

if(type == "password"){
  
  return (
    <div className="relative">
      <input
        {...register}
        className={`bg-[#F0F8FF] w-[100%] text-lg outline-none ${className}`} autoComplete="new-password"
        type={ passwordVisibility ? "text" : type}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
      
    </div>
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