import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Auth0User {
  user_id: string;
  email: string;
  name: string;
  picture: string;
}

async function fetchUsers(searchQuery?: string, userIds?: string[]) {
  const params = new URLSearchParams();

  if (searchQuery) {
    params.append('search_query', searchQuery);
  } else if (userIds && userIds.length > 0) {
    userIds.forEach(id => params.append('user_ids', id));
  }

  const queryString = params.toString();
  const url = `/api/users${queryString ? `?${queryString}` : ''}`;

  const response = await axios.get<Auth0User[]>(url);
  return response.data;
}

export function useAuth0Users(searchQuery?: string, userIds?: string[]) {
  return useQuery({
    queryKey: ['auth0Users', searchQuery, userIds],
    queryFn: () => fetchUsers(searchQuery, userIds),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
} 