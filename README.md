# Nebula

Nebula is a gamified focus and study application where focused work evolves unique planets over time.

- Each study subject—such as a university course or personal project—is represented by a star.
- As the user completes focus sessions, their currently active planet accumulates study time and progresses through
  visual evolution stages.
- Once fully evolved, the planet becomes a permanent part of the user's solar system and a new planet can begin growing
  around the same star.

The goal of Nebula is to turn focused work into a fun, visual record of effort!

---

## Core Concept

The central gameplay loop is:

```text
study
  ↓
grow a planet
  ↓
complete the planet
  ↓
add it to a solar system
  ↓
continue expanding the system
```

A **Subject** represents what the user is working on.

Examples:

```text
CPSC 213
MATH 221
LeetCode
Personal Project
Undergraduate Society
```

Each context is visually represented by a **star**.

A star can eventually have many completed planets orbiting it:

```text
                    Planet
                      │
                      │
Planet ─────── CPSC 213 Star ─────── Planet
                      │
                      │
                    Planet
```

---

# Project Phases

## Phase 1 — Core Domain and Backend

Build the initial application model and persistence layer.

### Goals

* create `StudyContext`
* create `Planet`
* create `FocusSession`
* create repositories
* create service layer
* implement planet evolution rules
* create basic REST endpoints
* connect the application to PostgreSQL
* test the core study-session workflow

---

## Phase 2 — Authentication and User Ownership

Add multiple users and secure personal data.

### Goals

* create `User` entity
* register accounts
* securely hash passwords
* log users in
* authenticate requests
* protect API endpoints
* associate study contexts with users
* ensure users can only access their own data
* support logout/session expiration as appropriate

Authentication is a core requirement of the finished application, not an optional extension.

---

## Phase 3 — React Frontend and Focus Timer

Create the primary user interface.

### Goals

* create React application
* connect React to Spring Boot API
* create registration page
* create login page
* create authenticated routes
* create study-context selector
* build focus timer
* support start, pause, resume, and finish actions
* display the currently evolving planet
* display planet progress

---

## Phase 4 — Procedural Planet System

Make planets visually unique.

### Goals

* generate deterministic planet characteristics from a seed
* reflect evolution stages visually
* display distinct planetary landscapes
* support reusable procedural generation
* introduce rare visual traits
* preserve finished planet appearances permanently

---

## Phase 5 — Solar-System Dashboard

Create the visual representation of accumulated effort.

### Goals

* render one star per study context
* render completed planets around their respective stars
* distinguish active and completed planets
* allow users to click stars
* allow users to click planets
* display context statistics
* display planet histories
* visualize growth of the user's study history over time

---

## Phase 6 — Study Insights and Analytics

Provide meaningful feedback about study behavior.

### Goals

Track statistics such as:

```text
total focused time
focused time by context
daily focus time
weekly focus time
average session length
median session length
longest session
most productive day
most productive time of day
study consistency
streaks
context-switching patterns
```

---

## Phase 7 — Progression and Gamification

Expand the collection system without making it intrusive.

Possible features include:

* achievements
* rare planet traits
* planet naming
* moons
* multiple ring types
* larger or brighter stars
* semester milestones
* course-completion summaries
* archived solar systems
* constellation-style semester views

---

## Phase 8 — Deployment and Production

Prepare Nebula to operate as a real application.

### Goals

* Dockerize Spring Boot backend
* Dockerize frontend
* run PostgreSQL through Docker
* configure production environment variables
* securely manage authentication configuration
* configure database migrations
* deploy application
* improve accessibility
* improve error handling
* add production logging
* expand automated testing

---
