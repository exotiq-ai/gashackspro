# Gas Hacks - Mobile Build Guide

Complete guide for building and deploying Gas Hacks to iOS App Store and Google Play Store.

## Overview

Gas Hacks is built as a Progressive Web App (PWA) that can be converted to native iOS and Android apps using **Capacitor**. This approach allows us to maintain a single codebase while delivering native app experiences.

---

## Option 1: Progressive Web App (PWA) - Immediate Deployment

The app is already PWA-ready and can be installed directly from the browser!

### Features Already Implemented:
- ✅ PWA manifest.json
- ✅ Mobile-optimized viewport
- ✅ App icons (192x192, 512x512, 180x180, 1024x1024)
- ✅ Apple touch icons
- ✅ Theme color meta tags
- ✅ Standalone display mode

### How Users Install:
**iOS (Safari):**
1. Visit the Gas Hacks website
2. Tap the Share button
3. Select "Add to Home Screen"
4. App installs like a native app!

**Android (Chrome):**
1. Visit the Gas Hacks website
2. Tap the menu (3 dots)
3. Select "Add to Home Screen" or "Install App"
4. App installs like a native app!

### PWA Benefits:
- No app store approval needed
- Instant updates (no user action required)
- Smaller download size
- Works offline (with service worker)
- Cross-platform (one build for all)

---

## Option 2: Native Apps with Capacitor - App Store Distribution

For full App Store and Google Play distribution, use Capacitor to convert the web app to native.

### Prerequisites

**Required Software:**
- Node.js 18+ (already installed)
- Xcode 14+ (for iOS builds - Mac only)
- Android Studio (for Android builds)
- CocoaPods (for iOS dependencies)

**Install Capacitor:**
```bash
cd /home/ubuntu/ethanol-blend-calculator
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/ios @capacitor/android
```

### Step 1: Initialize Capacitor

```bash
cd /home/ubuntu/ethanol-blend-calculator
npx cap init "Gas Hacks" "com.gashacks.app" --web-dir=client/dist
```

### Step 2: Build the Web App

```bash
cd client
pnpm build
```

### Step 3: Add iOS Platform (Mac Required)

```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

This opens Xcode. From there:
1. Select your development team
2. Configure signing & capabilities
3. Add app icons in Assets.xcassets
4. Build and run on simulator or device

### Step 4: Add Android Platform

```bash
npx cap add android
npx cap sync android
npx cap open android
```

This opens Android Studio. From there:
1. Configure app signing
2. Add app icons in res/mipmap
3. Build APK or AAB for Play Store
4. Run on emulator or device

---

## App Store Submission Checklist

### iOS App Store

**Required Assets:**
- [ ] App icon (1024x1024) - ✅ Already generated!
- [ ] Screenshots (6.5", 6.7", 5.5" displays)
- [ ] App preview video (optional but recommended)
- [ ] Privacy policy URL
- [ ] App description (see below)
- [ ] Keywords for SEO
- [ ] Support URL
- [ ] Marketing URL (optional)

**App Store Connect Steps:**
1. Create app in App Store Connect
2. Upload build via Xcode or Transporter
3. Fill in app metadata
4. Submit for review
5. Wait 1-3 days for approval

### Google Play Store

**Required Assets:**
- [ ] App icon (512x512) - ✅ Already generated!
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone + tablet)
- [ ] Privacy policy URL
- [ ] App description (see below)
- [ ] Content rating questionnaire

**Google Play Console Steps:**
1. Create app in Play Console
2. Upload AAB (Android App Bundle)
3. Fill in store listing
4. Complete content rating
5. Set up pricing & distribution
6. Submit for review
7. Wait 1-3 days for approval

---

## App Store Descriptions

### Short Description (80 chars)
```
Premium E85 blend calculator with real IE & DS1 tune data
```

### Full Description

```
🏎️ GAS HACKS - UNLOCK YOUR ENGINE'S POTENTIAL

The ultimate ethanol blend calculator for performance enthusiasts. Calculate perfect E85 mixes, track fuel costs, and optimize your tune with real-world data from Integrated Engineering (IE) and Dyno Spectrum (DS1).

✨ PREMIUM FEATURES

🔧 SMART BLEND CALCULATOR
• Calculate exact ethanol/pump gas ratios
• Support for E10, E30, E50, E85, E98 blends
• Real-time octane rating calculations
• Empty tank and partial tank modes

