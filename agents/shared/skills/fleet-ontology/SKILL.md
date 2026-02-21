---
name: fleet-ontology
description: Shared knowledge graph — the team brain that connects all LaunchFleet agents
---

# Fleet Ontology — The Shared Brain

A typed knowledge graph that gives all 7 agents shared memory, persistent state, and team coordination.

> "The whole is greater than the sum of its parts." — Every agent knows what every other agent decided.

## Why This Exists
Without this, agents are isolated. Scout researches → passes data to Namer → Namer forgets what Scout found.
With this, every decision is stored and queryable by any agent in the fleet.

## The Knowledge Graph

### Entity Types
| Type | Created By | Used By |
|------|-----------|---------|
| `App` | Scout | ALL — the central project node |
| `Competitor` | Scout | Namer, Builder, Shipper, Buzz |
| `Name` | Namer | Checker, Pixel, Builder, Shipper |
| `Brand` | Pixel | Builder, Shipper, Buzz |
| `Feature` | Builder | Shipper, Buzz |
| `Screenshot` | Pixel | Shipper |
| `Keyword` | Scout, Shipper | Buzz, Shipper |
| `Submission` | Shipper | Buzz |

### Relationship Types
| Relation | Example |
|----------|---------|
| `COMPETES_WITH` | App → Competitor |
| `NAMED_AS` | App → Name |
| `VERIFIED_BY` | Name → Checker verdict |
| `BRANDED_WITH` | App → Brand palette |
| `HAS_FEATURE` | App → Feature |
| `DEPENDS_ON` | Feature → API/Service |
| `SCREENSHOT_OF` | Screenshot → Feature |
| `TARGETS_KEYWORD` | App → Keyword |
| `SUBMITTED_TO` | App → Submission |
| `MARKETED_VIA` | App → Marketing channel |

## Agent Data Flow

```
Scout ──[COMPETES_WITH]──> Competitor
  │                              │
  └──[creates]──> App ──────────┘
                   │
          Namer ──[NAMED_AS]──> Name
                                 │
                    Checker ──[VERIFIED_BY]──> Verdict
                                 │
                      Pixel ──[BRANDED_WITH]──> Brand
                                                  │
                                 Builder ──[HAS_FEATURE]──> Feature
                                                              │
                                                Pixel ──[SCREENSHOT_OF]──> Screenshot
                                                              │
                                          Shipper ──[SUBMITTED_TO]──> Submission
                                                                        │
                                                           Buzz ──[MARKETED_VIA]──> Campaign
```

## How Each Agent Uses It

### Scout (WRITES)
```json
{
  "entity": { "type": "Competitor", "name": "Headspace", "properties": { "rating": 4.8, "reviews": "500K+", "pricing": "$12.99/mo" } },
  "relation": { "type": "COMPETES_WITH", "from": "app_001", "to": "competitor_headspace" }
}
```

### Namer (READS Scout, WRITES names)
- Queries: "What competitors exist?" → avoids similar names
- Stores: chosen name + tagline + score

### Checker (READS names, WRITES verdicts)
- Queries: "What name was chosen?" → verifies it
- Stores: trademark status, domain availability, social handles

### Pixel (READS name + verdict, WRITES brand)
- Queries: "What's the verified name?" + "What category?"
- Stores: color palette, fonts, icon concept, brand template

### Builder (READS everything, WRITES features)
- Queries: "What's the brand?" + "What features?" + "What APIs?"
- Stores: feature list, screens built, dependencies used

### Shipper (READS features + brand, WRITES submission)
- Queries: "What features exist?" → generates metadata
- Stores: submission status, review feedback, TestFlight status

### Buzz (READS submission status, WRITES campaigns)
- Queries: "Is the app live?" → triggers marketing
- Stores: launch timeline, social posts, press contacts

## Querying the Graph
```javascript
// What do we know about this app?
ontology.query({ type: 'App', id: 'app_001', depth: 2 })

// What competitors did Scout find?
ontology.query({ type: 'Competitor', relation: 'COMPETES_WITH', from: 'app_001' })

// What's the current status?
ontology.query({ type: 'Submission', relation: 'SUBMITTED_TO', from: 'app_001' })

// Full pipeline status
ontology.query({ type: 'App', id: 'app_001', includeAll: true })
```

## Team Coordination Rules
1. **Write once, read many** — each agent owns its entities, all can read
2. **Never overwrite** another agent's data — add relations, don't mutate
3. **Status updates** — use `properties.status` to track progress
4. **Conflict resolution** — later writes take precedence on status fields

## Persistence (Supabase)
The knowledge graph persists in your existing Supabase database.

### Tables
```sql
-- Entities (nodes in the graph)
CREATE TABLE fleet_entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL,
  type TEXT NOT NULL,  -- App, Competitor, Name, Brand, Feature, etc.
  name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_by TEXT NOT NULL,  -- agent name: scout, namer, pixel, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Relations (edges in the graph)
CREATE TABLE fleet_relations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL,
  from_entity UUID REFERENCES fleet_entities(id),
  to_entity UUID REFERENCES fleet_entities(id),
  relation_type TEXT NOT NULL,  -- COMPETES_WITH, NAMED_AS, etc.
  properties JSONB DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX idx_entities_app ON fleet_entities(app_id);
CREATE INDEX idx_entities_type ON fleet_entities(type);
CREATE INDEX idx_relations_app ON fleet_relations(app_id);
CREATE INDEX idx_relations_from ON fleet_relations(from_entity);
```

### RLS Policies
```sql
-- All agents can READ everything
ALTER TABLE fleet_entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agents_read_all" ON fleet_entities FOR SELECT USING (true);
-- Agents only WRITE their own entities
CREATE POLICY "agents_write_own" ON fleet_entities FOR INSERT WITH CHECK (true);
```

### Query Examples
```javascript
// Get everything about an app
const { data } = await supabase
  .from('fleet_entities')
  .select('*')
  .eq('app_id', appId)
  .order('created_at')

// Get what Scout found
const { data: competitors } = await supabase
  .from('fleet_entities')
  .select('*')
  .eq('app_id', appId)
  .eq('type', 'Competitor')
  .eq('created_by', 'scout')

// Get full pipeline status
const { data: pipeline } = await supabase
  .from('fleet_entities')
  .select('type, name, properties, created_by')
  .eq('app_id', appId)
  .order('created_at')
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` — already configured ✅
- `SUPABASE_SERVICE_ROLE_KEY` — already configured ✅

## ClawHub Source
- Skill: `ontology` by @oswalpalash (21 downloads)
- Install: `clawhub install ontology`
- Security: VirusTotal + OpenClaw: Benign

