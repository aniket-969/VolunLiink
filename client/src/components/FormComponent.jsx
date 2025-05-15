import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaCommentDots,FaWrench
} from "react-icons/fa";
import { MdKeyboardAlt } from "react-icons/md";
import { formSchema } from "../schema/FormSchema";
import CustomInput from "./UI/CustomInput";
import CustomInputWithIcon from "./UI/CustomInputWithIcon";
import { opportunityCategories, skills } from "../utils/formConfig";
import { submitForm } from "../api/queries/volunteerPost";
import { useUserContext } from "../context/AuthProvider";

const FormComponent = ({ formType }) => {
  const { location } = useUserContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      // Append role-based fields
      formData.append("role", formType === "volunteer" ? "Volunteer" : "Organization");

      // Append skills or category
      if (formType === "volunteer" && data.skillName) {
        formData.append("skills", JSON.stringify({
          skillName: data.skillName,
          description: data.skillDescription,
        }));
      }
      if (formType === "organization" && data.categoryName) {
        formData.append("category", JSON.stringify({
          categoryName: data.categoryName,
          description: data.categoryDescription,
        }));
      }

      // Append location
      Object.entries(location).forEach(([key, val]) => {
        formData.append(key, val);
      });

      // Append other fields
      Object.entries(data).forEach(([key, val]) => {
        if (!["skillName", "skillDescription", "categoryName", "categoryDescription"].includes(key)) {
          formData.append(key, val);
        }
      });

      const res = await submitForm(formData);
      if (res.success) {
        toast.success(res.message || "Post created!");
        navigate("/");
      }
    } catch (e) {
      console.error(e);
      toast.error("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CustomInputWithIcon
        register={register("title")}
        placeholder="Title"
        icon={FaCommentDots}
      />
      {errors.title && <p className="col-span-full text-red-500">{errors.title.message}</p>}

      <CustomInputWithIcon
        register={register("description")}
        placeholder="Description"
        icon={MdKeyboardAlt}
        isTextarea
      />
      {errors.description && (
        <p className="col-span-full text-red-500">{errors.description.message}</p>
      )}

      <CustomInputWithIcon
        register={register("contactEmail")}
        placeholder="Email"
        icon={FaEnvelope}
      />
      {errors.contactEmail && <p className="text-red-500">{errors.contactEmail.message}</p>}

      <CustomInputWithIcon
        register={register("contactPhone")}
        placeholder="Phone"
        icon={FaPhoneAlt}
      />
      {errors.contactPhone && <p className="text-red-500">{errors.contactPhone.message}</p>}

      <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Available From</label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Available Till</label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="col-span-full">
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="avatar"
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200"
          >
            Choose File
            <input
              id="avatar"
              type="file"
              accept="image/*"
              {...register("avatar", {
                onChange: (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFileName(file.name);
                    setPreview(URL.createObjectURL(file));
                    setValue("avatar", file);
                  }
                },
              })}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-600">{fileName}</span>
        </div>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-full max-h-48 object-cover rounded-md"
          />
        )}
      </div>

      {formType === "volunteer" && (
        <>
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">Select Skill</label>
            <select
              {...register("skillName")}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {skills.map((group, i) => (
                <optgroup key={i} label={group.label}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="col-span-full">
            <CustomInputWithIcon
              register={register("skillDescription")}
              placeholder="Skill Description"
              icon={FaWrench}
              isTextarea
            />
            {errors.skillDescription && <p className="text-red-500">{errors.skillDescription.message}</p>}
          </div>
        </>
      )}

      {formType === "organization" && (
        <>
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">Select Category</label>
            <select
              {...register("categoryName")}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {opportunityCategories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-full">
            <CustomInputWithIcon
              register={register("categoryDescription")}
              placeholder="Category Description"
              icon={FaWrench}
              isTextarea
            />
            {errors.categoryDescription && <p className="text-red-500">{errors.categoryDescription.message}</p>}
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="col-span-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {isSubmitting ? "Submitting..." : "Add Post"}
      </button>
    </form>
  );
};

export default FormComponent;
