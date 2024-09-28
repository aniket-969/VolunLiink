import React from "react";
import { FaEnvelope } from "react-icons/fa6";
import { FaRegKeyboard } from "react-icons/fa6";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useUserContext } from "../../../context/AuthProvider";
import Guest from "./Guest";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../../schema/UserSchema";
import CustomInputWithIcon from "../../../components/UI/CustomInputWithIcon";

const SigninForm = () => {

  const [cookies, setCookies, removeCookie] = useCookies("accessToken")

  const navigate = useNavigate();

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, setUser } = useUserContext();
  console.log(errors)
  const onSubmit = async (data) => {
    console.log(data)
    const formData = new FormData()
    formData.append('identifier', data.identifier)
    formData.append('password', data.password)
   for(let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    try {
      const user = await axios.post("http://localhost:9000/api/v1/users/login", formData)
      console.log(user)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-2 ">
        <h1 className="text-[#4361ee] text-3xl font-semibold">Sign in</h1>
        <p>Enter your credentials to login</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col gap-4 w-[95%] lg:w-[90%]"
      >
        <CustomInputWithIcon register={register('identifier')} placeholder="Username or Email" icon={FaEnvelope} />
        {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier.message}</p>}
        <CustomInputWithIcon register={register('password')} type="password" placeholder="Password" icon={FaRegKeyboard} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          type="submit"
          className="bg-[#4361ee] text-white text-xl p-3 my-2"
        >
          Sign In
        </button>
      </form>

      <div className="flex gap-5">
        <p>Don't have an account ?</p>
        <Link to="/sign-up" className="text-[#4361ee] font-semibold ">
          Sign Up
        </Link>
      </div>

    </>
  );
};

export default SigninForm;
