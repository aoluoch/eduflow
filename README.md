# Eduflow

An educational platform built with modern web technologies and Appwrite backend.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Appwrite (BaaS)
- **State Management:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Appwrite account and project

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd eduflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Appwrite credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_PROJECT_NAME=Eduflow
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/       # Shared components
│   ├── layouts/      # Layout components
│   └── ui/           # shadcn/ui components
├── data/             # Mock data
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configurations
│   ├── appwrite.ts   # Appwrite client configuration
│   └── utils.ts      # Helper functions
└── pages/            # Page components
```

## Appwrite Integration

The Appwrite SDK is configured in `src/lib/appwrite.ts` with the following services:

- **Account** - User authentication
- **Databases** - Data storage
- **Storage** - File uploads
- **Avatars** - Avatar generation

### Usage Example

```typescript
import { account, databases } from '@/lib/appwrite';

// Authentication
await account.createEmailPasswordSession(email, password);

// Database operations
await databases.listDocuments('databaseId', 'collectionId');
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Progress

- [x] Project scaffolding with Vite + React + TypeScript
- [x] UI component library setup (shadcn/ui)
- [x] Tailwind CSS configuration
- [x] Appwrite SDK integration
- [ ] Authentication system
- [ ] Database schema design
- [ ] Core features implementation

## License

MIT
