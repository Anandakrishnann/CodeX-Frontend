import { Co2Sharp } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  purchasedCourses: null,
  isAuthenticated: false,
  role: null,
  subscribed: false,
  plan_details: null,
  categories: null,
  second: 120,
  courseId: null,
  moduleId: null,
  lessonId: null,
  tutorId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      (state.user = action.payload),
        (state.isAuthenticated = true),
        (state.role = action.payload.role),
        (state.subscribed = action.payload.subscribed),
        (state.plan_details = action.payload.plan_details),
        (state.categories = action.payload.categories);
      console.log(state.role);
      console.log(state.plan_details);
    },

    logoutUser: (state) => {
      (state.user = null), (state.isAuthenticated = false), (state.role = null);
      state.subscribed = false;
      state.plan_details = null;
      state.categories = null;
      console.log(state.isAuthenticated);
    },

    setPurchasedCourses: (state) => {
      state.purchasedCourses = action.payload;
    },

    otpTime: (state, action) => {
      state.second = action.payload;
    },

    setOtpTime: (state) => {
      state.second = 120;
    },

    setTutor: (state) => {
      state.role = "tutor";
    },

    setSubscribedTrue: (state) => {
      state.subscribed = true;
    },

    setCourseId: (state, action) => {
      state.courseId = action.payload;
    },

    setModuleId: (state, action) => {
      state.moduleId = action.payload;
    },

    setLessonId: (state, action) => {
      state.lessonId = action.payload;
    },

    setTutorId: (state, action) => {
      state.tutorId = action.payload;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  otpTime,
  setSubscribedTrue,
  setTutor,
  setOtpTime,
  setCourseId,
  setModuleId,
  setLessonId,
  setTutorId,
  setPurchasedCourses,
} = userSlice.actions;

export default userSlice.reducer;
