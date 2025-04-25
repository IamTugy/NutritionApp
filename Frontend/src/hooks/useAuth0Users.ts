import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Auth0User {
  user_id: string;
  email: string;
  name: string;
  picture: string;
}

async function fetchUsers(searchQuery?: string, userIds?: string[]) {
  let url = `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users`;
  const params = new URLSearchParams();

  if (searchQuery) {
    params.append('q', `email:*${searchQuery}*`);
    params.append('search_engine', 'v3');
  } else if (userIds && userIds.length > 0) {
    params.append('q', `user_id:(${userIds.join(' OR ')})`);
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await axios.get<Auth0User[]>(url, {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_AUTH0_MANAGEMENT_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

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