# Ending and Perspective Components - Backend Integration

This document describes the enhanced Ending and Perspective components that integrate with the backend API to provide dynamic, personalized content for the Chemisee experience.

## Overview

The Ending and Perspective components have been enhanced with:

- Dynamic content loading from the backend API
- Background image support
- Loading states and error handling
- Personalized content based on user journey
- Improved UI/UX with animations and visual feedback
- Multilingual support with fallback content

## Components

### Ending Component

The Ending component serves as the final screen of the user journey, providing closure and thanks to the user for their participation.

#### Features

- **Dynamic Content**: Fetches personalized ending content from the backend
- **Background Images**: Supports dynamic background images from the CMS
- **Celebration Animation**: Animated celebration message with delayed appearance
- **Graceful Fallback**: Falls back to static translations if API fails
- **Loading States**: Shows loading spinner while fetching content
- **Error Handling**: Displays user-friendly error messages

#### Props

```jsx
<Ending goToWelcome={() => setState("welcome")} />
```

- `goToWelcome` (function): Callback to navigate back to welcome screen

#### API Integration

The component uses the `useEndingContent` hook to fetch data from:

```
/api/ending-screen/{id}/
```

The content is structured hierarchically:

```
Welcome → CharacterOverview → ChooseCharacter → IntroSearchAndCollect →
PhotographyScreen → YourCollection → PerspectiveScreen → EndingScreen
```

### Perspective Component

The Perspective component bridges the exploration phase with the upload phase, encouraging users to contribute their photos to the collective gallery.

#### Features

- **Dynamic Content**: Fetches personalized perspective content from the backend
- **Background Images**: Supports dynamic background images from the CMS
- **Content Personalization**: Shows content based on user's selected character/path
- **Responsive Design**: Adapts to different screen sizes
- **Loading States**: Provides visual feedback during content loading
- **Error Recovery**: Handles API failures gracefully

#### Props

```jsx
<Perspective goToUpload={() => setState("upload")} />
```

- `goToUpload` (function): Callback to navigate to upload screen

#### API Integration

The component uses the `usePerspectiveContent` hook to fetch data from:

```
/api/perspective-screen/{id}/
```

## Custom Hooks

### usePerspectiveContent

Hook for fetching perspective screen content.

```jsx
const {
  data: perspectiveData,
  isLoading,
  error,
  isError,
} = usePerspectiveContent()
```

**Returns:**

- `data`: Transformed perspective screen data
- `isLoading`: Boolean loading state
- `error`: Error object if request fails
- `isError`: Boolean error state

### useEndingContent

Hook for fetching ending screen content.

```jsx
const { data: endingData, isLoading, error, isError } = useEndingContent()
```

**Returns:**

- `data`: Transformed ending screen data
- `isLoading`: Boolean loading state
- `error`: Error object if request fails
- `isError`: Boolean error state

## Utilities

### apiUtils.js

Utility functions for API operations:

- `parseRichText(richText)`: Parses various rich text formats
- `navigateToScreen(localeContent, targetType)`: Navigates content hierarchy
- `transformScreenData(screenData, fallbackTitle, fallbackDescription)`: Standardizes screen data
- `handleApiError(error, context)`: Provides user-friendly error messages
- `processImageUrl(imageData, baseUrl)`: Processes and validates image URLs

## Data Structure

### Screen Data Format

Both components expect data in the following format:

```javascript
{
  id: number,
  title: string,
  description: string, // HTML content
  backgroundImage: {
    file: string // URL to image
  },
  locale: string
}
```

### Content Hierarchy

The backend content follows a hierarchical structure:

```
Welcome (Page)
└── CharacterOverview (Page)
    └── ChooseCharacter (Page) × 3
        └── IntroSearchAndCollect (Page)
            └── PhotographyScreen (Page)
                └── YourCollection (Page)
                    └── PerspectiveScreen (Page)
                        └── EndingScreen (Page)
```

## Localization

Both components support multiple languages with fallback behavior:

1. **Primary**: Dynamic content from API in user's language
2. **Fallback**: Static translations from i18n files
3. **Default**: English content as last resort

### Translation Keys

#### Perspective Component

- `perspective.title`
- `perspective.description`
- `perspective.loading`
- `perspective.success`

#### Ending Component

- `ending.title`
- `ending.description`
- `ending.loading`
- `ending.celebration`
- `ending.thankYouMessage`

## Styling

Both components use styled-components with:

- Responsive design patterns
- CSS-in-JS for dynamic styling
- Animation support with keyframes
- Theme-aware color schemes
- Accessibility considerations

### Key Style Features

- **Background Images**: Dynamic background with overlay
- **Loading States**: Opacity transitions during loading
- **Error States**: Distinctive error message styling
- **Animations**: Smooth transitions and celebratory animations
- **Typography**: Consistent font hierarchy using Bricolage Grotesque

## Error Handling

The components implement comprehensive error handling:

1. **Network Errors**: Connection issues, timeouts
2. **API Errors**: Server errors, not found responses
3. **Content Errors**: Missing or malformed content
4. **Image Errors**: Failed image loads, invalid URLs

### Error Recovery

- **Retry Logic**: Automatic retry with exponential backoff
- **Graceful Degradation**: Falls back to static content
- **User Feedback**: Clear error messages in user's language
- **Logging**: Comprehensive error logging for debugging

## Performance Considerations

### Optimizations

- **Image Preloading**: Background images are preloaded
- **Query Caching**: API responses cached for 10 minutes
- **Lazy Loading**: Content loaded only when needed
- **Memory Management**: Proper cleanup of resources

### Bundle Size

- **Tree Shaking**: Only required utilities are bundled
- **Code Splitting**: Components can be lazy-loaded
- **Asset Optimization**: Images processed through build pipeline

## Testing

### Component Testing

Test both components for:

- Rendering with mock data
- Loading states
- Error states
- User interactions
- API integration

### Hook Testing

Test custom hooks for:

- Data fetching
- Error handling
- Retry logic
- Caching behavior

### Integration Testing

Test the complete flow:

- API data fetching
- Content transformation
- UI rendering
- User navigation

## Development Workflow

1. **Backend First**: Ensure CMS content is populated
2. **API Testing**: Verify API endpoints return expected data
3. **Component Development**: Build components with mock data
4. **Integration**: Connect components to real API
5. **Testing**: Comprehensive testing across scenarios
6. **Optimization**: Performance and accessibility improvements

## Troubleshooting

### Common Issues

1. **Content Not Loading**
   - Check API endpoint availability
   - Verify content hierarchy in CMS
   - Check console for API errors

2. **Images Not Displaying**
   - Verify image URLs are accessible
   - Check CORS configuration
   - Validate image file formats

3. **Translation Issues**
   - Ensure translation files are complete
   - Check i18n configuration
   - Verify language detection

### Debug Mode

Enable debug logging by setting:

````javascript
```javascript
// Enable debug logging in browser console
localStorage.setItem("DEBUG", "chemisee:*")
````

```

This will show detailed API request/response logging and component state changes.
```
