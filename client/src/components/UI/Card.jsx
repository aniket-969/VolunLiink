import React from "react";
import { formatDate, formatUpdatedAt } from "../../utils/date";
import { Link } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";

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
  } = post;

  // Date formatting …
  const start = startDate ? formatDate(startDate) : null;
  const end = endDate ? formatDate(endDate) : null;
  let dateDisplay;
  if (start && end) dateDisplay = `${start} – ${end}`;
  else if (start) dateDisplay = `From ${start}`;
  else if (end) dateDisplay = `Until ${end}`;
  else dateDisplay = "N/A";

  return (
    <div className="pop1 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row gap-6 p-6 rounded-2xl mx-5 my-4">
      {/* Image */}
      <Link to={`/posts/${_id}`} className="flex-shrink-0 md:w-1/3">
        <img
          src={images?.[0] || "fallback.jpg"}
          loading="lazy"
          alt={title}
          className="w-full h-48 md:h-full object-cover rounded-lg"
        />
      </Link>

      {/* Content */}
      <div className="flex-grow flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg md:text-xl font-semibold truncate">
              {title}
            </h2>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span>{createdBy?.fullName.split(" ")[0]}</span>
              <span className="mx-2 h-4 w-px bg-dark" />
              <span className="truncate">@{createdBy?.username}</span>
              <span className="mx-2">·</span>
              <time>{formatUpdatedAt(updatedAt)}</time>
            </div>
          </div>
          {/* Date & Delete */}
          <div className="flex flex-col items-end text-sm text-gray-600">
            <time className="mb-2">{dateDisplay}</time>
            {handleDelete && (
              <button
                onClick={() => handleDelete(_id)}
                className="text-red-500 text-2xl"
              >
                <MdOutlineDeleteOutline />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-3 text-sm text-gray-700">{description}</p>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {skills?.skillName?.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className="px-2 py-1 text-xs font-medium bg-blue-100 rounded-full"
            >
              {skill}
            </span>
          ))}

          {category?.categoryName?.map((cat, idx) => (
            <span
              key={`${cat}-${idx}`}
              className="px-2 py-1 text-xs font-medium bg-green-100 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600">
          <div>
            <p>Email: {contactEmail}</p>
            <p>Phone: {contactPhone}</p>
          </div>
        </div>

        {/* Location */}
        <div className="mt-4 text-xs text-gray-500">
          Posted from:{" "}
          {[
            location?.road,
            location?.village,
            location?.county,
            location?.state,
            location?.country,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      </div>
    </div>
  );
};

export default Card;
