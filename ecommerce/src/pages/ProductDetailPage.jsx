import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import SkeletonText from '../components/SkeletonText.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function ProductDetailPage() {
	const { id } = useParams()
	const { addItem } = useCart()
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const { show } = useToast()

	useEffect(() => {
		let active = true
		async function load() {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`https://fakestoreapi.com/products/${id}`)
				if (!res.ok) throw new Error('Failed to load product')
				const json = await res.json()
				if (active) setProduct(json)
			} catch (e) {
				if (active) setError(e.message || 'Unknown error')
			} finally {
				if (active) setLoading(false)
			}
		}
		load()
		return () => {
			active = false
		}
	}, [id])

	if (loading) return (
		<div className="grid md:grid-cols-2 gap-8">
			<div className="bg-gray-200 aspect-square rounded animate-pulse" />
			<div className="space-y-4">
				<SkeletonText lines={4} />
				<div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
			</div>
		</div>
	)
	if (error) return <p className="text-red-600">{error}</p>
	if (!product) return null

	return (
		<div className="grid md:grid-cols-2 gap-8">
			<div className="bg-white aspect-square grid place-items-center p-8 border rounded">
				<img src={product.image} alt={product.title} className="max-h-full object-contain" />
			</div>
			<div className="space-y-4">
				<h1 className="text-2xl font-semibold">{product.title}</h1>
				<p className="text-gray-600">{product.description}</p>
				<div className="flex items-center justify-between">
					<span className="text-2xl font-bold">${product.price}</span>
					<span className="text-sm text-gray-500">{product.category}</span>
				</div>
				<button onClick={() => { addItem(product, 1); show('Added to cart', { type: 'success' }) }} className="px-4 py-2 bg-blue-600 text-white rounded">Add to Cart</button>
			</div>
		</div>
	)
}


