import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaCommentDots,
  FaWrench,
} from "react-icons/fa";
import { MdKeyboardAlt } from "react-icons/md";
import { organizationSchema, volunteerSchema } from "../schema/FormSchema";
import CustomInput from "./UI/CustomInput";
import CustomInputWithIcon from "./UI/CustomInputWithIcon";
import { opportunityCategories, skills } from "../utils/formConfig";
import { submitForm } from "../api/queries/volunteerPost";
import { useUserContext } from "../context/AuthProvider";
import { Controller } from "react-hook-form";
import MultiSelect from "./UI/MultiSelect";

const FormComponent = ({ formType }) => {
  const { location,user } = useUserContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [preview, setPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDateValue, setStartDateValue] = useState("");
const [endDateValue, setEndDateValue] = useState("");

const today = new Date().toISOString().split("T")[0]
  const schema =
    formType === "volunteer" ? volunteerSchema : organizationSchema;

    // react-hook-form with zod setup
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  console.log(errors);

  // form submit function
  const onSubmit = async (data) => {
    if(!user){
        
      toast.error("Please login to create post");
      return;
      }
    console.log(data);
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      // Append role-based fields
      formData.append(
        "role",
        formType === "volunteer" ? "Volunteer" : "Organization"
      );

      // Append skills or category
      if (formType === "volunteer" && data.skills) {
        formData.append("skills", JSON.stringify(data.skills));
      }

      if (formType === "organization" && data.category) {
        formData.append("category", JSON.stringify(data.category));
      }

      // Append location
      Object.entries(location).forEach(([key, val]) => {
        formData.append(key, val);
      });

  Object.entries(data).forEach(([key, val]) => {
    if (!["skills", "category"].includes(key)) {
      formData.append(key, val);
    }
  });

      const res = await submitForm(formData);
      if (res.success) {
        toast.success(res.message || "Post created successfully!");
        navigate("/");
      }
    } catch (e) {
      console.error(e);
      
      toast.error(error?.data?.message || "Failed to create post . Please try again");
    } finally {
      console.log("setting to false")
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <CustomInputWithIcon
        register={register("title")}
        placeholder="Title"
        icon={FaCommentDots}
      />
      {errors.title && (
        <p className="col-span-full text-red-500">{errors.title.message}</p>
      )}

      <CustomInputWithIcon
        register={register("description")}
        placeholder="Description"
        icon={MdKeyboardAlt}
        isTextarea
      />
      {errors.description && (
        <p className="col-span-full text-red-500">
          {errors.description.message}
        </p>
      )}

      <CustomInputWithIcon
        register={register("contactEmail")}
        placeholder="Email"
        icon={FaEnvelope}
      />
      {errors.contactEmail && (
        <p className="text-red-500">{errors.contactEmail.message}</p>
      )}

      <CustomInputWithIcon
        register={register("contactPhone")}
        placeholder="Phone"
        icon={FaPhoneAlt}
      />
      {errors.contactPhone && (
        <p className="text-red-500">{errors.contactPhone.message}</p>
      )}

{/* Dates */}
      <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div>
    <label className="block text-sm font-medium mb-1">Available From</label>
    <input
      type="date"
      {...register("startDate")}
      min={today}
      max={endDateValue || undefined}
      value={startDateValue}
      onChange={(e) => setStartDateValue(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
    />
    {errors.startDate && (
      <p className="text-red-500 text-sm">{errors.startDate.message}</p>
    )}
  </div>

  {/* END DATE */}
  <div>
    <label className="block text-sm font-medium mb-1">Available Till</label>
    <input
      type="date"
      {...register("endDate")}
      min={startDateValue || today}
      value={endDateValue}
      onChange={(e) => setEndDateValue(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
    />
    {errors.endDate && (
      <p className="text-red-500 text-sm">{errors.endDate.message}</p>
    )}
  </div>
      </div>
      {/* Upload image */}
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

{/* image preview */}
        {preview && (
          <div className="mt-4">
            {/* thumbnail */}
            <img
              src={preview}
              alt="Thumbnail Preview"
              onClick={() => setModalOpen(true)}
              className="w-16 h-16 object-cover rounded-md cursor-pointer border"
            />

            {/* modal */}
            {modalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setModalOpen(false)}
              >
                <div
                  className="relative bg-white p-5 rounded-md max-w-[90%] max-h-[90%]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={preview}
                    alt="Full Preview"
                    className="max-w-full max-h-[80vh] object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Volunteer specific */}
    {formType === "volunteer" && (
  <>
    <div className="col-span-full">
      <label>Skills</label>
      <Controller
        name="skills.skillName"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <MultiSelect
            options={skills}
            value={field.value}
            onChange={field.onChange}
            placeholder="Select skills"
          />
        )}
      />
      {errors.skills?.skillName && (
        <p className="text-red-500">{errors.skills.skillName.message}</p>
      )}
    </div>

    <div className="col-span-full">
      <CustomInputWithIcon
        register={register("skills.description")}
        placeholder="Skill Description"
        icon={FaWrench}
        isTextarea
      />
      {errors.skills?.description && (
        <p className="text-red-500">{errors.skills.description.message}</p>
      )}
    </div>
  </>
)}

      {/* Organization specific */}
     {formType === "organization" && (
  <>
    <div className="col-span-full">
      <label>Category</label>
      <Controller
        name="category.categoryName"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <MultiSelect
            options={[{ label: "Categories", options: opportunityCategories }]}
            value={field.value}
            onChange={field.onChange}
            placeholder="Select categories"
          />
        )}
      />
      {errors.category?.categoryName && (
        <p className="text-red-500">{errors.category.categoryName.message}</p>
      )}
    </div>

    <div className="col-span-full">
      <CustomInputWithIcon
        register={register("category.description")}
        placeholder="Category Description"
        icon={FaWrench}
        isTextarea
      />
      {errors.category?.description && (
        <p className="text-red-500">{errors.category.description.message}</p>
      )}
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
