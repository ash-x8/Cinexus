import type { Movie, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Action', sinhalaName: 'ක්‍රියාදාම', slug: 'action' },
  { id: '2', name: 'Sci-Fi', sinhalaName: 'විද්‍යා ප්‍රබන්ධ', slug: 'sci-fi' },
  { id: '3', name: 'Romance', sinhalaName: 'ආදරණීය', slug: 'romance' },
  { id: '4', name: 'Horror', sinhalaName: 'භීතිකා', slug: 'horror' },
  { id: '5', name: 'Sinhala Subbed', sinhalaName: 'සිංහල උපසිරැසි', slug: 'sinhala-subbed' },
  { id: '6', name: 'TV Series', sinhalaName: 'කථාමාලා', slug: 'tv-series' },
  { id: '7', name: 'Anime', sinhalaName: 'ඇනිමේ', slug: 'anime' },
  { id: '8', name: 'Dual Audio', sinhalaName: 'ද්විත්ව හඬ', slug: 'dual-audio' },
];

export const DEMO_MOVIE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];

// Catalog starts empty - only user added and managed movies will be displayed
export const INITIAL_MOVIES: Movie[] = [];
