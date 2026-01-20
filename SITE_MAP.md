# 🗺️ Site Map

## Project Structure Overview

```
PPD Builder Frontend
│
├── 🌐 PUBLIC WEBSITE (/)
│   │
│   ├── Homepage (/)
│   │   ├── Hero Section
│   │   ├── Services Section
│   │   ├── Stats Section
│   │   └── Contact Form
│   │
│   ├── Components
│   │   ├── PublicHeader (with navigation & dark mode)
│   │   └── PublicFooter
│   │
│   └── Features
│       ├── ✅ No authentication required
│       ├── ✅ Responsive design
│       ├── ✅ Dark/Light mode
│       ├── ✅ Smooth scrolling
│       └── ✅ Thai language support
│
└── 🔐 ADMIN PANEL (/admin/*)
    │
    ├── Authentication
    │   └── Login (/admin/login)
    │       ├── Username: admin
    │       └── Password: admin123456
    │
    ├── Dashboard (/admin/dashboard)
    │   └── Menu Grid with quick access
    │
    ├── Content Management
    │   ├── Articles (/admin/articles)
    │   │   └── Categories (/admin/articles/categories)
    │   ├── Images (/admin/images)
    │   ├── Slides (/admin/slides)
    │   └── Settings (/admin/settings)
    │
    ├── Components
    │   ├── Navbar (admin navigation)
    │   ├── MenuGrid (dashboard cards)
    │   ├── TiptapEditor (rich text)
    │   ├── ImageUpload (file uploads)
    │   └── Providers (session & theme)
    │
    └── Features
        ├── ✅ Protected by NextAuth
        ├── ✅ Supabase integration
        ├── ✅ Dark mode
        ├── ✅ CRUD operations
        └── ✅ Rich text editing
```

---

## URL Structure

### 🌐 Public (No Auth)

```
http://localhost:3000/                      → Homepage
http://localhost:3000/#services             → Services section
http://localhost:3000/#contact              → Contact form
```

### 🔐 Admin (Auth Required)

```
http://localhost:3000/admin/login           → Login page
http://localhost:3000/admin/dashboard       → Main dashboard
http://localhost:3000/admin/articles        → Article management
http://localhost:3000/admin/articles/categories → Categories
http://localhost:3000/admin/images          → Image albums
http://localhost:3000/admin/slides          → Slideshow
http://localhost:3000/admin/settings        → Settings
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Visits Site                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ├─────────────────┬─────────────────┐
                     │                 │                 │
                ┌────▼────┐       ┌───▼───┐       ┌────▼────┐
                │ Public  │       │ Admin │       │  Admin  │
                │  Pages  │       │ Login │       │  Pages  │
                │   (/)   │       │       │       │(/admin/)│
                └────┬────┘       └───┬───┘       └────┬────┘
                     │                │                 │
                ✅ Access         ✅ Enter          ❌ Redirect
                immediately       credentials       to login
                     │                │                 │
                     │           ┌────▼────┐            │
                     │           │ NextAuth│            │
                     │           │  Check  │            │
                     │           └────┬────┘            │
                     │                │                 │
                     │           ┌────▼────┐            │
                     │           │ Success?│◄───────────┘
                     │           └────┬────┘
                     │                │
                     │         ┌──────┴──────┐
                     │         │             │
                     │      ✅ Yes        ❌ No
                     │         │             │
                     │    ┌────▼────┐   ┌────▼────┐
                     │    │  Admin  │   │  Login  │
                     │    │Dashboard│   │  Page   │
                     │    └─────────┘   └─────────┘
                     │
                ┌────▼─────┐
                │  Public  │
                │ Homepage │
                └──────────┘
```

---

## Middleware Protection

```
Request to any route
        │
        ├─── / (public)
        │    └─→ ✅ Allow (no auth check)
        │
        ├─── /#services
        │    └─→ ✅ Allow (no auth check)
        │
        ├─── /admin/login
        │    ├─→ If logged in: Redirect to /admin/dashboard
        │    └─→ If not logged in: ✅ Show login page
        │
        └─── /admin/* (any other admin route)
             ├─→ If logged in: ✅ Allow access
             └─→ If not logged in: ❌ Redirect to /admin/login
```

