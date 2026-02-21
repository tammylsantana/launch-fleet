---
name: feature-screens
description: Generate relevant feature screens based on app category and idea
---

# Feature Screens Skill

Generate the right screens for each app type. Use the `bestFor` tags from the brand template AND the app idea to decide which features to build.

## Category → Screen Mapping

### Productivity / Developer Tools
- **Dashboard**: Task summary, progress rings, today's focus
- **Task List**: FlashList with swipe actions, priority tags
- **Timer/Focus**: Pomodoro or focus timer with circular progress
- **Insights**: Weekly chart (bar or line) showing productivity trends
- **Widget**: Today's tasks count + next deadline

### Health & Fitness / Wellness
- **Dashboard**: Daily metrics (steps, calories, water), circular progress
- **Tracker**: Log entries with date picker, meal/exercise/mood
- **Goals**: Goal cards with progress bars
- **History**: Calendar heatmap or weekly chart
- **Widget**: Today's progress ring + headline metric

### Finance / Fintech
- **Portfolio**: Account balance, holdings list with % change
- **Transactions**: FlashList with category icons, search/filter
- **Budgets**: Category spending bars, remaining budget
- **Insights**: Pie chart for spending breakdown, trend chart
- **Widget**: Account balance + daily change

### Shopping / E-commerce
- **Browse**: Product grid with image cards, category filter
- **Product Detail**: Hero image, price, add-to-cart button
- **Cart**: Line items, quantity stepper, total
- **Wishlist**: Saved items grid
- **Widget**: Sale countdown or deal of the day

### Social Networking / Entertainment
- **Feed**: Infinite scroll with post cards (image, text, actions)
- **Compose**: Text editor with image attachment
- **Profile**: Avatar, stats row, post grid
- **Messages**: Chat list with last message preview
- **Widget**: Unread count or trending topic

### Education / Kids & Family
- **Lessons**: Course cards with progress, category tabs
- **Lesson Detail**: Content view with completion checkmark
- **Quiz/Practice**: Interactive question card with answer buttons
- **Progress**: Achievement badges, streak counter
- **Widget**: Streak count or next lesson

### AI / Creative Tools
- **Create**: Main input (text prompt, image upload, canvas)
- **Results**: Generated output gallery
- **History**: Past creations list with thumbnails
- **Settings**: Model selection, style preferences
- **Widget**: Quick create shortcut

## Screen Component Patterns

### Every Screen Must Have
1. SafeAreaView with brand `bg` color
2. Header with screen title using brand `headline` font
3. Loading state (ActivityIndicator or skeleton)
4. Empty state with illustration + CTA
5. Haptic feedback on all interactive elements

### FlashList Pattern (use instead of FlatList)
```typescript
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  estimatedItemSize={80}
  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.colors.separator }} />}
/>
```

### Card Pattern
```typescript
<BlurView intensity={40} tint={theme.style === 'Dark' ? 'dark' : 'light'}>
  <View style={{
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
  }}>
    {/* Card content */}
  </View>
</BlurView>
```

### Bottom Sheet Pattern
```typescript
import BottomSheet from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur'

<BottomSheet
  snapPoints={['25%', '50%']}
  backgroundComponent={({ style }) => (
    <BlurView intensity={80} tint="light" style={style} />
  )}
>
  {/* Sheet content */}
</BottomSheet>
```

## Widget Data Patterns

Each widget should show **real, meaningful data** — never placeholder text.

| Category | Small Widget | Medium Widget |
|----------|-------------|---------------|
| Productivity | Tasks remaining: 5 | Next: "Design review" at 2pm |
| Health | Steps: 8,240 | Calories: 1,850 / 2,000 goal |
| Finance | Balance: $12,450 | +2.4% today, top holding |
| Shopping | Items in cart: 3 | Flash sale: 4h remaining |
| Social | 12 new notifications | Latest: "Alex liked your post" |
| Education | 🔥 5 day streak | Next: "Chapter 3: Variables" |
| AI | Creations: 47 | Last: "Sunset landscape" |
