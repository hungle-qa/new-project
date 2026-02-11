# Component Testing

**Philosophy:** 100% Happy Path coverage from atomic components to full E2E workflows using the Atomic-to-Flow framework.

## Atomic-to-Flow Framework

Build test coverage layer by layer, from smallest units to complete workflows:

### Layer 1: Atomic Component Tests
Test individual UI components in isolation.
- Rendering states (default, loading, error, empty)
- User interactions (click, type, hover, focus)
- Props/configuration variations

### Layer 2: Composite Component Tests
Test component combinations that form meaningful UI sections.
- Data flow between parent and child components
- State management within component groups
- Event propagation

### Layer 3: Feature Flow Tests
Test complete feature workflows end-to-end.
- Full user journeys through the feature
- Integration with APIs and services
- State persistence across navigation

## Testing Lenses

Apply multiple perspectives to each layer:

### CRUD Lens
- **Create**: Can the user create new items?
- **Read**: Does data display correctly?
- **Update**: Can existing items be modified?
- **Delete**: Can items be removed safely?

### Persona Lens
- New user (first-time experience)
- Power user (keyboard shortcuts, bulk actions)
- Admin user (management capabilities)
- Mobile user (responsive behavior)

### State Lens
- Empty state (no data)
- Loading state (fetching data)
- Error state (failed operations)
- Populated state (with data)
- Edge state (maximum data, special characters)

## When to Use

- UI-heavy features with many interactive components
- Features built from a design system
- Features requiring thorough component-level coverage
- When component reusability and isolation matter

## Approach Summary

1. **Inventory components** - List all UI components in the feature
2. **Layer 1: Atomic** - Test each component individually
3. **Layer 2: Composite** - Test component combinations
4. **Layer 3: Flow** - Test complete user workflows
5. **Apply lenses** - CRUD, Persona, State on each layer
