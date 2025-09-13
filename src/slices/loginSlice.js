import { createSlice } from "@reduxjs/toolkit";

// This slicer saves the information of the user that is logged
export const loginSlice = createSlice({
	name: "loginSlice",
	initialState: {
		login: false,
		user: null,
		token: null,
	},
	reducers: {
		login: (state, action) => {
			const { user, token } = action.payload;
			state.login = true;
			state.user = user;
			state.token = token;
		},
		logout: (state) => {
			state.login = false;
			state.user = null;
			state.token = null;
		},
		updateUser: (state, action) => {
			const { user } = action.payload;
			state.user = user;
		},
	},
});

export const { login, logout, updateUser } = loginSlice.actions;
export default loginSlice.reducer;
