import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import boardReducer from '../features/board/boardSlice';
import listReducer from '../features/list/listSlice';
import cardReducer from '../features/card/cardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    list: listReducer,
    card: cardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
