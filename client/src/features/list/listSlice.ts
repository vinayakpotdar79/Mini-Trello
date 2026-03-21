import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import listCardAPI from './listCardAPI';

interface ListState {
  lists: any[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: ListState = {
  lists: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getLists = createAsyncThunk(
  'list/getAll',
  async (boardId: string, thunkAPI: any) => {
    try {
      return await listCardAPI.getLists(boardId);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createList = createAsyncThunk(
  'list/create',
  async ({ boardId, listData }: any, thunkAPI: any) => {
    try {
      return await listCardAPI.createList(boardId, listData);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateList = createAsyncThunk(
  'list/update',
  async ({ listId, listData }: any, thunkAPI: any) => {
    try {
      return await listCardAPI.updateList(listId, listData);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteList = createAsyncThunk(
  'list/delete',
  async (listId: string, thunkAPI: any) => {
    try {
      return await listCardAPI.deleteList(listId);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    reset: (state) => {
      state.lists = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lists = action.payload.data;
      })
      .addCase(getLists.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload.data);  // Add new list to state
      })
      .addCase(updateList.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.lists = state.lists.map((list) =>
          list._id === updated._id ? updated : list
        );
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        const deletedListId = action.payload.data;
        state.lists = state.lists.filter((list) => list._id !== deletedListId);
      });
  },
});

export const { reset } = listSlice.actions;
export default listSlice.reducer;
