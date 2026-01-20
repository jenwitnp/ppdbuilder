# Architecture: Service Layer Pattern

## Overview

The application uses a **Service Layer Pattern** where business logic is centralized in service classes. This allows both **Server Actions** (for Next.js app) and **API Routes** (for external platforms) to use the same logic.

## Structure

```
├── services/               # Business Logic Layer
│   └── slides.service.ts  # Slides business logic
├── actions/               # Next.js Server Actions
│   └── slides.actions.ts  # Server actions for slides
├── app/api/              # REST API Routes
│   └── slides/           # API endpoints for external use
│       ├── route.ts      # GET, POST
│       └── [id]/route.ts # PUT, DELETE, PATCH
```

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Client)                        │
│                  (app/slides/page.tsx)                      │
└───────────────┬──────────────────────┬─────────────────────┘
                │                      │
                │                      │
        ┌───────▼────────┐    ┌───────▼───────┐
        │ Server Actions │    │   API Routes  │
        │  (Internal)    │    │  (External)   │
        └───────┬────────┘    └───────┬───────┘
                │                      │
                │                      │
                └──────────┬───────────┘
                           │
                    ┌──────▼──────┐
                    │   Service   │
                    │    Layer    │
                    │ (Business   │
                    │   Logic)    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │  Database   │
                    │  & Storage  │
                    └─────────────┘
```

## Components

### 1. Service Layer (`services/slides.service.ts`)

**Purpose**: Contains all business logic for slides management

**Features**:

- ✅ Single source of truth
- ✅ Reusable across different entry points
- ✅ Easy to test
- ✅ Database and storage operations

**Methods**:

```typescript
class SlidesService {
  getAllSlides(); // Fetch all slides
  getSlideById(id); // Fetch single slide
  uploadImage(file); // Upload to Supabase Storage
  deleteImage(url); // Delete from storage
  createSlide(data); // Create new slide
  updateSlide(id, data); // Update existing slide
  deleteSlide(id); // Delete slide + image
  toggleSlideStatus(id); // Toggle active status
}
```

### 2. Server Actions (`actions/slides.actions.ts`)

**Purpose**: Next.js Server Actions for internal app use

**Advantages**:

- ✅ No API endpoints needed for internal use
- ✅ Automatic revalidation with `revalidatePath()`
- ✅ Type-safe communication
- ✅ Reduced boilerplate
- ✅ Better performance (no HTTP overhead)

**Functions**:

```typescript
getSlidesAction(); // Get all slides
createSlideAction(formData); // Create slide
updateSlideAction(id, formData); // Update slide
deleteSlideAction(id); // Delete slide
toggleSlideStatusAction(id, status); // Toggle status
```

**Usage** (in components):

```typescript
import { getSlidesAction } from "@/actions/slides.actions";

const result = await getSlidesAction();
if (result.error) {
  // Handle error
} else {
  // Use result.data
}
```

### 3. API Routes (`app/api/slides/`)

**Purpose**: REST API for external platforms/apps

**Advantages**:

- ✅ Standard HTTP interface
- ✅ Can be consumed by mobile apps, external services
- ✅ Easy to document (OpenAPI/Swagger)
- ✅ Platform agnostic

**Endpoints**:

```
GET    /api/slides       - Get all slides
POST   /api/slides       - Create new slide
PUT    /api/slides/:id   - Update slide
DELETE /api/slides/:id   - Delete slide
PATCH  /api/slides/:id   - Toggle status
```

**Usage** (external):

```bash
curl -X GET https://your-domain.com/api/slides
curl -X POST https://your-domain.com/api/slides \
  -F "image=@photo.jpg" \
  -F "title=My Slide" \
  -F "display_order=1"
```

## Benefits of This Architecture

### 1. **DRY Principle** (Don't Repeat Yourself)

- Business logic written once
- Used by both actions and API

### 2. **Separation of Concerns**

- Services: Business logic
- Actions: Next.js integration
- API: External interface

### 3. **Easy Testing**

- Test service layer independently
- Mock services in integration tests

### 4. **Flexibility**

- Switch between actions and API easily
- Add new entry points (GraphQL, etc.) without touching logic

### 5. **Maintainability**

- Changes in logic happen in one place
- Easier to debug and refactor

## Example: Adding New Feature

To add image compression:

```typescript
// 1. Update Service Layer (services/slides.service.ts)
async uploadImage(file: File): Promise<string> {
  // NEW: Compress image
  const compressedFile = await compressImage(file);

  // ... rest of upload logic
}
```

That's it! Both server actions AND API routes will automatically use compressed images.

## Current Usage

The Next.js app uses **Server Actions** for better performance:

- [app/slides/page.tsx](../app/slides/page.tsx) imports from `actions/slides.actions.ts`

The **API Routes** remain available for:

- Mobile apps
- External integrations
- Third-party services
- Webhooks

## Best Practices

1. **Always use the service layer**

   - Don't access Supabase directly from actions or API routes

2. **Keep services pure**

   - No `revalidatePath()` in services
   - No HTTP responses in services

3. **Error handling**

   - Services throw errors
   - Actions/API catch and format errors appropriately

4. **Type safety**
   - Use TypeScript interfaces from `types/`
   - Share types between all layers

## Future Improvements

- Add Redis caching layer
- Implement rate limiting on API routes
- Add GraphQL endpoint using same services
- Add background job processing
- Add audit logging in service layer
