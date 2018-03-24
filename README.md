# Spending Report

Spending reports for communal expenses

## Requirements

* Node
* Popcorn Notify API key

## Setup

* Clone this repo
* Create a Google API service account and download the secret key JSON.
  Name it anything that matches `*-credentials.json` (so it gets ignored)
  at the repo root.
* Create a Google ClientID/secret pair
* Setup your config.json (see config.example.json) with Google account info,
  spreadsheet ID (`fileId`), and the cells to grab data from:

```
{
  "popcornnotify": {
    "apiKey": "YOUR_API_KEY"
  },
  "google": {
    "clientId": "GOOGLE_CLIENT_ID",
    "clientSecret": "GOOGLE_CLIENT_SECRET",
    "fileId": "GOOGLE_SHEETS_FILE_ID",
    "range": "I2:K4" // spreadsheet cell range in "A1" notation
  },

  // customize this - %name% is a variable
  "heading": "House spending report for %name%:",

  // the array of people to send alerts to
  "people": [
    {
      // name of person to receive report (replaces %name%)
      "name": "Alice",

      // how to reach Alice. Valid phone or email
      "contact": "5555555555",

      // this object tells the report where to look for
      // the amounts this person owes. Key is an arbitrary name
      // (which SHOULD match up with another person in the people
      // array, but doesn't have to). Value is an [X,Y] coordinate
      // relative to the top-left cell in `range`, defined above.
      "owes": {
        "Coby": [0, 1],
        "Bob": [0, 2]
      }
    },
    {
      "name": "Coby",
      "contact": "5555555555",
      "owes": {
        "Alice": [1, 0],
        "Bob": [1, 2]
      }
    },
    {
      "name": "Bob",
      "contact": "5555555555",
      "owes": {
        "Alice": [2, 0],
        "Coby": [2, 1]
      }
    }
  ]
}
```

Finally, run `node index.js`.
