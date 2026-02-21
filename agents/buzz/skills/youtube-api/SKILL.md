---
name: youtube-api
description: YouTube Data API integration for video search, playlists, comments, and channel management
---

# YouTube API Skill

Search videos, manage playlists, access channel data, and interact with comments via YouTube Data API.

## Authentication
- **API Key**: `MATON_API_KEY` (managed OAuth via Maton gateway)
- **Gateway**: All requests through `https://gateway.maton.ai/youtube/`
- **Connection setup**: `https://ctrl.maton.ai/connections`

## Capabilities

### Search
```javascript
const response = await fetch('https://gateway.maton.ai/youtube/search?part=snippet&q=fitness+app+review&maxResults=10&type=video', {
  headers: { 'Authorization': `Bearer ${process.env.MATON_API_KEY}` }
})
```

### Video Details
```javascript
const response = await fetch('https://gateway.maton.ai/youtube/videos?part=snippet,statistics,contentDetails&id=VIDEO_ID', {
  headers: { 'Authorization': `Bearer ${process.env.MATON_API_KEY}` }
})
// Returns: title, description, viewCount, likeCount, commentCount, duration
```

### Playlists
```javascript
// Create a playlist for app launch content
const response = await fetch('https://gateway.maton.ai/youtube/playlists?part=snippet,status', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.MATON_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    snippet: { title: 'App Launch - Behind the Scenes', description: '...' },
    status: { privacyStatus: 'public' }
  })
})
```

### Comments
- List comment threads on any video
- Reply to comments
- Add new comments
- Update/delete own comments

### Channel Data
- Get channel details (stats, branding, description)
- List channel's videos and playlists
- Check subscription status

## Use Cases for LaunchFleet

### Buzz (Marketing)
- Research competitor app review videos
- Create launch content playlists
- Monitor comments on app-related videos
- Track trending videos in the app's category

### Scout (Research)
- Find video reviews of competing apps
- Analyze view counts and engagement on competitor content
- Research tutorial demand (what people search for)

## Environment Variables
- `MATON_API_KEY` — from Maton gateway

## ClawHub Source
- Skill: `youtube-api-skill` by @byungkyu (13 downloads)
- Install: `clawhub install youtube-api-skill`
- Security: VirusTotal + OpenClaw: Benign
