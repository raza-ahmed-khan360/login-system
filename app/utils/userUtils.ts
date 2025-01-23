// utils/userUtils.ts

import { client } from "../../sanity/lib/client";


// Define the Sanity query to fetch user by email
export async function getUserByEmail(email: string) {
  try {
    const query = `*[_type == "user" && email == $email][0]`;
    const params = { email };
    const user = await client.fetch(query, params);

    return user;  // Return the user data if found
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

// Optionally, you can add methods to create or update users in the database

// Example function to create a user
export async function createUser(email: string, password: string) {
  try {
    const user = await client.create({
      _type: 'user',  // Make sure this matches your Sanity schema
      email,
      password,
    });

    return user;  // Return created user data
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Example function to update a user's password
export async function updateUserPassword(email: string, newPassword: string) {
  try {
    const updatedUser = await client
      .patch('*[_type == "user" && email == $email][0]')
      .set({ password: newPassword })  // Update the password field
      .commit();

    return updatedUser;  // Return updated user data
  } catch (error) {
    console.error('Error updating user password:', error);
    return null;
  }
}
