# Dispatcher Driver App

A React Native mobile application for delivery drivers to manage deliveries, track earnings, and update delivery status in real-time.

## Features

### Phase 1: Driver App (Current)
- **Authentication**: Driver signup and login with JWT auth
- **Delivery Management**: 
  - View available and active deliveries
  - Accept/decline delivery requests
  - Real-time delivery status updates
  - Pickup and drop-off address details
- **Delivery Status Lifecycle**:
  - Arrived at pickup
  - Picked up
  - In transit
  - Arrived at drop-off
  - Delivered
  - Failed delivery
- **Proof of Delivery**:
  - Photo upload (placeholder for expo-image-picker integration)
  - Signature capture (placeholder for react-native-signature-canvas integration)
- **Earnings Tracking**:
  - Daily, weekly, and monthly earnings
  - Delivery history
  - Tips tracking
  - Payout information
- **Profile Management**:
  - Driver profile
  - Vehicle information
  - Documents
  - Settings

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Native Stack)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Maps**: react-native-maps (configured)
- **Location**: expo-location
- **Notifications**: expo-notifications
- **Camera**: expo-camera
- **Image Picker**: expo-image-picker
- **Signature**: react-native-signature-canvas
- **Real-time**: socket.io-client (configured)

## Project Structure

```
dispatcher-app/
├── App.js                          # Main entry point
├── package.json                    # Dependencies
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel configuration
└── src/
    ├── context/
    │   └── AuthContext.js          # Authentication context
    ├── navigation/
    │   └── AppNavigator.js         # Navigation setup
    └── screens/
        ├── auth/
        │   ├── LoginScreen.js      # Login screen
        │   └── SignupScreen.js     # Signup screen
        └── driver/
            ├── DriverHomeScreen.js      # Home with delivery list
            ├── DeliveryDetailScreen.js  # Delivery details
            ├── DeliveryStatusScreen.js  # Status updates
            ├── EarningsScreen.js        # Earnings and history
            └── ProfileScreen.js         # Driver profile
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (Mac only)
- For Android: Android Studio with Android SDK

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device/simulator**:
   - **iOS**: Press `i` in the terminal or run `npm run ios`
   - **Android**: Press `a` in the terminal or run `npm run android`
   - **Web**: Press `w` in the terminal or run `npm run web`

### Environment Setup

The app currently uses mock data. To connect to a real backend:

1. Create a `.env` file in the root directory:
   ```
   API_URL=your_backend_url
   SOCKET_URL=your_websocket_url
   ```

2. Update the API calls in the screens to use your backend endpoints.

3. Configure Firebase Cloud Messaging for push notifications.

## Current Implementation Status

### ✅ Completed
- Project structure and configuration
- Authentication screens (Login/Signup)
- Driver home screen with delivery list
- Delivery detail screen with route information
- Delivery status update screen
- Earnings screen with history
- Profile screen
- Navigation structure
- Authentication context with AsyncStorage

### 🔲 To Be Implemented
- Backend API integration
- Real-time Socket.IO connection
- Map integration with react-native-maps
- Photo upload with expo-image-picker
- Signature capture with react-native-signature-canvas
- Push notifications with expo-notifications
- Offline support with data caching
- Navigation integration (Google Maps/Apple Maps)

## API Integration Guide

When the backend is ready, update the following:

1. **Authentication**: Replace mock login in `LoginScreen.js` and `SignupScreen.js`
2. **Deliveries**: Connect to delivery endpoints in `DriverHomeScreen.js`
3. **Status Updates**: Implement API calls in `DeliveryStatusScreen.js`
4. **Socket.IO**: Initialize socket connection in `AuthContext.js` or a separate context

## Next Steps

1. **Backend Development**: Build the Node.js + MongoDB backend API
2. **Real-time Features**: Implement Socket.IO for live delivery updates
3. **Map Integration**: Add react-native-maps for driver tracking
4. **Proof of Delivery**: Implement photo upload and signature capture
5. **Testing**: Test on physical devices
6. **Customer App**: Build the customer-facing mobile app
7. **Web Dashboard**: Build the dispatcher web dashboard

## Notes

- The app uses Expo for easier development and cross-platform support
- Location and camera permissions are configured in `app.json`
- The UI follows a modern, clean design system
- All screens are responsive and follow mobile-first principles

## License

Proprietary - Delivery Management Platform
