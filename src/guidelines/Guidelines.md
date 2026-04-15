# Landbase Human Resources Company - Website Navigation Guide

## Overview
This guide provides comprehensive navigation instructions for all components in the Landbase HR website. The website features a job portal, resume builder, applicant dashboard, and more.

---

## Brand Colors
- Primary Yellow: `#ffca1a`
- Primary Green: `#17960b`

## Motto
"We recruit the right people with the right skills at the right time"

---

## Public Pages (No Login Required)

### 1. Homepage / Job Portal (`/`)
**Component:** `JobPortal.tsx`

**Features:**
- Browse available job listings
- Search jobs by title or company
- Filter by job type, location, and salary range
- View job details including description, requirements, and benefits
- Apply for jobs (redirects to login if not authenticated)
- Interactive chatbot for assistance
- Success rate statistics
- Top principal companies showcase

**Navigation:**
- Header with logo and navigation links
- "Sign In" button (top right) → Takes you to login page
- Job cards → Click to view full details
- "Apply Now" button → Requires login/signup
- Footer with company information and links

---

## Authentication

### 2. Login Page (`/login`)
**Component:** `LoginPage.tsx`

**Features:**
- Email and password login
- "Remember Me" checkbox
- "Forgot Password?" link
- Social login options (Google, LinkedIn)

**Navigation:**
- "Don't have an account? Sign up" → Takes you to signup page
- After successful login → Redirects to Dashboard

### 3. Sign Up Page (`/signup`)
**Component:** `AuthPage.tsx`

**Features:**
- Create new account with email and password
- Terms and conditions acceptance
- Social signup options

**Navigation:**
- "Already have an account? Log in" → Takes you to login page
- After successful signup → Redirects to Dashboard

---

## Protected Pages (Login Required)

### 4. Dashboard (`/dashboard`)
**Component:** `Dashboard.tsx`

**Main Layout:**
- **Sidebar** (`Sidebar.tsx`) - Left navigation menu
- **Header** (`Header.tsx`) - Top bar with user profile and logout
- **Main Content Area** - Changes based on selected menu item

**Sidebar Menu Items:**
1. **Jobs For You** (Default view)
2. **Resume Builder**
3. **Applicant Dashboard**
4. **My Applications**
5. **Saved Jobs**
6. **Profile Settings**
7. **About Us**
8. **Logout**

---

## Dashboard Components

### 5. Jobs For You
**Component:** `JobsForYou.tsx`

**Features:**
- Personalized job recommendations
- Resume completion status card
- One-click job applications
- Save jobs for later

**Actions:**
- "Apply Now" → Opens job application modal
- "Save Job" → Adds to Saved Jobs list
- "Update Resume" → Navigates to Resume Builder
- Job card click → View full job details

---

### 6. Resume Builder (`/dashboard` → Resume Builder)
**Component:** `ResumeBuilder.tsx`

**4-Step Process:**

#### Step 1: Personal Information
**Component:** `PersonalInfoForm.tsx`
- Full name, email, phone, address
- Professional title
- LinkedIn and portfolio links
- Professional summary
- Contact: Naomi Cuerdo, 09345234576 (pre-filled)

#### Step 2: Education & Skills
- Education history (institution, degree, dates)
- Skills list (add/remove skills)
- Certifications

#### Step 3: Experience
- Work experience entries
- Company, position, dates, description
- Add multiple experiences

#### Step 4: Preview & Download
**Component:** `ResumePreview.tsx`
- View complete resume
- Download as PDF (simulated)
- Submit application

**Navigation:**
- "Next" → Proceed to next step
- "Previous" → Go back to previous step
- "Save & Exit" → Save progress and return to dashboard
- "Submit Application" → Final step, submits resume

---

### 7. Applicant Dashboard
**Component:** `ApplicantDashboard.tsx`

**Features:**
- Resume grading system (score out of 100)
- Detailed analysis with strengths and improvements
- Company recommendations based on resume
- Top matches with compatibility scores

**Interactive Elements:**
- Grade breakdown cards (Education, Experience, Skills)
- Recommended companies cards with "View Details" buttons
- "Improve Resume" → Navigates to Resume Builder

---

### 8. My Applications
**Component:** `ApplicationProgress.tsx`

**Features:**
- List of all submitted applications
- Application status tracking
- Timeline of application stages
- Contact information for each application

**Application Statuses:**
- Under Review (Yellow)
- Interview Scheduled (Blue)
- Accepted (Green)
- Rejected (Red)

**Actions:**
- Click application card → View full details
- "View Application" button → Shows application summary
- "Withdraw Application" button → Remove application (only for pending/in-review applications)

**Timeline Stages:**
1. Application Submitted
2. Resume Reviewed
3. Phone Interview
4. Technical Interview
5. Final Interview
6. Offer Decision

---

### 9. Saved Jobs
**Component:** `SavedJobs.tsx`

**Features:**
- List of bookmarked/saved jobs
- Filter saved jobs
- Quick apply from saved jobs
- Remove from saved list

**Actions:**
- "Apply Now" → Opens application form
- "Remove" → Unsave the job
- Job card click → View full details

---

