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
import CustomInput from "../../../components/UI/CustomInput";
import CustomInputWithIcon from "../../../components/UI/CustomInputWithIcon";

const SigninForm = () => {

  const [cookies, setCookies, removeCookie] = useCookies("accessToken")

  const navigate = useNavigate();

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, setUser } = useUserContext();
  console.log(errors)
  const onsubmit = async (data) => {
    console.log(data)
    try {


    } catch (error) {

    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-2 ">
        <h1 className="text-[#4361ee] text-3xl font-semibold">Sign in</h1>
        <p>Enter your credentials to login</p>
      </div>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className=" flex flex-col gap-4 w-[95%] lg:w-[90%]"
      >
        <CustomInputWithIcon register={register('identifier')} placeholder="Username or Email" icon={FaEnvelope} />
        <CustomInputWithIcon register={register('password')} type="password" placeholder="Password" icon={FaRegKeyboard} />

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

      <Guest />
    </>
  );
};

export default SigninForm;
