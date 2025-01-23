import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-20",
  useCdn: false, // We don't want to use CDN for authentication
  token: process.env.SANITY_API_TOKEN,
})

// Helper functions for user operations
export async function createUser(email: string, hashedPassword: string) {
  return client.create({
    _type: 'user',
    email,
    password: hashedPassword,
  })
}

export async function getUserByEmail(email: string) {
  return client.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email }
  )
}

export async function verifyUser(userId: string) {
  return client.patch(userId)
    .set({ isVerified: true })
    .commit()
}

export async function updateUserPassword(userId: string, hashedPassword: string) {
  return client.patch(userId)
    .set({ password: hashedPassword })
    .commit()
}
