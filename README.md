# AI-Powered Expense Tracker

> A full-stack expense tracking application that pairs a modern React interface with hand-implemented core data structures and algorithms (DSA) for sorting, searching, aggregation, and ranking — rather than relying solely on built-in language utilities.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [DSA Concepts Used](#dsa-concepts-used)
- [Data Flow](#data-flow)
- [Complexity Summary](#complexity-summary)
- [Getting Started](#getting-started)
- [Running the DSA Test Suite](#running-the-dsa-test-suite)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Ledger is an expense tracking application built to demonstrate that classic data structures and algorithms have real, practical value in everyday application logic — not just interview prep. Every core operation in the app (sorting the ledger, filtering by date range, computing category totals, ranking top expenses, and tracking unique categories) is backed by a custom, from-scratch implementation rather than a built-in method, with each choice justified by its time/space complexity.

The frontend is a React + Vite single-page application; the backend exposes this DSA logic as reusable, framework-agnostic modules that can be tested independently of any database or HTTP layer.

---

## Features

- **Add / remove expenses** with description, amount, category, and date
- **Category filtering** (All, Food, Transport, Education, Entertainment, etc.)
- **Sortable ledger** by date or amount, ascending or descending
- **Date-range search** for quickly isolating expenses within a window
- **Spend-by-category visualization** computed via hashmap aggregation
- **Top-N expense ranking** computed via a custom max-heap
- **Unique category tracking** via a Set, used to drive dynamic filter pills
- **AI-generated spending insights** on demand

---

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React, Vite                         |
| Backend    | Node.js                             |
| Database   | MongoDB                             |
| Core Logic | Custom DSA modules (vanilla JS, no external algorithm libraries) |

---

## Architecture

The application is split into three logical layers:

```
┌─────────────────────┐        ┌──────────────────────┐        ┌───────────────┐
│   React + Vite UI    │ <----> │   API / Server Layer  │ <----> │   MongoDB      │
│  (components, charts,│  REST  │ (routes, controllers) │        │ (persisted     │
│   ledger, filters)   │        │                        │        │  expenses)     │
└─────────────────────┘        └──────────┬───────────┘        └───────────────┘
                                            │
                                            ▼
                                 ┌───────────────────────┐
                                 │     DSA Engine          │
                                 │  (sorting, searching,   │
                                 │   aggregation, heap,     │
                                 │   set operations)        │
                                 └───────────────────────┘
```

The DSA engine is intentionally decoupled from both the database and the HTTP layer. Each module accepts and returns plain JavaScript arrays/objects, which means:

- It can be unit tested in isolation (see `demo.js`)
- It can be reused regardless of whether data originates from MongoDB, a REST payload, or a mock dataset
- Swapping the persistence layer in the future would not require touching any algorithmic code

---

## Project Structure

```
project-root/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
├── server/                     # Node.js backend
│   ├── lib/                    # DSA engine (see below)
│   │   ├── sorting.js
│   │   ├── searching.js
│   │   ├── aggregator.js
│   │   ├── topExpenses.js
│   │   ├── uniqueSet.js
│   │   └── demo.js
│   ├── routes/
│   ├── models/
│   └── server.js
└── README.md
```

> Adjust the paths above if your repository uses a different folder layout — the DSA modules themselves are framework-agnostic and can live anywhere.

---

## DSA Concepts Used

### 1. Merge Sort — `sorting.js`

**Purpose:** Sorts the expense ledger by `date` or `amount`, in ascending or descending order.

**Why a custom implementation:** Implementing merge sort explicitly guarantees a predictable O(n log n) worst case and demonstrates the divide-and-conquer paradigm, rather than depending on the underlying engine's native sort behavior.

**How it works:** The array is recursively split into halves down to single-element (trivially sorted) subarrays, then merged back together in sorted order by comparing a configurable key (`date` or `amount`).

- **Time Complexity:** O(n log n)
- **Space Complexity:** O(n) — auxiliary arrays created during merge

### 2. Binary Search — `searching.js`

**Purpose:** Efficiently retrieves all expenses within a given date range from an already-sorted ledger.

**How it works:** Rather than a single-target binary search, this module implements two boundary searches:
- `binarySearchLeftBoundary` — finds the first index whose date is `>=` the range start
- `binarySearchRightBoundary` — finds the last index whose date is `<=` the range end

The slice between these two indices is the result set.

**Precondition:** The input array must already be sorted by date — this module is designed to run immediately after `mergeSort`.

- **Time Complexity:** O(log n) per boundary, O(log n) total for the range query
- **Space Complexity:** O(1) (excluding the returned slice)
- **Why it matters:** A linear scan over the ledger would cost O(n) per query; binary search reduces this to logarithmic time as the ledger grows.

### 3. HashMap Aggregation — `aggregator.js`

**Purpose:** Groups and totals expenses by category and by month, and computes overall total spend.

**How it works:** A native JavaScript `Map` is used as a hashmap, with the category (or `YYYY-MM` month key) as the key and the running total as the value. Each expense is processed once, giving O(1) average-case lookup and update per entry.

- **Time Complexity:** O(n) for a single pass over all expenses
- **Space Complexity:** O(k), where k is the number of distinct categories or months
- **Where it's used:** Powers the "Spend by Category" chart and monthly breakdowns.

### 4. Set — `uniqueSet.js`

**Purpose:** Tracks the distinct set of categories the user has ever used, and checks whether a given category already exists.

**How it works:** A JavaScript `Set` is built from the category field of every expense, guaranteeing uniqueness natively.

- **Time Complexity:** O(n) to build, O(1) average for membership checks
- **Space Complexity:** O(k), where k is the number of unique categories
- **Where it's used:** Drives the dynamic category filter pills in the UI.

### 5. Max-Heap — `topExpenses.js`

**Purpose:** Efficiently identifies the top-N largest expenses, powering the "Top Expenses" ranking panel.

**How it works:** A binary max-heap is implemented from scratch (`insert` with `bubbleUp`, `extractMax` with `bubbleDown`), backed by a plain array with standard parent/child index arithmetic. All expenses are inserted, then the top N are extracted in descending order of amount.

- **Time Complexity:** O(n log n) to insert all n expenses, O(k log n) to extract the top k
- **Space Complexity:** O(n)
- **Design note:** Because every expense is inserted into the heap, this implementation's overall cost is comparable to a full sort. For very large datasets where only a small, fixed k is needed, a **min-heap of size k** would reduce the build cost to O(n log k) by only retaining the k largest elements seen so far. This is a natural next optimization — see [Roadmap](#roadmap).

---

## Data Flow

A typical read operation through the app touches several DSA modules in sequence:

1. Expenses are fetched from MongoDB as a raw array.
2. **Merge sort** orders the array by date (required for binary search to work correctly).
3. **Binary search** narrows the array to a specific date range, if the user has applied one.
4. **HashMap aggregation** computes category and monthly totals for the charts.
5. **Set** operations derive the list of unique categories to render as filter pills.
6. **Max-heap** extraction produces the top-N expenses for the ranking panel.
7. The AI insight endpoint consumes the aggregated summary to generate a natural-language observation.

---

## Complexity Summary

| Concept       | File              | Operation                  | Time Complexity                  | Space Complexity |
|---------------|-------------------|-----------------------------|-----------------------------------|-------------------|
| Merge Sort    | `sorting.js`      | Sort by date / amount       | O(n log n)                        | O(n)              |
| Binary Search | `searching.js`    | Date-range lookup           | O(log n) per boundary             | O(1)              |
| HashMap (Map) | `aggregator.js`   | Category / month totals     | O(n)                               | O(k)              |
| Set           | `uniqueSet.js`    | Unique categories           | O(n) build, O(1) lookup            | O(k)              |
| Max-Heap      | `topExpenses.js`  | Top-N expenses              | O(n log n) build, O(k log n) extract | O(n)            |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm
- A MongoDB instance (local or a hosted service such as MongoDB Atlas)

### Installation

```bash
git clone <repo-url>
cd project-root

# install backend dependencies
cd server
npm install

# install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in `server/` with the following:

```
MONGODB_URI=<your-mongodb-connection-string>
PORT=5000
AI_API_KEY=<your-ai-provider-key>   # required only for the AI insight feature
```

### Running Locally

```bash
# start the backend
cd server
npm run dev

# in a separate terminal, start the frontend
cd client
npm run dev
```

---

## Running the DSA Test Suite

The DSA engine can be exercised independently of the database or HTTP layer using the included demo script, which runs all six modules against a fixed sample dataset:

```bash
npm run test:dsa
```

This executes `demo.js`, printing the results of merge sort, binary search, hashmap aggregation, set operations, and max-heap extraction to the console — useful both for manual verification and as a quick reference when explaining the algorithms.

---

## Roadmap

- Replace the current all-elements max-heap with a fixed-size min-heap (O(n log k)) for top-N retrieval at scale
- Add MongoDB indexes to complement in-memory algorithms as the dataset grows
- Persist and cache aggregation results server-side instead of recomputing per request
- Expand AI insight generation to include predictive/trend-based observations

---

## Author

Vaishnavi Saw
Shailaja Singh
