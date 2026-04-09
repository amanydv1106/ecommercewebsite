import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUserRatings = createAsyncThunk('rating/fetchUserRatings',
    async ({ getToken }: { getToken: () => Promise<string | null> }, thunkAPI: any) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/rating', {headers: { Authorization: `Bearer ${token}` }})
            return data ? data.ratings : []
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)


const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [] as any[],
    },
    reducers: {
        addRating: (state, action: PayloadAction<any>) => {
            state.ratings.push(action.payload)
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUserRatings.fulfilled, (state, action)=>{
            state.ratings = action.payload
        })
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer
