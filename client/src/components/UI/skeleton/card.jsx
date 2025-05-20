
export default function CardSkeleton() {
  return (
    <div className="w-full max-w-[710px] bg-white rounded-lg p-4 shadow animate-pulse space-y-4">
      <div className="h-[180px] bg-gray-200 rounded" />       {/* image */}
      <div className="h-6 w-1/3 bg-gray-200 rounded" />     {/* title */}
      <div className="h-4 w-1/2 bg-gray-200 rounded" />     {/* subtitle */}
      <div className="h-4 bg-gray-200 rounded" />           {/* text */}
    </div>
  );
}
