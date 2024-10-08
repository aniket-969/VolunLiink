import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { FaImagePortrait } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { FaRegKeyboard } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema } from "../../../schema/UserSchema";
import CustomInputWithIcon from "../../../components/UI/CustomInputWithIcon";

const SignupForm = () => {

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ resolver: zodResolver(userSchema) })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null)

  const navigate = useNavigate();

  const onSubmit = async (data) => {

    setIsSubmitting(true)
    console.log(data)
    const formData = new FormData()
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('email', data.email);
    formData.append('fullName', data.fullName);
    formData.append('avatar', data.avatar);
     
    try {
      const response = await axios.post("http://localhost:9000/api/v1/users/register", formData)
     
      if(response.data.success){
         console.log(response.data)
         toast.success(response.data.message)
         navigate('/sign-in')
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setIsSubmitting(false)
    }
  };

  return (

    <>

      <div className="  flex flex-col items-start gap-2  ">
        <h1 className="text-[#4361ee] text-3xl font-semibold md:text-blac lg:text-red">Sign Up</h1>
        <p className="text-md">Create your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-4 w-[95%] lg:w-[90%]">

        <CustomInputWithIcon register={register('fullName')} placeholder="Name" icon={FaUser} />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
        <CustomInputWithIcon register={register('username')} placeholder="Username" icon={FaImagePortrait} />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        <CustomInputWithIcon register={register('email')} placeholder="Email" icon={FaEnvelope} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <CustomInputWithIcon register={register('password')} type="password" placeholder="Password" icon={FaRegKeyboard} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <div>

          <input
            type="file"
            id="file"
            style={{ display: 'none' }}
            {...register('avatar', {
              onChange: (e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setValue('avatar', selectedFile);
                  setSelectedFileName(selectedFile.name);
                  setImagePreview(URL.createObjectURL(selectedFile));
                }
              }
            })}
          />

          <div className="flex gap-4 ">
            <label htmlFor="file" className="custom-file-input bl p-1" style={{ cursor: 'pointer', display: 'inline-block' }}>
              Choose File

            </label>
            <span>{selectedFileName}</span>
          </div>

          {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}

          <div className=" flex justify-center ">
            {imagePreview && <img className="  w-[20rem] max-h-[16rem] my-2 rounded-xl sm:max-h-[25rem]" src={imagePreview} alt="Selected file" style={{ maxWidth: '100%' }} />}
          </div>

        </div>

        <button type="submit" className="bg-[#4361ee] text-white text-xl p-3 my-2">Sign Up</button>
      </form>

      <div className="flex gap-5">
        <p>Already a user?</p>
        <Link to="/sign-in" className="text-[#4361ee] font-semibold ">
          Sign in
        </Link>
      </div>

    </>
  );
};

export default SignupForm;
