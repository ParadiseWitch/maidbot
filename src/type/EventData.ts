export type MsgEventData = {
  time: number;
  self_id: number;
  post_type: 'message';
  message_type: 'private',
  sub_type: 'friend' | 'group' | 'group_self' | 'other' | 'normal' | 'anonymous' | 'notice';
  temp_source: number;
  message_id: number;
  user_id: number;
  message: string;
  raw_message: string;
  font: number;
  sender: Sender
}

export interface Sender {
  user_id: number;
  nickname: string;
  sex: 'male' | 'female' | 'unknown';
  age: number;
  card?: string,
  area?: string,
  level?: string,
  role?: string,
  title?: string,
}

export interface Anonymous {
  id: number,
  name: string,
  flag: string,
}

export enum TEMPSOURCE {
  GROUP = 0,
  QQ_CONSULT = 1,
  QUERY = 2,
  QQ_MOIVE = 3,
  HOT_CHAT = 4,
  VALID_MSG = 6,
  MULTI_PERSON_CHAT = 7,
  DATING = 8,
  PHONE_BOOK = 9
}