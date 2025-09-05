import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "../slices/filterSlice";
import loginSlice from "../slices/loginSlice";
import themeSlice from "../slices/themeSlice";

// This the store of the web app. In here we saved the login and the filters information
export default configureStore({
	reducer: {
		loginReducer: loginSlice,
		filterReducer: filterSlice,
		themeReducer: themeSlice,
	},
});
