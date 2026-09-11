import type { UserData, CardData, CardFormData } from '../types/types';

export interface ApiOptions {
  baseUrl: string;
  headers: Record<string, string>;
}

class Api {
  private _baseUrl: string;
  private _headers: Record<string, string>;

  constructor(options: ApiOptions) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  private async _checkResponse<T>(res: Response): Promise<T> {
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`Error: ${res.status}`);
  }

  public async getUserInfo(): Promise<UserData> {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
    return await this._checkResponse<UserData>(res);
  }

  public async getInitialCards(): Promise<CardData[]> {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
    return await this._checkResponse<CardData[]>(res);
  }

  public async updateUserInfo(name: string, about: string): Promise<UserData> {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    });
    return await this._checkResponse<UserData>(res);
  }

  public async addCard(data: CardFormData): Promise<CardData> {
    const res = await fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name: data.name, link: data.link }),
    });
    return await this._checkResponse<CardData>(res);
  }

  public async deleteCard(cardId: string): Promise<void> {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
    return await this._checkResponse<void>(res);
  }

  public async addLike(cardId: string): Promise<CardData> {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
    return await this._checkResponse<CardData>(res);
  }

  public async removeLike(cardId: string): Promise<CardData> {
    const res = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
    return await this._checkResponse<CardData>(res);
  }

  public async updateAvatar(avatarUrl: string): Promise<UserData> {
    const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar: avatarUrl }),
    });
    return await this._checkResponse<UserData>(res);
  }
}

const api = new Api({
  baseUrl: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;