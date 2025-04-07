import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    role: null,
    second:''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        
        loginUser: (state, action) => {
            state.user = action.payload,
            state.isAuthenticated = true,
            state.role = action.payload.role
            console.log(state.role);
        },

        logoutUser: (state) => {            
            state.user = null,
            state.isAuthenticated = false,
            state.role = null
            console.log(state.isAuthenticated);

        },
        otpTime: (state, action) => {
            state.second = action.payload;
            console.log("Redux Timer (seconds):", state.second);
        }        

    },
});

export const { loginUser, logoutUser, otpTime } = userSlice.actions;

export default userSlice.reducer;