import React, { useEffect, useState, useCallback, Suspense } from "react";
import { getPosts } from "../../api/queries/volunteerPost";
import Card from "../../components/UI/Card";
import { useInView } from "react-intersection-observer";
import { useUserContext } from "../../context/AuthProvider";
import Navbar from "../../components/Navbar";
// Skeletons
import FilterSkeleton from "../../components/UI/skeleton/filter";
import SearchSkeleton from "../../components/UI/skeleton/search";
import { LocationSkeleton } from "../../components/UI/skeleton/locationSkeleton";
import CardSkeleton from "../../components/UI/skeleton/card";

// Lazy-loaded components
const Filter   = React.lazy(() => import("../../components/Filter"));
const Search   = React.lazy(() => import("../../components/Search"));
const Location = React.lazy(() => import("../../components/Location"));
const Map      = React.lazy(() => import("../../components/Map"));

const PAGE_SIZE = 5;

export default function Home() {
  const { location } = useUserContext();
  const { latitude, longitude } = location || {};

  const [posts, setPosts]     = useState([]);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter]   = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [ref, inView]         = useInView({ threshold: 0 });

  const fetchPosts = useCallback(async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const newPosts = await getPosts(
        pageToFetch,
        PAGE_SIZE,
        filter,
        latitude,
        longitude
      );
      setPosts(pageToFetch === 1 ? newPosts : prev => [...prev, ...newPosts]);
      setHasMore(newPosts.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  }, [filter, latitude, longitude]);

  // on-mount & filter-change
  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [fetchPosts]);

  // infinite scroll
  useEffect(() => {
    if (inView && !loading && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchPosts(next);
    }
  }, [inView, loading, hasMore, page, fetchPosts]);

  return (
    <>
      {/* Navbar */}
      
        <Navbar />
     

      <section className="flex flex-col items-center">
        <div className="flex flex-col gap-2 md:max-w-[710px] w-full">
          {/* Full-page spinner on first load */}
          {loading && page === 1 && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
              <div className="border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Filter bar */}
          <Suspense fallback={<FilterSkeleton />}>
            <Filter filter={filter} setFilter={setFilter} />
          </Suspense>

          {/* Search bar */}
          <Suspense fallback={<SearchSkeleton />}>
            <Search filter={filter} setFilter={setFilter} />
          </Suspense>

          {/* Location display */}
          <Suspense fallback={<LocationSkeleton />}>
            <Location />
          </Suspense>

          {/* View Map button */}
          {latitude && longitude && (
            <Suspense
              fallback={
                <div className="h-[36px] w-[160px] bg-gray-200 animate-pulse rounded mx-auto my-4" />
              }
            >
              <button
                onClick={() => setIsMapOpen(true)}
                className="mx-auto my-4 w-[160px] h-[36px] bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Map
              </button>
            </Suspense>
          )}

          {/* No posts */}
          {!loading && posts.length === 0 && (
            <p className="text-center text-gray-500 py-10">No posts to show.</p>
          )}

          {/* POSTS or SKELETONS */}
          {loading && page === 1
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            : posts.map(post => (
                <Card key={post._id} post={post} />
              ))}

          {/* Infinite-scroll sentinel or end-of-list */}
          <div className="mt-8 flex justify-center items-center">
            {loading && page > 1 ? (
              <div className="animate-spin h-8 w-8 border-4 border-t-4 border-gray-200 rounded-full"></div>
            ) : !hasMore ? (
              <p className="text-gray-500 mb-5">No more posts to show.</p>
            ) : (
              <div ref={ref} className="h-1 w-full"></div>
            )}
          </div>
        </div>

        {/* Map modal */}
        {isMapOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsMapOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-4 relative max-w-3xl w-full max-h-[80vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-xl font-bold"
                onClick={() => setIsMapOpen(false)}
              >
                &times;
              </button>
              <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded" />}>
                <Map />
              </Suspense>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
