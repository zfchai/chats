import { Message } from '@/types/chat';
import { Model } from 'sequelize';
import { ModelType } from './model';

export interface UserChatMessage extends Model {
  User: {
    username: string;
    role: string;
  };
  ChatModel: {
    name: string;
    imgConfig: string;
    id: string;
    modelVersion: string;
    systemPrompt: string;
    type: ModelType;
  };
  id?: string;
  userId: string;
  modelId: string;
  messages: Message[];
  name: string;
  prompt: string;
  tokenCount: number;
  chatCount: number;
  createdAt: string;
  updatedAt: string;
}
