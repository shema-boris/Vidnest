const VideoGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="aspect-video bg-slate-200 rounded-lg"></div>
        <div className="flex items-start mt-3">
          <div className="h-9 w-9 bg-slate-200 rounded-full"></div>
          <div className="ml-3 flex-1 space-y-2 py-1">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default VideoGridSkeleton;
