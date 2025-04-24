# Atom Components

Atom components are the smallest building blocks of the UI. They are simple, reusable components that serve a single purpose.

## Structure

Each atom component follows this folder structure:

\`\`\`
ComponentName/
  ├── ComponentName.tsx
  └── ComponentName.css
\`\`\`

## Available Components

- Avatar - User profile images
- Badge - Small status indicators
- Button - Interactive buttons
- Card - Container for content
- Checkbox - Selection control
- Dropdown - Expandable selection menu
- Icon - Visual symbols
- Input - Text input fields
- Label - Text labels for form elements
- Modal - Dialog windows
- Popover - Contextual overlays
- Progress - Progress indicators
- Radio - Single selection controls
- Select - Dropdown selection
- Slider - Range selection
- Switch - Toggle controls
- Tabs - Content organization
- TextArea - Multiline text input
- ThemeProvider - Theme context provider
- Toast - Notification messages
- Toaster - Toast message container
- Tooltip - Contextual information
- UseToast - Hook for toast functionality

## Usage

Import atom components directly from their folders:

\`\`\`tsx
import { Button } from '../components/atoms/Button/Button';
\`\`\`

Or set up barrel exports for cleaner imports.
\`\`\`

This documentation will help developers understand the atom components and how to use them in the project.
