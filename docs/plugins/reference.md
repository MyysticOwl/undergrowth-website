---
sidebar_position: 3
title: Plugin Reference
---

# Plugin Reference

Complete reference for all built-in plugin variations.

---

## Quick Navigation

| Category | Plugins |
|----------|---------|
| [Time](#time-plugins) | interval_timer, delay, time_trigger |
| [Scheduler](#scheduler-plugins) | cron_trigger, calendar_trigger, solar_event |
| [HTTP](#http-plugins) | http_request |
| [Notify](#notify-plugins) | send_email, send_sms, send_push, call_webhook |
| [File](#file-plugins) | write_file, read_file |
| [SQLite](#sqlite-plugins) | sql_query, sql_insert, sql_upsert, sql_delete |
| [Redis](#redis-plugins) | redis_cache, redis_publish, redis_subscribe |
| [JSON](#json-plugins) | generate_json, extract_json, render_template, filter_json, map_fields |
| [JSON Table](#json-table-plugins) | collect_rows |
| [Data Transform](#data-transform-plugins) | parse_csv, stringify_csv, regex_match, regex_replace, format_date |
| [Logic](#logic-plugins) | if_else, compare_values, logic_threshold, logic_gate |
| [MQTT](#mqtt-plugins) | mqtt_publish, mqtt_subscribe |
| [System](#system-plugins) | cpu_metrics, memory_usage, disk_usage |
| [Process](#process-plugins) | run_command |
| [Crypto](#crypto-plugins) | generate_hash, hmac_sign, hmac_verify, generate_uuid, generate_bytes |
| [AI](#ai-plugins) | ai_chat, generate_workflow |

> **ðŸ’¡ Pro Tip:** The Web UI displays detailed descriptions and tooltips for every variation and configuration field, powered by the engine's enhanced schema system.


---

## Time Plugins

### time:interval_timer

Emits events at regular intervals.

**Config:**
```json
{
  "interval": 5,
  "units": "seconds"  // "seconds", "minutes", "hours"
}
```

**Output:** `{ "type": "tick", "timestamp": 1704067200 }`

---

### time:delay

Delays incoming data by a specified duration.

**Config:**
```json
{
  "delay": 500,
  "units": "milliseconds"
}
```

---

### time:time_trigger

Triggers at specific times of day.

**Config:**
```json
{
  "times": ["09:00", "17:00"],
  "timezone": "America/New_York"
}
```

---

## Scheduler Plugins

### scheduler:cron_trigger

Triggers based on cron expressions.

**Config:**
```json
{
  "expression": "0 */5 * * * *",  // Every 5 minutes
  "timezone": "UTC"
}
```

---

### scheduler:calendar_trigger

Triggers on specific dates.

**Config:**
```json
{
  "dates": ["2024-12-25T10:00:00", "2024-12-31T23:59:00"],
  "timezone": "UTC"
}
```

---

### scheduler:solar_event

Triggers at sunrise or sunset.

**Config:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "event": "sunrise",  // "sunrise", "sunset", "both"
  "offset_minutes": -30  // 30 minutes before
}
```

---

## HTTP Plugins

### http:http_request

Make HTTP GET, POST, PUT, PATCH, DELETE, or HEAD requests.

**Config:**
```json
{
  "method": "GET",
  "url": "https://api.example.com/data",
  "headers": { "Authorization": "Bearer token" },
  "body": "{\"key\": \"value\"}" // Optional, for POST/PUT/PATCH
}
```

---

## File Plugins

### file:write_file

Writes input data to a file.

**Config:**
```json
{
  "path": "output",
  "file_name": "data.json",
  "append": false
}
```

---

### file:read_file

Reads file content and emits as output.

**Config:**
```json
{
  "path": "data",
  "file_name": "input.json"
}
```

---

## SQLite Plugins

### sqlite:sql_query

Execute SELECT queries and return results as JSON array.

**Config:**
```json
{
  "database_path": "data.db",
  "query": "SELECT * FROM sensors WHERE value > 25"
}
```

---

### sqlite:sql_insert

Insert JSON data into a table.

**Config:**
```json
{
  "database_path": "data.db",
  "table": "sensors",
  "create_table": "CREATE TABLE IF NOT EXISTS sensors (id INTEGER, value REAL)"
}
```

---

### sqlite:sql_upsert

Insert or replace (upsert) data.

**Config:**
```json
{
  "database_path": "data.db",
  "table": "sensors"
}
```

---

### sqlite:sql_delete

Delete rows with a WHERE clause.

**Config:**
```json
{
  "database_path": "data.db",
  "table": "sensors",
  "where_clause": "id = ?1"
}
```

---

## Redis Plugins

### redis:redis_cache

Perform cache operations (GET/SET/DEL).

**Config:**
```json
{
  "operation": "get", // "get", "set", "del"
  "url": "redis://127.0.0.1:6379",
  "key": "sensor:temperature",
  "default_value": "{\"not_found\": true}",
  "ttl_seconds": 3600 // For SET
}
```

---

### redis:redis_publish

Publish a message to a Redis channel.

**Config:**
```json
{
  "url": "redis://127.0.0.1:6379",
  "channel": "events"
}
```

---

### redis:redis_subscribe

Subscribe to a Redis channel and emit messages.

**Config:**
```json
{
  "url": "redis://127.0.0.1:6379",
  "channel": "events"
}
```

---

## JSON Plugins

### json:generate_json

Emit configured JSON when triggered.

**Config:**
```json
{
  "message": "{\"sensor\": \"temp\", \"value\": 25.5}"
}
```

---

### json:extract_json

Extract values using JSONPath expressions.

**Config:**
```json
{
  "path": "$.data.items[*].value"
}
```

---

### json:render_template

String templating with variable substitution.

**Config:**
```json
{
  "template": "Sensor {{name}} reported {{value}}"
}
```

---

### json:filter_json

Filter data based on conditions.

**Config:**
```json
{
  "conditions": [
    { "field": "value", "operator": "greater_than", "value": 25 }
  ]
}
```

**Operators:** `equals`, `not_equals`, `greater_than`, `less_than`, `contains`, `exists`

---

### json:map_fields

Transform field values.

**Config:**
```json
{
  "mappings": [
    { "from": "temp_c", "to": "temp_f", "transform": { "type": "multiply", "factor": 1.8 } }
  ]
}
```

**Transforms:** `copy`, `multiply`, `add`, `uppercase`, `lowercase`, `replace`

---

## JSON Table Plugins

### jsontable:collect_rows

Aggregate streaming JSON objects into batches or tables.

**Config:**
```json
{
  "max_rows": 100,
  "emit_every": 10
}
```

---

## Data Transform Plugins

### data_transform:parse_csv

Parse CSV text into JSON array.

**Config:**
```json
{
  "delimiter": 44,  // ASCII code for comma (default)
  "has_headers": true
}
```

---

### data_transform:stringify_csv

Convert JSON array to CSV format.

**Config:**
```json
{
  "delimiter": 44,
  "has_headers": true
}
```

---

### data_transform:regex_match

Extract data using regular expressions.

**Config:**
```json
{
  "pattern": "([A-Z]+)-([0-9]+)"
}
```

---

### data_transform:regex_replace

Replace text using regular expressions.

**Config:**
```json
{
  "pattern": "\\d{3}-\\d{3}-\\d{4}",
  "replacement": "XXX-XXX-XXXX"
}
```

---

### data_transform:format_date

Parse and format date strings.

**Config:**
```json
{
  "input_format": "[year]-[month]-[day]T[hour]:[minute]:[second]Z",
  "output_format": "[day]/[month]/[year]"
}
```

---

## Logic Plugins

### logic:if_else

Conditional branching.

**Config:**
```json
{
  "condition_field": "status",
  "condition_value": "active",
  "then_value": { "action": "proceed" },
  "else_value": { "action": "skip" }
}
```

---

### logic:compare_values

Compare two field values.

**Config:**
```json
{
  "field_a": "current",
  "field_b": "target",
  "operator": "greater_than",
  "output_field": "is_above_target"
}
```

---

### logic:logic_threshold

Trigger when a value crosses a threshold.

**Config:**
```json
{
  "field": "temperature",
  "threshold": 30,
  "direction": "above",  // "above", "below", "either"
  "output_field": "high_temp_alert"
}
```

---

### logic:logic_gate

Boolean logic gates (AND, OR, NAND, NOR, XOR).

**Config:**
```json
{
  "gate_type": "AND",
  "inputs": ["is_enabled", "is_active"],
  "output_field": "should_run"
}
```

---

## Notify Plugins

### notify:call_webhook

Send HTTP webhooks.

**Config:**
```json
{
  "url": "https://hooks.slack.com/services/...",
  "method": "POST"
}
```

---

### notify:send_email

Send emails via SMTP.

**Config:**
```json
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "to_emails": ["alert@company.com"],
  "subject": "Alert"
}
```

---

### notify:send_sms

Send SMS via Twilio.

**Config:**
```json
{
  "twilio_sid": "AC...",
  "twilio_token": "token",
  "to_phones": ["+0987654321"]
}
```

---

### notify:send_push

Push notifications via Pushover/Gotify.

---

## System Plugins

### system:cpu_metrics

Monitor CPU usage.

**Config:**
```json
{
  "interval_secs": 5
}
```

**Output:** `{ "cpu_percent": 45.2, "load_avg": [0.5, 0.3, 0.1] }`

---

### system:memory_usage

Monitor memory usage.

**Output:** `{ "used": 4096, "total": 16384, "free": 12288 }`

---

### system:disk_usage

Monitor disk usage.

**Output:** `{ "used": 250, "total": 500, "percent": 50.0 }`

---

## MQTT Plugins

### mqtt:mqtt_publish

Publish to MQTT broker.

**Config:**
```json
{
  "host": "broker.hivemq.com",
  "topic": "sensors/temperature",
  "qos": 1
}
```

---

### mqtt:mqtt_subscribe

Subscribe to MQTT topic.

**Config:**
```json
{
  "host": "broker.hivemq.com",
  "topic": "sensors/#",
  "qos": 1
}
```

---

## Process Plugins

### process:run_command

Execute external commands (with allowlist).

**Config:**
```json
{
  "allowlist": ["python", "node", "curl"]
}
```

---

## Crypto Plugins

### crypto:generate_hash

Generate cryptographic hashes (SHA256, MD5).

**Config:**
```json
{
  "algorithm": "sha256"  // "sha256" or "md5"
}
```

---

### crypto:hmac_sign

Create HMAC signature for data integrity.

**Config:**
```json
{
  "algorithm": "sha256",
  "key": "your-secret-key"
}
```

---

### crypto:hmac_verify

Verify HMAC signature.

**Config:**
```json
{
  "algorithm": "sha256",
  "key": "your-secret-key",
  "signature": "expected-signature-value"
}
```

---

### crypto:generate_uuid

Generate UUIDv4.

**Config:** None required

**Output:** `"550e8400-e29b-41d4-a716-446655440000"`

---

### crypto:generate_bytes

Generate cryptographically secure random bytes.

**Config:**
```json
{
  "length": 32,
  "encoding": "hex"  // "hex" or "base64"
}
```

---

## AI Plugins

### ai:ai_chat

AI/LLM text completion and chat (requires backend configuration).

**Config:**
```json
{
  "backend": {
      "type": "ollama",
      "base_url": "http://localhost:11434",
      "model": "llama3"
  }
}
```

---

### ai:generate_workflow

Generate executable workflows from natural language descriptions.

**Config:**
```json
{} // Configured via system instructions or prompt
```

---

*For detailed plugin development, see [Plugin Developer Guide](./developer-guide.md)*

| [HTTP](#http-plugins) | request |
| [Notify](#notify-plugins) | email, sms, push, webhook |
| [File](#file-plugins) | write, read |
| [SQLite](#sqlite-plugins) | query, insert, upsert, delete |
| [Redis](#redis-plugins) | cache, publish, subscribe |
| [JSON](#json-plugins) | generate, jsonpath, template, filter, map |
| [JSON Table](#json-table-plugins) | aggregate |
| [Data Transform](#data-transform-plugins) | csv-parse, csv-stringify, regex-match, regex-replace, date-format |
| [Logic](#logic-plugins) | branch, compare, threshold, gate |
| [MQTT](#mqtt-plugins) | publish, subscribe |
| [System](#system-plugins) | cpu, memory, disk |
| [Process](#process-plugins) | exec |
| [Crypto](#crypto-plugins) | hash, hmac-sign, hmac-verify, random-uuid, random-bytes |
| [AI](#ai-plugins) | default |

> **ðŸ’¡ Pro Tip:** The Web UI displays detailed descriptions and tooltips for every variation and configuration field, powered by the engine's enhanced schema system.


---

## Time Plugins

### time:timer

Emits events at regular intervals.

**Config:**
```json
{
  "interval": 5,
  "units": "seconds"  // "seconds", "minutes", "hours"
}
```

**Output:** `{ "type": "tick", "timestamp": 1704067200 }`

---

### time:delay

Delays incoming data by a specified duration.

**Config:**
```json
{
  "delay": 500,
  "units": "milliseconds"
}
```

---

### time:time-of-day

Triggers at specific times of day.

**Config:**
```json
{
  "times": ["09:00", "17:00"],
  "timezone": "America/New_York"
}
```

---

### scheduler:cron

Triggers based on cron expressions.

**Config:**
```json
{
  "expression": "0 */5 * * * *",  // Every 5 minutes
  "timezone": "UTC"
}
```

---

### scheduler:calendar

Triggers on specific dates.

**Config:**
```json
{
  "dates": ["2024-12-25T10:00:00", "2024-12-31T23:59:00"],
  "timezone": "UTC"
}
```

---

### scheduler:solar

Triggers at sunrise or sunset.

**Config:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "event": "sunrise",  // "sunrise", "sunset", "both"
  "offset_minutes": -30  // 30 minutes before
}
```

---

## HTTP Plugins

### http:get

Make HTTP GET requests.

**Config:**
```json
{
  "url": "https://api.example.com/data",
  "headers": { "Authorization": "Bearer token" },
  "timeout_seconds": 30
}
```

---

### http:post

Make HTTP POST requests with body from input data.

**Config:**
```json
{
  "url": "https://api.example.com/data",
  "content_type": "application/json"
}
```

---

### http:put / http:patch

Similar to POST, for PUT and PATCH methods.

---

## File Plugins

### file:write

Writes input data to a file.

**Config:**
```json
{
  "path": "./output",
  "file_name": "data.json"
}
```

---

### file:read

Reads file content and emits as output.

**Config:**
```json
{
  "path": "./data",
  "file_name": "input.json"
}
```

---

## SQLite Plugins

### sqlite:query

Execute SELECT queries and return results as JSON array.

**Config:**
```json
{
  "database_path": "data.db",
  "query": "SELECT * FROM sensors WHERE value > 25"
}
```

---

### sqlite:insert

Insert JSON data into a table.

**Config:**
```json
{
  "database_path": "data.db",
  "table": "sensors",
  "create_table": "CREATE TABLE IF NOT EXISTS sensors (id INTEGER, value REAL)"
}
```

---

### sqlite:upsert

Insert or replace (upsert) data.

---

### sqlite:delete

Delete rows with a WHERE clause.

**Config:**
```json
{
  "database_path": "data.db",
  "table": "sensors",
  "where_clause": "id = ?1"
}
```

---

## Redis Plugins

### redis:get

Get a key value from Redis.

**Config:**
```json
{
  "url": "redis://127.0.0.1:6379",
  "key": "sensor:temperature",
  "default_value": "{\"not_found\": true}"
}
```

---

### redis:set

Set a key value in Redis.

**Config:**
```json
{
  "url": "redis://127.0.0.1:6379",
  "key": "sensor:temperature",
  "ttl_seconds": 3600
}
```

---

### redis:del

Delete a key from Redis.

---

### redis:publish

Publish a message to a Redis channel.

**Config:**
```json
{
  "url": "redis://127.0.0.1:6379",
  "channel": "events"
}
```

---

### redis:subscribe

Subscribe to a Redis channel and emit messages.

---

## JSON Plugins

### json:generate

Emit configured JSON when triggered.

**Config:**
```json
{
  "message": "{\"sensor\": \"temp\", \"value\": 25.5}"
}
```

---

### json:jsonpath

Extract values using JSONPath expressions.

**Config:**
```json
{
  "path": "$.data.items[*].value"
}
```

---

### json:template

String templating with variable substitution.

**Config:**
```json
{
  "template": "Sensor {{name}} reported {{value}}"
}
```

---

### json:filter

Filter data based on conditions.

**Config:**
```json
{
  "conditions": [
    { "field": "value", "operator": "greater_than", "value": 25 }
  ]
}
```

**Operators:** `equals`, `not_equals`, `greater_than`, `less_than`, `contains`, `exists`

---

### json:map

Transform field values.

**Config:**
```json
{
  "mappings": [
    { "from": "temp_c", "to": "temp_f", "transform": { "type": "multiply", "factor": 1.8 } }
  ]
}
```

**Transforms:** `copy`, `multiply`, `add`, `uppercase`, `lowercase`, `replace`

---

## Data Transform Plugins

### data_transform:csv-parse

Parse CSV text into JSON array.

**Config:**
```json
{
  "delimiter": 44,  // ASCII code for comma (default)
  "has_headers": true
}
```

**Input:** Raw CSV string
**Output:** 
- With headers: `[{"name": "Alice", "age": "30"}, {"name": "Bob", "age": "25"}]`
- Without headers: `[["Alice", "30"], ["Bob", "25"]]`

---

### data_transform:csv-stringify

Convert JSON array to CSV format.

**Config:**
```json
{
  "delimiter": 44,
  "has_headers": true
}
```

**Input:** JSON array of objects or arrays
**Output:** CSV string

---

### data_transform:regex-match

Extract data using regular expressions.

**Config:**
```json
{
  "pattern": "([A-Z]+)-([0-9]+)"
}
```

**Input:** Text string
**Output:**
```json
[
  {
    "match": "ABC-123",
    "groups": ["ABC", "123"],
    "named": {}
  }
]
```

---

### data_transform:regex-replace

Replace text using regular expressions.

**Config:**
```json
{
  "pattern": "\\d{3}-\\d{3}-\\d{4}",
  "replacement": "XXX-XXX-XXXX"
}
```

**Input:** Text string
**Output:** Transformed string

---

### data_transform:date-format

Parse and format date strings.

**Config:**
```json
{
  "input_format": "[year]-[month]-[day]T[hour]:[minute]:[second]Z",
  "output_format": "[day]/[month]/[year]"
}
```

**Input:** Date string matching input_format
**Output:** Formatted date string

---

## Logic Plugins

### logic:branch

Conditional branching.

**Config:**
```json
{
  "condition_field": "status",
  "condition_value": "active",
  "then_value": { "action": "proceed" },
  "else_value": { "action": "skip" }
}
```

---

### logic:compare

Compare two field values.

**Config:**
```json
{
  "field_a": "current",
  "field_b": "target",
  "operator": "greater_than",
  "output_field": "is_above_target"
}
```

---

### logic:threshold

Trigger when a value crosses a threshold.

**Config:**
```json
{
  "field": "temperature",
  "threshold": 30,
  "direction": "above",  // "above", "below", "either"
  "output_field": "high_temp_alert"
}
```

---

### logic:gate

Boolean logic gates (AND, OR, NAND, NOR, XOR).

**Config:**
```json
{
  "gate_type": "AND",
  "inputs": ["is_enabled", "is_active"],
  "output_field": "should_run"
}
```

---

## Notify Plugins

### notify:webhook

Send HTTP webhooks.

**Config:**
```json
{
  "url": "https://hooks.slack.com/services/...",
  "method": "POST"
}
```

---

### notify:email

Send emails via SMTP.

**Config:**
```json
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "user@gmail.com",
  "smtp_password": "app-password",
  "from_email": "user@gmail.com",
  "to_emails": ["alert@company.com"],
  "subject": "Alert"
}
```

---

### notify:sms

Send SMS via Twilio.

**Config:**
```json
{
  "twilio_sid": "AC...",
  "twilio_token": "token",
  "from_phone": "+1234567890",
  "to_phones": ["+0987654321"]
}
```

---

### notify:push

Push notifications via Pushover/Gotify.

---

## System Plugins

### system:cpu

Monitor CPU usage.

**Config:**
```json
{
  "interval_secs": 5
}
```

**Output:** `{ "cpu_percent": 45.2 }`

---

### system:memory

Monitor memory usage.

**Output:** `{ "used_mb": 4096, "total_mb": 16384, "percent": 25.0 }`

---

### system:disk

Monitor disk usage.

**Output:** `{ "used_gb": 250, "total_gb": 500, "percent": 50.0 }`

---

## MQTT Plugins

### mqtt:publish

Publish to MQTT broker.

**Config:**
```json
{
  "host": "broker.hivemq.com",
  "port": 1883,
  "topic": "sensors/temperature",
  "qos": 1
}
```

---

### mqtt:subscribe

Subscribe to MQTT topic.

**Config:**
```json
{
  "host": "broker.hivemq.com",
  "port": 1883,
  "topic": "sensors/#",
  "qos": 1
}
```

---

## Process Plugins

### process:exec

Execute external commands (with allowlist).

**Config:**
```json
{
  "allowlist": ["python", "node", "curl"]
}
```

---

## Crypto Plugins

### crypto:hash

Generate cryptographic hashes (SHA256, MD5).

**Config:**
```json
{
  "algorithm": "sha256"  // "sha256" or "md5"
}
```

**Input:** Raw bytes or string
**Output:** Hex-encoded hash string

**Example Output:** `"2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"`

---

### crypto:hmac-sign

Create HMAC signature for data integrity.

**Config:**
```json
{
  "algorithm": "sha256",
  "key": "your-secret-key",
  "encoding": "hex"  // "hex" or "base64"
}
```

**Input:** Message to sign
**Output:** HMAC signature string

---

### crypto:hmac-verify

Verify HMAC signature.

**Config:**
```json
{
  "algorithm": "sha256",
  "key": "your-secret-key",
  "encoding": "hex",
  "signature": "expected-signature-value"
}
```

**Input:** Message to verify
**Output:** `true` or `false`

---

### crypto:random-uuid

Generate UUIDv4.

**Config:** None required

**Output:** `"550e8400-e29b-41d4-a716-446655440000"`

---

### crypto:random-bytes

Generate cryptographically secure random bytes.

**Config:**
```json
{
  "length": 32,
  "encoding": "hex"  // "hex" or "base64"
}
```

**Output:** Random bytes encoded as hex or base64 string

---

## AI Plugins

### llm:default

AI/LLM text completion (requires model file).

**Config:**
```json
{
  "model_path": "./models/llama-7b.gguf",
  "temperature": 0.7,
  "max_tokens": 256
}
```

---

*For detailed plugin development, see [Plugin Developer Guide](./developer-guide.md)*

