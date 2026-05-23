# CYBER.DEV Portfolio

A premium, highly-interactive, Cyberpunk-themed portfolio built for Red Teamers, Bug Bounty Hunters, and Full-Stack Developers.

## 🚀 Features

- **Cyberpunk Aesthetics**: Immersive glassmorphism UI with neon glows, grid patterns, and scroll-driven animations.
- **Dynamic Content**: Connected to a PostgreSQL database using Drizzle ORM to manage Projects, Write-ups, and Certifications.
- **Admin Dashboard**: Secure control panel protected by `better-auth` for seamless content management.
- **GitHub Sync Integration**: Auto-import Markdown write-ups directly from GitHub repositories with one click.
- **Secure File Uploads**: Upload certificate images and thumbnails safely with magic-bytes verification.
- **Contact System**: Built-in messaging system storing form submissions securely.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Database**: PostgreSQL (Neon)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Language**: TypeScript

## 💻 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/adrianfahrezi404/cyber-dev.git
cd cyber-dev
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
# Database Configuration (Neon/PostgreSQL)
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Admin Setup (Change this to your actual email and a strong password)
ADMIN_EMAIL="adriandwifahrezirizki@gmail.com"
ADMIN_PASSWORD="secure_password_here"
ADMIN_NAME="Adrian Dwi Fahrezi Rizki"
```

### 4. Push Database Schema
Ensure your database is synchronized with the schema:
```bash
npx drizzle-kit push
```

### 5. Run the application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Deployment to Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to your GitHub repository.
2. Sign in to Vercel and click **Add New Project**.
3. Import your GitHub repository (`cyber-dev`).
4. In the configuration step, open **Environment Variables** and add all the keys from your `.env.local`. 
   - *Note: Change `BETTER_AUTH_URL` to your production domain (e.g., `https://cyber.dev`).*
5. Click **Deploy**.

## 🛡️ Security Notes
- The `/api/upload` route implements strict file signature (Magic Bytes) verification, preventing MIME-type spoofing and Path Traversal attacks.
- Admin creation is securely handled by `better-auth`. Make sure to change your default password immediately after deployment.

---

*Built with ❤️ and security in mind by Adrian Dwi Fahrezi Rizki.*
