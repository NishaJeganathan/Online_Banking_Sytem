# Online Banking System - Frontend

A modern, responsive React frontend for the Online Banking System built with Vite, React Router, and Tailwind CSS.

## Features

- **User Authentication**: Login and registration with bank selection
- **Dashboard**: Overview of account information and quick actions
- **Account Management**: View detailed account information
- **Money Transfer**: Within bank and inter-bank transfers
- **Transaction History**: Complete transaction history with filtering
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Context API** - State management for authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on port 5000

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Online_Banking_Sytem/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   └── LoadingSpinner.jsx
├── contexts/           # React Context providers
│   └── AuthContext.jsx # Authentication context
├── pages/             # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── AccountDetails.jsx # Account details page
│   ├── Transfer.jsx    # Money transfer page
│   └── TransactionHistory.jsx # Transaction history
├── services/          # API services
│   └── api.js         # Backend API integration
├── App.jsx            # Main app component with routing
├── main.jsx           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000`. The API service (`src/services/api.js`) handles all backend communication including:

- User authentication (login/register)
- Account management
- Transaction processing
- Transaction history

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- Multi-bank support (Bank 1, Bank 2, Bank 3)
- Secure login/logout
- User registration with account linking

### Dashboard
- Account summary
- Quick action buttons
- User information display
- Balance overview

### Transfers
- Within-bank transfers (instant)
- Inter-bank transfers (pending approval)
- Real-time validation
- Transaction confirmation

### Transaction History
- Sent and received transactions
- Status tracking
- Date/time formatting
- Responsive tables

## Styling

The application uses Tailwind CSS with custom color schemes:
- Primary colors: Blue theme
- Secondary colors: Gray theme
- Status colors: Green (success), Red (error), Yellow (warning)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Online Banking System.