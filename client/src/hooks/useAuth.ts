'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { LoginInput, RegisterInput } from '@/schemas';
import { ApiSuccess, ApiMessage, User } from '@/types';

const AUTH_KEY = ['auth', 'me'] as const;

export function useMe() {
  return useQuery<User>({
    queryKey: AUTH_KEY,
    queryFn: async () => {
      const res = await api.get<ApiSuccess<User>>('/auth/me');
      return res.data.data;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<User, Error, LoginInput>({
    mutationFn: async (data) => {
      const res = await api.post<ApiSuccess<User>>('/auth/login', data);
      return res.data.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEY, user);
      router.push('/');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<User, Error, RegisterInput>({
    mutationFn: async (data) => {
      const res = await api.post<ApiSuccess<User>>('/auth/register', data);
      return res.data.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_KEY, user);
      router.push('/');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiMessage, Error, void>({
    mutationFn: async () => {
      const res = await api.post<ApiMessage>('/auth/logout');
      return res.data;
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });
}

