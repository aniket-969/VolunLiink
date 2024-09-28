import FormComponent from "../../components/FormComponent"

const page = () => {
  return (
    <section className="flex items-center flex-col my-2 gap-4"><h1>Create Post</h1>
      <div className="pop">
        <FormComponent formType='organization' />
      </div>

    </section>
  )
}

export default page 