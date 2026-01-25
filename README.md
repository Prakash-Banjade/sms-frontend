# School Management System - Frontend

<div align="center">

![School Management System](https://tscapis.e-aribt.com/uploads/Loomis%20Global%20School%20Logo-01-1cb6f8.png)

**A comprehensive, modern, and robust school management system built with React and TypeScript**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.5-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC.svg)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Portal Features](#-portal-features)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development Workflow](#-development-workflow)
- [Project Structure](#-project-structure)
- [Core Modules](#-core-modules)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **School Management System Frontend** is a comprehensive web application designed to streamline and automate various administrative, academic, and operational tasks in educational institutions. This system provides dedicated portals for different user roles, ensuring role-based access control and tailored user experiences.

### Key Highlights

- **Multi-Portal Architecture**: Separate interfaces for Super Admin, Admin, Teachers, and Students
- **Comprehensive Academic Management**: Complete student lifecycle management from admission to graduation
- **Financial Management**: Fee collection, salary management, and financial reporting
- **Modern UI/UX**: Built with shadcn/ui components and Radix UI primitives
- **Type-Safe**: Fully typed with TypeScript and Zod schema validation

---

## ✨ Features

### 🔐 Authentication & Authorization
- Multi-factor authentication with OTP verification
- WebAuthn/Passkey support for passwordless authentication
- Role-based access control (RBAC)
- Persistent login sessions with device management
- Sudo mode for sensitive operations

### 👥 User Management
- Four distinct user portals (Super Admin, Admin, Teacher, Student)
- User profile management with avatar support
- Role-specific dashboards and navigation
- Device tracking and session management

### 📚 Academic Management
- **Class & Section Management**: Create and manage classes, sections, and faculties
- **Subject Management**: Subject allocation, teacher assignments
- **Class Routines**: Dynamic timetable creation and management
- **Lesson Plans**: Teacher-created lesson plans with rich text support
- **Examination System**: 
  - Exam setup and scheduling
  - Exam routines and evaluation
  - Mark entry and grade calculation
  - Multiple report formats (student-wise, class-wise, subject-wise)
- **Tasks & Assignments**: 
  - Homework and assignment creation
  - Student submission tracking
  - Grading and feedback system

### 👨‍🎓 Student Management
- Student registration and enrollment
- Student profile with comprehensive information
- Attendance tracking and leave management
- Subject selection for elective courses
- Class promotion and transfer
- Student ID card generation
- Fee management and payment tracking
- Academic performance reports

### 👨‍🏫 Teacher Management
- Teacher profiles with qualification details
- Subject and class assignments
- Attendance tracking
- Salary management
- Leave request system
- Performance evaluation
- Teacher ID card generation

### 👔 Staff Management
- Staff registration and profile management
- Role-based staff categorization
- Attendance and leave tracking
- Salary and payroll management

### 📖 Library Management
- Book cataloging with categories
- Book issue and return tracking
- Digital library (e-library) for online resources
- Library member management
- Overdue tracking and fine calculation
- Library statistics and reports

### 🏨 Dormitory Management
- Dormitory and room management
- Room type configuration
- Student room allocation
- Occupancy tracking

### 🚌 Transportation Management
- Vehicle management
- Route and stop configuration
- Student transport allocation

### 💰 Finance Management
- **Fee Management**:
  - Charge head configuration
  - Fee structure creation
  - Billing and payment processing
  - Payment history and receipts
  - Fee defaulter reports
- **Salary Management**:
  - Salary structure configuration
  - Payroll processing
  - Payment tracking
  - Salary slips generation

### 📢 Communication
- Notice board system with rich text editor
- Real-time chat system
- Live video classes with Stream.io integration
- Email notifications
- Push notifications

### 📊 Reports & Analytics
- Dashboard with key metrics and charts
- Attendance reports
- Academic performance reports
- Financial reports
- Custom report generation

### ⚙️ Settings & Configuration
- General settings management
- Academic year configuration
- Branch management (multi-branch support)
- Exam type and grade configuration
- Theme customization (multiple color themes)
- Dark mode support

---

## 🛠 Tech Stack

### Core Framework & Language
- **React** - UI library for building component-based interfaces
- **TypeScript** - Type-safe JavaScript superset
- **Vite** - Next-generation frontend build tool

### Routing & State Management
- **React Router DOM** - Client-side routing
- **TanStack Query** - Server state management and data fetching
- **React Context API** - Global state management

### UI Components & Styling
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
  - Dialog, Dropdown, Popover, Select, Tabs, and more
- **shadcn/ui** - Re-usable component collection
- **Lucide React** - Icon library
- **next-themes** - Theme management with dark mode support

### Form Management & Validation
- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation resolvers

### Rich Text Editing
- **Tiptap** - Headless rich text editor
  - Extensions: Code blocks, Images, Links, Typography
  - Syntax highlighting with Lowlight
- **DOMPurify** - XSS sanitization

### Data Visualization
- **Recharts** - Composable charting library
- **FullCalendar** - Calendar and scheduling

### Real-time Communication
- **@stream-io/video-react-sdk** - Video calling and live streaming
- **Axios** - HTTP client for API requests

### Tables & Data Display
- **TanStack Table** - Headless table library
- **React Masonry CSS** - Masonry layout

### Drag & Drop
- **@dnd-kit** - Modern drag and drop toolkit
  - Core, Sortable, and Utilities

### Utilities
- **date-fns** - Modern date utility library
- **clsx & tailwind-merge** - Conditional className utilities
- **jwt-decode** - JWT token decoding
- **lodash** - Utility functions
- **uuid** - UUID generation
- **to-words** - Number to words conversion
- **ua-parser-js** - User agent parsing

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing
- **Vite Plugin React** - React fast refresh and JSX support

---

## 🏗 Architecture

### Design Patterns

#### 1. **Multi-Portal Architecture**
The application is structured around four distinct portals, each with its own routing, components, and business logic:

```
src/apps/
├── super_admin/    # Super Admin portal
├── admin/          # Admin portal
├── teacher/        # Teacher portal
├── student/        # Student portal
├── common/         # Shared features across portals
└── public/         # Public-facing pages (login, etc.)
```

#### 2. **Feature-Based Organization**
Each portal follows a feature-based structure:

```
portal/
├── components/     # Portal-specific components
├── pages/          # Route components
├── data-access/    # API hooks and queries
├── types/          # TypeScript type definitions
├── schemas/        # Zod validation schemas
├── layout/         # Layout components
└── utils/          # Utility functions
```

#### 3. **Component Architecture**
- **Atomic Design**: Components are organized from atoms to organisms
- **Composition over Inheritance**: Leveraging React's composition model
- **Headless UI Pattern**: Using Radix UI for accessible, unstyled primitives
- **Compound Components**: Complex components broken into sub-components

#### 4. **State Management Strategy**
- **Server State**: TanStack Query for API data caching and synchronization
- **Client State**: React Context for global UI state (theme, auth)
- **Form State**: React Hook Form for form-specific state
- **URL State**: React Router for navigation state

#### 5. **Data Fetching Pattern**
```typescript
// Custom hooks for data fetching
const useStudents = (filters) => {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => fetchStudents(filters),
  });
};
```

#### 6. **Authentication Flow**
```
Login → OTP Verification → Role Detection → Portal Redirect → Persist Session
```

- **PersistLogin**: Wrapper component that validates sessions
- **RequireAuth**: Route guard for role-based access
- **RequireSudo**: Additional verification for sensitive operations

---

## 👤 Portal Features

### 🔴 Super Admin Portal

**Purpose**: System-wide configuration and multi-branch management

**Key Features**:
- **Branch Management**: Create and manage multiple school branches
- **Admin Management**: Create and assign admins to branches
- **Academic Year Configuration**: Set up academic years and terms
- **Faculty Management**: Define faculties/departments
- **Examination Configuration**: 
  - Exam type setup (Terminal, Unit Test, etc.)
  - Mark grade configuration (A+, A, B+, etc.)
- **Access to All Admin Features**: Full access to all administrative functions
- **System Analytics**: Cross-branch reports and analytics

**Unique Capabilities**:
- Multi-branch oversight
- System-wide settings
- Admin user creation
- Global configuration management

---

### 🟢 Admin Portal

**Purpose**: Complete school administration and management

**Key Features**:

#### Academic Management
- **Classes & Sections**: Create, edit, and manage classes and sections
- **Subjects**: Subject creation, teacher assignment, and curriculum management
- **Class Routines**: Timetable creation and scheduling
- **Lesson Plans**: View and approve teacher lesson plans
- **Examination**: 
  - Exam setup and configuration
  - Exam routine creation
  - Mark entry and evaluation
  - Report card generation

#### Student Management
- **Admissions**: New student registration and enrollment
- **Student Records**: Comprehensive student profiles
- **Attendance**: Track and manage student attendance
- **Leave Requests**: Approve/reject student leave applications
- **Subject Selection**: Manage elective subject choices
- **Class Changes**: Transfer students between classes
- **Promotion**: Bulk student promotion to next grade
- **Fee Management**: Monitor fee payments and generate bills

#### Staff Management
- **Teachers**: 
  - Teacher registration and profile management
  - Subject and class assignments
  - Performance tracking
  - Salary management
- **Staff**: 
  - Non-teaching staff management
  - Role assignment
  - Attendance tracking
- **Employee Attendance**: Track all employee attendance
- **Leave Management**: Approve employee leave requests

#### Resource Management
- **Library**: 
  - Book cataloging and categorization
  - Issue/return management
  - Library statistics
- **Dormitory**: 
  - Room allocation
  - Occupancy management
- **Transportation**: 
  - Vehicle management
  - Route configuration

#### Financial Management
- **Fee Management**: 
  - Charge head configuration
  - Fee structure creation
  - Billing and payment tracking
- **Salary Management**: 
  - Salary structure setup
  - Payroll processing
  - Payment history

#### Communication & Tasks
- **Notices**: Create and publish school-wide notices
- **Tasks**: Assign homework and assignments to students
- **Chat**: Communication with teachers, students, and staff

#### Reports
- Examination reports (class-wise, student-wise, subject-wise)
- Attendance reports
- Financial reports
- Custom analytics

---

### 🔵 Teacher Portal

**Purpose**: Teaching, student management, and academic activities

**Key Features**:

#### Teaching & Academics
- **My Classes**: View assigned classes and sections
- **Students**: Access student information and profiles
- **Attendance**: Mark student attendance for classes
- **Leave Requests**: Review student leave applications
- **Lesson Plans**: 
  - Create detailed lesson plans
  - Upload teaching materials
  - Track curriculum coverage
- **Tasks**: 
  - Create homework and assignments
  - Review student submissions
  - Grade and provide feedback

#### Communication
- **Live Classes**: Conduct online video classes
- **Chat**: Communicate with students and colleagues
- **E-Library**: Access and share digital resources

#### Personal Management
- **Schedule**: View personal class timetable
- **My Attendance**: Track personal attendance
- **Leave Requests**: Apply for leave
- **Salary**: View salary details and payment history
- **Library**: Check borrowed books and due dates

#### Resources
- Access to digital library
- Teaching materials repository
- Student performance analytics

---

### 🟡 Student Portal

**Purpose**: Learning, assignments, and academic tracking

**Key Features**:

#### Academics
- **Dashboard**: Overview of classes, assignments, and announcements
- **My Subjects**: View enrolled subjects and subject details
- **Tasks**: 
  - View homework and assignments
  - Submit assignments online
  - Track submission status
- **Lesson Plans**: Access teacher-created lesson plans
- **Class Routine**: View personal timetable
- **Examination**: 
  - View exam schedule
  - Access exam reports and grades

#### Communication & Learning
- **Teachers**: View teacher contact information
- **Live Classes**: Join online video classes
- **E-Library**: Access digital learning resources
- **Notices**: View school announcements

#### Personal Management
- **Attendance**: View attendance records
- **Leave Requests**: Apply for leave
- **Fees**: Check fee status and payment history
- **Library**: View borrowed books and due dates
- **Dormitory**: View room allocation (if applicable)

#### Features
- Assignment submission with file uploads
- Grade tracking and academic progress
- Attendance percentage monitoring
- Fee payment history

---

## 📦 Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (required - enforced by preinstall script)
- **Git**: For version control

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Prakash-Banjade/sms-frontend.git
   cd sms-frontend
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_TIMEOUT=30000

   # Stream.io Configuration (for live classes)
   VITE_STREAM_API_KEY=your_stream_api_key

   # App Configuration
   VITE_APP_NAME=School Management System
   VITE_APP_URL=http://localhost:5173

   # Feature Flags
   VITE_ENABLE_LIVE_CLASSES=true
   VITE_ENABLE_CHAT=true
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   pnpm build
   ```

6. **Preview Production Build**
   ```bash
   pnpm preview
   ```

---

## ⚙️ Configuration

### Theme Configuration

The application supports multiple color themes and dark mode. Themes are located in `src/themes/`:

- `blue.css`
- `green.css`
- `yellow.css`
- `orange.css`
- `red.css`
- `purple.css`
- `pink.css`
- `slate.css`
- `zinc.css`

Users can switch themes from the settings menu.

### TailwindCSS Configuration

TailwindCSS v4 is configured with:
- Custom color schemes
- Typography plugin
- Container queries
- Animations

---

## 🔄 Development Workflow

### Code Organization

1. **Feature Development**
   - Create feature branch from `main`
   - Implement feature in appropriate portal directory
   - Add types and schemas
   - Create data-access hooks
   - Build UI components
   - Add to routing

2. **Component Development**
   - Use shadcn/ui components as base
   - Extend with custom logic
   - Ensure accessibility (ARIA labels, keyboard navigation)
   - Add TypeScript types
   - Document props with JSDoc

3. **API Integration**
   - Define TypeScript types for API responses
   - Create Zod schemas for validation
   - Build custom hooks with TanStack Query
   - Handle loading, error, and success states
   - Implement optimistic updates where appropriate

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced code quality rules
- **Naming Conventions**:
  - Components: PascalCase (`StudentList.tsx`)
  - Hooks: camelCase with `use` prefix (`useStudents.ts`)
  - Types: PascalCase with descriptive names (`StudentType`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/student-attendance

# Make changes and commit
git add .
git commit -m "feat: add student attendance marking"

# Push to remote
git push origin feature/student-attendance

# Create pull request for review
```

---

## 📁 Project Structure

```
school_management_system-frontend/
├── public/                      # Static assets
├── src/
│   ├── apps/                    # Portal applications
│   │   ├── super_admin/         # Super Admin portal
│   │   │   ├── components/      # Super admin components
│   │   │   ├── pages/           # Super admin pages
│   │   │   ├── data-access/     # API hooks
│   │   │   ├── types/           # Type definitions
│   │   │   ├── layout/          # Layout components
│   │   │   └── super_admin-routes.tsx
│   │   ├── admin/               # Admin portal
│   │   │   ├── components/      # Admin components
│   │   │   │   ├── dashboard/
│   │   │   │   ├── students-management/
│   │   │   │   ├── teachers/
│   │   │   │   ├── examination/
│   │   │   │   ├── finance-system/
│   │   │   │   ├── library/
│   │   │   │   └── ...
│   │   │   ├── pages/           # Admin pages
│   │   │   ├── data-access/     # API hooks
│   │   │   ├── types/           # Type definitions
│   │   │   ├── schemas/         # Zod schemas
│   │   │   └── admin-routes.tsx
│   │   ├── teacher/             # Teacher portal
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── data-access/
│   │   │   └── teacher-routes.tsx
│   │   ├── student/             # Student portal
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── data-access/
│   │   │   └── student-routes.tsx
│   │   ├── common/              # Shared features
│   │   │   ├── pages/
│   │   │   │   ├── online-classes/
│   │   │   │   ├── library-books/
│   │   │   │   └── leave-request/
│   │   │   └── common-routes.tsx
│   │   └── public/              # Public pages
│   │       └── pages/
│   │           ├── login/
│   │           ├── forgot-password/
│   │           └── ...
│   ├── components/              # Shared components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── forms/               # Form components
│   │   ├── data-table/          # Table components
│   │   ├── auth/                # Auth components
│   │   ├── minimal-tiptap/      # Rich text editor
│   │   └── app-sidebar-layout/  # Layout components
│   ├── contexts/                # React contexts
│   │   ├── auth-context.tsx
│   │   └── theme-context.tsx
│   ├── hooks/                   # Custom hooks
│   │   ├── use-auth.ts
│   │   ├── use-debounce.ts
│   │   └── ...
│   ├── lib/                     # Library configurations
│   │   └── utils.ts
│   ├── react-query/             # TanStack Query config
│   │   ├── query-client.ts
│   │   └── query-keys.ts
│   ├── schemas/                 # Global Zod schemas
│   ├── services/                # API services
│   │   └── api.service.ts
│   ├── themes/                  # Theme CSS files
│   ├── types/                   # Global TypeScript types
│   │   └── global.type.ts
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   ├── router.tsx               # Route configuration
│   ├── index.css                # Global styles
│   └── CONSTANTS.ts             # Global constants
├── .env                         # Environment variables
├── .eslintrc.js                 # ESLint configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.mjs          # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # This file
```

---

## 🧩 Core Modules

### 1. Authentication Module
**Location**: `src/components/auth/`

**Components**:
- `PersistLogin`: Session persistence wrapper
- `RequireAuth`: Role-based route guard
- `RequireSudo`: Elevated permission guard

**Features**:
- JWT-based authentication
- OTP verification
- WebAuthn/Passkey support
- Device tracking
- Session management

---

### 2. Student Management Module
**Location**: `src/apps/admin/components/students-management/`

**Features**:
- Student registration with comprehensive forms
- Profile management with photo upload
- Attendance tracking with calendar view
- Leave request management
- Subject selection for electives
- Class transfer and promotion
- Academic performance tracking
- Fee management integration

**Key Components**:
- `StudentList`: Paginated, searchable student list
- `StudentProfile`: Detailed student information
- `AttendanceCalendar`: Visual attendance tracking
- `SubjectSelection`: Elective subject chooser

---

### 3. Examination Module
**Location**: `src/apps/admin/components/examination/`

**Features**:
- Exam type configuration
- Exam creation with subject-wise marks distribution
- Exam routine scheduling
- Mark entry with validation
- Grade calculation based on configured grade system
- Report card generation (multiple formats)
- Exam analytics and statistics

**Key Components**:
- `ExamSetup`: Exam configuration wizard
- `ExamRoutine`: Calendar-based routine display
- `MarkEntry`: Spreadsheet-like mark entry interface
- `ReportCard`: Printable report card generator

---

### 4. Finance Module
**Location**: `src/apps/admin/components/finance-system/`

**Sub-modules**:

#### Fee Management
- Charge head configuration (Tuition, Transport, etc.)
- Fee structure creation per class/category
- Automated billing generation
- Payment processing and receipt generation
- Payment history tracking
- Defaulter reports

#### Salary Management
- Salary structure configuration
- Allowance and deduction setup
- Payroll processing
- Salary slip generation
- Payment tracking

**Key Components**:
- `FeeStructure`: Fee configuration interface
- `BillingDashboard`: Payment tracking dashboard
- `SalaryStructure`: Salary component configuration
- `PayrollProcessor`: Salary calculation and processing

---

### 5. Library Module
**Location**: `src/apps/admin/components/library/`

**Features**:
- Book cataloging with ISBN, author, publisher
- Category management
- Book issue/return workflow
- Member management
- Overdue tracking
- Fine calculation
- Library statistics
- Digital library (e-library) for online resources

**Key Components**:
- `BookCatalog`: Book listing and search
- `IssueReturn`: Book transaction interface
- `LibraryDashboard`: Statistics and analytics

---

### 6. Communication Module
**Location**: `src/apps/common/`

**Features**:

#### Chat System
- Real-time messaging
- Direct and group conversations
- File sharing
- Message notifications
- Read receipts

#### Live Classes
- Video conferencing with Stream.io
- Screen sharing
- Recording capabilities
- Participant management
- Chat during live sessions

#### Notices
- Rich text notice creation
- Targeted notice distribution
- Notice board display
- Email notifications

---

### 7. Attendance Module
**Locations**: 
- `src/apps/admin/components/attendances/` (Employee)
- `src/apps/admin/components/students-management/attendance/` (Student)

**Features**:
- Daily attendance marking
- Bulk attendance entry
- Attendance reports
- Leave request management
- Attendance percentage calculation
- Attendance analytics

**Key Components**:
- `AttendanceSheet`: Daily attendance interface
- `AttendanceCalendar`: Monthly attendance view
- `LeaveRequestForm`: Leave application form

---

### 8. Dashboard Module
**Location**: `src/apps/[portal]/pages/dashboard/`

**Features** (varies by portal):
- Key metrics and statistics
- Recent activities
- Quick actions
- Charts and graphs (Recharts)
- Upcoming events
- Notifications

**Visualizations**:
- Student enrollment trends
- Attendance statistics
- Fee collection charts
- Exam performance graphs

---

### 9. Reports Module
**Location**: `src/apps/admin/components/report/`

**Report Types**:
- **Examination Reports**:
  - Student-wise: Individual student performance
  - Class-wise: Class average and ranking
  - Subject-wise: Subject performance analysis
- **Attendance Reports**:
  - Daily, weekly, monthly attendance
  - Defaulter reports
- **Financial Reports**:
  - Fee collection reports
  - Salary disbursement reports
  - Outstanding payments

**Features**:
- Exportable to PDF/Excel
- Customizable date ranges
- Filtering and sorting
- Print-friendly layouts

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests if applicable
5. Ensure code passes linting
6. Submit a pull request

### Commit Message Convention
Follow conventional commits:
```
feat: add student bulk import feature
fix: resolve attendance calculation bug
docs: update API documentation
style: format code with prettier
refactor: restructure student module
test: add unit tests for fee calculation
chore: update dependencies
```

### Code Review Process
1. All PRs require review from at least one maintainer
2. Ensure CI/CD checks pass
3. Address review comments
4. Squash commits before merging

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Prakash Banjade**
- GitHub: [@Prakash-Banjade](https://github.com/prakash-banjade)
- Repository: [sms-frontend](https://github.com/Prakash-Banjade/sms-frontend)

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [TanStack](https://tanstack.com/) for excellent data management tools
- [Stream.io](https://getstream.io/) for video SDK
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/Prakash-Banjade/sms-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Prakash-Banjade/sms-frontend/discussions)

---

<div align="center">

**Built with ❤️ for educational institutions**

</div>