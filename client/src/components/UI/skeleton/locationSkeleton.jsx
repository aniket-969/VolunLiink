
export function LocationSkeleton() {
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
      <div className="h-[36px] w-[160px] bg-gray-200 animate-pulse rounded" />
    </div>
  );
}
