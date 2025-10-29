# Ethanol Blend Calculator - TODO

## Design System
- [x] Configure Daytona Grey color palette with dark/light theme support
- [x] Set up premium typography (Porsche/Audi S8 inspired)
- [x] Add theme toggle functionality
- [x] Configure smooth animations and transitions

## Core Calculator Features
- [x] Implement ethanol blend calculation engine
- [x] Create slider inputs with +/- buttons for tank size
- [x] Create slider inputs for current tank level percentage
- [x] Create slider inputs for current E-mix percentage
- [x] Create slider inputs for target E-mix percentage
- [x] Add tap-to-edit functionality for all numeric values
- [x] Display calculated results (ethanol to add, pump gas to add)
- [x] Show resulting mix percentage
- [x] Calculate and display octane ratings

## Vehicle Database
- [x] Integrate vehicle database JSON with Audi, BMW, Porsche, Mercedes models
- [x] Create vehicle selector dropdown (Make → Model)
- [x] Auto-populate tank size based on selected vehicle
- [x] Add custom vehicle option for manual tank size entry

## Advanced Features
- [x] Empty tank calculation mode (ethanol-only scenario)
- [x] Fuel type presets (E85, E98, custom percentages)
- [x] Cost calculator (integrated view)
- [x] Session persistence (localStorage)
- [x] Save vehicle profiles
- [x] Remember last calculation state

## UI/UX Polish
- [x] Responsive mobile-first design
- [x] Smooth slider interactions with haptic-style feedback
- [x] Loading states and transitions
- [x] Error handling and validation
- [ ] Empty states
- [ ] Accessibility (keyboard navigation, ARIA labels)
- [x] Add visual fuel gauge indicator
- [x] Add animation when results update
- [x] Add footer with version info

## Testing & Deployment
- [ ] Test all calculations with various scenarios
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance optimization
- [ ] Create production checkpoint



## Phase 2 - Premium Enhancements

### Performance Dashboard
- [x] Estimated HP/TQ gains calculator
- [x] Knock resistance indicator
- [x] "Safe to tune" status indicator
- [x] Power potential meter

### Visual Enhancements
- [x] Animated gauge cluster for octane rating
- [ ] 3D car visualization or high-quality car images
- [x] Vehicle specs card (engine, HP, displacement)
- [ ] Animated fuel system visualization
- [ ] Performance comparison charts

### Sound & Interaction
- [ ] Subtle sound effects (clicks, engine sounds)
- [x] Haptic feedback animations
- [x] Smooth transitions between states

### Advanced Features
- [ ] Fill history tracking
- [ ] Cost analytics over time
- [x] Preset scenario modes (Track Day, Daily, Economy, Winter)
- [ ] Comparison mode (side-by-side blends)
- [ ] Weather integration for cold start warnings

### Tuning Features
- [x] AFR (Air-Fuel Ratio) recommendations
- [x] Timing advance suggestions
- [x] Boost pressure recommendations
- [x] Spark plug heat range tips

### Data & Analytics
- [ ] Fill-up history log
- [ ] Savings calculator (vs premium pump gas)
- [ ] Mileage tracking
- [ ] Trend analysis charts




## Phase 3 - IE Tune Integration & Missing Features

### IE Tune Data Integration
- [x] Integrate IE tune database (RS3, TTRS, S4, S5, SQ5, S3)
- [x] Show real-world power gains for selected vehicle + tune stage
- [x] Add tune stage selector (Stock, Stage 1, Stage 2, Stage 3)
- [x] Display E85 vs 93 octane power comparison
- [x] Show estimated power with current blend

### Visual Enhancements (Still Missing)
- [ ] 3D car visualization or high-quality car images
- [ ] Animated fuel system visualization
- [ ] Performance comparison charts
- [ ] Add car image when vehicle is selected

### Sound & Interaction (Still Missing)
- [ ] Subtle sound effects (engine sounds, clicks, slider feedback)
- [ ] Button click sounds
- [ ] Fuel pump sound when calculating

### Advanced Features (Still Missing)
- [ ] Fill history tracking with timestamps
- [ ] Cost analytics over time (savings calculator)
- [ ] Comparison mode (side-by-side blend scenarios)
- [ ] Weather integration for cold start warnings
- [ ] Export fill history to CSV

### Data & Analytics (Still Missing)
- [ ] Fill-up history log with date/time
- [ ] Savings calculator (vs premium pump gas over time)
- [ ] Fuel economy tracking
- [ ] Average cost per gallon over time
- [ ] Total gallons of E85 vs pump gas used

