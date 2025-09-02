import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
	const [items, setItems] = useState(() => {
		try {
			const saved = localStorage.getItem('cart:v1')
			return saved ? JSON.parse(saved) : []
		} catch {
			return []
		}
	})

	useEffect(() => {
		localStorage.setItem('cart:v1', JSON.stringify(items))
	}, [items])

	function addItem(product, quantity = 1) {
		setItems((prev) => {
			const idx = prev.findIndex((i) => i.id === product.id)
			if (idx !== -1) {
				const next = [...prev]
				next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
				return next
			}
			return [...prev, { id: product.id, title: product.title, price: product.price, image: product.image, quantity }]
		})
	}

	function removeItem(id) {
		setItems((prev) => prev.filter((i) => i.id !== id))
	}

	function setQuantity(id, quantity) {
		setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)))
	}

	function clearCart() {
		setItems([])
	}

	const { subtotal, totalItems } = useMemo(() => {
		const subtotalCalc = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
		const totalQty = items.reduce((sum, i) => sum + i.quantity, 0)
		return { subtotal: Number(subtotalCalc.toFixed(2)), totalItems: totalQty }
	}, [items])

	const value = useMemo(() => ({ items, addItem, removeItem, setQuantity, clearCart, subtotal, totalItems }), [items, subtotal, totalItems])

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
	const ctx = useContext(CartContext)
	if (!ctx) throw new Error('useCart must be used within CartProvider')
	return ctx
}


