import React, { useRef, useState } from "react";
import { FaCameraRetro } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

const ProfileImageUpload = ({ user }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('avatar', file);

            // await updateUserAvatar(formData);
            console.log(file)
            setIsUploading(false)
        }
    };

    return (
        <div className="relative">

            <figure>
                <img src={user.avatar} alt="profile image" className="rounded-full w-32 h-32" />
            </figure>

            <i
                className="absolute bottom-2 right-2 bg-gray-300 rounded-full text-black p-1 cursor-pointer hover:bg-gray-500"
                onClick={triggerFileInput}
                title="Upload image"
            >
                <FaCameraRetro />
            </i>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleImageChange}
                className="hidden"
            />
            {isUploading && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 rounded-full">
                    <AiOutlineLoading className="text-white animate-spin" size={24} />
                </div>
            )}
        </div>
    );
};

export default ProfileImageUpload;
