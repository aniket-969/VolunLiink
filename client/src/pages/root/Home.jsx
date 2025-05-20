import React, { useEffect, useState, useCallback, Suspense } from "react";
import { getPosts } from "../../api/queries/volunteerPost";
import Card from "../../components/UI/Card";
import { useInView } from "react-intersection-observer";
import { useUserContext } from "../../context/AuthProvider";
import { useDebounce } from "../../hooks/useDebounce";

import FilterSkeleton from "../../components/UI/skeleton/filter";
import SearchSkeleton from "../../components/UI/skeleton/search";
import { LocationSkeleton } from "../../components/UI/skeleton/locationSkeleton";
import CardSkeleton from "../../components/UI/skeleton/card";
import { FaChevronDown } from "react-icons/fa";

const Filter   = React.lazy(() => import("../../components/Filter"));
const Search   = React.lazy(() => import("../../components/Search"));
const Location = React.lazy(() => import("../../components/Location"));
const Map      = React.lazy(() => import("../../components/Map"));
const Navbar   = React.lazy(() => import("../../components/Navbar"));

const PAGE_SIZE     = 5;
const POLL_INTERVAL = 60000; // 60s

export default function Home() {
  const { location } = useUserContext();
  const { latitude, longitude } = location || {};

  // 1) Keep the “raw” filter state directly updated by the UI
  const [rawFilter, setRawFilter] = useState({});

  // 2) Debounce it by 300ms
  const debouncedFilter = useDebounce(rawFilter, 300);

  const [posts, setPosts]         = useState([]);
  const [newPosts, setNewPosts]   = useState([]);
  const [showNewButton, setShowNewButton] = useState(false);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [hasMore, setHasMore]     = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [ref, inView]             = useInView({ threshold: 0 });

  // 3) Fetcher uses the *debounced* filter
  const fetchPosts = useCallback(
    async (pageToFetch = 1, setter = setPosts) => {
      setLoading(true);
      try {
        const fetched = await getPosts(
          pageToFetch,
          PAGE_SIZE,
          debouncedFilter,
          latitude,
          longitude
        );
        setter(pageToFetch === 1 ? fetched : prev => [...prev, ...fetched]);
        setHasMore(fetched.length === PAGE_SIZE);
      } finally {
        setLoading(false);
      }
    },
    [debouncedFilter, latitude, longitude]
  );

  // When the debounced filter (or location) changes, reload page 1
  useEffect(() => {
    setPage(1);
    fetchPosts(1, setPosts);
  }, [fetchPosts]);

  // infinite-scroll
  useEffect(() => {
    if (inView && !loading && hasMore) {
      const next = page + 1;
      setPage(next);
      fetchPosts(next, setPosts);
    }
  }, [inView, loading, hasMore, page, fetchPosts]);

  // polling for brand-new posts (also uses debouncedFilter)
  useEffect(() => {
    const iv = setInterval(async () => {
      if (!loading) {
        const fetched = await getPosts(1, PAGE_SIZE, debouncedFilter, latitude, longitude);
        if (fetched[0]?._id !== posts[0]?._id) {
          setNewPosts(fetched);
          setShowNewButton(true);
        }
      }
    }, POLL_INTERVAL);
    return () => clearInterval(iv);
  }, [debouncedFilter, latitude, longitude, loading, posts]);

  const handleLoadNew = () => {
    setPosts(newPosts);
    setPage(1);
    setShowNewButton(false);
  };

  return (
    <>
      <Suspense fallback={<div className="h-16 w-full bg-gray-100 animate-pulse" />}>
        <Navbar />
      </Suspense>

      <section className="flex flex-col items-center">
        <div className="flex flex-col gap-2 md:max-w-[710px] w-full">
          {loading && page === 1 && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
              <div className="border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin" />
            </div>
          )}

          {/* 4) Pass the rawFilter into your Filter/Search UIs */}
          <Suspense fallback={<FilterSkeleton />}>
            <Filter filter={rawFilter} setFilter={setRawFilter} />
          </Suspense>

          <Suspense fallback={<SearchSkeleton />}>
            <Search filter={rawFilter} setFilter={setRawFilter} />
          </Suspense>

          <Suspense fallback={<LocationSkeleton />}>
            <Location />
          </Suspense>

          {latitude && longitude && (
            <Suspense fallback={<div className="h-[36px] w-[160px] bg-gray-200 animate-pulse rounded mx-auto my-4" />}>
              <button
                onClick={() => setIsMapOpen(true)}
                className="mx-auto my-4 w-[160px] h-[36px] bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Map
              </button>
            </Suspense>
          )}

          {showNewButton && (
            <button
              onClick={handleLoadNew}
              className="flex items-center gap-2 mx-auto mb-4 px-4 py-2 bg-green-500 text-white rounded-full"
            >
              New posts <FaChevronDown />
            </button>
          )}

          {!loading && posts.length === 0 && (
            <p className="text-center text-gray-500 py-10">No posts to show.</p>
          )}

          {(loading && page === 1)
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)
            : posts.map(post => <Card key={post._id} post={post} handleDelete={post.handleDelete} />)}

          <div className="mt-8 flex justify-center items-center">
            {loading && page > 1 ? (
              <div className="animate-spin h-8 w-8 border-4 border-t-4 border-gray-200 rounded-full" />
            ) : !hasMore ? (
              <p className="text-gray-500 mb-5">No more posts to show.</p>
            ) : (
              <div ref={ref} className="h-1 w-full" />
            )}
          </div>
        </div>

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
