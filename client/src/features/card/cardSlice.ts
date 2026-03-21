import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import listCardAPI from '../list/listCardAPI'; // Reusing the same API file

interface CardState {
  cards: Record<string, any[]>; // listId -> cards[]
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: CardState = {
  cards: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getCards = createAsyncThunk(
  'card/getAll',
  async (listId: string, thunkAPI: any) => {
    try {
      return { listId, cards: await listCardAPI.getCards(listId) };
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createCard = createAsyncThunk(
  'card/create',
  async ({ listId, cardData }: any, thunkAPI: any) => {
    try {
      return await listCardAPI.createCard(listId, cardData);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCard = createAsyncThunk(
  'card/update',
  async ({ cardId, cardData }: any, thunkAPI: any) => {
    try {
      return await listCardAPI.updateCard(cardId, cardData);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteCard = createAsyncThunk(
  'card/delete',
  async (cardId: string, thunkAPI: any) => {
    try {
      return await listCardAPI.deleteCard(cardId);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    reset: (state) => {
      state.cards = {};
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    reorderCards: (
      state,
      action: PayloadAction<{ listId: string; fromIndex: number; toIndex: number }>
    ) => {
      const { listId, fromIndex, toIndex } = action.payload;
      const listCards = state.cards[listId];
      if (!listCards || fromIndex === toIndex) return;
      const [moved] = listCards.splice(fromIndex, 1);
      listCards.splice(toIndex, 0, moved);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCards.fulfilled, (state, action) => {
        state.cards[action.payload.listId] = action.payload.cards.data;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        const card = action.payload.data;
        const listId = card.listId;
        if (!state.cards[listId]) {
          state.cards[listId] = [];
        }
        state.cards[listId].push(card);
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const updated = action.payload.data;

        // Remove card from old list(s) in case listId changed
        for (const listId in state.cards) {
          state.cards[listId] = state.cards[listId].filter(
            (card) => card._id !== updated._id
          );
        }

        const listId = updated.listId;
        if (!state.cards[listId]) {
          state.cards[listId] = [];
        }

        const existingIndex = state.cards[listId].findIndex((card) => card._id === updated._id);
        if (existingIndex !== -1) {
          state.cards[listId][existingIndex] = updated;
        } else {
          state.cards[listId].push(updated);
        }
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        const deletedCardId = action.payload.data;
        for (const listId in state.cards) {
          state.cards[listId] = state.cards[listId].filter(
            (card) => card._id !== deletedCardId
          );
        }
      });
  },
});

export const { reset, reorderCards } = cardSlice.actions;
export default cardSlice.reducer;
