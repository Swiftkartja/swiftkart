# SwiftKart - On-Demand Delivery Platform

SwiftKart is a comprehensive on-demand delivery platform that connects customers, vendors, and riders through a seamless mobile and web experience.

## 🚀 Features

- **Multi-role Dashboards**: Separate interfaces for Customers, Vendors, Riders, and Admins
- **Real-time Order Tracking**: Live order status and delivery tracking
- **Secure Payments**: Integrated payment processing with Fygaro
- **In-app Chat**: Direct communication between all parties
- **Inventory Management**: For vendors to manage their products
- **Delivery Management**: For riders to manage deliveries

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for mobile development)
- [Git](https://git-scm.com/)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Swiftkartja/Swiftkart.git
   cd Swiftkart
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # OR using Yarn
   yarn install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your API keys and configuration
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   # For web
   npx expo start --web
   
   # For iOS (requires macOS)
   npx expo start --ios
   
   # For Android
   npx expo start --android
   ```

## 🔒 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
FYGARO_API_KEY=your_fygaro_api_key_here
FYGARO_PUBLIC_KEY=your_fygaro_public_key_here

# App Configuration
NODE_ENV=development
ADMIN_PIN=1234  # Change this in production
```

## 📱 Mobile App Setup

### iOS

1. Install Xcode from the Mac App Store
2. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```
3. Install iOS dependencies:
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Android

1. Install Android Studio
2. Set up Android SDK and emulator
3. Create a `local.properties` file in the `android` directory with your Android SDK path:
   ```
   sdk.dir = /Users/YOUR_USERNAME/Library/Android/sdk
   ```

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For support or queries, please contact support@swiftkart.com
