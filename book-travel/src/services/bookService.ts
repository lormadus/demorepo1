import { Book, BookJourney, Review, HandoffCode } from '../types';
import {
  mockBooks,
  mockJourneys,
  mockReviews,
  mockHandoffCodes,
  getNextRouteColor,
} from './mockData';
import { v4 as uuidv4 } from 'uuid';

let books = [...mockBooks];
let journeys = [...mockJourneys];
let reviews = [...mockReviews];
let handoffCodes = [...mockHandoffCodes];

export function getBooks(): Book[] {
  return books;
}

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getJourneysForBook(bookId: string): BookJourney[] {
  return journeys
    .filter((j) => j.book_id === bookId)
    .sort((a, b) => a.order_index - b.order_index);
}

export function getAllJourneys(): BookJourney[] {
  return journeys;
}

export function getReviewsForBook(bookId: string): Review[] {
  return reviews.filter((r) => r.book_id === bookId);
}

export function getReviewByJourneyId(journeyId: string): Review | undefined {
  return reviews.find((r) => r.journey_id === journeyId);
}

export function getUserById(userId: string) {
  const { mockUsers } = require('./mockData');
  return mockUsers.find((u: any) => u.id === userId);
}

export function registerBook(
  isbn: string,
  title: string,
  author: string,
  publisher: string,
  coverImage: string,
  description: string,
  userId: string,
  latitude: number,
  longitude: number,
  locationName: string,
  rating: number,
  reviewContent: string
): Book {
  const bookId = uuidv4();
  const journeyId = uuidv4();

  const newBook: Book = {
    id: bookId,
    isbn,
    title,
    author,
    publisher,
    cover_image: coverImage,
    description,
    route_color: getNextRouteColor(books.length),
    current_owner_id: userId,
    total_distance: 0,
    handoff_count: 0,
    created_at: new Date().toISOString(),
  };

  const newJourney: BookJourney = {
    id: journeyId,
    book_id: bookId,
    user_id: userId,
    from_user_id: null,
    latitude,
    longitude,
    location_name: locationName,
    received_at: new Date().toISOString(),
    order_index: 0,
  };

  const newReview: Review = {
    id: uuidv4(),
    book_id: bookId,
    user_id: userId,
    journey_id: journeyId,
    rating,
    content: reviewContent,
    created_at: new Date().toISOString(),
  };

  books = [...books, newBook];
  journeys = [...journeys, newJourney];
  reviews = [...reviews, newReview];

  return newBook;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const parts = [];
  for (let p = 0; p < 3; p++) {
    let s = '';
    for (let i = 0; i < 3; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(s);
  }
  return parts.join('-');
}

export function createHandoffCode(bookId: string, fromUserId: string): HandoffCode {
  const code: HandoffCode = {
    id: uuidv4(),
    book_id: bookId,
    from_user_id: fromUserId,
    code: generateCode(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    used: false,
    created_at: new Date().toISOString(),
  };
  handoffCodes = [...handoffCodes, code];
  return code;
}

export function findHandoffCode(code: string): HandoffCode | undefined {
  return handoffCodes.find(
    (c) => c.code === code && !c.used && new Date(c.expires_at) > new Date()
  );
}

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function receiveBook(
  code: string,
  userId: string,
  latitude: number,
  longitude: number,
  locationName: string
): { book: Book; journey: BookJourney } | null {
  const handoff = findHandoffCode(code);
  if (!handoff) return null;

  const book = getBookById(handoff.book_id);
  if (!book) return null;

  const existingJourneys = getJourneysForBook(book.id);
  const lastJourney = existingJourneys[existingJourneys.length - 1];
  const distance = lastJourney
    ? haversineDistance(lastJourney.latitude, lastJourney.longitude, latitude, longitude)
    : 0;

  const journeyId = uuidv4();
  const newJourney: BookJourney = {
    id: journeyId,
    book_id: book.id,
    user_id: userId,
    from_user_id: handoff.from_user_id,
    latitude,
    longitude,
    location_name: locationName,
    received_at: new Date().toISOString(),
    order_index: existingJourneys.length,
  };

  // Update book
  const updatedBook: Book = {
    ...book,
    current_owner_id: userId,
    total_distance: book.total_distance + Math.round(distance),
    handoff_count: book.handoff_count + 1,
  };

  books = books.map((b) => (b.id === book.id ? updatedBook : b));
  journeys = [...journeys, newJourney];
  handoffCodes = handoffCodes.map((c) =>
    c.id === handoff.id ? { ...c, used: true } : c
  );

  return { book: updatedBook, journey: newJourney };
}

export function addReview(
  bookId: string,
  userId: string,
  journeyId: string,
  rating: number,
  content: string
): Review {
  const review: Review = {
    id: uuidv4(),
    book_id: bookId,
    user_id: userId,
    journey_id: journeyId,
    rating,
    content,
    created_at: new Date().toISOString(),
  };
  reviews = [...reviews, review];
  return review;
}

export async function lookupISBN(isbn: string): Promise<{
  title: string;
  author: string;
  publisher: string;
  cover_image: string;
  description: string;
} | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    const data = await res.json();
    if (data.totalItems === 0) return null;
    const info = data.items[0].volumeInfo;
    return {
      title: info.title || '',
      author: (info.authors || []).join(', '),
      publisher: info.publisher || '',
      cover_image: info.imageLinks?.thumbnail || '',
      description: info.description || '',
    };
  } catch {
    return null;
  }
}
