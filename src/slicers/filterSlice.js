import { createSlice } from "@reduxjs/toolkit";

// This slicer saves the checkbox filters information
export const filterSlice = createSlice({
	name: "filterSlice",
	initialState: {
		area: [],
		difficulty: [],
		time: [],
	},
	reducers: {
		// This reducer receives the info of a checkbox, selects the filter and adds the filter to the arrays of area, difficulty and time
		selectFilter: (state, action) => {
			const { filterName, filter } = action.payload;

			switch (filterName) {
				case "area":
					state.area.push(filter);
					break;
				case "difficulty":
					state.difficulty.push(filter);
					break;
				case "time":
					state.time.push(filter);
					break;
				default:
					return;
			}
		},
		// This reducer receives the info of the unselected checkbox and deletes the filter from the store
		unselectFilter: (state, action) => {
			const { filterName, filter } = action.payload;

			switch (filterName) {
				case "area":
					state.area = state.area.filter((item) => item !== filter);
					break;
				case "difficulty":
					state.difficulty = state.difficulty.filter((item) => item !== filter);
					break;
				case "time":
					state.time = state.time.filter((item) => item !== filter);
					break;
				default:
					return;
			}
		},
	},
});

export const { selectFilter, unselectFilter } = filterSlice.actions;
export default filterSlice.reducer;
