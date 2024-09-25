import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { FaImagePortrait } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { FaRegKeyboard } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Guest from "./Guest";
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
  console.log(errors, getValues('image'))


  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data)
    
   try {
    
   } catch (error) {
    
   }
  };

  return (

    <>

      <div className="  flex flex-col items-start gap-2  ">
        <h1 className="text-[#4361ee] text-3xl font-semibold md:text-blac lg:text-red">Sign Up</h1>
        <p className="text-md">Create your account</p>
      </div>

      <form onSubmit={handleSubmit(onsubmit)} className=" flex flex-col gap-4 w-[95%] lg:w-[90%]">

        <CustomInputWithIcon register={register('fullName')} placeholder="Name" icon={FaUser} />
        <CustomInputWithIcon register={register('username')} placeholder="Username" icon={FaImagePortrait} />
        <CustomInputWithIcon register={register('email')} placeholder="Email" icon={FaEnvelope} />
        <CustomInputWithIcon register={register('password')} type="password"  placeholder="Password" icon={FaRegKeyboard} />

        <div>

          <input
            type="file"
            id="file"
            style={{ display: 'none' }}
            {...register('image', {
              onChange: (e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setValue('image', selectedFile);
                  setSelectedFileName(selectedFile.name);
                  setImagePreview(URL.createObjectURL(selectedFile));
                }
              }
            })}
          />

          <div className="flex gap-4">
            <label htmlFor="file" className="custom-file-input" style={{ cursor: 'pointer', display: 'inline-block' }}>
              Choose File

            </label>
            <span>{selectedFileName}</span>
          </div>

          {errors.image && <p className="text-red-500">{errors.image.message}</p>}

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

      <Guest />
    </>
  );
};

export default SignupForm;
