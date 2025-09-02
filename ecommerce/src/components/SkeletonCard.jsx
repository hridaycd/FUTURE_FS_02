export default function SkeletonCard() {
	return (
		<div className="border rounded-lg overflow-hidden animate-pulse">
			<div className="aspect-square bg-gray-200" />
			<div className="p-4 space-y-2">
				<div className="h-4 bg-gray-200 rounded w-3/4" />
				<div className="h-4 bg-gray-200 rounded w-1/2" />
			</div>
		</div>
	)
}


