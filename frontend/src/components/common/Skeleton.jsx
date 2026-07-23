const SkeletonCard = ({ className = "" }) => (
    <div className={`bg-slate-800 rounded-2xl animate-pulse ${className}`} />
);

export const SkeletonDashboard = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} className="h-28" />
            ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
            <SkeletonCard className="h-80" />
            <SkeletonCard className="h-80" />
        </div>
        <SkeletonCard className="h-64" />
    </div>
);

export const SkeletonTable = () => (
    <div className="space-y-4">
        <SkeletonCard className="h-12" />
        {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="h-14" />
        ))}
    </div>
);

export const SkeletonAnalytics = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} className="h-28" />
            ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
            <SkeletonCard className="h-80" />
            <SkeletonCard className="h-80" />
        </div>
        <SkeletonCard className="h-64" />
    </div>
);

export const SkeletonCards = ({ count = 3, height = "h-28" }) => (
    <div className={`grid grid-cols-1 md:grid-cols-${count} gap-6`}>
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} className={height} />
        ))}
    </div>
);

export default SkeletonCard;
