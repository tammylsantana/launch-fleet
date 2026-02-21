---
name: ios-native
description: Build, test, and ship native iOS apps with Swift, Xcode, and App Store best practices
---

# iOS Native Development Skill

Build native iOS apps with Swift and Xcode — NOT Expo. Use this when the user wants a fully native app instead of React Native.

## When to Use Native vs Expo
- **Native Swift**: Performance-critical apps, WidgetKit extensions, custom animations, ARKit, Core ML
- **Expo/RN**: Cross-platform needs, rapid prototyping, web + mobile from one codebase

## Xcode & Build

### Fix Build Errors
1. Clean Build Folder: `Cmd+Shift+K` or Product → Clean Build Folder
2. Reset Simulator: Device → Erase All Content and Settings
3. Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
4. Resolve SPM: File → Packages → Reset Package Caches

### Archive for Release
- Always use **Release** configuration for archives
- Check Signing & Capabilities before archiving
- Validate via Organizer before uploading

## Code Signing
- Use **Automatic Signing** for individual developers
- Use **Manual Signing** in CI environments (Fastlane, GitHub Actions)
- When adding new device: register UDID → regenerate provisioning profile
- Certificate issues: revoke + recreate in Apple Developer Portal

## SwiftUI Patterns

### Data Flow
```swift
// View-local state (owned by this view)
@State private var count = 0

// Owned reference type (created and owned by this view)
@StateObject private var viewModel = MyViewModel()

// Passed-in reference type (owned by parent)
@ObservedObject var viewModel: MyViewModel
```

### Async Operations
```swift
// Use .task modifier — auto-cancels when view disappears
.task {
    await loadData()
}

// NOT this (won't auto-cancel):
// .onAppear { Task { await loadData() } }
```

### Lists (Performance)
```swift
// Use List for cell reuse (better than ScrollView for large data)
List(items, id: \.self) { item in
    ItemRow(item: item)
}
```

## App Store Compliance

### Required
- Handle offline state gracefully (show cached data or error message)
- Login must be skippable OR include "Sign in with Apple" if you have other auth
- Digital goods MUST use StoreKit (no external payment links for in-app content)
- Privacy manifest required for all new submissions

### Info.plist Keys
```xml
<!-- Export compliance (most apps = NO) -->
<key>ITSAppUsesNonExemptEncryption</key>
<false/>

<!-- Camera/Mic/Location — MUST include usage descriptions -->
<key>NSCameraUsageDescription</key>
<string>Take photos for your profile</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Find nearby places</string>
```

## Performance
- **Measure before optimizing**: Use Instruments → Time Profiler
- **@MainActor**: Use on all view model classes for thread safety
- **[weak self]**: Always use in escaping closures to prevent memory leaks
- **Asset optimization**: Use asset catalogs, compress images, lazy load where possible

## Common Rejection Reasons
1. Missing privacy descriptions in Info.plist
2. Placeholder content ("Lorem ipsum")
3. Crash on launch
4. Missing "Sign in with Apple" alongside other auth
5. Using web views for core functionality (Guideline 4.2)

## ClawHub Source
- Skill: `ios` by @ivangdavila
- Install: `clawhub install ios`
- Security: VirusTotal + OpenClaw scan: Benign
- Requires: macOS + `xcodebuild` in PATH