### Community Features (Future)
- [ ] See popular blends for your vehicle
- [ ] User reviews/comments on different mixes
- [ ] Share your setup with other users




## Phase 4 - Visual Effects & Car Rendering (In Progress)

### Car Visualization
- [x] Add high-quality car images for each vehicle model
- [x] Animated car reveal when vehicle is selected
- [x] Parallax effect on car image
- [x] Glow effect around selected car
- [ ] Show different angles/views of the car

### Sound Effects
- [x] Button click sounds
- [x] Slider adjustment sounds
- [x] Engine start sound when selecting vehicle
- [ ] Fuel pump sound during calculations
- [x] Turbo spool sound for high ethanol mixes
- [x] Success chime when calculation completes

### Advanced Animations
- [ ] Particle effects on performance gains
- [ ] Animated fuel flowing visualization
- [ ] Boost gauge with needle animation
- [ ] RPM gauge animation
- [x] Smooth page transitions
- [x] Staggered card entrance animations
- [x] Number count-up animations

### Micro-interactions
- [x] Button press animations
- [ ] Slider glow on drag
- [x] Card hover lift effects
- [x] Number count-up animations
- [ ] Progress bar animations
- [x] Ripple effects on clicks




## Phase 5 - Bug Fixes & Missing Features

### Critical Bugs to Fix
- [ ] Results section showing "Octane Total" but missing gas/ethanol breakdown
- [ ] E30 Mixed Blend showing "Ethanol to Add: 4.24 gal" but not showing "Gas to Add"
- [ ] E30 Ethanol Only showing "Ethanol to Add: 7.95 gal" but missing gas breakdown
- [ ] Verify all calculation results are displaying correctly

### DS1 Tune Integration
- [x] Research DS1 (Dyno Spectrum) tune data for Audi models
- [x] Add DS1 tune database alongside IE tunes
- [x] Create tune provider selector (IE vs DS1)
- [ ] Compare IE vs DS1 power numbers side-by-side
- [ ] Add APR, Unitronic, and other popular tuners

### Missing Display Elements
- [ ] Restore "Gas (Gal)" column in results
- [ ] Show pump gas octane rating in results
- [ ] Display fuel type breakdown (E85 @ X%, Pump @ Y%)




## Phase 6 - S8 DS1 Tune Data
- [x] Add Audi S8 to DS1 tune database (same 4.0T V8 as RS6/RS7)
- [x] Use RS6/RS7 performance specifications for S8




## Phase 7 - Gas Hacks Rebrand & Premium Polish

### Branding
- [x] Rename app to "Gas Hacks"
- [x] Create custom Gas Hacks logo
- [x] Update app title and metadata
- [ ] Design custom favicon
- [x] Update footer branding

### UI/UX Review & Enhancement
- [ ] Review all button interactions and hover states
- [ ] Enhance slider animations with easing curves
- [ ] Add haptic-style vibration effects on interactions
- [ ] Smooth page transitions with stagger animations
- [ ] Add loading skeleton states
- [ ] Enhance card entrance animations
- [ ] Add ripple effects on all clickable elements
- [ ] Improve mobile responsiveness and touch targets

### 3D Car Renderings
- [ ] Replace static car images with 3D models
- [ ] Add interactive rotating car showcase
- [ ] Implement fuel tank 3D visualization
- [ ] Add engine bay highlights on hover
- [ ] Create turbo spool animation
- [ ] Add exhaust glow effects for high ethanol

### Advanced Animations
- [ ] Glass morphism effects on cards
- [ ] Particle systems for performance gains
- [ ] Advanced sound design (engine notes, turbo, fuel pump)
- [ ] Gradient animations on backgrounds
- [ ] Number counter animations with easing
- [ ] Progress bar animations with spring physics
- [ ] Floating elements with parallax

### Premium Features
- [ ] Add blur effects and depth
- [ ] Implement advanced lighting effects
- [ ] Create custom cursors for interactive elements
- [ ] Add ambient background animations
- [ ] Implement gesture controls for mobile
- [ ] Add screenshot/share functionality
- [ ] Create onboarding tutorial




## Phase 8 - Bug Fixes & Missing Features

### Tune Stage Selector Issues
- [x] Update TuneStageSelector to show different stages based on provider (IE vs DS1)
- [x] DS1 has different stage descriptions than IE
- [x] Make stage selector dynamic based on tuneProvider state

### Apply Premium Animations
- [x] Apply glass morphism to all cards
- [x] Add smooth entrance animations to all sections
- [x] Apply hover-lift effects to interactive elements
- [ ] Add glow effects to performance gains
- [x] Apply stagger delays to card entrances

