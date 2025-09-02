import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'

export default function HomePage() {
	const { filteredProducts, categories, query, setQuery, category, setCategory, loading, error } = useProducts()

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:items-center gap-4">
				<h1 className="text-2xl font-semibold">Products</h1>
				<div className="ml-auto flex gap-3 w-full md:w-auto">
					<input
						type="text"
						placeholder="Search products..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full md:w-64 border rounded px-3 py-2"
					/>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="border rounded px-3 py-2"
					>
						{categories.map((c) => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
				</div>
			</div>

			{loading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, i) => (
						<SkeletonCard key={i} />
					))}
				</div>
			)}
			{error && <p className="text-red-600">{error}</p>}

			{!loading && !error && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{filteredProducts.map((p) => (
						<Link key={p.id} to={`/product/${p.id}`} className="border rounded-lg overflow-hidden hover:shadow">
							<div className="aspect-square bg-white grid place-items-center p-6">
								<img src={p.image} alt={p.title} className="max-h-full object-contain" />
							</div>
							<div className="p-4 space-y-2">
								<h3 className="text-sm font-medium line-clamp-2">{p.title}</h3>
								<div className="flex items-center justify-between">
									<span className="font-semibold">${p.price}</span>
									<span className="text-xs text-gray-500">{p.category}</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}


