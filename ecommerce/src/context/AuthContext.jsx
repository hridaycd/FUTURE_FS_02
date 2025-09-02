import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

function loadState() {
	try {
		const raw = localStorage.getItem('auth:v1')
		return raw ? JSON.parse(raw) : { user: null, users: [], ordersByUserId: {} }
	} catch {
		return { user: null, users: [], ordersByUserId: {} }
	}
}

export function AuthProvider({ children }) {
	const [state, setState] = useState(loadState)

	useEffect(() => {
		localStorage.setItem('auth:v1', JSON.stringify(state))
	}, [state])

	function register({ name, email, password }) {
		const exists = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
		if (exists) throw new Error('Email already registered')
		const user = { id: cryptoRandomId(), name, email, password }
		setState((s) => ({ ...s, users: [...s.users, user], user }))
	}

	function login({ email, password }) {
		const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
		if (!user) throw new Error('Invalid credentials')
		setState((s) => ({ ...s, user }))
	}

	function logout() {
		setState((s) => ({ ...s, user: null }))
	}

	function addOrder(order) {
		if (!state.user) return
		setState((s) => {
			const list = s.ordersByUserId[s.user.id] || []
			return {
				...s,
				ordersByUserId: { ...s.ordersByUserId, [s.user.id]: [order, ...list] },
			}
		})
	}

	const orders = state.user ? state.ordersByUserId[state.user.id] || [] : []

	const value = useMemo(
		() => ({ user: state.user, orders, register, login, logout, addOrder }),
		[state.user, orders],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

function cryptoRandomId() {
	return Math.random().toString(36).slice(2, 10)
}


