import { opportunityCategoryFormSchema, skillFormSchema } from "../schema/FormSchema"
import CustomInput from "./UI/CustomInput";
import CustomInputWithIcon from "./UI/CustomInputWithIcon";
import { opportunityCategories, skills } from './../utils/formConfig';
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaWrench } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa"
import { MdKeyboardAlt } from "react-icons/md";
import { FaCommentDots } from "react-icons/fa"
import { zodResolver } from '@hookform/resolvers/zod';
import { submitCategoryForm, submitForm, submitSkillForm } from "../utils/fetchVolunteerData";
import { useUserContext } from "../context/AuthProvider";

const FormComponent = ({ formType }) => {

    const schema = formType === "volunteer" ? skillFormSchema : opportunityCategoryFormSchema
    const { location } = useUserContext()
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFileName, setSelectedFileName] = useState("No file chosen");
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState(null)
 const navigate = useNavigate()
    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const formData = new FormData();

        // Handle skill submission if skillName and skillDescription are provided
        if (data.skillName && data.skillDescription) {
            const skillId = await submitSkillForm(data.skillName, data.skillDescription);
            formData.append('skillId', skillId);
            formData.append('role', 'Volunteer');
        }

        // Handle category submission if categoryName and categoryDescription are provided
        if (data.categoryName && data.categoryDescription) {
            const categoryId = await submitCategoryForm(data.categoryName, data.categoryDescription);
            console.log(categoryId)
            formData.append('categoryId', categoryId);
            formData.append('role', 'Organization');
        }
        const { latitude, longitude, country, state, road, county, village } = location;

        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('country', country);
        formData.append('state', state);
        formData.append('road', road);
        formData.append('county', county);
        formData.append('village', village);

        Object.entries(data).forEach(([key, value]) => {
            if (key !== "skillName" && key !== "skillDescription" && key !== "categoryName" && key !== "categoryDescription") {
                formData.append(key, value);
            }
        });

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        const response = await submitForm(formData)
        console.log(response)
        if(response.success){
             toast.success(response.message || "Post added successfully")
             navigate("/")
        }
        setIsSubmitting(false)
    }

    const commonFields = (
        <>
            <CustomInputWithIcon register={register('title')} placeholder="Title" icon={FaCommentDots} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            <CustomInputWithIcon register={register('description')} placeholder="Description" icon={MdKeyboardAlt} isTextarea />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            <CustomInputWithIcon register={register('contactEmail')} placeholder="Email" icon={FaEnvelope} />
            {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>}
            <CustomInputWithIcon register={register('contactPhone')} placeholder="Phone" icon={FaPhoneAlt} />
            {errors.contactPhone && <p className="text-red-500 text-sm">{errors.contactPhone.message}</p>}
            <div className=" flex items-center justify-start gap-2" >
 
                <label >Available from:</label>
                <CustomInput
                    type="date"
                    className="bglight p-2"
                    register={register("startDate")}
                />

            </div>
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}

            <div className=" flex items-center justify-start gap-6" >

                <label >Available till:</label>
                <CustomInput
                    type="date"
                    className="bglight p-2"
                    register={register("endDate")}

                />

            </div>
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
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
        </>
    );

    const volunteerFields = (
        <>
            {commonFields}
            <label htmlFor="skills" className="bg-light w-[60%]">Select skills:</label>
            <select id="skills" className="w-[100%] px-3 py-2 bglight" onChange={(e) => setValue('skillName', e.target.value)}>
                {skills.map((optGroup, index) => (
                    <optgroup key={index} label={optGroup.label}>
                        {optGroup.options.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <CustomInputWithIcon icon={FaWrench} register={register('skillDescription')} isTextarea placeholder="Skill Description" />
            {errors.skillDescription && <p className="text-red-500 text-sm">{errors.skillDescription.message}</p>}
        </>
    );

    const organizationFields = (
        <>
            {commonFields}
            <label htmlFor="skills" className="bg-light w-[60%]">Opportunity category:</label>
            <select className='w-[100%] px-3 py-2 bglight' onChange={(e) => setValue('categoryName', e.target.value)}>
                {opportunityCategories.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
            <CustomInputWithIcon icon={FaWrench} register={register('categoryDescription')} isTextarea={true} placeholder="Description" />
            {errors.categoryDescription && <p className="text-red-500 text-sm">{errors.categoryDescription.message}</p>}
        </>
    );

    return (
        <>
            <div className="m-1 p-2 flex flex-col justify-center items-center sm:max-w-[710px] bb">


                <form onSubmit={handleSubmit(onSubmit)}>
                    {formType === 'volunteer' && volunteerFields}
                    {formType === 'organization' && organizationFields}
                    <button type="submit" className='bg-black text-white py-1' disabled={isSubmitting}>Add Post</button>
                </form>
            </div>

        </>
    );
};

export default FormComponent;
