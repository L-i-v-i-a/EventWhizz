import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userDetails: null, 
  token: null,       
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userDetails = action.payload.userDetails;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userDetails = null;
      state.token = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
