import React, { useEffect, useState } from 'react'
import { getPosts } from '../../utils/fetchVolunteerData'
import { useUserContext } from '../../context/AuthProvider'
import Location from '../../components/Location'
import Card from '../../components/UI/Card'
import Navbar from '../../components/Navbar'
import { useInView } from 'react-intersection-observer'

const Home = () => {

  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [ref, inView] = useInView()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState({})
  const { userLocation } = useUserContext()
  const latitude = 12.9716;
  const longitude = 77.5946;

  const fetchPosts = async (page = 1, limit = 5, filter = {}, latitude, longitude) => {

    const postData = await getPosts(page, limit, filter, latitude, longitude)

    setPosts(postData)
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()

  }, [])

  const loadMorePosts = async () => {
    const next = page + 1

    const newPosts = await getPosts(next, 5, filter, latitude, longitude)

    if (newPosts?.length) {
      setPage(next)
      setPosts((prev) => [...prev, ...newPosts])
    }
  }

  useEffect(() => {
    if (inView) {
      console.log("in view")
      loadMorePosts()
    }
  }, [inView])

  useEffect(() => {

    const fetchFilteredPosts = async () => {
      const filteredPosts = await fetchPosts(1, 5, filter, latitude, longitude)
      console.log(filteredPosts)
      setPosts(filteredPosts)
      setPage(1)
    }
    if (Object.keys(filter).length > 0) {
      console.log("in filter")
      fetchFilteredPosts()
    }

  }, [filter])

  console.log(posts);

  return (
    <>
      <Navbar />
      <section className='flex flex-col items-center'>

        <div className='flex flex-col gap-2  md:max-w-[710px] '>

          {loading && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50 gap-3">
              <p>Loading...</p>
              <div className=" border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin text-2xl  ">....</div>

            </div>
          )}

          <div className='flex mt-5 b justify-center items-center gap-3'>
            <label >Filter by :</label>
            <select className='bl p-1.5 text-sm bg-white w-[50%] ' >
              <option >Default</option>
              <option >Nearest to you</option>
              <option >Volunteers only</option>
              <option > Opportunity only</option>
              <option >Latest</option>

            </select>
          </div>

          {/* Search */}
          <div className='flex m-3 justify-center items-center gap-3 mx-6 '>

            <label >Search by:</label>

            <select id="skills" className="p-1.5  w-[40%] text-sm bg-white bl truncate"  >
              <option value="">Skills</option>
              <optgroup label="Technical Skills">
                <option value="programming">Programming</option>
                <option value="webDevelopment">Web Development</option>
                <option value="graphicDesign">Graphic Design</option>
              </optgroup>

              <optgroup label="Communication Skills">
                <option value="writing">Writing</option>
                <option value="editing">Editing</option>
                <option value="publicSpeaking">Public Speaking</option>
              </optgroup>

              <optgroup label="Administrative Skills">
                <option value="projectManagement">Project Management</option>
                <option value="eventPlanning">Event Planning</option>
              </optgroup>

              <optgroup label="Creative Skills">
                <option value="artisticAbilities">Artistic Abilities</option>
                <option value="photography">Photography</option>
              </optgroup>

              <optgroup label="Language Skills">
                <option value="fluencyInLanguages">
                  Fluency in Multiple Languages
                </option>
              </optgroup>

              <optgroup label="Interpersonal Skills">
                <option value="teamwork">Teamwork</option>
                <option value="leadership">Leadership</option>
              </optgroup>

              <optgroup label="Organizational Skills">
                <option value="timeManagement">Time Management</option>
                <option value="planningAndCoordination">
                  Planning and Coordination
                </option>
              </optgroup>

              <optgroup label="Education and Training">
                <option value="tutoring">Tutoring</option>
                <option value="mentoring">Mentoring</option>
              </optgroup>

              <optgroup label="Healthcare Skills">
                <option value="firstAidAndCPR">First Aid and CPR</option>
                <option value="medicalAssistance">Medical Assistance</option>
              </optgroup>

              <optgroup label="Environmental Skills">
                <option value="conservation">Conservation</option>
                <option value="sustainability">Sustainability</option>
              </optgroup>

              <optgroup label="Specialized Skills">
                <option value="legal">Legal</option>
                <option value="financeAndAccounting">Finance and Accounting</option>
              </optgroup>

              <optgroup label="Manual Skills">
                <option value="carpentry">Carpentry</option>
                <option value="plumbing">Plumbing</option>
              </optgroup>

              <optgroup label="Other">
                <option value="otherSkills">Other Skills</option>
              </optgroup>
            </select>
            <select id="opportunityCategory" className='w-[40%] p-1.5 text-sm bl bg-white truncate' >
              <option value="">Opportunity</option>
              <option value="fundraising">Fundraising</option>
              <option value="eventPlanning">Event Planning</option>
              <option value="socialMediaManagement">Social Media Management</option>
              <option value="webDevelopment">Web Development</option>
              <option value="graphicDesign">Graphic Design</option>
              <option value="volunteerCoordination">Volunteer Coordination</option>
              <option value="marketing">Marketing</option>
              <option value="dataEntry">Data Entry</option>
              <option value="tutoring">Tutoring or Mentoring</option>
              <option value="environmentalConservation">Environmental Conservation</option>
              <option value="communityOutreach">Community Outreach</option>
              <option value="healthcare">Healthcare Services</option>
              <option value="legalAssistance">Legal Assistance</option>
              <option value="foodDistribution">Food Distribution</option>
              <option value="educationalPrograms">Educational Programs</option>
              <option value="marathon">Marathon</option>
              <option value="other">Other</option>

            </select>

          </div>

          {/* <Location /> */}
          {loading ? <p></p> :

            posts.map(post => (

              <Card key={post._id} post={post} />

            ))

          }
        </div>

        {!loading && <div
          ref={ref}
          className='col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4'
        >
          <svg
            aria-hidden='true'
            className='h-10 w-10 animate-spin fill-sky-600 text-gray-200 dark:text-gray-600'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
          <span className='sr-only'>Loading...</span>
        </div>
        }

      </section>
    </>

  )
}

export default Home

