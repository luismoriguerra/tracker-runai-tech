# Expenses Remodeling Project

A modern web application for managing remodeling project expenses, built with Next.js and deployed on Cloudflare Pages.

## Features

- 🔐 Secure authentication with Auth0
- 💾 Data persistence with Cloudflare D1 (SQLite)
- 🎨 Modern UI with shadcn/ui components
- 🌓 Dark/Light mode support
- 📱 Responsive design with Tailwind CSS
- ⚡ Edge runtime for optimal performance
- 💰 Project budget management
- 💳 Payment tracking
- 📊 Expense management

## Tech Stack

- **Framework**: Next.js (App Router)
- **Authentication**: Auth0
- **Database**: Cloudflare D1 (SQLite)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Runtime**: Edge
- **ID Generation**: nanoid

## Prerequisites

- Node.js 18+ 
- Wrangler CLI
- Cloudflare account
- Auth0 account

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the required values:
   ```
   AUTH0_SECRET=
   AUTH0_BASE_URL=
   AUTH0_ISSUER_BASE_URL=
   AUTH0_CLIENT_ID=
   AUTH0_CLIENT_SECRET=
   ```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   # Create local D1 database
   wrangler d1 create expenses-db
   
   # Apply migrations locally
   wrangler d1 migrations apply expenses-db --local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Database Management

- Create new migration:
  ```bash
  wrangler d1 migrations create [migration-name]
  ```
- Apply migrations locally:
  ```bash
  wrangler d1 migrations apply expenses-db --local
  ```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (Edge runtime)
│   ├── projects/          # Project management pages
│   └── ...
├── components/            # React components
├── server/                # Server-side code
│   └── domain/           # Domain services
├── types/                # TypeScript type definitions
└── tests/                # API tests
```

## API Testing

Use the provided `.http` files in the project root to test the API endpoints:
```bash
# Example using REST Client in VS Code
api-db-test.http
```

## Deployment

The application is configured for deployment on Cloudflare Pages:

1. Push your changes to the main branch
2. Cloudflare Pages will automatically build and deploy
3. Ensure all environment variables are configured in Cloudflare Pages dashboard

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
