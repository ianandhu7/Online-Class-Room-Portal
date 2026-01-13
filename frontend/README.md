# Online Classroom Portal - Frontend

A modern React-based online classroom management system built with Vite.

## 🚀 Features

- **Role-Based Access Control**: Separate dashboards for Admin, Teacher, and Student roles
- **Course Management**: Create, edit, and manage courses
- **Classroom Management**: Join classrooms with codes and manage classroom activities
- **Assignment System**: Create, submit, and track assignments
- **Authentication**: Complete auth flow with login, register, and forgot password
- **Modern UI**: Clean, responsive design with professional styling

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html              # Main HTML template
│   └── favicon.ico             # App favicon
│
├── src/
│   ├── api/                    # Axios instances & API calls
│   │   ├── auth.js             # Authentication API
│   │   ├── courses.js          # Courses API
│   │   ├── classrooms.js       # Classrooms API
│   │   └── assignments.js      # Assignments API
│   │
│   ├── assets/                 # Static assets
│   │   ├── images/
│   │   └── logos/
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Sidebar.jsx         # Side navigation
│   │   ├── Card.jsx            # Card component
│   │   ├── Button.jsx          # Button component
│   │   ├── Table.jsx           # Table component
│   │   └── Modal.jsx           # Modal component
│   │
│   ├── context/                # React Context for global state
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── AppContext.jsx      # App-level context
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── useAuth.js          # Auth hook
│   │
│   ├── pages/                  # Page components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── teacher/
│   │   │   │   └── TeacherDashboard.jsx
│   │   │   └── student/
│   │   │       └── StudentDashboard.jsx
│   │   │
│   │   ├── courses/
│   │   │   ├── CourseList.jsx
│   │   │   ├── CourseCreate.jsx
│   │   │   └── CourseEdit.jsx
│   │   │
│   │   ├── classrooms/
│   │   │   ├── ClassroomList.jsx
│   │   │   ├── ClassroomJoin.jsx
│   │   │   └── ClassroomDetails.jsx
│   │   │
│   │   └── assignments/
│   │       ├── AssignmentList.jsx
│   │       ├── AssignmentCreate.jsx
│   │       ├── AssignmentEdit.jsx
│   │       └── AssignmentSubmit.jsx
│   │
│   ├── routes/                 # React Router config
│   │   └── AppRoutes.jsx       # Route definitions
│   │
│   ├── styles/                 # CSS files
│   │   └── globals.css         # Global styles
│   │
│   ├── utils/                  # Helper functions
│   │   └── helpers.js          # Utility functions
│   │
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.development
   ```

3. **Update the API URL in `.env.development` if needed:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The app will open at `http://localhost:3000`

## 📦 Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🎨 Styling

The project uses vanilla CSS with CSS custom properties for theming. All styles are in `src/styles/globals.css`.

## 🔐 Authentication

The app includes a complete authentication system with:
- Login
- Registration with role selection
- Forgot password
- Role-based routing (Admin, Teacher, Student)

## 📱 Pages

### Auth Pages
- `/login` - User login
- `/register` - New user registration
- `/forgot-password` - Password recovery

### Dashboards
- `/dashboard/admin` - Admin dashboard
- `/dashboard/teacher` - Teacher dashboard
- `/dashboard/student` - Student dashboard

### Features
- `/courses` - Course listing and management
- `/classrooms` - Classroom management
- `/assignments` - Assignment management

## 🤝 Contributing

This is a template structure. Customize it according to your needs!

## 📄 License

MIT
