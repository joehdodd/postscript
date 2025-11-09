# Using Coding Guidelines with AI Assistants

## How to Reference Guidelines

### For New Features or Code Generation
When asking an AI assistant to help with your Postscript project, include this instruction:

```
Please follow the coding guidelines in `.github/CODING_GUIDELINES.md` when generating code for this project.
```

### For Specific Areas
You can also reference specific sections:

```
Please follow the Next.js 15 and Tailwind CSS guidelines from `.github/CODING_GUIDELINES.md` when building this component.
```

### For Code Reviews
```
Please review this code against the standards in `.github/CODING_GUIDELINES.md` and suggest improvements.
```

## Example Usage

### Full Context Request
```
I need to create a new user dashboard page for Postscript. Please follow the coding guidelines in `.github/CODING_GUIDELINES.md`, especially:
- Keep components under 200 lines
- Use Tailwind CSS classes instead of inline styles 
- Follow the Next.js 15 App Router patterns
- Use the custom color palette (ps-primary, ps-secondary, etc.)
- Implement proper authentication with requireAuth()
```

### Quick Reference
```
Create a new email settings component following our established patterns from `.github/CODING_GUIDELINES.md`.
```

## What This Ensures

✅ **Consistent styling** using Tailwind and custom color palette
✅ **Proper Next.js 15** patterns (async params, server/client components)
✅ **Component architecture** following single responsibility principle
✅ **TypeScript best practices** with proper typing
✅ **Security patterns** for authentication and data handling
✅ **Performance optimization** following established patterns

## Updating Guidelines

When you discover new patterns or best practices while working on Postscript:

1. Update `.github/CODING_GUIDELINES.md` with the new patterns
2. Include examples of what to do (✅) and what to avoid (❌)
3. Add context about why the pattern is preferred
4. Reference the guidelines in future AI conversations

This ensures your codebase maintains consistency and quality as it grows.