### Haptic Feedback
- [x] Implement Vibration API for mobile devices
- [x] Add haptic feedback on button clicks
- [ ] Add haptic feedback on slider adjustments
- [x] Add haptic feedback on preset selection
- [ ] Add settings toggle for haptic feedback on/off

### 3D Car Renderings
- [ ] Research Three.js integration for React
- [ ] Create 3D car model viewer component
- [ ] Add rotating car showcase
- [ ] Implement camera controls (rotate, zoom)
- [ ] Add lighting and shadows to 3D models




## Phase 9 - Mobile Build Preparation

### Full App Review
- [ ] Test all calculations for accuracy
- [ ] Verify IE tune data calculations
- [ ] Verify DS1 tune data calculations
- [ ] Test vehicle selection and auto-fill
- [ ] Test all preset modes
- [ ] Test theme switching
- [ ] Test session persistence
- [ ] Verify all animations working
- [ ] Test haptic feedback on mobile
- [ ] Test sound effects

### Mobile Optimization
- [x] Verify touch targets are minimum 44x44px
- [x] Add viewport meta tags for mobile
- [x] Create PWA manifest.json
- [x] Generate app icons (all sizes for iOS/Android)
- [ ] Create splash screens
- [ ] Add offline functionality (service worker)
- [ ] Optimize images for mobile
- [ ] Test on various screen sizes
- [ ] Verify landscape/portrait modes
- [x] Add safe area insets for notched devices (viewport-fit=cover)

### Native Build Setup
- [x] Research Capacitor vs React Native vs PWA (Capacitor chosen)
- [x] Set up build configuration (MOBILE_BUILD_GUIDE.md created)
- [x] Generate iOS app icons (1024x1024, 180x180, 120x120, etc.)
- [x] Generate Android app icons (512x512, 192x192, 144x144, etc.)
- [ ] Create app store screenshots
- [x] Write app store descriptions (in MOBILE_BUILD_GUIDE.md)
- [ ] Set up app signing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [x] Prepare for App Store submission (guide complete)
- [x] Prepare for Google Play submission (guide complete)

### Performance Optimization
- [ ] Minimize bundle size
- [ ] Lazy load components
- [ ] Optimize images (WebP format)
- [ ] Add loading states
- [ ] Implement code splitting
- [ ] Cache vehicle database
- [ ] Optimize re-renders




## CRITICAL BUGS - Phase 10

### Calculation Errors
- [x] Fix octane calculation showing 0 instead of actual rating
- [x] Fix knock resistance showing -117 (should be 0-100 scale)
- [x] Fix cost calculator showing $0.00 for all values (was showing 0 because already at target)
- [x] Verify blend calculations are accurate

### UI/UX Issues
- [x] Remove duplicate result sections (E28 Mixed Blend + E28 Ethanol Only)
- [x] Show ONE clear result section with target blend
- [x] Simplify results display
- [x] Remove or fix inaccurate performance estimates (temporarily hidden)
- [x] Hide octane gauge if calculation is broken (temporarily hidden)

### Data Accuracy
- [x] Verify vehicle specs are accurate or remove them (temporarily hidden)
- [x] Fix or remove performance dashboard if data is inaccurate (temporarily hidden)
- [x] Only show features that work correctly




## Phase 11 - UI Cleanup
- [x] Hide Tune Provider selector (IE vs DS1) - not needed without performance data
- [x] Hide Tune Stage selector (Stock, Stage 1, Stage 2) - not needed without performance data
- [ ] Clean up imports and unused components




## Phase 12 - User Authentication & Tank History

### Backend Upgrade
- [x] Upgrade project from web-static to web-db-user
- [x] Set up database connection (MySQL/TiDB)
- [x] Configure database schema (tank_history table created)
- [x] Set up authentication system (Manus OAuth)

### User Authentication
- [x] Email + name login (Manus OAuth)
- [x] User profile management (via Manus)
- [x] Session management
- [x] Logout functionality

### Tank History Feature
- [x] Create tank_history database table
- [x] Save calculation results to database
- [x] Display history list view
- [x] Show previous tank details
- [x] Delete history entries
- [x] Load previous calculation
- [ ] Filter/search history

### UI Components
- [x] Login/signup modal (Manus OAuth)
- [ ] User profile dropdown
- [x] Tank history page/modal
- [x] History list component
- [x] Save confirmation toast
- [x] Save Tank button in header
- [x] History button in header




