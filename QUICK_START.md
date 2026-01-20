# 🚀 Quick Start Guide

## Start the Development Server

\`\`\`bash
cd /Users/jenwitnoppiboon/Documents/ppdbuilder-frontend
npm run dev
\`\`\`

The server will start at: **http://localhost:3000**

---

## 🌐 Public Website (No Login Required)

Visit these URLs in your browser:

| Page         | URL                            | Description           |
| ------------ | ------------------------------ | --------------------- |
| **Homepage** | http://localhost:3000          | Hero, Services, Stats |
| **Services** | http://localhost:3000#services | Service cards         |
| **Contact**  | http://localhost:3000#contact  | Contact form          |

**Features to Test:**

- ✅ Smooth scroll between sections
- ✅ Dark mode toggle (top right)
- ✅ Mobile menu (hamburger icon on small screens)
- ✅ Responsive design
- ✅ Thai language content

---

## 🔐 Admin Panel (Login Required)

### Step 1: Go to Login Page

http://localhost:3000/admin/login

### Step 2: Login Credentials

```
Username: admin
Password: admin123456
```

### Step 3: Access Admin Features

After login, you'll be redirected to the dashboard. Available pages:

| Feature        | URL                                             | Description        |
| -------------- | ----------------------------------------------- | ------------------ |
| **Dashboard**  | http://localhost:3000/admin/dashboard           | Main menu grid     |
| **Articles**   | http://localhost:3000/admin/articles            | Manage articles    |
| **Categories** | http://localhost:3000/admin/articles/categories | Article categories |
| **Images**     | http://localhost:3000/admin/images              | Image albums       |
| **Slides**     | http://localhost:3000/admin/slides              | Slideshow          |
| **Settings**   | http://localhost:3000/admin/settings            | Company info       |

**Features to Test:**

- ✅ Dashboard menu grid
- ✅ Dark mode toggle (independent from public site)
- ✅ Logout functionality
- ✅ Protected routes (try accessing admin pages without login)

---

## 🧪 Quick Test Checklist

### Public Site:

- [ ] Open http://localhost:3000
- [ ] See construction company homepage
- [ ] Click "บริการของเรา" in nav → scrolls to services
- [ ] Click dark mode toggle → theme changes
- [ ] Resize browser → mobile menu appears
- [ ] No authentication required ✅

### Admin Panel:

- [ ] Open http://localhost:3000/admin/dashboard (should redirect to login)
- [ ] Login with admin/admin123456
- [ ] See dashboard with colored menu cards
- [ ] Click on any menu card → navigates to that section
- [ ] Toggle dark mode → admin theme changes
- [ ] Click logout → redirects to login
- [ ] Try visiting `/admin/articles` without login → redirects to login ✅

### Both Systems:

- [ ] Public site works without login
- [ ] Admin requires authentication
- [ ] Dark mode settings are independent
- [ ] No errors in browser console

---

## 🎯 Default Credentials

**⚠️ Important**: Change these before production!

**Location**: `lib/auth.ts`

```typescript
const users = [
  {
    username: "admin",
    password: "admin123456", // Change this!
  },
];
```

---

## 📝 Common Issues & Solutions

### Issue: Port 3000 already in use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue: Dark mode not persisting

- Check browser localStorage is enabled
- Clear cache and reload

### Issue: Can't login to admin

- Verify credentials: `admin` / `admin123456`
- Check `.env.local` has `AUTH_SECRET` set

### Issue: Admin pages redirect to login even after login

- Clear browser cookies
- Check session in browser DevTools → Application → Cookies

---

## 🎨 Customization Tips

### Change Public Site Colors:

File: `app/page.tsx` and `components/PublicHeader.tsx`

- Replace `sky-` with your color (e.g., `blue-`, `purple-`)
- Replace `amber-` with your accent color

### Change Company Info:

File: `app/page.tsx` (Search for):

- Company name: "PPD Builder"
- Phone: "02-123-4567"
- Email: "contact@ppdbuilder.com"
- Address: "Building 88, ถนนสุขุมวิท..."

### Add More Services:

File: `app/page.tsx` (Services section)

- Duplicate a service card
- Change icon, title, description

### Update Admin Menu:

File: `constants/menu.ts`

- Add/remove menu items
- Change icons, colors, paths

---

## 📚 Documentation

- [RESTRUCTURE_COMPLETE.md](./RESTRUCTURE_COMPLETE.md) - Full restructure details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- [README.md](./README.md) - Complete setup guide

---

## 🚀 Ready to Deploy?

1. Update `.env.local` with production values
2. Change admin password in `lib/auth.ts`
3. Build: `npm run build`
4. Test build: `npm start`
5. Deploy to Vercel/Netlify

**Environment Variables Needed:**

```env
AUTH_SECRET=<your-secret-min-32-chars>
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
```

---

**Need Help?** Check the error console in your browser (F12) for detailed error messages.

**All Set!** 🎉 Your site is ready to use with both public and admin areas working perfectly!
