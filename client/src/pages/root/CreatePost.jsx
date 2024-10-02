import { useState } from "react";
import FormComponent from "../../components/FormComponent";
import Location from "../../components/Location";

const page = () => {
  const[formType,setFormType] = useState("volunteer")

  return (
    <section className="flex items-center flex-col my-2 gap-4">
      <h1>Create Post as:</h1>
      <div className="flex items-center">
        <label>
          <input
            type="radio"
            value="volunteer"
            checked={formType === "volunteer"}
            onChange={() => setFormType("volunteer")}
          />
          Volunteer
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="organization"
            checked={formType === "organization"}
            onChange={() => setFormType("organization")}
          />
          Organization
        </label>
      </div>
      <Location/>
      <div className="pop">
        <FormComponent formType={formType} />
      </div>
    </section>
  );
};

export default page;
