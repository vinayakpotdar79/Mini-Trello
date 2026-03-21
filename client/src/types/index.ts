export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export interface Board {
  _id: string;
  title: string;
  ownerId: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface List {
  _id: string;
  title: string;
  boardId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  assignedTo?: string;
  listId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
