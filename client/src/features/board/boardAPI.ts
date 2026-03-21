import axiosInstance from '../../utils/axiosInstance';

const API_URL = '/api/boards/';

// Create new board
const createBoard = async (boardData: any) => {
  const response = await axiosInstance.post(API_URL, boardData);
  return response.data;
};

// Get user boards
const getBoards = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

// Get single board
const getBoard = async (boardId: string) => {
  const response = await axiosInstance.get(API_URL + boardId);
  return response.data;
};

const boardAPI = {
  createBoard,
  getBoards,
  getBoard,
};

export default boardAPI;