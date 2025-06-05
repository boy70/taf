# Tafsula - Team Compatibility Analysis Platform

Tafsula is a SaaS platform that analyzes startup team compatibility using the DISC personality model. It helps startups understand their team dynamics and improve collaboration.

## Features

- **DISC Personality Test**: Employees take a short test to determine their DISC personality type
- **AI-Powered Insights**: Receive personalized feedback about work style and strengths
- **Team Compatibility Analysis**: HR managers can view team balance and get recommendations
- **Role-Based Access**: Different dashboards for Superadmins, HR Managers, and Employees

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: Hugging Face API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/tafsula.git
   cd tafsula
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   \`\`\`
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/tafsula"

   # NextAuth
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # Hugging Face
   HUGGING_FACE_API_KEY=your_huggingface_api_key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. Set up the database:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

5. Seed the database with initial data:
   \`\`\`bash
   npm run seed
   \`\`\`

6. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Users

After running the seed script, you can log in with the following credentials:

- **Super Admin**:
  - Email: admin@tafsula.com
  - Password: admin123

- **HR Manager**:
  - Email: hr@samplestartup.com
  - Password: hr123

- **Employee**:
  - Email: john@samplestartup.com
  - Password: employee123

## Project Structure

- `/app`: Next.js App Router pages and API routes
- `/components`: Reusable React components
- `/lib`: Utility functions, types, and database connection
- `/prisma`: Database schema and migrations
- `/scripts`: Seed script and other utilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.
