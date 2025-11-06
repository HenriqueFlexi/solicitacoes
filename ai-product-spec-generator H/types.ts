export enum MessageAuthor {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface Message {
  author: MessageAuthor;
  content: string;
}
