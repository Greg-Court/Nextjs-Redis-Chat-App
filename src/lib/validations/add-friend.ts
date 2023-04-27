import { z } from 'zod';
//  Zod is a popular validation library for JavaScript and TypeScript that provides a convenient and type-safe way to validate the shape and contents of data objects.


// z.object() method creates a schema for an object with specified properties.
// the schema requires an 'email' property with a value that must be a valid email address.
// z.string().email method creates a schema for a string that must be a valid email address.
export const addFriendValidator = z.object({
  email: z.string().email(),
})