---
name: native-ui
description: Build native mobile UIs with Expo Router and React Native following Apple HIG
---

# Native UI Skill

You build native mobile UIs using Expo Router and React Native, following Apple's Human Interface Guidelines.

## Core Principles

### Apple Human Interface Guidelines (HIG)
- Use system-standard navigation patterns (tab bar, navigation stack, modals)
- Respect safe areas on all devices (notch, home indicator, Dynamic Island)
- Minimum 44pt touch targets for all interactive elements
- Support both light and dark mode via `useColorScheme()`
- Use SF Symbols (via `@expo/vector-icons`) for system-consistent icons

### Expo Router Navigation
```typescript
// Tab-based navigation (most common for consumer apps)
app/
  (tabs)/
    _layout.tsx      // Tab bar with expo-blur glass effect
    index.tsx        // Home tab
    explore.tsx      // Explore/discover tab
    profile.tsx      // Profile/settings tab
  (auth)/
    login.tsx        // Login screen
    signup.tsx       // Signup screen
  _layout.tsx        // Root layout with Stack navigator
  +not-found.tsx     // 404 screen
```

### Tab Bar with Glass Effect
```typescript
import { Tabs } from 'expo-router'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { position: 'absolute' },
        tabBarBackground: () => (
          <BlurView intensity={80} tint="systemChromeMaterial" style={{ flex: 1 }} />
        ),
      }}
      screenListeners={{
        tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ... }} />
    </Tabs>
  )
}
```

### Screen Patterns

#### List Screen (Settings, Feed, etc.)
```typescript
<ScrollView>
  <View style={{ padding: 16, gap: 12 }}>
    {items.map(item => (
      <Pressable
        key={item.id}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          router.push(`/item/${item.id}`)
        }}
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.surface : colors.card,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        })}
      >
        <Text style={{ fontSize: 17, fontWeight: '600' }}>{item.title}</Text>
      </Pressable>
    ))}
  </View>
</ScrollView>
```

#### Card/Dashboard Screen
```typescript
<ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
  {/* Hero stat card */}
  <View style={{ backgroundColor: colors.accent, borderRadius: 20, padding: 24 }}>
    <Text style={{ color: '#fff', fontSize: 13, opacity: 0.8 }}>TODAY</Text>
    <Text style={{ color: '#fff', fontSize: 48, fontWeight: '800' }}>{value}</Text>
  </View>

  {/* Grid of smaller cards */}
  <View style={{ flexDirection: 'row', gap: 12 }}>
    <StatCard label="Steps" value="8,241" flex={1} />
    <StatCard label="Active" value="42min" flex={1} />
  </View>
</ScrollView>
```

### Required Dependencies
```json
{
  "expo": "~52.0.0",
  "expo-router": "~4.0.0",
  "expo-blur": "~14.0.0",
  "expo-haptics": "~14.0.0",
  "expo-font": "~13.0.0",
  "@expo/vector-icons": "^14.0.0",
  "react-native-reanimated": "~3.16.0",
  "react-native-gesture-handler": "~2.20.0",
  "react-native-safe-area-context": "~4.12.0"
}
```

### Styling Rules
1. Never use `StyleSheet.create` for dynamic values — use inline styles
2. Use `borderRadius: 12-20` for cards (Apple standard)
3. Use `gap` property instead of margin between siblings
4. Use `Pressable` with `({ pressed })` for touch feedback, never `TouchableOpacity`
5. Always include haptic feedback on buttons: `Haptics.impactAsync()`
6. Text sizes: 48 (hero), 28 (h1), 22 (h2), 17 (body), 15 (subhead), 13 (caption)

## ClawHub Source
- Skill: `native-ui` by @wpank (207 downloads)
- Install: `clawhub install native-ui`
