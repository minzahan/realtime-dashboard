# Real-Time Sales Analytics Dashboard

Demonstrates backend API development, WebSocket integration, real-time data processing, and UI/UX design.

---

## Getting Started

### 1. Clone the Repo

```bash
git clone git@github.com:minzahan/realtime-dashboard.git
cd realtime-dashboard
```

### 2. Install dependependies

```bash
pnpm install
```

### 3. Run App

```bash
pnpm dev:all
```

### This will launch:

- **Backend HTTP server** — [http://localhost:3001](http://localhost:3001)
- **WebSocket server** — `ws://localhost:3002`
- **Frontend** — [http://localhost:3000](http://localhost:3000)

### Navigate to Pages:

- [`/`](http://localhost:3000) — Combined **Dashboard** + **Add Transaction Form**
- [`/dashboard`](http://localhost:3000/dashboard) — Dashboard only
- [`/transaction`](http://localhost:3000/transaction) — Transaction Form only

### Technical Approach

1. User submits a transaction from the form that calls a mutation tRPC procedure to add a transaction
2. Mutation hits backend → transaction is saved to JSON and uses `txEmitter` to emit event
3. A tRPC subscription is listening for events and recieves a type safe Transaction
4. WebSocket server broadcasts to all connected clients
5. Clients subscribed via `useSubscription` receive the update and re-render without refreshing

### Key Decisions and Trade offs

1. For real time updates: polling, sse, or websockets? Websockets because of multi channel broadcasting
2. For API: tRPC for the use of subscriptions, type safety, and the experience
3. For backend server: Hono for tRPC host - simplicity and separation from frontend
4. For frontend: Next.js for quick app routing and the experience
5. For folder structure: Monorepo style with separate frontend and backend and a shared trpc package
6. For storage: JSON file for simplicity and proof of concept
7. For search: filtering on the frontend for search - trade off complexity for simplicity

### Assumptions and Limitations

These are questions I would have asked for clarifaction in a real setting

1. Should the transactions be listed in any particular order?
   - Assumed: transaction with the most recent date on the bottom
2. When filtering by name should the total revenue be reflective of only the filtered transactions?
   - Assumed: The total revenue only changes when a transaction is added
3. How does summing the values of the dashboard table work with different currencies? Should there be conversions to a specific currency?
   - Assumed: The total revenue will be reflected for each currency present in the table
4. Can you specify the search by name? Do you mean exact name match or the first character or any character?
   - Assumed: The names that have full or partial match to the input
5. Are the Dashboard and Transaction Form on separate pages? What do you expect on the home page if they are their own routes?
   - Assumed: Create seperate routes/pages for Dashboard and Transaction and display the functionality on the homepage

### Notes

First time using tRPC, Hono, Next.js.
