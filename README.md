# AgriConnect Application Platform

[![CI — Auth](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-auth.yml/badge.svg?branch=dev)](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-auth.yml)
[![CI — Marketplace](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-marketplace.yml/badge.svg?branch=dev)](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-marketplace.yml)
[![CI — Order](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-order.yml/badge.svg?branch=dev)](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-order.yml)
[![CI — Media](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-media.yml/badge.svg?branch=dev)](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-media.yml)
[![CI — Notification](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-notification.yml/badge.svg?branch=dev)](https://github.com/AgriConnect-Platform/agriconnect-app/actions/workflows/ci-notification.yml)

![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-ap--south--1-FF9900?logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerised-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-EKS-326CE5?logo=kubernetes&logoColor=white)

---

AgriConnect is an **India-focused farm-to-market platform** that eliminates agricultural middlemen by directly connecting farmers with wholesale and retail buyers. The platform enables farmers to list produce, receive competitive bids, track orders, and get AI-powered farming advice — while buyers can discover fresh produce, place bids, manage procurement, and get a live marketplace assistant. All payments are held in escrow and released only upon buyer confirmation of delivery. The platform is deployed on AWS (`ap-south-1` / Mumbai) via Kubernetes (EKS + ArgoCD), uses Indian Rupees (₹), and is designed as a production-grade DevSecOps reference implementation.

---

## Repository Structure

```
agriconnect-app/
├── .github/
│   └── workflows/
│       ├── main.yml               # Master CI — runs on every push to dev
│       ├── ci-auth.yml            # Auth service build + Trivy scan + smoke test + ECR push
│       ├── ci-marketplace.yml     # Marketplace service pipeline
│       ├── ci-order.yml           # Order service pipeline
│       ├── ci-media.yml           # Media service pipeline
│       ├── ci-notification.yml    # Notification service pipeline
│       ├── cd-frontend.yml        # Frontend build + S3 deploy + CloudFront invalidation
│       ├── ci-prod.yml            # Production pipeline (manual approval gate + version tag)
│       └── notify-failure.yml     # Email alert on security scan failure
├── sonar-project.properties       # SonarCloud project config
├── frontend/                      # React 18 + Vite SPA (served via CloudFront)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js             # Dev server + proxy config for all 5 services
│   └── src/
│       ├── App.jsx                # Router + role-based route guards
│       ├── theme.js               # MUI v5 theme
│       ├── components/
│       │   ├── AIChatBot.jsx      # Shared AI chat UI wrapper
│       │   ├── Navbar.jsx         # Polls /api/notifications/unread-count every 30s
│       │   └── WeatherWidget.jsx  # Calls open-meteo.com directly from browser
│       └── pages/
│           ├── Admin/Dashboard.jsx      # Recharts admin analytics
│           ├── Auth/Login.jsx           # JWT login
│           ├── Auth/Register.jsx        # Farmer / Buyer registration
│           ├── Buyer/BuyerBot.jsx       # BuyerBot AI (VITE_BUYERBOT_API_URL)
│           ├── Buyer/Dashboard.jsx      # Listings + bidding
│           ├── Farmer/Dashboard.jsx     # My listings + incoming bids
│           └── Farmer/FarmBot.jsx       # FarmBot AI with image upload (VITE_FARMBOT_API_URL)
├── services/
│   ├── auth-service/              # Port 3001 — authentication + user management
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── controllers/authController.js
│   │   └── routes/auth.js
│   ├── marketplace-service/       # Port 3002 — produce listings + bidding
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── controllers/marketplaceController.js
│   │   └── routes/marketplace.js
│   ├── order-service/             # Port 3003 — orders + escrow payments
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── controllers/orderController.js
│   │   └── routes/order.js
│   ├── media-service/             # Port 3004 — S3 image upload proxy
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── controllers/mediaController.js
│   │   └── routes/media.js
│   └── notification-service/      # Port 3005 — SQS consumer + email dispatch
│       ├── Dockerfile
│       ├── index.js
│       ├── package.json
│       ├── controllers/notificationController.js
│       ├── routes/notification.js
│       └── workers/sqsWorker.js   # Long-polls SQS, 20s wait, 10 messages/batch
└── shared/                        # Shared library — models, DB, middleware, utils
    ├── package.json
    ├── db/index.js                # Sequelize MySQL connection via Secrets Manager
    ├── middleware/auth.js         # JWT verify middleware
    ├── models/                    # Sequelize ORM models
    │   ├── User.js
    │   ├── Farmer.js
    │   ├── Buyer.js
    │   ├── ProduceListing.js
    │   ├── Bid.js
    │   ├── Order.js
    │   ├── Transaction.js
    │   ├── Payment.js
    │   ├── Notification.js
    │   └── index.js               # Model associations + sync
    ├── scripts/
    │   ├── migrate.js             # Creates all tables (run once post-deploy)
    │   └── seed.js                # Seeds 20 farmers, 20 buyers, 100 listings, 50 orders
    └── utils/
        ├── secrets.js             # AWS Secrets Manager client (5-min in-memory TTL cache)
        ├── eventPublisher.js      # Publishes SNS events (AgriConnect-Events topic)
        └── email.js               # Nodemailer SMTP wrapper (Gmail, port 587)
```

---

## Services

### Auth Service — Port 3001

Handles registration, login, JWT issuance, and admin user management. Passwords are hashed with bcrypt (10 rounds). JWTs are signed with a secret retrieved from AWS Secrets Manager (`agriconnect/dev/jwt`).

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `POST` | `/api/auth/register` | None | — | Register a new user. Body: `{ first_name, last_name, email, phone, password, role: "FARMER"\|"BUYER" }`. Creates `User` + `Farmer` or `Buyer` profile row. Returns JWT. |
| `POST` | `/api/auth/login` | None | — | Login with email + password. Returns JWT token. |
| `GET` | `/api/auth/me` | JWT | Any | Returns the authenticated user record with associated Farmer or Buyer profile. |
| `GET` | `/api/auth/admin/stats` | JWT | ADMIN | Returns aggregate platform statistics (user counts, listing counts, order totals). |
| `GET` | `/api/auth/admin/users` | JWT | ADMIN | Paginated user list with all profile data. |
| `GET` | `/healthz` | None | — | Liveness probe — returns 200 OK. |
| `GET` | `/ready` | None | — | Readiness probe — returns 200 OK (with optional DB check). |

---

### Marketplace Service — Port 3002

Manages produce listings and the bidding lifecycle. Farmers create listings; buyers place bids; farmers accept or reject bids. Accepting a bid rejects all other bids on that listing automatically.

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `GET` | `/api/marketplace/listings` | None | — | All active listings. Query params: `search` (text), `category`, `page`, `limit`. Returns listings with farmer info. |
| `GET` | `/api/marketplace/listings/:id` | None | — | Single listing with associated farmer profile. |
| `GET` | `/api/marketplace/categories` | None | — | Distinct categories from all ACTIVE listings. |
| `GET` | `/api/marketplace/my-listings` | JWT | FARMER | All listings belonging to the authenticated farmer. |
| `GET` | `/api/marketplace/farmer-bids` | JWT | FARMER | All bids received on the farmer's listings. |
| `POST` | `/api/marketplace/listings` | JWT | FARMER | Create a listing. Body: `{ product_name, category, unit, quantity, price, harvest_date, description, image_url }`. |
| `PUT` | `/api/marketplace/listings/:id` | JWT | FARMER | Update a listing (owner check). |
| `DELETE` | `/api/marketplace/listings/:id` | JWT | FARMER | Soft-delete (sets `status = DELETED`). |
| `PUT` | `/api/marketplace/bids/:id/accept` | JWT | FARMER | Accept a bid. Simultaneously rejects all other pending bids on the same listing. Publishes `BID_ACCEPTED` SNS event. |
| `PUT` | `/api/marketplace/bids/:id/reject` | JWT | FARMER | Reject a specific bid. Publishes `BID_REJECTED` SNS event. |
| `POST` | `/api/marketplace/bids` | JWT | BUYER | Place a bid. Body: `{ listing_id, amount }`. Publishes `NEW_BID` SNS event. |
| `GET` | `/api/marketplace/my-bids` | JWT | BUYER | All bids placed by the authenticated buyer. |
| `GET` | `/api/marketplace/bids/:listingId` | JWT | FARMER/BUYER | All bids on a specific listing. |

---

### Order Service — Port 3003

Manages the order-to-delivery lifecycle with escrow payment logic. When an order is created, a `Payment` record is created with status `HELD`. Payment status moves to `RELEASED` only when the buyer explicitly confirms delivery.

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `POST` | `/api/orders/create` | JWT | BUYER | Create an order. Creates `Order`, `Transaction` (COMPLETED), and `Payment` (HELD). Publishes `NEW_ORDER` SNS event. Body: `{ listing_id, quantity }`. |
| `GET` | `/api/orders/my-orders` | JWT | BUYER | All orders placed by the authenticated buyer. |
| `POST` | `/api/orders/:id/confirm` | JWT | BUYER | Confirm delivery. Sets `buyer_confirmed = true`, `payment_released = true`, `Payment.status = RELEASED`. Publishes `PAYMENT_RELEASED` SNS event. |
| `GET` | `/api/orders/sales` | JWT | FARMER | All orders for the authenticated farmer's listings. |
| `PUT` | `/api/orders/:id/status` | JWT | FARMER | Update delivery status. Body: `{ status: "PENDING"\|"IN_TRANSIT"\|"DELIVERED" }`. Publishes `ORDER_STATUS` SNS event. |
| `GET` | `/api/orders/admin/all` | JWT | ADMIN | All orders across the platform (paginated). |

---

### Media Service — Port 3004

A thin proxy for uploading produce images to S3. Accepts `multipart/form-data` with field `image`. Validates file type (jpg, jpeg, png, webp) and uploads to the `produce_bucket` from `agriconnect/dev/s3` secret via IRSA.

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `POST` | `/api/media/upload/produce` | JWT | FARMER | Upload produce image. Field: `image` (multipart). Returns `{ imageUrl }` (public S3 URL). |

---

### Notification Service — Port 3005

Dual-mode notification delivery: an HTTP API for reading/marking notifications, and a background SQS worker that long-polls `AgriConnect-Notifications-Queue` (20-second wait time, 10 messages per batch, visibility timeout 30s) and processes all SNS event types to write DB notifications and send emails.

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `GET` | `/api/notifications/` | JWT | Any | Fetch the last 50 notifications for the authenticated user. |
| `GET` | `/api/notifications/list` | JWT | Any | Identical to above. |
| `GET` | `/api/notifications/unread-count` | JWT | Any | Returns count of `is_read = false` notifications. Polled by Navbar every 30s. |
| `POST` | `/api/notifications/send` | JWT | Any | Send a notification to a target user ID + optionally send an email. Body: `{ user_id, title, message, send_email }`. |
| `POST` | `/api/notifications/weather-alert` | None | — | Broadcast weather alert message to all farmers. Body: `{ message, alert_type }`. Called by `weather-alert-processor` Lambda every 6 hours. |
| `PUT` | `/api/notifications/read-all` | JWT | Any | Mark all notifications for the user as read. |
| `PUT` | `/api/notifications/:id/read` | JWT | Any | Mark a single notification as read. |

**SNS Event Types processed by the SQS worker:**

| Event Type | Trigger | Email Sent |
|------------|---------|------------|
| `NEW_BID` | Buyer places bid | Yes — to farmer |
| `BID_ACCEPTED` | Farmer accepts bid | Yes — to buyer |
| `BID_REJECTED` | Farmer rejects bid | Yes — to buyer |
| `NEW_ORDER` | Buyer creates order | Yes — to farmer |
| `ORDER_STATUS` | Farmer updates delivery status | Yes — to buyer |
| `PAYMENT_RELEASED` | Buyer confirms delivery | Yes — to farmer |
| `WEATHER_ALERT` | Lambda every 6h | Yes — to all farmers |

---

## Database Schema

All services share a single MySQL 8.0 database (`agriconnect`) via Sequelize ORM. Connection credentials are fetched at startup from AWS Secrets Manager secret `agriconnect/dev/database` (host, port 3306, database, username, password).

### `users`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INT | PK, AUTO_INCREMENT |
| `role` | ENUM | `'FARMER'`, `'BUYER'`, `'ADMIN'` |
| `first_name` | STRING | NOT NULL |
| `last_name` | STRING | NOT NULL |
| `email` | STRING | NOT NULL, UNIQUE |
| `phone` | STRING | nullable |
| `password_hash` | STRING | NOT NULL (bcrypt, 10 rounds) |
| `status` | STRING | DEFAULT `'ACTIVE'` |
| `created_at` | TIMESTAMP | auto |
| `updated_at` | TIMESTAMP | auto |

### `farmers`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `user_id` | INT | FK → users |
| `farm_name` | STRING | NOT NULL |
| `location` | STRING | city + state string |
| `city` | STRING | nullable |
| `state` | STRING | nullable |
| `latitude` | FLOAT | nullable (for WeatherWidget) |
| `longitude` | FLOAT | nullable |
| `bank_secret_reference` | STRING | AWS Secrets Manager reference |

### `buyers`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `user_id` | INT | FK → users |
| `company_name` | STRING | — |

### `produce_listings`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `farmer_id` | INT | FK → farmers |
| `product_name` | STRING | e.g. "Basmati Rice", "Alphonso Mangoes" |
| `category` | STRING | — |
| `unit` | STRING | e.g. "kg", "quintal" |
| `quantity` | FLOAT | — |
| `price` | DECIMAL(10,2) | in ₹ |
| `harvest_date` | DATEONLY | — |
| `description` | TEXT | — |
| `image_url` | STRING | S3 public URL |
| `status` | STRING | `ACTIVE` / `SOLD` / `INACTIVE` / `DELETED` |

### `bids`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `buyer_id` | INT | FK → buyers |
| `listing_id` | INT | FK → produce_listings |
| `amount` | DECIMAL(10,2) | bid price in ₹ |
| `status` | STRING | `PENDING` / `ACCEPTED` / `REJECTED` |

### `orders`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `buyer_id` | INT | FK → buyers |
| `listing_id` | INT | FK → produce_listings |
| `quantity` | FLOAT | — |
| `total_amount` | DECIMAL(10,2) | in ₹ |
| `delivery_status` | STRING | `PENDING` / `IN_TRANSIT` / `DELIVERED` |
| `buyer_confirmed` | BOOLEAN | DEFAULT false |
| `payment_released` | BOOLEAN | DEFAULT false |

### `transactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `order_id` | INT | FK → orders |
| `amount` | DECIMAL(10,2) | in ₹ |
| `status` | STRING | `COMPLETED` / `PENDING` / `FAILED` |

### `payments`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `order_id` | INT | FK → orders |
| `amount` | DECIMAL(10,2) | in ₹ |
| `status` | STRING | `HELD` → `RELEASED` / `FAILED` |
| `sns_message_id` | STRING | nullable |
| `released_at` | DATE | nullable |

### `notifications`

| Column | Type | Notes |
|--------|------|-------|
| `id` | INT | PK |
| `user_id` | INT | FK → users |
| `title` | STRING | — |
| `message` | TEXT | — |
| `is_read` | BOOLEAN | DEFAULT false |

### Model Associations

```
User ──hasOne──► Farmer (as: farmer_profile)
User ──hasOne──► Buyer  (as: buyer_profile)
User ──hasMany─► Notification

Farmer ──hasMany──► ProduceListing
ProduceListing ──hasMany──► Bid
ProduceListing ──hasMany──► Order

Buyer ──hasMany──► Bid
Buyer ──hasMany──► Order
Order ──hasMany──► Transaction
Order ──hasOne──► Payment
```

---

## Frontend

**Stack:** React 18, Vite 4, React Router v6, MUI v5 (Material-UI), Emotion, framer-motion, recharts, axios.

**Role-based routing:**

| Role | Base Path | Key Pages |
|------|-----------|-----------|
| `FARMER` | `/farmer/*` | Dashboard (listings + bids), FarmBot AI, WeatherWidget |
| `BUYER` | `/buyer/*` | Dashboard (browse + bid), BuyerBot AI |
| `ADMIN` | `/admin/*` | Analytics dashboard (recharts), user list |

**Key behaviours:**
- JWT stored in `localStorage`; included in all API calls as `Authorization: Bearer <token>`
- Navbar polls `GET /api/notifications/unread-count` every **30 seconds** to show badge
- **WeatherWidget** calls `open-meteo.com` directly from the browser for 20 hardcoded Indian cities (lat/lng), fetching current weather + humidity + precipitation probability
- **FarmBot** page (`/farmer/farmbot`) — sends image + text to `VITE_FARMBOT_API_URL` (Lambda API Gateway, Amazon Nova Pro on Bedrock). Supports multimodal plant disease diagnosis.
- **BuyerBot** page (`/buyer/buyerbot`) — sends text to `VITE_BUYERBOT_API_URL` (Lambda API Gateway, Amazon Nova Lite on Bedrock). Uses tool calls to fetch live marketplace data.

**Vite dev proxy** (all requests proxied from port 3000):

| Prefix | Target |
|--------|--------|
| `/api/auth` | `http://localhost:3001` |
| `/api/marketplace` | `http://localhost:3002` |
| `/api/orders` | `http://localhost:3003` |
| `/api/media` | `http://localhost:3004` |
| `/api/notifications` | `http://localhost:3005` |

---

## Key Business Workflows

### 1. Farmer Lists Produce → Buyer Bids → Order Created

```
Farmer                   Marketplace Service        Buyer
  │                             │                     │
  ├─POST /api/marketplace/──────►                     │
  │  listings (image_url,       │                     │
  │  price, quantity)           │                     │
  │◄────────── listing_id ──────┤                     │
  │                             │                     │
  │                             │◄──── POST /api/marketplace/bids ─┤
  │                             │      { listing_id, amount }       │
  │◄── NEW_BID SNS ─────────────┤                                   │
  │  (email to farmer)          │                     │
  │                             │                     │
  ├─PUT /api/marketplace/───────►                     │
  │  bids/:id/accept            │                     │
  │                             ├─── BID_ACCEPTED ──► Buyer (email)│
  │                             │    (all others REJECTED)          │
  │                             │                     │
  │                             │◄──── POST /api/orders/create ────┤
  │                             │      { listing_id, quantity }    │
  │                             │      Creates Order + Transaction  │
  │                             │      + Payment(HELD)             │
  │◄── NEW_ORDER SNS ───────────┤                     │
  │  (email to farmer)          │                     │
```

### 2. Delivery → Payment Release (Escrow Flow)

```
Farmer                   Order Service              Buyer
  │                          │                        │
  ├─PUT /api/orders/:id/─────►                        │
  │  status {IN_TRANSIT}     │──── ORDER_STATUS ────► Buyer (email)
  │                          │                        │
  ├─PUT /api/orders/:id/─────►                        │
  │  status {DELIVERED}      │──── ORDER_STATUS ────► Buyer (email)
  │                          │                        │
  │                          │◄── POST /orders/:id/confirm ────────┤
  │                          │    (buyer confirms receipt)         │
  │                          │    Payment: HELD → RELEASED         │
  │◄── PAYMENT_RELEASED ─────┤    buyer_confirmed = true           │
  │  (email to farmer)       │                        │
```

### 3. Weather Alert Broadcast (Every 6 Hours)

```
EventBridge Scheduler (rate: 6h, Asia/Kolkata)
  │
  ▼
weather-alert-processor Lambda (Node.js 18)
  │  Picks message based on UTC hour (rain/heat/storm/default)
  │
  ▼
POST http://<ALB_URL>/api/notifications/weather-alert
  │  { message, alert_type }
  │
  ▼
Notification Service
  │  Broadcasts to ALL farmers in DB
  │  Sends email to each farmer
  │  Creates Notification records
  ▼
SNS AgriConnect-WeatherAlerts topic
```

---

## CI/CD Pipeline

### Dev Pipeline (`main.yml` — triggered on push to `dev`)

```
push to dev
    │
    ├─► [changes]  Detect if frontend/** changed
    │
    ├─► [sast]     SonarCloud scan (sonar.organization=agriconnect-platform,
    │              projectKey=AgriConnect-Platform_agriconnect-app2)
    │              Sources: services/, shared/  |  continue-on-error: true
    │
    ├─► [snyk]     After sast: npm install all services + shared
    │              snyk test --all-projects --severity-threshold=high
    │              continue-on-error: true
    │
    ├─► [lint]     After sast+snyk: npx eslint@8 services/ shared/
    │              --max-warnings 0  (hard fail)
    │
    ├─► [notify-security]  If sast or snyk failed →
    │              email asadchamp109@gmail.com via smtp.gmail.com:587
    │
    ├─► [ci-auth / ci-marketplace / ci-order / ci-media / ci-notification]
    │   Run in parallel after lint. Each service does:
    │     1. Configure AWS credentials
    │     2. ECR login (893431614084.dkr.ecr.ap-south-1.amazonaws.com)
    │     3. Set IMAGE_TAG = 7-char git SHA
    │     4. docker build (multi-stage Dockerfile, GHA cache)
    │     5. trivy image --severity CRITICAL --exit-code 1
    │     6. Smoke test: docker run -e SKIP_DB=true -p 300X:300X
    │                    curl /healthz (up to 20 retries)
    │     7. docker push :SHA + :latest to ECR
    │
    ├─► [update-helm-values]  After all 5 CI jobs pass:
    │     1. Checkout AgriConnect-Platform/agriconnect-helm (dev branch)
    │     2. sed-replace image tag in helm/agriconnect/values.yaml
    │     3. git push → ArgoCD detects change → syncs dev namespace on EKS
    │
    └─► [cd-frontend]  If frontend changed:
          1. Read SSM /agriconnect/farmbot-api-url + /agriconnect/buyerbot-api-url
          2. npm install && npm run build (VITE_FARMBOT_API_URL + VITE_BUYERBOT_API_URL injected)
          3. aws s3 sync frontend/dist/ s3://agriconnect-frontend-893431614084/
          4. CloudFront invalidation /* (distribution ID from SSM)
```

### Production Pipeline (`ci-prod.yml` — push to `prod` branch)

```
push to prod
    │
    ├─► Manual approval (GitHub environment: production)
    │
    ├─► Get version: git describe --tags --abbrev=0
    │
    ├─► Build all 5 services in parallel (matrix strategy)
    │   Tag: version + "stable"
    │   Push to ECR
    │
    └─► Update agriconnect-platform/agriconnect-helm prod branch
        → ArgoCD syncs to production namespace on EKS
```

---

## AWS Secrets Manager

All secrets are fetched at service startup with a **5-minute in-memory TTL cache** via `shared/utils/secrets.js`. No `.env` files are used in production.

| Secret Name | Contents |
|-------------|----------|
| `agriconnect/dev/database` | `{ database, username, password, host, port: 3306 }` |
| `agriconnect/dev/jwt` | `{ jwt_secret, jwt_expiry: "24h" }` |
| `agriconnect/dev/email` | `{ host, port: 587, user, pass, from }` |
| `agriconnect/dev/s3` | `{ produce_bucket }` |
| `agriconnect/dev/aws` | `{ access_key, secret_key }` (optional; IRSA preferred) |

---

## Environment Variables

| Variable | Default | Service | Description |
|----------|---------|---------|-------------|
| `PORT` | 3001–3005 | All services | HTTP listen port |
| `DB_SECRET_NAME` | `agriconnect/dev/database` | shared/db | Secrets Manager key for DB credentials |
| `AWS_REGION` | `ap-south-1` | All services | AWS region |
| `EVENTS_TOPIC_ARN` | — | shared/eventPublisher | SNS topic ARN (`AgriConnect-Events`) |
| `NOTIFICATIONS_QUEUE_URL` | — | notification-service | SQS queue URL (`AgriConnect-Notifications-Queue`) |
| `SKIP_DB` | `false` | All services | Set `true` in smoke tests to skip DB connection |
| `NODE_ENV` | `production` | Dockerfile | Node environment |
| `VITE_FARMBOT_API_URL` | — | Frontend build | FarmBot Lambda API Gateway URL |
| `VITE_BUYERBOT_API_URL` | — | Frontend build | BuyerBot Lambda API Gateway URL |

**CI/CD GitHub Secrets required:**

| Secret | Used By | Description |
|--------|---------|-------------|
| `AWS_ACCESS_KEY_ID` | All CI workflows | AWS credentials for ECR, S3, CloudFront, SSM |
| `AWS_SECRET_ACCESS_KEY` | All CI workflows | AWS credentials |
| `SONAR_TOKEN` | main.yml | SonarCloud authentication |
| `SNYK_TOKEN` | main.yml | Snyk authentication |
| `GH_PAT` | main.yml, ci-prod.yml | GitHub PAT to push to agriconnect-helm repo |
| `TF_VAR_SMTP_PASS` | notify-failure.yml | Gmail app password for failure email |

---

## AI Integrations

Three AI agents are embedded in the platform, all powered by **Amazon Bedrock** (region: `us-east-1`):

| Agent | Model | Interface | Purpose |
|-------|-------|-----------|---------|
| **FarmBot** | `amazon.nova-pro-v1:0` | Lambda + API Gateway | Multimodal plant disease diagnosis — farmers upload crop photos for AI analysis |
| **BuyerBot** | `amazon.nova-lite-v1:0` | Lambda + API Gateway | Live marketplace assistant — uses tool calls to fetch real listing data from `/api/marketplace/listings` |
| **DevOpsBot** | `anthropic.claude-sonnet-4-6` | Lambda + API Gateway | Infrastructure AI agent — security audits, K8s diagnostics, FinOps analysis (see devops-agent repo) |

FarmBot and BuyerBot Lambda functions are defined in the **agriconnect-infra** repo. Their API URLs are stored in SSM and injected at frontend build time.

---

## Local Development

### Prerequisites

- Node.js 18+
- MySQL 8.0 running locally (or Docker)
- AWS CLI configured (for Secrets Manager, or use `.env` files locally)
- Docker (for smoke tests)

### Start all services

```bash
# 1. Install all dependencies
cd shared && npm install
cd ../services/auth-service && npm install
cd ../marketplace-service && npm install
cd ../order-service && npm install
cd ../media-service && npm install
cd ../notification-service && npm install
cd ../../frontend && npm install

# 2. Set environment variables (create .env in each service directory)
# services/auth-service/.env:
# PORT=3001
# DB_SECRET_NAME=agriconnect/dev/database
# AWS_REGION=ap-south-1

# 3. Run DB migration (once)
cd shared && node scripts/migrate.js

# 4. Seed test data (optional)
cd shared && node scripts/seed.js

# 5. Start all services (separate terminals)
cd services/auth-service && node index.js         # :3001
cd services/marketplace-service && node index.js  # :3002
cd services/order-service && node index.js        # :3003
cd services/media-service && node index.js        # :3004
cd services/notification-service && node index.js # :3005

# 6. Start frontend dev server
cd frontend && npm run dev  # :3000 with proxy to all 5 services
```

### Test credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@agriconnect.com` | `password123` |
| Farmer | `farmer1@example.com` | `password123` |
| Buyer | `buyer1@example.com` | `password123` |

Seeded data includes 20 farmers, 20 buyers, 100 produce listings (Basmati Rice, Alphonso Mangoes, Cotton, Sugarcane, and 16 more categories), 50 orders, and 100 bids.

---

## Security

| Layer | Implementation |
|-------|---------------|
| Authentication | JWT (HS256), signed with secret from `agriconnect/dev/jwt`. Expiry: 24h. |
| Authorisation | Role-based middleware (`auth.js`) checks JWT `role` claim against `FARMER`/`BUYER`/`ADMIN` |
| Password storage | bcrypt, 10 rounds |
| Secrets management | AWS Secrets Manager — no `.env` files in production. 5-min in-memory cache. |
| Container scanning | Trivy (CRITICAL severity, exit-code 1) on every build in CI — blocks push on critical CVEs |
| SAST | SonarCloud on every push to `dev` (organisation: `agriconnect-platform`) |
| Dependency scanning | Snyk `--all-projects --severity-threshold=high` on every push |
| Image signing | ECR images stored with scan-on-push enabled (lifecycle: keep last 10) |
| Network | AWS WAFv2 (rate limiting, Common ruleset, Known Bad Inputs) in front of CloudFront |
| IAM | Services use IRSA (no long-lived credentials) — `agriconnect-dev-eks-services-role` |
| HTTPS | CloudFront with HTTP→HTTPS redirect on `/api/*` behaviour |
