# Configuration Guide

## Embeddable Code Format

```html
<inmojo-events
  primary-color="#007bff"
  secondary-color="#6c757d"
  search-enabled="true"
  filter-type="upcoming">
</inmojo-events>
<script src="https://embed.inmojo.at/main.js"></script>
```

## Available Components

1. `inmojo-events` - Display events
2. `inmojo-tasks` - Display tasks
3. `inmojo-organizations` - Display organizations

## Configuration Parameters

### Common Parameters

- `primary-color`: Primary theme color (hex code)
- `secondary-color`: Secondary theme color (hex code)
- `background-color`: Background color (hex code)
- `font-family`: Custom font family
- `border-radius`: Border radius for elements
- `padding`: Component padding

### Event Component Parameters

- `search-enabled`: Enable/disable search (true/false)
- `filter-type`: Type of events to show (upcoming/past/all)
- `sort-by`: Sort order (date/name)
- `limit`: Number of events to display

### Task Component Parameters

- `status-filter`: Filter by status (all/active/completed)
- `priority-filter`: Filter by priority
- `sort-by`: Sort order (due-date/priority)

### Organization Component Parameters

- `category-filter`: Filter by category
- `sort-by`: Sort order (name/category)
- `show-description`: Show/hide descriptions

## Styling

Components can be styled using CSS custom properties:

```css
inmojo-events {
  --inmojo-primary-color: #007bff;
  --inmojo-secondary-color: #6c757d;
  --inmojo-background-color: #ffffff;
  --inmojo-font-family: Arial, sans-serif;
  --inmojo-border-radius: 4px;
  --inmojo-padding: 16px;
}
```

## Responsive Design

Components are responsive by default and will adapt to their container width.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest) 