### 10. Profile Settings
**Component:** `ProfileSettings.tsx`

**Sections:**

#### Profile Picture
- Upload photo (JPG, PNG, GIF, max 2MB)
- Camera icon for quick upload
- Preview uploaded image

#### Personal Information
- Full name
- Email address
- Phone number
- Location
- Bio/About me

#### Change Password
- Current password
- New password
- Confirm new password

#### Danger Zone
- Delete account option

**Actions:**
- "Save Changes" → Updates profile
- "Cancel" → Discard changes
- "Upload Photo" / Camera icon → Opens file picker
- "Delete Account" → Removes account (with confirmation)

---

### 11. About Us
**Component:** `AboutUs.tsx`

**Content:**
- Company mission and vision
- Updated motto display
- Team information
- Company values and history
- Contact information

---

### 12. Job Application Modal
**Component:** `JobApplication.tsx`

**Features:**
- Quick application form
- Uses existing resume data
- Cover letter input
- Application details summary

**Actions:**
- "Submit Application" → Sends application
- "Cancel" → Closes modal
- Auto-fills from resume if available

---

## Additional Features

### ChatBot
**Component:** `ChatBot.tsx`
- Available on homepage (bottom-right corner)
- Click to expand/collapse
- Get instant answers about:
  - Job postings
  - Application process
  - Company information
  - Resume tips

### Footer
**Component:** `Footer.tsx`
- Company information
- Quick links
- Social media links
- Contact details
- Newsletter signup

### Header (Dashboard)
**Component:** `Header.tsx`
- User profile dropdown
- Notifications
- Search functionality
- Logout button

---

## Navigation Flow Examples

### Example 1: New User Applying for a Job
1. Visit homepage (`/`)
2. Browse job listings
3. Click "Apply Now" on desired job
4. Redirected to Sign Up page
5. Create account
6. Redirected to Dashboard
7. Click "Resume Builder" in sidebar
8. Complete 4-step resume process
9. Click "Jobs For You" in sidebar
10. Apply for jobs with completed resume

### Example 2: Existing User Checking Application Status
1. Login at `/login`
2. Redirected to Dashboard
3. Click "My Applications" in sidebar
4. Select application from list
5. View timeline and status
6. Click "View Application" for details

### Example 3: Updating Profile
1. Login and navigate to Dashboard
2. Click "Profile Settings" in sidebar
3. Upload profile photo (click camera icon or Upload Photo button)
4. Update personal information
5. Change password if needed
6. Click "Save Changes"

### Example 4: Building/Updating Resume
1. From Dashboard, click "Resume Builder"
2. Step 1: Fill personal information
3. Step 2: Add education and skills
4. Step 3: Add work experience
5. Step 4: Preview resume
6. Click "Submit Application" or "Save & Exit"

---

## Tips for Navigation

### Sidebar Menu
- Always visible on desktop
- Hamburger menu on mobile
- Active item highlighted with yellow/green gradient
- Hover effects for better UX

### Logout
- Available in sidebar menu
- Also in header profile dropdown
- Confirms before logging out
- Redirects to homepage after logout

### Responsive Design
- All components are fully responsive
- Mobile-friendly navigation
- Touch-optimized buttons and forms
- Collapsible sidebar on small screens

### Search & Filters
- Job Portal: Search by title/company, filter by type/location/salary
- Dashboard: Quick search in header
- Saved Jobs: Filter saved listings

---

## Component File Structure

```
/
├── App.tsx                          # Main application entry
├── components/
│   ├── AboutUs.tsx                  # About Us page
│   ├── ApplicantDashboard.tsx       # Resume grading & recommendations
│   ├── ApplicationProgress.tsx      # Track application status
│   ├── AuthPage.tsx                 # Sign up page
│   ├── ChatBot.tsx                  # AI chatbot assistant
│   ├── Dashboard.tsx                # Main dashboard container
│   ├── Footer.tsx                   # Footer component
│   ├── Header.tsx                   # Dashboard header
│   ├── JobApplication.tsx           # Job application modal
│   ├── JobPortal.tsx                # Homepage job listings
│   ├── JobsForYou.tsx               # Personalized job recommendations
│   ├── LoginPage.tsx                # Login page
│   ├── PersonalInfoForm.tsx         # Resume builder step 1
│   ├── ProfileSettings.tsx          # User profile settings
│   ├── ResumeBuilder.tsx            # Complete resume builder
│   ├── ResumePreview.tsx            # Resume preview component
│   ├── SavedJobs.tsx                # Saved jobs list
│   ├── Sidebar.tsx                  # Dashboard sidebar navigation
│   ├── SignUpPrompt.tsx             # Sign up prompt component
│   └── StepIndicator.tsx            # Resume builder step indicator
└── styles/
    └── globals.css                  # Global styles and Tailwind config
```

---

## Contact Information (Pre-filled in forms)
- **Contact Person:** Naomi Cuerdo
- **Phone:** 09345234576

---

## Support
For technical issues or questions:
- Use the ChatBot on the homepage
- Contact: Naomi Cuerdo (09345234576)
- Email support through Contact form in Footer

---

**Last Updated:** March 25, 2026
