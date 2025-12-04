// src/config/appwrite.js
import { Client, Storage, ID } from 'appwrite';

if (!import.meta.env.VITE_APPWRITE_ENDPOINT) {
  throw new Error('Missing VITE_APPWRITE_ENDPOINT');
}
if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) {
  throw new Error('Missing VITE_APPWRITE_PROJECT_ID');
}
if (!import.meta.env.VITE_APPWRITE_BUCKET_ID) {
  throw new Error('Missing VITE_APPWRITE_BUCKET_ID');
}

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const storage = new Storage(client);
export { ID };

export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export const getImageUrl = (fileId) => {
  return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
};