## Phase 13 - UI Cleanup
- [x] Remove "Made with Manus" floating button




## Phase 14 - Logo Refinement
- [x] Create premium Apple-inspired logo with glass morphism
- [x] Design for both dark and light themes
- [x] High resolution for app icons (16x16 to 1024x1024)
- [x] Clean, modern aesthetic
- [x] Update all logo references in app
- [x] Generate favicon.ico
- [x] Update manifest.json with new icons
- [x] Update index.html with new favicon and apple-touch-icon




## Phase 15 - App Store Submission Research
- [x] Research Apple App Store requirements and guidelines
- [x] Research Google Play Store requirements and guidelines
- [x] Compile technical requirements for both platforms
- [x] Document legal requirements (privacy policy, terms of service)
- [x] Identify content policy compliance needs
- [x] Create submission checklist for both stores
- [x] Document required assets and metadata
- [x] Research developer account requirements and costs




## Phase 16 - Store Deployment Preparation
- [ ] Create privacy policy for Exotiq Inc.
- [ ] Create terms of service for Exotiq Inc.
- [ ] Add in-app safety disclaimers
- [ ] Add account deletion feature
- [ ] Generate store screenshots
- [ ] Write store descriptions (App Store & Play Store)
- [ ] Create feature graphics
- [ ] Prepare build instructions




## Phase 16 - Store Deployment Preparation (COMPLETED ✅)
- [x] Create privacy policy for Exotiq Inc.
- [x] Create terms of service for Exotiq Inc.
- [x] Add in-app safety disclaimers
- [x] Add account deletion feature (backend API)
- [x] Add account deletion UI (Settings page)
- [x] Generate store screenshots (via Management UI)
- [x] Write store descriptions (in DEPLOYMENT_GUIDE.md)
- [x] Create comprehensive deployment guide (DEPLOYMENT_GUIDE.md)
- [x] Prepare Capacitor build instructions (iOS & Android)
- [x] Create App Store submission checklist
- [x] Create Google Play Store submission checklist

## Phase 17 - Native App Store Deployment (TODO)
- [ ] Install Capacitor dependencies (`pnpm add @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`)
- [ ] Initialize Capacitor project (`npx cap init`)
- [ ] Add iOS platform (`npx cap add ios`)
- [ ] Add Android platform (`npx cap add android`)
- [ ] Build web assets (`cd client && pnpm build`)
- [ ] Sync Capacitor (`npx cap sync`)
- [ ] Configure iOS project in Xcode
- [ ] Configure Android project in Android Studio
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Build iOS release for App Store
- [ ] Build Android release APK
- [ ] Sign Android APK
- [ ] Submit to Apple App Store
- [ ] Submit to Google Play Store

## Phase 18 - Post-Launch (Future)
- [ ] Monitor user feedback and reviews
- [ ] Track analytics and usage patterns
- [ ] Plan v1.1 features based on feedback
- [ ] Create landing page at exotiq.ai
- [ ] Social media marketing campaign
- [ ] Automotive forum outreach (Reddit, etc.)
- [ ] YouTube demo video
- [ ] Consider re-enabling performance features with verified data




## Phase 19 - Mobile UI/UX Bug Fixes (COMPLETED ✅)
- [x] Fix vehicle dropdown menu not working on mobile browsers
- [x] Verify all buttons work on mobile (iOS Safari, Chrome, Firefox)
- [x] Check all menus are accessible on mobile
- [x] Verify formatting and padding on small screens
- [x] Test touch targets meet 44x44px minimum
- [x] Verify all interactive elements respond to touch
- [x] Test Settings page on mobile
- [x] Test Tank History modal on mobile
- [x] Check theme toggle on mobile
- [x] Verify sliders work smoothly on touch devices
- [x] Test all preset buttons on mobile
- [x] Check cost calculator inputs on mobile
- [x] Verify fuel gauge displays correctly on small screens

**Mobile Improvements Made:**
- Fixed Select component with proper height constraints (max-h-[min(400px)])
- Added sideOffset to Select dropdown for better positioning
- Increased all touch targets to minimum 44x44px
- Added touch-manipulation CSS to prevent double-tap zoom
- Responsive header buttons (icon-only on mobile, text on desktop)
- Improved input field sizing (text-base, min-h-[44px])
- Added mobile-specific CSS (16px font-size to prevent iOS zoom)
- Fixed preset buttons with proper touch targets
- Improved slider +/- buttons with 44x44px minimum
- Enhanced Settings page with proper touch targets
- Added safe-area-inset support for notched devices

