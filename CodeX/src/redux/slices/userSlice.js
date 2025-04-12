import { Co2Sharp } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    role: null,
    subscribed:false,
    plan_details:null,
    categories:null,
    second:120
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        
        loginUser: (state, action) => {
            state.user = action.payload,
            state.isAuthenticated = true,
            state.role = action.payload.role,
            state.subscribed = action.payload.subscribed,
            state.plan_details = action.payload.plan_details,
            state.categories = action.payload.categories
            console.log(state.role);
            console.log(state.plan_details)
        },

        logoutUser: (state) => {            
            state.user = null,
            state.isAuthenticated = false,
            state.role = null
            state.subscribed = false
            state.plan_details = null
            state.categories = null
            console.log(state.isAuthenticated);
        },

        otpTime: (state, action) => {
            state.second = action.payload;
            console.log("Redux Timer (seconds):", state.second);
        },

        setOtpTime: (state) => {
            state.second = 120
            console.log("Otp time reset to 120");
        },

        setTutor: (state) => {
            state.role = "tutor"
            console.log("role updated to tutor.");
        },

        setSubscribedTrue: (state) => {
            state.subscribed = true;
            console.log("User subscription updated to true.");
        },
    },
});

export const { loginUser, logoutUser, otpTime, setSubscribedTrue, setTutor, setOtpTime } = userSlice.actions;

export default userSlice.reducer;