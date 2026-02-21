---
name: in-app-purchases
description: StoreKit 2, RevenueCat, subscriptions, and monetization for iOS apps
---

# In-App Purchases Skill

Implement monetization in iOS apps using StoreKit 2 and RevenueCat. Covers all product types, paywall design, and App Store compliance.

## Product Types
| Type | Use Case | Example |
|------|----------|---------|
| **Consumable** | One-time use items | Gems, credits, tokens |
| **Non-consumable** | Permanent unlock | Pro features, remove ads |
| **Auto-renewable** | Recurring revenue | Weekly/monthly/annual plans |
| **Non-renewing** | Fixed-term access | Season pass, 30-day trial |

## StoreKit 2 (iOS 15+)

### Fetch Products
```swift
let products = try await Product.products(for: ["com.app.weekly", "com.app.annual"])
for product in products {
    print("\(product.displayName): \(product.displayPrice)")
}
```

### Purchase
```swift
let result = try await product.purchase()
switch result {
case .success(let verification):
    switch verification {
    case .verified(let transaction):
        // Grant access
        await transaction.finish()
    case .unverified(_, let error):
        // Handle verification failure
        print("Unverified: \(error)")
    }
case .userCancelled:
    break
case .pending:
    // Waiting for approval (Ask to Buy)
    break
@unknown default:
    break
}
```

### Listen for Transactions
```swift
// Call on app launch — catches renewals, restores, refunds
Task {
    for await result in Transaction.updates {
        if case .verified(let transaction) = result {
            // Update entitlements
            await transaction.finish()
        }
    }
}
```

### Check Entitlements
```swift
for await result in Transaction.currentEntitlements {
    if case .verified(let transaction) = result {
        // User has active access
    }
}
```

## RevenueCat Integration

### Why RevenueCat
- Free up to **$2.5K Monthly Tracked Revenue**
- Handles receipt validation, cross-device sync, webhooks
- Built-in paywall editor and analytics
- Works on iOS, Android, Flutter, React Native

### Setup
```swift
Purchases.configure(withAPIKey: "appl_YOUR_KEY")

// Fetch offerings (products organized for display)
let offerings = try await Purchases.shared.offerings()
if let current = offerings.current {
    for package in current.availablePackages {
        print("\(package.storeProduct.localizedTitle): \(package.storeProduct.localizedPriceString)")
    }
}

// Purchase
let (transaction, info, cancelled) = try await Purchases.shared.purchase(package: package)
if !cancelled {
    // Grant access based on info.entitlements
}
```

## App Store Review Rules (MUST FOLLOW)
1. **All digital goods MUST use Apple IAP** — no external payment links
2. **"Restore Purchases" button is MANDATORY** — place it prominently in settings
3. **No anti-steering** — cannot tell users to buy on your website
4. **Commission**: 30% first year, 15% after (Small Business Program: 15% from day 1 if under $1M/yr)
5. **Free trials** must clearly show price after trial ends

## Testing

### StoreKit Configuration File (Local Testing)
- No App Store Connect setup needed
- Create `.storekit` file in Xcode
- Add products matching your product IDs
- Use `SKTestSession` for automated tests

### Sandbox Testing (Realistic)
- Accelerated subscription times:
  - 1 week → 3 minutes
  - 1 month → 5 minutes
  - 1 year → 1 hour
- Create sandbox tester in App Store Connect → Users → Sandbox

### Pre-Submission Checklist
- [ ] Restore Purchases button works
- [ ] Subscription terms shown before purchase
- [ ] Prices displayed with `displayPrice` (localized)
- [ ] Handles offline gracefully
- [ ] Transaction.updates listener on app launch
- [ ] Receipt validation (server-side or RevenueCat)

## ClawHub Source
- Skill: `in-app-purchases` by @ivangdavila
- Install: `clawhub install in-app-purchases`
- Files: SKILL.md + storekit.md + revenuecat.md + testing.md
