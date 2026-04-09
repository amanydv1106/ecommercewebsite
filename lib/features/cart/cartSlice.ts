import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { CartItems } from '@/lib/types'

type TokenPayload = {
    getToken: () => Promise<string | null>
}

type CartState = {
    total: number
    cartItems: CartItems
}

let debounceTimer = null

export const uploadCart = createAsyncThunk('cart/uploadCart', 
    async ({ getToken }: TokenPayload, thunkAPI: any) => {
        try {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(async ()=> {
                const { cartItems } = thunkAPI.getState().cart as CartState;
                const token = await getToken();
                await axios.post('/api/cart', {cart: cartItems}, { headers: { Authorization: `Bearer ${token}` } })
            },1000)
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const fetchCart = createAsyncThunk('cart/fetchCart', 
    async ({ getToken }: TokenPayload, thunkAPI: any) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/cart', {headers: { Authorization: `Bearer ${token}` }})
            return data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    } as CartState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ productId: string }>) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
            state.total -= 1
        },
        deleteItemFromCart: (state, action: PayloadAction<{ productId: string }>) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchCart.fulfilled, (state, action)=>{
            state.cartItems = (action.payload?.cart ?? {}) as CartItems
            state.total = Object.values(state.cartItems).reduce((acc, item)=>acc + item, 0)
        })
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer
