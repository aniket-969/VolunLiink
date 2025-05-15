import React, { useState } from "react";
import FormComponent from "../../components/FormComponent";
import Location from "../../components/Location";

const CreatePostPage = () => {
  const [formType, setFormType] = useState("volunteer");

  return (
    <section className="max-w-3xl mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Create a New Post</h1>

      {/* Form Type Toggle */}
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 rounded-l-full border border-gray-300 font-medium transition 
            ${formType === "volunteer" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
          onClick={() => setFormType("volunteer")}
        >
          Volunteer
        </button>
        <button
          className={`px-6 py-2 rounded-r-full border-t border-b border-r border-gray-300 font-medium transition 
            ${formType === "organization" ? "bg-green-600 text-white" : "bg-white text-gray-700"}`}
          onClick={() => setFormType("organization")}
        >
          Organization
        </button>
      </div>

      {/* Location Picker */}
      <div className="mb-8">
        <Location />
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
        <FormComponent formType={formType} />
      </div>
    </section>
  );
};

export default CreatePostPage;