---

## Component Hierarchy

### Public Page (`/`)

```
RootLayout
├── head
│   └── Font Awesome CSS
├── body (Kanit font)
    ├── PublicHeader
    │   ├── Logo
    │   ├── Navigation Links
    │   ├── Dark Mode Toggle
    │   └── Mobile Menu
    │
    ├── main
    │   └── page.tsx (Home)
    │       ├── Hero Section
    │       ├── Services Section
    │       ├── Stats Section
    │       └── Contact Section
    │
    └── PublicFooter
        ├── Branding
        └── Links
```

### Admin Pages (`/admin/*`)

```
RootLayout (same as above, but wraps AdminLayout)
└── AdminLayout (Outfit font)
    ├── Providers (Session + Theme)
        ├── Navbar
        │   ├── Logo → /admin/dashboard
        │   ├── Dark Mode Toggle
        │   └── User Menu (Profile + Logout)
        │
        └── main
            └── page.tsx (Dashboard/Articles/etc)
                └── [Page-specific content]
```

---

## File Organization

```
/app
  ├── layout.tsx           # Public layout (Kanit, Header, Footer)
  ├── page.tsx             # Public homepage
  │
  └── /admin
      ├── layout.tsx       # Admin layout (Outfit, Navbar, Auth)
      ├── /dashboard
      │   └── page.tsx     # Dashboard with MenuGrid
      ├── /login
      │   ├── layout.tsx   # Login-specific (no Navbar)
      │   └── page.tsx     # Login form
      ├── /articles
      │   ├── page.tsx     # Article list
      │   └── /categories
      │       └── page.tsx # Category management
      ├── /images
      ├── /slides
      ├── /settings
      └── /api             # API routes
```

---

## Key Technologies

| Technology   | Purpose          | Version       |
| ------------ | ---------------- | ------------- |
| Next.js      | Framework        | 16.1.1        |
| React        | UI Library       | 19.2.3        |
| NextAuth     | Authentication   | 5.0.0-beta.30 |
| Supabase     | Database/Storage | 2.90.0        |
| Tailwind CSS | Styling          | 4.x           |
| Tiptap       | Rich Text Editor | 3.15.3        |
| Lucide React | Icons (Admin)    | 0.468.0       |
| Font Awesome | Icons (Public)   | 6.4.0         |
| TypeScript   | Type Safety      | 5.x           |

---

## Data Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Public    │         │    Admin    │         │  Supabase   │
│   Pages     │         │    Panel    │         │  Database   │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                        │
       │ Display info          │ CRUD operations        │
       │ Contact form          │ Create/Read/Update/Del │
       │                       │                        │
       │                       ├───────────────────────►│
       │                       │   Save article         │
       │                       │                        │
       │                       │◄───────────────────────┤
       │                       │   Return data          │
       │                       │                        │
       │◄──────────────────────┤                        │
       │  Fetch public content │                        │
       │  (Articles, Images)   │                        │
       │                       │                        │
       └───────────────────────┴────────────────────────┘
```

---

## Environment Variables

```env
# Authentication
AUTH_SECRET=<min-32-char-secret>
NEXTAUTH_URL=http://localhost:3000

# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

---

## Quick Reference

| Task                 | Command/URL                           |
| -------------------- | ------------------------------------- |
| Start dev server     | `npm run dev`                         |
| View public site     | http://localhost:3000                 |
| Login to admin       | http://localhost:3000/admin/login     |
| Admin dashboard      | http://localhost:3000/admin/dashboard |
| Default credentials  | admin / admin123456                   |
| Build for production | `npm run build`                       |
| Start production     | `npm start`                           |

---

**Ready to use!** 🚀 Both public and admin systems are fully functional and separated.
