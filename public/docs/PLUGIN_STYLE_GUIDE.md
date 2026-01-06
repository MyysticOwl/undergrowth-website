# Plugin Style Guide

This document defines the visual design system for Undergrowth plugins, including colors, icons, and node component styling.

## Color System

### Category Colors (Tailwind Palette)

| Category | Base Color | Hex | Usage |
|----------|------------|-----|-------|
| **AI** | Violet-500 | `#8B5CF6` | LLM, agents, inference |
| **Time** | Amber-500 | `#F59E0B` | Timers, schedulers, delays |
| **Communication** | Blue-500 | `#3B82F6` | HTTP, email, SMS, webhooks |
| **Data** | Emerald-500 | `#10B981` | JSON, transform, storage |
| **Logic** | Yellow-500 | `#EAB308` | Conditionals, gates, routing |
| **Monitoring** | Red-500 | `#EF4444` | Alerts, health checks |
| **IoT** | Teal-500 | `#14B8A6` | MQTT, protocols |
| **Utility** | Slate-500 | `#64748B` | System, crypto, debug |

### Color Strategy: Input → Process → Output

The shade of each plugin's color indicates its **role in the data flow**:

```
Pastel (-200)        Base (-500)          Black (-950)
┌─────────┐         ┌─────────┐          ┌─────────┐
│ SOURCE  │ ──────▶ │ PROCESS │ ───────▶ │  SINK   │
└─────────┘         └─────────┘          └─────────┘
  Triggers            Transforms            Writers
  Generators          Filters               Senders
  Subscribers         Logic                 Publishers
```

| Role | Shade | When to Use | Examples |
|------|-------|-------------|----------|
| **Source** | -200 | Triggers, generators, subscribers, listeners | `time_interval`, `http_server`, `mqtt_subscribe` |
| **Process** | -500 | Transformers, filters, logic, AI inference | `extract_json`, `filter_json`, `ai_chat` |
| **Sink** | -950 | Writers, publishers, senders, inserters | `http_request`, `sql_insert`, `send_email` |

### Full Shade Reference (Tailwind Max-Contrast)

| Category | Source (-200) | Process (-500) | Sink (-950) |
|----------|---------------|----------------|-------------|
| AI (Violet) | `#DDD6FE` | `#8B5CF6` | `#2E1065` |
| Time (Amber) | `#FDE68A` | `#F59E0B` | `#451A03` |
| Communication (Blue) | `#BFDBFE` | `#3B82F6` | `#172554` |
| Data (Emerald) | `#A7F3D0` | `#10B981` | `#022C22` |
| Logic (Yellow) | `#FEF08A` | `#EAB308` | `#422006` |
| Monitoring (Red) | `#FECACA` | `#EF4444` | `#450A0A` |
| IoT (Teal) | `#99F6E4` | `#14B8A6` | `#042F2E` |
| Utility (Slate) | `#E2E8F0` | `#64748B` | `#020617` |

---

## Icon Guidelines

### Format
- **Single emoji** per plugin variation
- Inline with node name (not in a container box)
- 16px font size

### Selection Principles
1. **Function over category** - Icon should represent what the node *does*
2. **Universal recognition** - Use commonly understood emoji
3. **No duplicates** - Each variation should have a unique icon

### Reference Icons by Category

| Category | Example Icons |
|----------|---------------|
| AI | 💬 (chat), 🧠 (agent), ✨ (generate), ⚡ (inference) |
| Time | ⏱️ (interval), ⏳ (delay), 🕐 (trigger), 📅 (schedule) |
| Communication | 🌐 (server), 🔗 (request), 📧 (email), 🔔 (push) |
| Data | 🔍 (query), 🔬 (filter), 🗺️ (map), 💾 (store) |
| Logic | ❓ (if/else), ⚖️ (compare), 🚦 (gate), 🔀 (switch) |
| Monitoring | 📊 (threshold), 💓 (heartbeat), 🏥 (health) |
| IoT | 📤 (publish), 📥 (subscribe) |
| Utility | ⚙️ (process), 🆔 (uuid), #️⃣ (hash) |

---

## Node Component Structure

### Visual Anatomy

```
┌─────────────────────────────┐
█│ 🔍  SQL Query          ○───→
└─────────────────────────────┘
 ↑                        ↑
 │                        └── Output handle (8px circle)
 └── Color bar (4px, category color)
```

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.editable-node` | Container with border, radius |
| `.node-color-bar` | 10px left edge, category color |
| `.node-content` | Flexbox layout for icon + name |
| `.node-icon-compact` | Emoji icon (16px) |
| `.node-name` | Text label (13px) |
| `.react-flow__handle` | Connection handles (8px circles) |

### Key Dimensions

| Property | Value |
|----------|-------|
| Border radius | `var(--radius-lg)` |
| Content padding | `8px 10px` |
| Icon-name gap | `6px` |
| Handle size | `8px` |
| Min width | `120px` |

---

## Adding a New Plugin

When creating a new plugin variation, define these in the `plugin!` macro:

```rust
"variation_name" => VariationType { 
    icon: "🔍",              // Single emoji
    role: PluginRole::Process, // Auto-derives color based on category
    description: "...",
    category: categories::DATA_TRANSFORM,
    help: include_str!("help/file.md")
}
```

### Checklist
- [ ] Icon is unique within the plugin
- [ ] Icon represents the function, not the category
- [ ] Role is semantically correct (Source/Process/Sink)

---

## Related Files

- `web/src/components/node/EditableNode.jsx` - Node component
- `web/src/components/node/EditableNode.css` - Node styles
- `foundation/src/plugin_interface/category.rs` - Category definitions

