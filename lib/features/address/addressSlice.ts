import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { AddressInput } from '@/lib/types'

type TokenPayload = {
    getToken: () => Promise<string | null>
}

type AddressWithId = AddressInput & {
    id?: string
}

export const fetchAddress = createAsyncThunk('address/fetchAddress', 
    async ({ getToken }: TokenPayload, thunkAPI: any) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/address', {headers: { Authorization: `Bearer ${token}` }})
            return data ? data.addresses : []
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [] as AddressWithId[],
    },
    reducers: {
        addAddress: (state, action: PayloadAction<AddressWithId>) => {
            state.list.push(action.payload)
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchAddress.fulfilled, (state, action)=>{
            state.list = action.payload
        })
    }
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer
