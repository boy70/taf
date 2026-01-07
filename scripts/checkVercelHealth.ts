// This script checks your production environment variables and health endpoint for NextAuth/Prisma issues.
// Run this after deployment to verify your Vercel setup.

export async function checkVercelHealth() {
  const res = await fetch('/api/auth/health')
  const health = await res.json()
  if (health.database.url !== '✅ Set') {
    throw new Error('DATABASE_URL is missing in Vercel environment variables.')
  }
  if (health.database.connection !== '✅ Connected') {
    throw new Error('Database connection failed. Check DATABASE_URL and DB access.')
  }
  if (health.auth.secret !== '✅ Set') {
    throw new Error('NEXTAUTH_SECRET is missing in Vercel environment variables.')
  }
  if (health.auth.url !== '✅ Set') {
    throw new Error('NEXTAUTH_URL is missing in Vercel environment variables.')
  }
  return health
}
