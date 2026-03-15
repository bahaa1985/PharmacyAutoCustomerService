export interface Message {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateMessageDto {
  title: string;
  content: string;
}
