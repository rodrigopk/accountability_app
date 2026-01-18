import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new UUID v4.
 * This utility provides a layer of separation between the uuid dependency
 * and the rest of the application, making it easier to swap implementations if needed.
 *
 * @returns A new UUID v4 string
 */
export function generateUUID(): string {
  return uuidv4();
}
