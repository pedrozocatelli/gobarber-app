/* eslint-disable camelcase */
import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User {
  avatar_url: string;
  id: string;
  name: string;
  email: string;
}

interface AuthContextInterface {
  user: User;
  loading: boolean;
  signIn({ email, password }: SignInInterface): Promise<void>;
  signOut(): void;
  updateUser(data: User): void;
}

interface SignInInterface {
  email: string;
  password: string;
}

interface AuthState {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);
      if (user[1] && token[1]) {
        setData({ user: JSON.parse(user[1]), token: token[1] });
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInInterface) => {
    const response = await api.post('/sessions', { email, password });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token']);
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (updatedData: User) => {
      setData({
        token: data.token,
        user: updatedData,
      });
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(updatedData));
    },
    [data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, loading, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextInterface {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
