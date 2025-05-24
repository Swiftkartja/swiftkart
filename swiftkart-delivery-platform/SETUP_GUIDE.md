# SwiftKart - Development Environment Setup Guide

This guide will help you set up your development environment for the SwiftKart project.

## Prerequisites

### 1. Install Node.js and npm

1. Download and install Node.js (LTS version recommended) from [nodejs.org](https://nodejs.org/)
2. Verify installation:
   ```bash
   node -v
   npm -v
   ```

### 2. Install Git

1. Download and install Git from [git-scm.com](https://git-scm.com/)
2. Configure your Git username and email:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### 3. Install Expo CLI

```bash
npm install -g expo-cli
```

### 4. Install Yarn (Optional but recommended)

```bash
npm install -g yarn
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Swiftkartja/Swiftkart.git
cd Swiftkart
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# OR using Yarn
yarn install
```

### 3. Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your API keys and configuration

### 4. Start the Development Server

#### Web Development

```bash
npx expo start --web
```

#### iOS Development (macOS only)

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
4. Start the iOS simulator:
   ```bash
   npx expo start --ios
   ```

#### Android Development

1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Create a `local.properties` file in the `android` directory with your Android SDK path:
   ```
   sdk.dir = /Users/YOUR_USERNAME/Library/Android/sdk
   ```
4. Start the Android emulator:
   ```bash
   npx expo start --android
   ```

## Troubleshooting

### Common Issues

1. **Node.js/npm not found**
   - Ensure Node.js is installed and added to your system PATH
   - Restart your terminal after installation

2. **iOS build errors**
   - Make sure Xcode command line tools are installed:
     ```bash
     xcode-select --install
     ```
   - Clean the build folder in Xcode (Product > Clean Build Folder)

3. **Android build errors**
   - Ensure ANDROID_HOME is set in your environment variables
   - Make sure you have accepted all Android SDK licenses:
     ```bash
     yes | sdkmanager --licenses
     ```

4. **Expo issues**
   - Clear the Expo cache:
     ```bash
     expo start -c
     # or
     npx expo start --clear
     ```

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them

3. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Add your commit message here"
   ```

4. Push your changes to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a pull request on GitHub

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Fygaro API Documentation](https://docs.fygaro.com/)

## Support

For additional help, please contact the development team or open an issue in the repository.
