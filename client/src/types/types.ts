export type PopupConfig = {
  title?: string;
  children: React.ReactNode;
};

export interface CardData {
  _id: string;
  name: string;
  link: string;
  owner: string;
  createdAt: string;
  isLiked: boolean;
}

export interface CardFormData {
  name: string;
  link: string;
}

export interface UserData {
  _id: string;
  name: string;
  about: string;
  avatar: string;
}

export interface CurrentUserContextType {
  currentUser: UserData | null;
  handleUpdateUser: (userData: { name: string; about: string }) => void;
  handleUpdateAvatar: (userData: { avatar: string }) => void;
  handleAddPlaceSubmit: (cardData: CardFormData) => void;
}