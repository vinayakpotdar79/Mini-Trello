import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import boardAPI from './boardAPI';

interface BoardState {
  boards: any[];
  currentBoard: any | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  users: any[];
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  users: [],
};

// Create new board
export const createBoard = createAsyncThunk(
  'board/create',
  async (boardData: any, thunkAPI: any) => {
    try {
      return await boardAPI.createBoard(boardData);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user boards
export const getBoards = createAsyncThunk(
  'board/getAll',
  async (_, thunkAPI: any) => {
    try {
      return await boardAPI.getBoards();
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBoard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.boards.push(action.payload.data);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getBoards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.boards = action.payload.data;
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = boardSlice.actions;
export default boardSlice.reducer;
