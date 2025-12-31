# Components Guide - Part 4 Complete ✅

## Overview

A complete UI component library has been built with consistent styling, dark mode support, and accessibility features.

## 🎨 UI Components Library

All components are located in `src/components/ui/` and can be imported from `@/components/ui`.

### Button Component

**Location**: `src/components/ui/button.tsx`

Flexible button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui'

// Variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Danger Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Loading...</Button>

// With icon
<Button>
  <span className="material-symbols-outlined">add</span>
  <span>Create Post</span>
</Button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- All standard HTML button attributes

---

### Card Component

**Location**: `src/components/ui/card.tsx`

Container component with consistent styling and shadows.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>

// Simple usage
<Card>
  <p>Content directly in card</p>
</Card>
```

---

### Input Component

**Location**: `src/components/ui/input.tsx`

Text input with error state support.

```tsx
import { Input } from '@/components/ui'

<Input 
  type="text"
  placeholder="Enter text..."
  error="This field is required"
/>

<Input 
  type="email"
  placeholder="email@example.com"
/>
```

**Props**:
- `error`: string (displays error message below input)
- All standard HTML input attributes

---

### Textarea Component

**Location**: `src/components/ui/textarea.tsx`

Multi-line text input.

```tsx
import { Textarea } from '@/components/ui'

<Textarea 
  placeholder="Write your post..."
  rows={4}
  error="Content is required"
/>
```

---

### Select Component

**Location**: `src/components/ui/select.tsx`

Dropdown select input.

```tsx
import { Select } from '@/components/ui'

<Select error="Please select an option">
  <option value="">Select platform...</option>
  <option value="twitter">Twitter</option>
  <option value="facebook">Facebook</option>
</Select>
```

---

### Label Component

**Location**: `src/components/ui/label.tsx`

Form label with optional required indicator.

```tsx
import { Label } from '@/components/ui'

<Label htmlFor="email" required>
  Email Address
</Label>
<Input id="email" type="email" />
```

---

### Badge Component

**Location**: `src/components/ui/badge.tsx`

Status badges with color variants.

```tsx
import { Badge } from '@/components/ui'

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
```

---

### Modal Component

**Location**: `src/components/ui/modal.tsx`

Overlay dialog for focused interactions.

```tsx
import { Modal } from '@/components/ui'
import { useState } from 'react'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="Optional description"
        size="md" // sm, md, lg, xl
      >
        <p>Modal content goes here</p>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </Modal>
    </>
  )
}
```

**Features**:
- Closes on ESC key
- Closes on backdrop click
- Locks body scroll when open
- Smooth animations
- Multiple sizes

---

### Toast Notifications

**Location**: `src/components/ui/toast.tsx`

Toast notifications are managed globally via context.

```tsx
'use client'

import { useToast } from '@/components/providers/toast-provider'

function MyComponent() {
  const toast = useToast()

  return (
    <div>
      <Button onClick={() => toast.success('Success!')}>
        Show Success
      </Button>
      <Button onClick={() => toast.error('Error occurred')}>
        Show Error
      </Button>
      <Button onClick={() => toast.warning('Warning!')}>
        Show Warning
      </Button>
      <Button onClick={() => toast.info('Info message')}>
        Show Info
      </Button>
    </div>
  )
}
```

**Methods**:
- `toast.success(message)` - Green success toast
- `toast.error(message)` - Red error toast
- `toast.warning(message)` - Yellow warning toast
- `toast.info(message)` - Blue info toast
- `toast.addToast({ type, message, duration })` - Custom toast

---

## 🎭 Application Components

### EmptyState Component

**Location**: `src/components/empty-state.tsx`

Placeholder for empty states with icon, title, description, and optional action.

```tsx
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui'

<EmptyState
  icon="post_add"
  title="No posts yet"
  description="Create your first post to get started."
  action={
    <Button>Create Post</Button>
  }
/>
```

---

### PlatformIcon Component

**Location**: `src/components/platform-icon.tsx`

Display platform icons with consistent styling.

```tsx
import { PlatformIcon } from '@/components/platform-icon'

<PlatformIcon platform="twitter" size="md" />
<PlatformIcon platform="facebook" size="lg" showName />
```

**Props**:
- `platform`: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
- `size`: 'sm' | 'md' | 'lg'
- `showName`: boolean (shows platform name)

---

### StatusBadge Component

**Location**: `src/components/status-badge.tsx`

Display status with color-coded badges.

```tsx
import { StatusBadge } from '@/components/status-badge'

