import { useEffect, useState } from "react"
import {db} from '../data/db'
import { useMemo } from "react"
import type { Guitar, CartItem  } from "../types/types"

export const useCart = () => {

    //! ====MAIN COMPONENT: "APP.JSX"====
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item: Guitar) => {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExists >= 0) { // existe en el carrito
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem])
        }
    }

    const removeFromCart = (id : Guitar['id']) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    const increaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    const decreaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    const clearCart = () => {
        setCart([])
    }


    //! ====COMPONENT: "HEADER"====
    const isEmpty = useMemo( () => cart.length === 0, [cart])
    const cartTotal = useMemo( () => cart.reduce( (total, item ) => total + (item.quantity * item.price), 0), [cart] )


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}