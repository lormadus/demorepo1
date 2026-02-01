export interface User {
  id: string;
  email: string;
  nickname: string;
  profile_image: string;
  address: string;
  latitude: number;
  longitude: number;
  auth_provider: 'google' | 'facebook';
  created_at: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  cover_image: string;
  description: string;
  route_color: string;
  current_owner_id: string;
  total_distance: number;
  handoff_count: number;
  created_at: string;
}

export interface BookJourney {
  id: string;
  book_id: string;
  user_id: string;
  from_user_id: string | null;
  latitude: number;
  longitude: number;
  location_name: string;
  received_at: string;
  order_index: number;
}

export interface Review {
  id: string;
  book_id: string;
  user_id: string;
  journey_id: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface HandoffCode {
  id: string;
  book_id: string;
  from_user_id: string;
  code: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}