🚗 VEHICLE DATABASE
• Pre-loaded tank sizes for Audi, BMW, Porsche, Mercedes
• RS3, TTRS, S3, S4, S5, S6, S7, RS6, RS7, S8 and more
• Custom vehicle support
• Save multiple vehicle profiles

⚡ PERFORMANCE ESTIMATES
• Real IE and DS1 tune data
• HP/TQ gains for each stage and fuel blend
• Knock resistance indicators
• Timing advance recommendations
• Boost pressure suggestions

💰 COST TRACKING
• Compare blend costs in real-time
• Track savings vs pump premium
• Fuel price customization

🎯 QUICK PRESETS
• Track Day (E85) - Maximum performance
• Daily Driver (E30) - Balanced power
• Economy (E10) - Cost-effective
• Winter (E20) - Cold weather safe

🎨 BEAUTIFUL DESIGN
• Audi/Porsche-inspired UI
• Dark/Light theme support
• Smooth animations
• Haptic feedback

📊 SUPPORTED VEHICLES
Audi: RS3, TTRS, S3 8Y, S4 B9, S5 B9, SQ5, S6 C7, S7 C7, RS6 C7, RS7 C7, S8 D4
BMW, Porsche, Mercedes: Coming soon!

🔒 PRIVACY FIRST
• All data stored locally on your device
• No account required
• No tracking or analytics
• Your fuel data stays private

Perfect for:
✓ Track day enthusiasts
✓ Tuned performance vehicles
✓ E85 flex fuel conversions
✓ Cost-conscious power seekers
✓ Anyone running ethanol blends

Download Gas Hacks today and optimize your fuel strategy!
```

### Keywords (iOS)
```
e85, ethanol, calculator, tune, audi, performance, rs3, ttrs, s4, flex fuel, octane, boost, turbo, dyno, horsepower, ie, ds1, blend, fuel, racing, track
```

---

## App Configuration Files

### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gashacks.app',
  appName: 'Gas Hacks',
  webDir: 'client/dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0a",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#0a0a0a"
    }
  }
};

export default config;
```

---

## Testing Checklist

### Before Submission:
- [ ] Test on iOS simulator (multiple screen sizes)
- [ ] Test on Android emulator (multiple screen sizes)
- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Verify all calculations are accurate
- [ ] Test haptic feedback on mobile
- [ ] Test sound effects
- [ ] Verify theme switching works
- [ ] Test session persistence
- [ ] Check all vehicle data loads correctly
- [ ] Test IE and DS1 tune switching
- [ ] Verify all preset modes work
- [ ] Test landscape and portrait modes
- [ ] Check safe area insets on notched devices
- [ ] Test offline functionality
- [ ] Verify app icons display correctly
- [ ] Test splash screen
- [ ] Check status bar styling

---

## Performance Optimization

### Before Building:
```bash
# Optimize images
cd client/public
# Use WebP format for better compression

# Minify and tree-shake
cd client
pnpm build

# Analyze bundle size
pnpm add -D vite-bundle-visualizer
# Add to vite.config.ts: import { visualizer } from 'rollup-plugin-visualizer'
```

---

## Support & Maintenance

### Updating the App:
1. Make changes to web code
2. Build: `cd client && pnpm build`
3. Sync: `npx cap sync`
4. Test on simulators/emulators
5. Build new version in Xcode/Android Studio
6. Upload to App Store Connect / Play Console
7. Submit for review

### Version Numbering:
- Follow semantic versioning: MAJOR.MINOR.PATCH
- Current: 6.1.0
- Increment PATCH for bug fixes
- Increment MINOR for new features
- Increment MAJOR for breaking changes

---

## Troubleshooting

### Common Issues:

**iOS Build Fails:**
- Check Xcode version (14+ required)
- Verify development team is selected
- Run `pod install` in ios/App directory
- Clean build folder: Product → Clean Build Folder

**Android Build Fails:**
- Check Android SDK is installed
- Verify Gradle version compatibility
- Clear cache: `./gradlew clean`
- Check AndroidManifest.xml permissions

**App Crashes on Launch:**
- Check console logs in Xcode/Android Studio
- Verify all assets are included in build
- Test web version first to isolate issues
- Check Capacitor plugin compatibility

---

## Next Steps

1. ✅ PWA is ready - deploy the web version now!
2. Install Capacitor for native builds
3. Set up developer accounts (Apple $99/year, Google $25 one-time)
4. Generate screenshots and promotional materials
5. Write privacy policy
6. Submit to app stores
7. Celebrate! 🎉

---

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)

---

**Built with ❤️ for the performance community**

