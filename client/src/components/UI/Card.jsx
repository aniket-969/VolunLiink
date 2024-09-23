import React from 'react';
import { formatDate, formatUpdatedAt } from '../../utils/fetchVolunteerData';
import { Link } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';

const Card = ({ post, handleDelete }) => {

    const {
        _id,
        createdBy,
        updatedAt,
        startDate,
        endDate,
        images,
        title,
        description,
        contactEmail,
        contactPhone,
        skills,
        category,
        location,
    } = post

    return (
        <div className='pop1 flex flex-col gap-4 mx-5 my-2 px-5 py-4 rounded-2xl'>

            <div className='flex items-center gap-5 justify-between'>
                {/* Post name and username */}
                <div className='flex flex-col'>
                    <div className='flex items-center text-sm md:text-lg max-w-[12rem]'>
                        <p>{createdBy?.fullName.split(' ')[0]}</p>
                        <span className="mx-2 h-4 w-[2.5px] bg-dark"></span>
                        <p className='truncate'>@{createdBy?.username}</p>
                    </div>
                    <p className='text-xs'>{formatUpdatedAt(updatedAt)}</p>
                </div>

                {/* Post availability and delete button */}
                <div className='text-xs flex flex-col gap-1 items-center'>
                    {handleDelete && (
                        <button onClick={() => handleDelete(_id)} className='text-red-500 text-xl'>
                            <MdOutlineDeleteOutline />
                        </button>
                    )}
                    {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                </div>
            </div>

            <Link to={`/posts/${_id}`}>
                {/* Post image */}
                <img
                    src={images?.[0] || 'fallback-image-url.jpg'}
                    className="w-full max-h-[16rem] my-2 rounded-xl sm:max-h-[25rem]"
                    alt={title || 'Post image'}
                />

                {/* Post description */}
                <div className='mt-6'>
                    <div>
                        <p className='text-base md:text-lg'>{title}</p>
                        <p className='line-clamp-2 text-sm md:text-base'>{description}</p>
                    </div>
                    <div className='text-sm md:text-base'>
                        <p>Email: {contactEmail}</p>
                        <p>Phone: {contactPhone}</p>
                    </div>
                </div>

                {/* Skills and Category */}
                {skills && <p className='text-sm md:text-base'>Skills - {skills.skillName}</p>}
                {category && <p className='text-sm md:text-base'>Category - {category.categoryName}</p>}

                {/* Post location */}
                <div className='flex justify-center items-center mt-3'>
                    <p className='text-xs flex items-center justify-center w-[19rem]'>
                        Posted from: {location?.road}, {location?.village}, {location?.county}, {location?.state}, {location?.country}
                    </p>
                </div>
            </Link>

        </div>
    );
};

export default Card;
