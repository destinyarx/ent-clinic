import { defineEventHandler, getQuery } from 'h3'; // Nuxt 3 server utilities
import { getExpenseById } from '@/src/db/queries/select'; // Import the function from your Drizzle configuration


export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  // Fetch user data by ID
  // const userId = Number(id);
  // const user = await getExpenseById(userId);

  // if (!user || user.length === 0) {
  //   throw createError({ statusCode: 404, statusMessage: 'User not found' });
  // }

  return 'user'; // Return a single user object
});
