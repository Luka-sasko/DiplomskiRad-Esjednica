import { makeAutoObservable } from 'mobx';
import { UserService } from '../api/services/UserService';

class UserStore {
  user = null;
  token = localStorage.getItem('token') || null;

  constructor() {
    makeAutoObservable(this);
    if (this.token) {
      this.user = JSON.parse(localStorage.getItem('user')); 
    }
  }

  async login(data) {
    try {
      const response = await UserService.login(data);
      this.token = response.data.token;
      this.user = response.data.user;

      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data) {
    try {
      await UserService.register(data);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  get isLoggedIn() {
    return !!this.token;
  }
}

export const userStore = new UserStore();
