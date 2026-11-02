# BloodLink — Blood Donation & Emergency Coordination Platform

<div align="center">
  <img src="https://raw.githubusercontent.com/mdratul4505/BloodLink-Frontend/main/public/favicon.ico" alt="BloodLink Logo" width="64" height="64" />
  <h3>Every Drop Connects a Life</h3>
  <p>A mission-critical healthcare SaaS application connecting voluntary blood donors, patients, hospitals, and blood banks with automated emergency dispatch.</p>
</div>

---

## 🌟 Overview

**BloodLink** is an enterprise-grade, fully responsive blood donation and emergency coordination platform. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**, it integrates seamlessly with an existing 56-endpoint production backend.

The platform provides life-saving capabilities including real-time donor search, emergency blood request broadcasting, organization verification, blood donation camp management, bKash financial support contributions, and multi-role dashboards for donors, organizations, and platform administrators.

---

## 🚀 Key Features

### 1. Public Experience & Marketing
- **10-Section Home Page**:
  1. *Hero Section* with headline, CTAs, live counters, and animated badge.
  2. *Impact Statistics* with animated numbers (donors, fulfilled requests, lives saved).
  3. *How It Works* interactive step-by-step workflow for donors and patients.
  4. *Find Blood Donors* quick search preview with blood group selector.
  5. *Live Emergency Requests* urgency badges, countdown timers, and response action.
  6. *Verified Organizations & Blood Banks* partner network with verification seals.
  7. *Upcoming Donation Camps* schedule, venue, and registration links.
  8. *Why Choose BloodLink* key platform advantages and security highlights.
  9. *Call to Action Banner* encouraging registration and emergency requests.
  10. *Enterprise Footer* with quick links, legal documents, emergency hotline, and developer credit.

### 2. Public Directories & Discovery
- **Donors Directory (`/donors`)**: Filter by blood group, district, upazila, and live availability.
- **Blood Requests Directory (`/blood-requests`)**: Filter by urgency, status, and location.
- **Organizations Directory (`/organizations`)**: Verified hospitals, blood banks, and volunteer clubs.
- **Donation Camps (`/camps`)**: Public blood drive schedule with one-click donor registration.
- **Emergency SOS Launcher**: Global floating action button (FAB) for instant blood broadcasting.

### 3. Developer Profile (`/developer`)
- Dedicated portfolio page showcasing **MD. Ratul Hasan**, Diploma Engineer in Computer Science and Technology (Satkhira Polytechnic Institute).
- Showcases technical competencies (Next.js, React, Node.js, Express, MongoDB, TypeScript, Tailwind CSS, Prisma).
- Direct GitHub and LinkedIn links.

### 4. Complete Authentication Suite
- **Sign In (`/login`)**: Email/Password authentication with JWT access and refresh token management.
- **Sign Up (`/register`)**: Role-based registration with blood group selection.
- **Email Verification (`/verify-email`, `/verify-account`)**: 6-digit OTP verification.
- **Password Recovery (`/forgot-password`, `/verify-otp`, `/reset-password`)**: Secure OTP-based reset flow.

### 5. Multi-Role Dashboard System
Powered by the official **shadcn/ui Sidebar** suite with collapsible navigation and breadcrumbs:
- **User / Donor Dashboard (`/dashboard/user`)**:
  - Live donor availability toggle (`ACTIVE` / `INACTIVE`).
  - Personal blood donation history and response timeline.
  - Active blood requests posted by user.
  - Notification center with mark-as-read controls.
  - Contribution history with bKash receipt downloads.
  - Profile and security settings.
- **Organization Dashboard (`/dashboard/organization`)**:
  - Organization profile management and verification status tracking.
  - Camp management (create camps, schedule dates, monitor donor registrations).
  - Member management and team role assignments.
- **Admin Dashboard (`/dashboard/admin`)**:
  - System-wide metric charts (users, donors, blood requests, total volume).
  - User management (search, role filtering, instant account suspension/activation).
  - Organization verification portal (approve/reject with audit feedback).
  - Blood request management across all districts.
  - Donation camp approval and status controls.
  - Payment and donation audit tracking (bKash TrxID, invoice numbers).
  - System audit logs with JSON payload inspector.

### 6. Global Theme & Localization System
- **Theme Switcher**: Instant switching between **Light Mode**, **Dark Mode**, and **System Default** powered by `next-themes` and semantic CSS variables.
- **Language Switcher**: Seamless toggling between **English** and **বাংলা** (Bengali) with persistent localStorage state.

### 7. Payment Gateway Integration
- Secure **bKash** payment gateway integration for platform support and emergency patient funds.
- Automatic callback handler (`/payment/callback`) for transaction verification and receipt rendering.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript |
| **UI Components** | **shadcn/ui** (Base UI & Radix UI accessible primitives) |
| **Styling** | Tailwind CSS with semantic design tokens |
| **Icons** | Lucide React |
| **Animations** | Motion for React (`motion/react`) |
| **State & Data Fetching** | TanStack React Query v5 |
| **HTTP Client** | Axios with automated token refresh interceptor |
| **Theming** | `next-themes` (Class-based dark mode) |
| **Validation** | Zod |

---

## 📂 Project Structure

```
blood-link-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Login, Register, Forgot/Reset Password
│   │   ├── (public)/                # Landing page, Donors, Requests, Camps, Orgs, Developer
│   │   ├── dashboard/               # Multi-role Dashboards
│   │   │   ├── user/                # Donor / User dashboard
│   │   │   ├── organization/        # Organization dashboard
│   │   │   └── admin/               # Platform Administrator dashboard
│   │   ├── payment/callback/        # bKash Gateway Callback & Receipt
│   │   ├── globals.css              # Design tokens and theme CSS variables
│   │   ├── layout.tsx               # Root layout with providers & emergency launcher
│   │   ├── not-found.tsx            # Custom branded 404 page
│   │   ├── error.tsx                # Client error boundary
│   │   ├── loading.tsx              # Root loader animation
│   │   ├── robots.ts                # SEO robots file
│   │   └── sitemap.ts               # Dynamic XML sitemap
│   ├── components/
│   │   ├── common/                  # Logo, ThemeSwitcher, LanguageSwitcher, EmergencyFAB
│   │   ├── dashboard/               # AppSidebar, DashboardHeader, NotificationDropdown
│   │   ├── layout/                  # Navbar, Footer
│   │   └── ui/                      # Official shadcn/ui components
│   ├── lib/
│   │   ├── api/                     # Axios instance, token interceptors, endpoint mapping
│   │   └── i18n/                    # English & Bengali translation dictionaries
│   ├── providers/                   # AuthProvider, LanguageProvider, ThemeProvider, QueryProvider
│   ├── services/                    # Typed API client services for 56 endpoints
│   └── types/                       # TypeScript interfaces, enums, and API models
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+ or [Bun](https://bun.sh/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mdratul4505/BloodLink-Frontend.git
   cd BloodLink-Frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_API_URL=https://blood-link-backend-one.vercel.app/api/v1
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build

To verify compilation and generate an optimized production bundle:
```bash
bun run build
# or
npm run build
```

---

## 📄 License & Attribution

Developed with ❤️ for humanity by **MD. Ratul Hasan**.
Every Drop Connects a Life.
