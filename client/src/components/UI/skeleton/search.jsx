
import React from "react";

const SearchSkeleton = () => (
  <div className="flex m-3 justify-center items-center gap-3 mx-6 w-full min-h-[34px]">

    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
   
    <div className="h-[34px] w-[40%] bg-gray-200 animate-pulse rounded" />
    
    <div className="h-[34px] w-[40%] bg-gray-200 animate-pulse rounded" />
  </div>
);

export default SearchSkeleton;
