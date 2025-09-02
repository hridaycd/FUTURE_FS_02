export default function SkeletonText({ lines = 3 }) {
	return (
		<div className="animate-pulse space-y-2">
			{Array.from({ length: lines }).map((_, idx) => (
				<div key={idx} className={`h-4 bg-gray-200 rounded ${idx === lines - 1 ? 'w-1/2' : ''}`} />
			))}
		</div>
	)
}


