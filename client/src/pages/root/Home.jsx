import React, { useEffect, useState } from 'react';
import { getPosts } from "../../api/queries/volunteerPost"
import Location from '../../components/Location';
import Card from '../../components/UI/Card';
import Navbar from '../../components/Navbar';
import { useInView } from 'react-intersection-observer';
import Filter from '../../components/Filter';
import Search from '../../components/Search';
import Map from '../../components/Map';
import { useUserContext } from '../../context/AuthProvider';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [ref, inView] = useInView();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);

  const { location } = useUserContext();
  const latitude = location?.latitude;
  const longitude = location?.longitude;

  const fetchPosts = async (page = 1, limit = 5, filter = {}) => {
    const postData = await getPosts(page, limit, filter);
    setPosts(postData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMorePosts = async () => {
    const next = page + 1;
    const newPosts = await getPosts(next, 5, filter, latitude, longitude);
    if (newPosts?.length) {
      setPage(next);
      setPosts(prev => [...prev, ...newPosts]);
    }
  };

  useEffect(() => {
    if (inView) loadMorePosts();
  }, [inView]);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      (async () => {
        await fetchPosts(1, 5, filter);
        setPage(1);
      })();
    }
  }, [filter]);

  return (
    <>
      <Navbar />
      <section className='flex flex-col items-center'>
        <div className='flex flex-col gap-2 md:max-w-[710px]'>
          {loading && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
              <p>Loading...</p>
              <div className="border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin"></div>
            </div>
          )}

          <Filter filter={filter} setFilter={setFilter} />
          <Search filter={filter} setFilter={setFilter} />
          <Location />

          {latitude && longitude && (
            <button
              onClick={() => setIsMapOpen(true)}
              className='my-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
            >
              View Map
            </button>
          )}

          {posts.map(post => (
            <Card key={post._id} post={post} />
          ))}

          {!loading && (
            <div
              ref={ref}
              className='mt-16 flex items-center justify-center'
            >
              <svg
                aria-hidden='true'
                className='h-10 w-10 animate-spin fill-sky-600 text-gray-200'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M100 50.5908C100 78.2051 ...' fill='currentColor' />
                <path d='M93.9676 39.0409 ...' fill='currentFill' />
              </svg>
            </div>
          )}
        </div>

        {/* Map Modal */}
        {isMapOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
            onClick={() => setIsMapOpen(false)}
          >
            <div
              className='bg-white rounded-lg p-4 relative max-w-3xl w-full max-h-[80vh] overflow-auto'
              onClick={e => e.stopPropagation()}
            >
              <button
                className='absolute top-2 right-2 text-xl font-bold'
                onClick={() => setIsMapOpen(false)}
              >
                &times;
              </button>
              <Map />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
