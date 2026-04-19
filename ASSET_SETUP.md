# Asset Setup Instructions

## Files to Copy

Please copy the following file from the project root to `client/src/assets/`:

```
File Searching.gif → client/src/assets/file-searching.gif
```

**Note:** Make sure to rename the file to `file-searching.gif` (lowercase, no spaces) to match the import statement in the components.

## Logo Update

✅ The magnifying glass logo has been automatically set as the official logo:
- Saved as: `client/src/assets/magnifying-glass-logo.svg`
- Used in: Header component and Navbar component
- Already imported and configured

## Usage

The searching GIF is now ready to use in components:

```jsx
import SearchingState from "../components/SearchingState";

<SearchingState 
  message="Finding matching papers..."
  description="This may take a few moments"
/>
```

## Where This is Used

You can incorporate the `SearchingState` component in:
1. **AssignedPapers page** - When loading assigned papers
2. **AdminPaperDetails page** - When analyzing submissions
3. **EditorDashboard page** - When processing decisions
4. **Any list loading state** - As an alternative to the spinner

---

**Quick Setup:**
1. Copy `File Searching.gif` from project root
2. Paste it in `client/src/assets/`
3. Rename to `file-searching.gif`
4. Done! The component will now work perfectly
