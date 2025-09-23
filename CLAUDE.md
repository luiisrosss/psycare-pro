# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Next.js 15 with turbopack)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Lint**: `npm run lint`

## Project Context

**CRITICAL**: Always check `contexto.md` for the current real state of the application as seen by the user. This file is updated after every significant change and contains:
- Current functionality status
- Known bugs and issues
- User experience feedback
- Priority problems to fix

This context is essential for understanding what actually works vs what should work.

## Tech Stack

This is a Next.js 15 application using:

- **Framework**: Next.js 15 with App Router and Server Components
- **Authentication**: Clerk for user authentication and session management
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Payments**: Stripe for subscription billing
- **UI**: shadcn/ui components with Radix UI and Tailwind CSS
- **Forms**: react-hook-form with zod validation
- **Icons**: Lucide React

## Architecture Overview

### Project Structure

- `app/` - Next.js App Router pages and API routes
  - Main pages: Dashboard (`/`), Patients (`/pacientes`), Appointments (`/citas`), Notes (`/notas`), Billing (`/facturacion`), Reminders (`/recordatorios`), Settings (`/configuracion`)
  - Authentication: Sign-in handled by Clerk at `/sign-in/[[...sign-in]]`
  - API: Stripe webhooks at `/api/webhooks/stripe`
- `components/` - React components (both shadcn/ui and custom components)
- `lib/` - Utility functions and configurations
  - `actions/` - Server actions for data operations
  - `supabase.ts` - Supabase client configuration
  - `stripe.ts` - Stripe configuration
  - `utils.ts` - Utility functions including cn() for className merging
- `types/index.d.ts` - TypeScript type definitions

### Data Architecture

This is a SaaS application for psychologists (`PsyCare Pro`) with multi-tenancy using Row Level Security:

- **Psychologists**: Main tenant entity, linked to Clerk user_id
- **Patients**: Belong to psychologists, with comprehensive medical info
- **Appointments**: Sessions between psychologists and patients
- **Clinical Notes**: Session notes with mood/risk assessments
- **Invoices**: Billing for sessions
- **Documents**: File attachments for patients

Key status enums:
- `PatientStatus`: active, inactive, discharged
- `AppointmentStatus`: scheduled, completed, cancelled, no_show
- `SessionType`: individual, couple, family, group
- `PaymentStatus`: pending, paid, overdue

### Authentication & Authorization

- Uses Clerk for authentication with customized appearance
- Server actions use `auth()` from `@clerk/nextjs/server` to get userId
- All database operations are scoped to the authenticated psychologist
- Supabase RLS ensures data isolation between psychologists

### Key Patterns

1. **Server Actions**: Located in `lib/actions/`, all use standard pattern:
   - Get userId from Clerk auth
   - Fetch psychologist record
   - Perform database operations with psychologist_id filter
   - Use `revalidatePath()` for cache invalidation

2. **Component Structure**:
   - Main layout with Sidebar and Header components
   - Feature pages with loading skeletons
   - Form components using react-hook-form + zod

3. **Database Access**: All operations go through Supabase client with RLS enforcement

### Subscription Plans (CRITICAL)

**ALWAYS refer to `clerk-subscription-plans.md` for:**
- Plan configurations (starter, professional, enterprise)
- Pricing: €29, €59, €149 monthly (€134 Enterprise annual)
- Limits: 50/200/unlimited patients, 1GB/5GB/50GB storage
- Features: AI summaries, advanced reports, Google Calendar integration
- All subscription logic must follow the exact plan structure defined in that file

### Configuration Notes

- TypeScript build errors are ignored (`ignoreBuildErrors: true`)
- ESLint errors are ignored during builds
- Clerk images are allowed via `remotePatterns`
- Uses Inter font with CSS variables

### Environment Setup

The app requires these external services:
- Clerk for authentication
- Supabase for database
- Stripe for payments (optional)

The README.md contains detailed setup instructions including required environment variables.