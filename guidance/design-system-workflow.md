# WordPress Design System Workflow Guidance

TBD: This guidance file is in progress and needs to be expanded.

## Overview

The WordPress Design System (WPDS) provides a comprehensive set of components, patterns, and guidelines for building consistent WordPress experiences. This document outlines workflow guidance and component recommendations for design system work.

## Workflow Guidance

### 1. Component Selection Process

**Before starting any design system work:**

1. **Review existing components**: Always check the component library first before building custom solutions
   - Use `list_components` tool to see available components
   - Review component documentation and Storybook stories
   - Check component variants and states

2. **Identify requirements**: Document what you need
   - Interaction patterns required
   - Accessibility requirements
   - Responsive behavior needs
   - Data handling requirements

3. **Map to components**: Match requirements to existing components
   - Primary component selection
   - Supporting components needed
   - Any composition patterns

### 2. Implementation Best Practices

**When using design system components:**

- **Always use the latest versions**: Check for component updates regularly
- **Follow composition patterns**: Use components together as documented
- **Maintain accessibility**: All components include accessibility features - don't override them
- **Respect design tokens**: Use design system colors, spacing, and typography
- **Test across breakpoints**: Ensure responsive behavior works as expected

### 3. Customization Guidelines

**When components need customization:**

1. **Check component props first**: Many components accept customization props
2. **Use design tokens**: For colors, spacing, typography - use tokens, not hardcoded values
3. **Extend, don't override**: Build on top of components rather than replacing them
4. **Contribute back**: If you build something reusable, consider contributing it back to the design system

### 4. Component Recommendations

#### Form Components
- **FormInput**: For text inputs, emails, passwords
- **FormSelect**: For dropdown selections
- **FormTextarea**: For multi-line text input
- **FormCheckbox**: For single or multiple selections
- **FormRadio**: For single choice selections
- **Button**: For form submissions (use appropriate variants)

#### Layout Components
- **Card**: For content containers with elevation
- **Grid**: For responsive grid layouts
- **Stack**: For vertical or horizontal spacing
- **Container**: For content width constraints

#### Navigation Components
- **Navigation**: For primary site navigation
- **Breadcrumbs**: For hierarchical navigation
- **Pagination**: For paginated content
- **Tabs**: For content organization

#### Feedback Components
- **Notice**: For informational messages and alerts
- **Spinner**: For loading states
- **ProgressBar**: For progress indication
- **Modal**: For dialog boxes and overlays

#### Content Components
- **Heading**: For semantic headings (h1-h6)
- **Text**: For body text with typography variants
- **Badge**: For labels and tags
- **Avatar**: For user profile images
- **Divider**: For visual separation

#### Interactive Components
- **Button**: Primary, secondary, tertiary variants
- **Link**: For navigation and external links
- **IconButton**: For icon-only actions
- **Toggle**: For on/off states
- **Dropdown**: For menus and options

## Common Patterns

### Form Patterns
- Always use FormInput, FormSelect, etc. for form fields
- Group related fields using Card or Stack
- Use Button with appropriate variant for actions
- Show validation states using Notice components

### Card Patterns
- Use Card for content blocks
- Combine with Stack for internal spacing
- Use Grid for card layouts
- Add Button or Link for actions

### Modal Patterns
- Use Modal for critical actions or additional information
- Include primary and secondary actions
- Use FormInput for modal forms
- Always provide close mechanism

### Data Display Patterns
- Use Table for structured data
- Use Card for content cards
- Combine with Pagination for large datasets
- Use Badge for status indicators

## Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible and clear
- [ ] ARIA labels are provided where needed
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announcements are appropriate
- [ ] Form validation messages are associated with inputs

## Performance Considerations

- **Lazy load**: Use code splitting for component-heavy pages
- **Optimize imports**: Import only needed components
- **Bundle size**: Monitor bundle impact when adding components
- **Images**: Use optimized image components when available

## Testing Recommendations

- Test component interactions and states
- Verify responsive behavior across breakpoints
- Validate accessibility with keyboard navigation
- Test with screen readers
- Verify form validation works correctly
- Check loading and error states

## Getting Help

- Check component Storybook documentation
- Review design system guidelines
- Ask in design system channels
- Review component source code for examples
