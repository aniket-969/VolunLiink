import { opportunityCategoryFormSchema, skillFormSchema } from "../schema/FormSchema"
import CustomInput from "./UI/CustomInput";
import CustomInputWithIcon from "./UI/CustomInputWithIcon";
import { opportunityCategories, skills } from './../utils/formConfig';
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaEnvelope, FaWrench } from "react-icons/fa6";
import { FaImagePortrait } from "react-icons/fa6";
import { FaRegKeyboard } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa"
import { MdKeyboardAlt } from "react-icons/md";
import { FaCommentDots } from "react-icons/fa"
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const FormComponent = ({ formType }) => {

    const schema = formType === "volunteer" ? skillFormSchema : opportunityCategoryFormSchema

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFileName, setSelectedFileName] = useState("No file chosen");
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState(null)
    console.log(errors, getValues('image'))

    const onSubmit = (data) => {


        setIsSubmitting(true)
        console.log(data)
        try {

        } catch (error) {

        }
    }


    const commonFields = (
        <>
            <CustomInputWithIcon register={register('title')} placeholder="Title" icon={FaCommentDots} />
            <CustomInputWithIcon register={register('description')} placeholder="Description" icon={MdKeyboardAlt} isTextarea />
            <CustomInputWithIcon register={register('email')} placeholder="Email" icon={FaEnvelope} />
            <CustomInputWithIcon register={register('phone')} placeholder="Phone" icon={FaPhoneAlt} />
            <div className=" flex items-center justify-start gap-2" >

                <label >Available from:</label>
                <CustomInput
                    type="date"
                    className="bglight p-2"
                    register={register("availableFrom")}
                />
            </div>


            <div className=" flex items-center justify-start gap-6" >

                <label >Available till:</label>
                <CustomInput
                    type="date"
                    className="bglight p-2"
                    register={register("availableTill")}

                />
            </div>

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
            <CustomInputWithIcon icon={FaWrench} register={register('categoryDescription')} isTextarea placeholder="Description" />
        </>
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {formType === 'volunteer' && volunteerFields}
                {formType === 'organization' && organizationFields}
                <button type="submit" className='bg-black text-white py-1' disabled={isSubmitting}>Add Post</button>
            </form>


        </>
    );
};

export default FormComponent;
