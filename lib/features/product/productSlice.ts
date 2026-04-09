import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProducts = createAsyncThunk('product/fetchProducts', 
    async ({ storeId }: { storeId?: string }, thunkAPI: any) => {
        try {
            const { data } = await axios.get('/api/products' + (storeId ? `?storeId=${storeId}` : ''))
            return data.products
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [] as any[],
    },
    reducers: {
        setProduct: (state, action: PayloadAction<any[]>) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.fulfilled, (state, action)=>{
            state.list = action.payload
        })
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer
