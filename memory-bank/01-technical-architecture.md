# Technical Architecture

## System Components

### 1. Core Application

- Angular 19 application
- Angular Elements for web components
- Firestore integration
- Configuration management
- Angular Material for UI components
- Yarn PnP for package management
- Jest for unit testing

### 2. Web Components

- Event List Component
- Task List Component
- Organization List Component
- Shared UI Components
- All components with a11y compliance

### 3. Services

- Firestore Service
- Configuration Service
- Authentication Service (if needed)
- Proxy Service for Firebase communication

### 4. Data Models

- Event Model
- Task Model
- Organization Model
- Configuration Model

## Component Architecture

```
src/
├── app/
│   ├── components/
│   │   ├── event-list/
│   │   │   ├── event-list.component.ts
│   │   │   ├── event-list.component.spec.ts
│   │   │   ├── event-list.component.html
│   │   │   └── event-list.component.scss
│   │   ├── task-list/
│   │   └── organization-list/
│   ├── services/
│   │   ├── firestore.service.ts
│   │   ├── firestore.service.spec.ts
│   │   ├── config.service.ts
│   │   └── proxy.service.ts
│   ├── models/
│   │   ├── event.model.ts
│   │   ├── task.model.ts
│   │   └── organization.model.ts
│   ├── styles/
│   │   └── styles.scss
│   └── app.module.ts
```

## Data Flow

1. Embeddable script loads
2. Configuration parameters are read
3. Components are initialized
4. Requests go through proxy service
5. Proxy service communicates with Firestore
6. UI is rendered with custom styling

## Security Considerations

- Firestore security rules
- CORS configuration
- API key management through server-side proxy
- Data access control
- No exposure of Firebase credentials to client

## Performance Considerations

- Lazy loading of components
- Bundle size optimization
- Caching strategies
- Load time optimization

## Accessibility Considerations

- ARIA attributes
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

## Development Environment

- Yarn PnP for package management
- Angular Material for UI components
- Git for version control
- Comprehensive .gitignore
- Development tools configuration

## Testing Strategy

- Jest as testing framework
- Component testing with Angular Testing Module
- Service testing with dependency injection
- Mock services for external dependencies
- Snapshot testing for components
- Integration testing with TestBed
- E2E testing with Cypress

## Coding Standards

### ESLint Configuration

- Strict TypeScript rules
- Angular-specific rules
- Import sorting
- Explicit return types
- Explicit member accessibility
- No inferrable types
- Component and directive selector rules

### Prettier Configuration

- 120 character line width
- Single quotes
- Consistent quote props
- Brackets on same line
- Angular template formatting

### Code Style Guidelines

- 4 spaces indentation
- Explicit type declarations
- Sorted imports
- Consistent naming conventions
- Component prefix: 'inmojo'
- Accessibility-first development
- Strict TypeScript usage

### Testing Guidelines

- Jest for unit testing
- Automatic spec file creation
- Test coverage requirements
- Mock external dependencies
- Test file naming: *.spec.ts
- Component testing patterns
- Service testing patterns
- Integration testing patterns
