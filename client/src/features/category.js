import { createSlice } from "@reduxjs/toolkit";

export const CategorySlice = createSlice({
  name: "category",
  initialState: { value: "explore" },
  reducers: {
    selectedCategory: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { selectedCategory } = CategorySlice.actions;

export default CategorySlice.reducer;
