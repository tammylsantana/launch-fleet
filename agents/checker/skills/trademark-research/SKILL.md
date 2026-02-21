---
name: trademark-research
description: Deep trademark analysis using the in-house Wizard USPTO database
---

# Trademark Research Skill

You have access to the in-house Wizard trademark database (Supabase) containing USPTO data. Use this skill when verifying name candidates.

## Process

### Step 1: Exact Match Search
Search the `trademarks` table for exact matches on `word_mark` where `status = 'LIVE'`.
- If ANY exact match exists with status LIVE → **CONFLICT**
- Pay attention to `owner_name` and `class_codes` for context

### Step 2: Similar Marks Search
Search for marks containing the candidate name as a substring.
- If more than 3 similar LIVE marks exist → **PENDING** (too crowded)
- Consider phonetic similarity (e.g., "Kolor" vs "Color")

### Step 3: Class Analysis
Check if conflicts are in relevant classes:
- **Class 9**: Software, mobile apps, computer programs
- **Class 42**: Software as a service, computer services
- **Class 35**: Advertising, business management
- Industry-specific classes based on the app category

### Step 4: Verdict
- **CLEAR**: No exact matches, fewer than 3 similar marks, no class overlap
- **CONFLICT**: Exact match with LIVE status in a relevant class
- **PENDING**: Too many similar marks or check unavailable — recommend attorney review

## Important Rules
- Never say a name is clear if there is ANY doubt
- Always mention the owner name of conflicting marks
- Recommend professional legal review for all names before final selection
- Parked domains are not trademarks — a parked domain does NOT mean trademark conflict
