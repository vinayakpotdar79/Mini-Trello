import axiosInstance from '../../utils/axiosInstance';

const API_URL = '/api/';

// Lists API
const getLists = async (boardId: string) => {
  const response = await axiosInstance.get(`${API_URL}boards/${boardId}/lists`);
  return response.data;
};

const createList = async (boardId: string, listData: any) => {
  const response = await axiosInstance.post(`${API_URL}boards/${boardId}/lists`, listData);
  return response.data;
};

// Cards API
const getCards = async (listId: string) => {
  const response = await axiosInstance.get(`${API_URL}lists/${listId}/cards`);
  return response.data;
};

const createCard = async (listId: string, cardData: any) => {
  const response = await axiosInstance.post(`${API_URL}lists/${listId}/cards`, cardData);
  return response.data;
};

const updateList = async (listId: string, listData: any) => {
  const response = await axiosInstance.put(`${API_URL}lists/${listId}`, listData);
  return response.data;
};

const deleteList = async (listId: string) => {
  const response = await axiosInstance.delete(`${API_URL}lists/${listId}`);
  return response.data;
};

const updateCard = async (cardId: string, cardData: any) => {
  const response = await axiosInstance.put(`${API_URL}cards/${cardId}`, cardData);
  return response.data;
};

const deleteCard = async (cardId: string) => {
  const response = await axiosInstance.delete(`${API_URL}cards/${cardId}`);
  return response.data;
};

const listCardAPI = {
  getLists,
  createList,
  updateList,
  deleteList,
  getCards,
  createCard,
  updateCard,
  deleteCard,
};

export default listCardAPI;
