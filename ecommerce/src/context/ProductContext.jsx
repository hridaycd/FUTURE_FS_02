import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
	const [apiProducts, setApiProducts] = useState([])
	const [localProducts, setLocalProducts] = useState(() => {
		try {
			const raw = localStorage.getItem('localProducts:v1')
			return raw ? JSON.parse(raw) : []
		} catch {
			return []
		}
	})
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [query, setQuery] = useState('')
	const [category, setCategory] = useState('all')

	useEffect(() => {
		localStorage.setItem('localProducts:v1', JSON.stringify(localProducts))
	}, [localProducts])

	useEffect(() => {
		let isActive = true
		async function load() {
			setLoading(true)
			setError(null)
			try {
				const [prodRes, catRes] = await Promise.all([
					fetch('https://fakestoreapi.com/products'),
					fetch('https://fakestoreapi.com/products/categories'),
				])
				if (!prodRes.ok || !catRes.ok) throw new Error('Failed to load data')
				const [prodJson, catJson] = await Promise.all([prodRes.json(), catRes.json()])
				if (!isActive) return
				setApiProducts(prodJson.map((p) => ({ ...p, source: 'api' })))
				setCategories(['all', ...catJson, ...collectLocalOnlyCategories(localProducts, catJson)])
			} catch (e) {
				if (!isActive) return
				setError(e.message || 'Unknown error')
			} finally {
				if (isActive) setLoading(false)
			}
		}
		load()
		return () => {
			isActive = false
		}
	}, [])

	useEffect(() => {
		// Keep categories up to date when local products change
		setCategories((prev) => {
			const apiCats = prev.filter((c) => c === 'all' || c === 'all' || true)
			return Array.from(new Set(['all', ...apiCats.filter((c) => c !== 'all'), ...localProducts.map((p) => p.category)]))
		})
	}, [localProducts])

	const allProducts = useMemo(() => {
		return [
			...localProducts.map((p) => ({ ...p, source: 'local' })),
			...apiProducts,
		]
	}, [localProducts, apiProducts])

	const filteredProducts = useMemo(() => {
		const q = query.trim().toLowerCase()
		return allProducts.filter((p) => {
			const matchesQuery = q ? (p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) : true
			const matchesCategory = category === 'all' ? true : p.category === category
			return matchesQuery && matchesCategory
		})
	}, [allProducts, query, category])

	function addLocalProduct(product) {
		const id = Math.random().toString(36).slice(2, 10)
		const base = { id, title: '', description: '', price: 0, category: 'misc', image: '', rating: { rate: 0, count: 0 }, ...product }
		setLocalProducts((prev) => [base, ...prev])
		return id
	}

	function updateLocalProduct(id, updates) {
		setLocalProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
	}

	function deleteLocalProduct(id) {
		setLocalProducts((prev) => prev.filter((p) => p.id !== id))
	}

	function getLocalById(id) {
		return localProducts.find((p) => p.id === id) || null
	}

	const value = useMemo(() => ({
		products: allProducts,
		filteredProducts,
		categories,
		loading,
		error,
		query,
		setQuery,
		category,
		setCategory,
		// local CRUD
		localProducts,
		addLocalProduct,
		updateLocalProduct,
		deleteLocalProduct,
		getLocalById,
	}), [allProducts, filteredProducts, categories, loading, error, query, category, localProducts])

	return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
	const ctx = useContext(ProductContext)
	if (!ctx) throw new Error('useProducts must be used within ProductProvider')
	return ctx
}

function collectLocalOnlyCategories(localProducts, apiCategories) {
	const set = new Set(apiCategories)
	return Array.from(new Set(localProducts.map((p) => p.category).filter((c) => !set.has(c))))
}


