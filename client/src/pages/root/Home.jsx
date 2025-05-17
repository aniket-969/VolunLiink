import React, { useEffect, useState, useCallback,Suspense } from "react";
import { getPosts } from "../../api/queries/volunteerPost";
import Card from "../../components/UI/Card";
import Navbar from "../../components/Navbar";
import { useInView } from "react-intersection-observer";
import { useUserContext } from "../../context/AuthProvider";

const Filter = React.lazy(() => import("../../components/Filter"));
const Search = React.lazy(() => import("../../components/Search"));
const Map = React.lazy(() => import("../../components/Map"));
const Location = React.lazy(()=>import("../../components/Location"))

const PAGE_SIZE = 5;

const Home = () => {
  const { location } = useUserContext();
  const { latitude, longitude } = location || {};

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [ref, inView] = useInView({
    // fire as soon as the sentinel is visible
    threshold: 0,
  });

  const fetchPosts = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const newPosts = await getPosts(
          pageToFetch,
          PAGE_SIZE,
          filter,
          latitude,
          longitude
        );
        if (pageToFetch === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }
        // if we got fewer than PAGE_SIZE, there's no more data
        setHasMore(newPosts.length === PAGE_SIZE);
      } finally {
        setLoading(false);
      }
    },
    [filter, latitude, longitude]
  );

  // initial + filter change
  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [fetchPosts]);

  // infinite-scroll
  useEffect(() => {
    if (inView && !loading && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchPosts(next);
    }
  }, [inView, loading, hasMore, page, fetchPosts]);

  return (
    <>
      <Navbar />

      <section className="flex flex-col items-center">
        <div className="flex flex-col gap-2 md:max-w-[710px]">
          {/* initial loading overlay */}
          {loading && page === 1 && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
              <div className="border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin"></div>
            </div>
          )}
         
            <Filter filter={filter} setFilter={setFilter} />
            <Search filter={filter} setFilter={setFilter} />
            <Location />
          
          {latitude && longitude && (
            <button
              onClick={() => setIsMapOpen(true)}
              className="block mx-auto my-4 w-[10rem] py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              View Map
            </button>
          )}

          {/* no posts found */}
          {!loading && posts.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">
              No posts to show.
            </p>
          )}

          {/* post cards */}
          {posts.map((post) => (
            <Card key={post._id} post={post} />
          ))}

          {/* infinite-scroll sentinel or “no more” message */}
          <div className="mt-8 flex justify-center items-center">
            {loading && page > 1 ? (
              <div className="animate-spin h-8 w-8 border-4 border-t-4 border-gray-200 rounded-full"></div>
            ) : !hasMore ? (
              <p className="text-gray-500 mb-5">No more posts to show.</p>
            ) : (
              //  inView ref
              <div ref={ref} className="h-1 w-full"></div>
            )}
          </div>
        </div>

        {/* Map Modal */}
        {isMapOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsMapOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-4 relative max-w-3xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-xl font-bold"
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
