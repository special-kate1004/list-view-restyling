# Inmojo Embedded Code App

## Project Overview

The Inmojo Embedded Code App is an Angular-based application that creates embeddable components for displaying Inmojo data (events, tasks, and organizations) on external websites.

## Core Features

- Embeddable components using Angular Elements
- Firestore integration for data retrieval
- Customizable appearance through configuration parameters
- Support for events, tasks, and organizations display
- Accessibility (a11y) compliance
- Secure Firebase key management

## Technical Stack

- Framework: Angular 19
- Database: Firebase/Firestore
- Custom Elements: Angular Elements
- Package Manager: Yarn 4.9.1
- UI Framework: Angular Material

## Project Status

- [x] Initial Setup
  - [x] Angular project initialization
  - [x] Dependencies installation
  - [x] Git configuration
- [x] Core Components
  - [x] Event component
  - [x] Task component
  - [x] Organization component
  - [x] Shared components and services
- [x] Firestore Integration
  - [x] Data models and interfaces
  - [x] Firestore service implementation
  - [x] Data fetching and caching
  - [x] Error handling
- [x] Embeddable Script
  - [x] Web components registration
  - [x] Build configuration
  - [x] Script generation
  - [x] Configuration handling
  - [ ] Documentation
  - [ ] Testing
  - [ ] Deployment

## Key Decisions

- Using Angular Elements for web components
- Firestore as the data source
- Configuration through HTML attributes
- Custom styling through CSS variables
- Angular Material for a11y compliance
- Secure Firebase key management through server-side proxy
- Yarn as package manager with PnP

## Open Questions

1. Authentication requirements
2. Performance constraints
3. Specific UI/UX requirements
4. Deployment strategy
5. Server-side proxy implementation details
