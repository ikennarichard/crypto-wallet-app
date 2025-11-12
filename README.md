# Crypto Wallet App 🚀

A modern, real-time cryptocurrency tracking application with a sleek Web3-inspired design. Track prices, view detailed charts, search cryptocurrencies, and manage your favorite coins all in one place.

![Crypto Nova](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)

## ✨ Features

### 🪙 Real-Time Cryptocurrency Data
- Live price tracking for 100+ cryptocurrencies
- 24-hour price change indicators
- Market cap and trading volume data
- Powered by CoinGecko API

### 📊 Interactive Price Charts
- Multiple timeframe views: 1 Day, 7 Days, 30 Days, 1 Year
- Smooth, animated line charts with gradient fills
- Responsive tooltips showing exact prices
- Color-coded gains/losses (green for up, red for down)

### 🔍 Smart Search
- Real-time search across all cryptocurrencies
- Instant filtering as you type
- Search by name or symbol

### ⭐ Favorites Management
- Mark coins as favorites with a single click
- Dedicated favorites tab for quick access
- Persistent storage using localStorage
- Visual indicators for favorited coins

### 🎨 Modern Web3 Design
- Dark theme with glassmorphism effects
- Cyan and purple gradient accents
- Smooth animations and transitions
- Fully responsive mobile-first design

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui + Radix UI
- **Charts**: Recharts
- **Data Fetching**: TanStack Query (React Query) + Axios
- **Routing**: React Router DOM v6
- **State Management**: React Hooks + Local Storage

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd crypto-nova
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 🔑 API Configuration

The app uses the CoinGecko API. By default, it works with the free public API.

### Using a Free Trial API Key (Optional)

If you have a CoinGecko API key (free trial or paid), you can configure it:

1. Open `src/lib/config.ts`
2. Add your API key:
```typescript
export const COINGECKO_API_KEY = "your-api-key-here";
```

3. To remove the API key when it expires, simply set it back to `null`:
```typescript
export const COINGECKO_API_KEY = null;
```

## 🎯 Key Features Explained

### Data Caching Strategy

- Uses React Query for intelligent client-side caching
- 2-minute stale time for optimal performance
- Automatic background refetching
- Reduces API calls and improves UX

### Error Handling

- Graceful error states with retry options
- Network failure resilience
- User-friendly error messages
- Automatic retry logic with exponential backoff

## 🔧 Development

### Available Scripts

```bash
npm start          # Start development server
npm run web       # Build for production
npm run android      # Preview production build
npm run ios         # Run ESLint
```

## 📄 License

This project is created with Lovable.

## 🤝 Contributing

This is a Lovable project. To contribute:
2. Or clone locally and submit pull requests
3. All changes sync automatically

## 🔗 Links

- **CoinGecko API**: [Documentation](https://www.coingecko.com/en/api)

---

## Shoutout

HNGi13 Mentors ❤️
https://www.behance.net/AlaminHossen07
https://www.behance.net/appdesignbyuixarafat
https://www.behance.net/gallery/234796543/Crypto-Wallet-Mobile-App-Design-UIUX