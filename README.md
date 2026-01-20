# PPD Builder Frontend - Admin Panel

This project is a modern admin panel for managing content including articles, images, slides, and company settings.

## 🚀 Features

- **Authentication**: NextAuth v5 with credentials-based login
- **Content Management**: 
  - Articles with categories
  - Image albums with upload functionality
  - Slideshow management
  - Company information settings
- **Rich Text Editor**: Tiptap editor with image, link, and text alignment support
- **Dark Mode**: Full dark mode support with theme persistence
- **Responsive Design**: Mobile-friendly interface
- **Supabase Integration**: Backend storage and database

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account (for backend storage)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
AUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Important**: Replace the placeholder values with your actual credentials.

### 3. Set Up Supabase Database

1. Create a new project in [Supabase](https://supabase.com)
2. Run the SQL scripts in the `sql/` folder in this order:
   - `company_info.sql`
   - `article_categories.sql`
   - `articles.sql`
   - `album.sql`
   - `album_images.sql`
   - `slides.sql`

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Default Login Credentials

- **Username**: admin
- **Password**: admin123456

**⚠️ Important**: Change these credentials in `lib/auth.ts` before deploying to production!

## 📁 Project Structure

```
├── actions/           # Server actions for data mutations
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── articles/    # Article management pages
│   ├── images/      # Image album pages
│   ├── login/       # Authentication pages
│   ├── settings/    # Settings pages
│   └── slides/      # Slideshow pages
├── components/       # Reusable UI components
├── constants/        # App constants and configuration
├── contexts/         # React contexts
├── lib/             # Utility libraries
├── services/        # Data service layer
├── sql/             # Database schema files
└── types/           # TypeScript type definitions
```

## 🎨 Key Components

- **Navbar**: Main navigation with dark mode toggle
- **MenuGrid**: Dashboard menu with icons
- **TiptapEditor**: Rich text editor for articles
- **ImageUpload**: Single and multi-image upload with Supabase
- **Providers**: Theme and session providers

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase setup guide

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `AUTH_SECRET` | Secret key for NextAuth (min 32 chars) | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |

## 🚀 Deployment

1. Update environment variables for production
2. Change default admin credentials
3. Build the project: `npm run build`
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 📄 License

Private project - All rights reserved