// Post status
<StatusBadge status="pending" type="post" />
<StatusBadge status="published" type="post" />
<StatusBadge status="failed" type="post" />

// Connection status
<StatusBadge status="active" type="connection" />
<StatusBadge status="reconnect_needed" type="connection" />
<StatusBadge status="inactive" type="connection" />
```

---

### LoadingSpinner Component

**Location**: `src/components/loading-spinner.tsx`

Simple loading indicator.

```tsx
import { LoadingSpinner } from '@/components/loading-spinner'

<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
```

---

### Navbar Component

**Location**: `src/components/navbar.tsx`

Application header with navigation and user menu.

```tsx
import { Navbar } from '@/components/navbar'

// In your layout or page
<Navbar />
```

**Features**:
- Shows different content for authenticated/unauthenticated users
- Theme toggle
- User button with profile dropdown
- Responsive navigation links

---

### ThemeToggle Component

**Location**: `src/components/theme-toggle.tsx`

Toggle between light and dark modes.

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

---

## 🎨 Providers

### ThemeProvider

**Location**: `src/components/providers/theme-provider.tsx`

Manages application theme state.

```tsx
'use client'

import { useTheme } from '@/components/providers/theme-provider'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

**Features**:
- Light/dark/system modes
- Persists to localStorage
- Listens to system preference changes
- No flash on page load

---

### ToastProvider

**Location**: `src/components/providers/toast-provider.tsx`

Manages toast notifications globally.

Already covered in Toast Notifications section above.

---

## 📁 Component Structure

```
src/components/
├── ui/                         # Reusable UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── select.tsx
│   ├── label.tsx
│   ├── badge.tsx
│   ├── modal.tsx
│   ├── toast.tsx
│   └── index.ts              # Barrel export
├── providers/                 # Context providers
│   ├── theme-provider.tsx
│   └── toast-provider.tsx
├── navbar.tsx                # App navigation
├── user-button.tsx           # User profile menu
├── theme-toggle.tsx          # Theme switcher
├── loading-spinner.tsx       # Loading indicator
├── empty-state.tsx          # Empty state placeholder
├── platform-icon.tsx        # Social platform icons
├── status-badge.tsx         # Status indicators
└── protected-route.tsx      # Auth wrapper
```

## 🎨 Design Tokens

### Colors

Defined in `tailwind.config.ts`:

```ts
colors: {
  primary: '#2463eb',           // Main brand blue
  'background-light': '#f6f6f8',
  'background-dark': '#111621',
  'card-dark': '#1e2532',
  'text-primary-light': '#0f172a',
  'text-primary-dark': '#f1f5f9',
  'text-secondary-light': '#64748b',
  'text-secondary-dark': '#94a3b8',
}
```

### Typography

- **Font**: Inter (loaded from Google Fonts)
- **Font weights**: Regular (400), Medium (500), Semibold (600), Bold (700), Black (900)

### Spacing

Uses Tailwind's default spacing scale (4px increments).

### Border Radius

- Default: 0.25rem (4px)
- Large: 0.5rem (8px)
- XL: 0.75rem (12px)
- Full: 9999px (circles)

---

## ♿ Accessibility Features

All components include:
- ✅ Semantic HTML
- ✅ ARIA labels where appropriate
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Color contrast compliance (WCAG AA)

---

## 🌙 Dark Mode Support

All components automatically adapt to dark mode via:
- Tailwind's `dark:` variant
- Theme context provider
- Persistent theme preference
- System preference detection

---

## 📱 Responsive Design

Components are mobile-first and responsive:
- Mobile (default)
- Tablet (`md:` breakpoint at 768px)
- Desktop (`lg:` breakpoint at 1024px)
- Large desktop (`xl:` breakpoint at 1280px)

---

## 🔧 Usage Examples

### Form with Validation

```tsx
'use client'

import { useState } from 'react'
import { Button, Input, Label, Card } from '@/components/ui'
import { useToast } from '@/components/providers/toast-provider'

export function MyForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }

    // Submit logic
    toast.success('Form submitted successfully!')
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="email" required>Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Card>
  )
}
```

### Modal with Confirmation

```tsx
'use client'

import { useState } from 'react'
import { Button, Modal } from '@/components/ui'

export function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = () => {
    // Delete logic
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        description="Are you sure? This action cannot be undone."
        size="sm"
      >
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}
```

---

## 🚀 Next Steps (Part 5)

With the component library ready, we'll now focus on specific features:
1. Enhanced authentication pages
2. Post creation form
3. Connection management UI
4. Scheduled posts list view
5. Time picker component

---

**Status**: ✅ Part 4 Complete - Component library ready for use!
