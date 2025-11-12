# Crypto Wallet Mobile App 🚀

A modern, real-time cryptocurrency tracking mobile application built with React Native and Expo. Features live price tracking, interactive charts, search functionality, and favorites management with a sleek Web3-inspired design.

## Features

- 24-hour price change indicators with visual cues
- Market cap and trading volume information
- Powered by CoinGecko API

### Interactive Price Charts

- Multiple timeframe views: 1 Day, 7 Days, 30 Days, 1 Year
- Smooth line charts with React Native Chart Kit
- Color-coded gains/losses (green for positive, red for negative)

### Smart Search

- Real-time cryptocurrency search
- Instant filtering as you type
- Search by coin name or symbol

### Favorites Management

- One-tap favorite marking
- Dedicated favorites tab for quick access
- Persistent storage using AsyncStorage

## Technology Stack

- Framework: React Native with Expo SDK 52
- Language: TypeScript
- UI Library: Gluestack UI v2
- Charts: React Native Chart Kit
- API Client: Axios
- Data Fetching: TanStack Query (React Query)
- Navigation: Expo Router
- Storage: AsyncStorage
- API: CoinGecko API

## Installation & Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Expo
- Expo Go app (for physical device testing)

### Quick Start

#### Clone the repository

```bash
   git clone https://github.com/ikennarichard/crypto-wallet-app.git
   cd crypto-wallet-app
```

#### Install dependencies

```bash
npm install
```

#### Start the development server

```bash
npm start
```

#### Run on your device

- Scan the QR code with Expo Go Android or iOS
- Or press a for Android emulator / i for iOS simulator

## Platform-Specific Builds

```bash
npm run android # Run on Android emulator/device
npm run ios # Run on iOS simulator (Mac only)
npm run web # Run in web browser (fallback)
```

## API Configuration

The app uses the CoinGecko API with intelligent rate limiting and caching.

### API Key Setup (Optional)

For higher rate limits, add a CoinGecko API key:

Create a .env file in the project root:

```env
COINGECKO_API_KEY=your-api-key-here
```

Access in your code:

```typescript
const apiKey = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;
```

## License

This project is open source and available under the MIT License.

## Acknowledgments

Design Inspiration

- Alamin Hossen
- UI/UX by Xarafat
- Crypto Wallet Design

### Special Thanks

HNGi13 Mentors ❤️
