# Placement Advisor — Backend API

## Folder Structure
```
placement-advisor/
├── src/
│   ├── index.js          ← starts the server
│   ├── routes/
│   │   └── analyze.js    ← handles POST /analyze
│   └── logic/
│       ├── validator.js  ← checks inputs are valid
│       └── advisor.js    ← the actual decision logic
├── package.json
└── README.md
```

## Setup

```bash
npm install
npm run dev     # development (auto-restarts on save)
npm start       # production
```

## Test the API

Send a POST request to `http://localhost:3000/analyze`

### Example Input
```json
{
  "cgpa": 7.2,
  "tier": 3,
  "skills": "dsa",
  "goal": "product"
}
```

### Example Output
```json
{
  "category": "Tier 3 — Good CGPA helps, but off-campus is mandatory",
  "companies": ["Zoho", "Freshworks", "Hasura", "Chargebee", "Postman", "Juspay"],
  "strategy": "Product companies rarely visit Tier 3 campuses...",
  "roadmap": [
    "Build one real project...",
    "Create profiles on Unstop...",
    "CGPA is decent...",
    "Off-campus is your main route..."
  ]
}
```

## Test with curl
```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"cgpa": 7.2, "tier": 3, "skills": "dsa", "goal": "product"}'
```
