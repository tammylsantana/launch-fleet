---
name: swiftui-liquid-glass
description: iOS 26+ Liquid Glass material system for cutting-edge SwiftUI UI design
---

# SwiftUI Liquid Glass Skill

Liquid Glass is the defining visual material of iOS 26+. It blurs content behind it, reflects color and light from the environment, and reacts to touch in real time. Use it for premium, modern iOS UIs.

## Requirements
- iOS 26+ (Tahoe)
- SwiftUI (built into native SDK, no third-party deps)

## Core API

### Basic Glass Effect
```swift
Text("Hello, World!")
    .glassEffect()  // Default capsule shape
```

### Custom Shape + Tint
```swift
Text("Liquid Glass")
    .glassEffect(
        .regular.tint(.orange).interactive(),
        in: .rect(cornerRadius: 16)
    )
```

### Available Shapes
- `.capsule` — pill shape (default)
- `.circle` — circular
- `.rect(cornerRadius:)` — rounded rectangle

### Button Styles
```swift
Button("Action") { }
    .buttonStyle(.glass)            // Standard glass
Button("Primary") { }
    .buttonStyle(.glassProminent)   // Emphasized glass
```

## Morphing Transitions

The signature Liquid Glass feature — views morph between shapes during transitions.

```swift
@Namespace var namespace

GlassEffectContainer(spacing: 40) {
    if isExpanded {
        ExpandedView()
            .glassEffectID("item", in: namespace)
    } else {
        CollapsedView()
            .glassEffectID("item", in: namespace)
    }
}
```

Trigger morphing with standard SwiftUI animation:
```swift
withAnimation(.smooth) {
    isExpanded.toggle()
}
```

## Uniting Multiple Effects

Combine distinct views into one shared glass background:
```swift
HStack {
    Icon()
        .glassEffectUnion(id: "toolbar", namespace: namespace)
    Text("Title")
        .glassEffectUnion(id: "toolbar", namespace: namespace)
}
```

## Scroll Integration
```swift
ScrollView {
    content
}
.scrollExtensionMode(.underSidebar)  // Extends under glass sidebar
```

## Best Practices
1. **Modifier order**: Apply `.glassEffect()` AFTER padding/frame modifiers
2. **Performance**: Wrap multiple glass views in `GlassEffectContainer`
3. **Spacing**: Smaller `spacing` values cause glass elements to merge sooner
4. **Consistency**: Use consistent corner radii and tints throughout the app
5. **Don't overuse**: Glass is for key UI elements (nav bars, cards, buttons), not every view

## ClawHub Source
- Skill: `swiftui-liquid-glass` by @steipete (1.3K downloads)
- Install: `clawhub install swiftui-liquid-glass`
- Security: VirusTotal + OpenClaw: Benign
