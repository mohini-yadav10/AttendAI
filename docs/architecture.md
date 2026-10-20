# AttendAI Architecture

## System Overview

AttendAI is a modular, full-stack educational technology platform. Each service is independently runnable and testable.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        FE["React Frontend<br/>(Vite + TypeScript + Tailwind)<br/>:5173"]
    end

    subgraph "API Layer"
        BE["Node.js / Express API<br/>(TypeScript)<br/>:5000"]
    end

    subgraph "Data Layer"
        DB[("MongoDB<br/>attendai database")]
    end

    subgraph "AI Layer"
        AI["Python FastAPI<br/>(OpenCV + NumPy)<br/>:8000"]
        MOCK["Mock Adapter<br/>(Labelled Simulation)"]
    end

    FE -->|"REST / Axios<br/>JWT in Authorization header"| BE
    BE -->|"Mongoose ODM"| DB
    BE -->|"HTTP (when AI_MOCK_MODE=false)"| AI
    BE -->|"(when AI_MOCK_MODE=true)"| MOCK
    AI -->|"OpenCV<br/>Haar / DNN"| AI
```

## Request Flow — Attendance Capture

```mermaid
sequenceDiagram
    actor Teacher
    participant FE as React Frontend
    participant BE as Express API
    participant AI as FastAPI AI
    participant DB as MongoDB

    Teacher->>FE: Opens session attendance screen
    FE->>BE: GET /api/sessions/:id
    BE->>DB: Query session + enrolled students
    DB-->>BE: Session data
    BE-->>FE: Session + student list

    Teacher->>FE: Clicks "Capture Attendance"
    FE->>FE: Request camera permission
    FE->>BE: POST /api/ai/detect-faces (image frame)
    BE->>AI: POST /detect-faces
    AI-->>BE: Detected faces + bounding boxes
    BE-->>FE: Detection result

    FE->>FE: Show AI suggestions to teacher
    Teacher->>FE: Review + confirm/correct attendance
    FE->>BE: POST /api/sessions/:id/attendance/review
    BE->>DB: Save final AttendanceRecord + AuditLog
    DB-->>BE: Saved
    BE-->>FE: Success
    FE->>Teacher: Show confirmation toast
```

## Data Model Relationships

```mermaid
erDiagram
    User {
        ObjectId _id
        string name
        string email
        string passwordHash
        enum role
        date createdAt
    }

    Class {
        ObjectId _id
        string name
        string code
        ObjectId teacher
        boolean archived
    }

    Course {
        ObjectId _id
        string name
        string code
        ObjectId class
    }

    StudentProfile {
        ObjectId _id
        string name
        string studentId
        string email
        ObjectId enrolledBy
    }

    Enrollment {
        ObjectId _id
        ObjectId student
        ObjectId class
        ObjectId course
        enum status
    }

    Session {
        ObjectId _id
        ObjectId class
        ObjectId course
        ObjectId teacher
        date date
        enum status
    }

    AttendanceRecord {
        ObjectId _id
        ObjectId student
        ObjectId session
        enum status
        enum entryMethod
        boolean aiReviewed
        ObjectId confirmedBy
        array correctionHistory
    }

    ParticipationEvent {
        ObjectId _id
        ObjectId student
        ObjectId session
        enum eventType
        string note
    }

    AuditLog {
        ObjectId _id
        ObjectId user
        string action
        string resourceType
        ObjectId resourceId
        object changes
    }

    User ||--o{ Class : "teaches"
    Class ||--o{ Course : "contains"
    Class ||--o{ Enrollment : "has"
    StudentProfile ||--o{ Enrollment : "enrolled_in"
    Class ||--o{ Session : "has"
    Session ||--o{ AttendanceRecord : "records"
    StudentProfile ||--o{ AttendanceRecord : "has"
    Session ||--o{ ParticipationEvent : "logs"
    User ||--o{ AuditLog : "generates"
```

## Security Architecture

```mermaid
flowchart LR
    subgraph "Public Routes"
        L[POST /auth/login]
        R[POST /auth/register]
        H[GET /health]
    end

    subgraph "Protected Middleware Chain"
        A[authenticateToken<br/>Verify JWT]
        B[authorizeRole<br/>Check role claim]
        C[validateRequest<br/>Zod schema]
        D[Controller Logic]
    end

    subgraph "Student-scoped"
        S1[GET /api/auth/me]
        S2[GET /api/students/:id/attendance]
    end

    subgraph "Teacher-only"
        T1[POST /api/classes]
        T2[POST /api/sessions]
        T3[POST /api/sessions/:id/attendance/review]
    end

    L --> A
    R --> A
    A --> B --> C --> D
```

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| React Frontend | 5173 | http://localhost:5173 |
| Express Backend | 5000 | http://localhost:5000 |
| FastAPI AI Service | 8000 | http://localhost:8000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | React + Vite | Fast DX, TypeScript support, industry standard |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| Charts | Recharts | React-native, composable |
| Backend framework | Express | Mature, flexible, wide ecosystem |
| ORM | Mongoose | MongoDB-native, schema validation |
| Auth | JWT (HS256) | Stateless, role claims in token |
| Password hashing | bcryptjs | Battle-tested, configurable work factor |
| Input validation | Zod | TypeScript-first, shared with frontend |
| AI framework | FastAPI | Async, auto-docs, Pydantic validation |
| Face detection | OpenCV Haar/DNN | No external API cost, offline capable |
| Face matching | Mock only (v1) | Privacy/consent review required for real matching |

## Privacy & Compliance Notes

- Raw camera frames are NOT stored by default.
- AI detection results are advisory only — a teacher must confirm all records.
- Face matching against stored reference images requires explicit informed consent and is not enabled in v1.
- Synthetic demo data only — no real student PII in seed files.
- Audit logs track all attendance corrections with timestamps and responsible users.
