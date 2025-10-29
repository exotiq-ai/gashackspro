# Gas Hacks - Complete Deployment Guide

## Overview
This guide covers deploying Gas Hacks as a Progressive Web App (PWA) and building native iOS/Android apps using Capacitor.

---

## Prerequisites

### Development Environment
- **Node.js** 22.x (already installed)
- **pnpm** (already installed)
- **Git** (already installed)

### For iOS Development
- **macOS** required
- **Xcode** 14.1+ ([Download from App Store](https://apps.apple.com/us/app/xcode/id497799835))
- **CocoaPods**: `sudo gem install cocoapods`
- **Apple Developer Account**: $99/year ([Sign up](https://developer.apple.com/programs/))

### For Android Development
- **Android Studio** ([Download](https://developer.android.com/studio))
- **Java JDK** 17+ ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Google Play Console Account**: $25 one-time ([Sign up](https://play.google.com/console/signup))

---

## Part 1: Progressive Web App (PWA) Deployment

### Current Status
✅ PWA manifest configured  
✅ App icons generated (192x192, 512x512)  
✅ Mobile-optimized viewport  
✅ Installable on iOS/Android browsers  

### Deploy to Production
The app is already deployed via Manus. To publish:

1. **Click "Publish" button** in the Management UI (top-right)
2. Your app will be live at: `https://[your-subdomain].manus.space`
3. Users can install it as a PWA:
   - **iOS**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Install App

---

## Part 2: Native iOS App with Capacitor

### Step 1: Install Capacitor
```bash
cd /home/ubuntu/ethanol-blend-calculator
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/ios @capacitor/android
```

### Step 2: Initialize Capacitor
```bash
npx cap init "Gas Hacks" "com.exotiq.gashacks" --web-dir=client/dist
```

### Step 3: Build Web Assets
```bash
cd client
pnpm build
```

### Step 4: Add iOS Platform
```bash
cd ..
npx cap add ios
```

### Step 5: Configure iOS Project
Edit `ios/App/App/Info.plist` and add:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Step 6: Open in Xcode
```bash
npx cap open ios
```

### Step 7: Configure in Xcode
1. Select **App** target
2. **General** tab:
   - Display Name: `Gas Hacks`
   - Bundle Identifier: `com.exotiq.gashacks`
   - Version: `1.0.0`
   - Build: `1`
3. **Signing & Capabilities**:
   - Team: Select your Apple Developer account
   - Automatically manage signing: ✅
4. **App Icons**:
   - Drag `/client/public/icon-1024.png` to AppIcon slot

### Step 8: Test on Simulator
1. Select iPhone simulator (iPhone 15 Pro recommended)
2. Click **Run** button (▶️)
3. Test all features

### Step 9: Build for App Store
1. Product → Archive
2. Wait for archive to complete
3. Click **Distribute App**
4. Choose **App Store Connect**
5. Upload to TestFlight
6. Submit for review

### iOS App Store Submission Checklist
- [ ] App icons (1024x1024)
- [ ] Screenshots (6.7", 6.5", 5.5" displays)
- [ ] App description (4000 chars max)
- [ ] Keywords
- [ ] Privacy Policy URL: `https://[your-domain]/PRIVACY_POLICY.md`
- [ ] Terms of Service URL: `https://[your-domain]/TERMS_OF_SERVICE.md`
- [ ] Support URL: `https://exotiq.ai` or `mailto:hello@exotiq.ai`
- [ ] Age rating: 4+ (No objectionable content)
- [ ] Category: Utilities
- [ ] Price: Free

---

## Part 3: Native Android App with Capacitor

### Step 1: Add Android Platform
```bash
npx cap add android
```

### Step 2: Configure Android Project
Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        applicationId "com.exotiq.gashacks"
        minSdkVersion 22
        targetSdkVersion 35  // Required by August 31, 2025
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Step 3: Add App Icons
Copy icons to `android/app/src/main/res/`:
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Step 4: Open in Android Studio
```bash
npx cap open android
```

### Step 5: Test on Emulator
1. Create AVD (Android Virtual Device): Pixel 7 Pro, Android 14
2. Click **Run** button (▶️)
3. Test all features

### Step 6: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Step 7: Sign the APK
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore gas-hacks.keystore -alias gas-hacks -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore gas-hacks.keystore android/app/build/outputs/apk/release/app-release-unsigned.apk gas-hacks

# Optimize APK
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk gas-hacks-v1.0.0.apk
```

### Step 8: Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app: **Gas Hacks**
3. Upload `gas-hacks-v1.0.0.apk` to Internal Testing
4. Complete store listing
5. Submit for review

### Android Play Store Submission Checklist
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (Phone: 16:9, Tablet: 10" optional)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Support email: `hello@exotiq.ai`
- [ ] Content rating questionnaire
- [ ] Target audience: Everyone
- [ ] Category: Tools
- [ ] Price: Free

---

## Part 4: App Store Descriptions

### Short Description (80 chars)
```
Calculate optimal ethanol fuel blends for performance vehicles. Track history.
```

### Full Description (Use for both stores)
```
Gas Hacks - Performance Fuel Optimization

Calculate the perfect ethanol blend for your performance vehicle with precision and ease.

KEY FEATURES:
• Real-time blend calculations for E10, E30, E50, E85, and custom mixes
• Vehicle database with Audi, BMW, Porsche, Mercedes, and more
• Cost calculator to compare fuel blend expenses
• Tank history tracking (requires free account)
• Quick presets: Track Day, Daily Driver, Economy, Winter
• Octane rating calculator
• Dark and light theme support
• Beautiful, intuitive interface

SAFETY FIRST:
Gas Hacks provides estimates for informational purposes only. Always consult with a qualified automotive professional before modifying your vehicle's fuel system. Improper fuel blending can damage your engine.

PERFECT FOR:
• Performance enthusiasts
• Track day drivers
• Tuners and modders
• Anyone running flex fuel or E85

ABOUT EXOTIQ INC:
Developed by automotive enthusiasts for enthusiasts. Gas Hacks combines precision calculations with a premium user experience.

SUPPORT:
Questions or feedback? Contact us at hello@exotiq.ai

Legal: See our Privacy Policy and Terms of Service at https://[your-domain]
```

### Keywords (iOS App Store)
```
ethanol, e85, fuel, calculator, blend, performance, tuning, octane, flex fuel, automotive, car, racing, track day, audi, bmw, porsche
```

---

## Part 5: Legal Requirements

### Privacy Policy
✅ Created: `/PRIVACY_POLICY.md`  
📍 URL: Host at `https://[your-domain]/PRIVACY_POLICY.md`

### Terms of Service
✅ Created: `/TERMS_OF_SERVICE.md`  
📍 URL: Host at `https://[your-domain]/TERMS_OF_SERVICE.md`

### Safety Disclaimer
✅ Implemented in-app (shows on first launch)

### Account Deletion
✅ Available in Settings → Delete Account

---

## Part 6: Post-Launch Checklist

### Monitoring
- [ ] Set up analytics (already configured via Manus)
- [ ] Monitor crash reports (Xcode/Android Studio)
- [ ] Track user feedback and reviews

### Updates
- [ ] Plan v1.1 features based on feedback
- [ ] Regular security updates
- [ ] iOS: Submit updates via Xcode
- [ ] Android: Upload new APK to Play Console

### Marketing
- [ ] Create landing page at exotiq.ai
- [ ] Social media announcement
- [ ] Automotive forums (Reddit r/cars, r/Audi, etc.)
- [ ] YouTube demo video

---

## Part 7: Troubleshooting

### Common Issues

**iOS Build Fails**
- Ensure Xcode Command Line Tools installed: `xcode-select --install`
- Clean build folder: Product → Clean Build Folder
- Update CocoaPods: `pod repo update`

**Android Build Fails**
- Check Java version: `java -version` (need 17+)
- Sync Gradle: File → Sync Project with Gradle Files
- Invalidate caches: File → Invalidate Caches / Restart

**App Crashes on Launch**
- Check console logs in Xcode/Android Studio
- Verify API endpoints are accessible
- Check for missing environment variables

---

## Support

**Technical Issues:**  
Email: hello@exotiq.ai

**App Store Questions:**  
- iOS: https://developer.apple.com/support/
- Android: https://support.google.com/googleplay/android-developer/

---

## Version History

**v1.0.0** (Current)
- Initial release
- Ethanol blend calculator
- Vehicle database
- Tank history tracking
- Cost calculator
- Safety disclaimers
- Account management

---

**Built with ❤️ by Exotiq Inc.**  
Kalispell, Montana | hello@exotiq.ai

