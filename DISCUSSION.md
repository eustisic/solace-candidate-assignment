# Changes Made

### fe-edits
1. Removed document.getElementById
Added searchTerm state and used it to display the search value.
2. Made input controlled Added value={searchTerm} to the input to make it a controlled component and reset properly.
3. Fixed promise chain 
Replaced nested .then() calls with async/await and added error handling.
4. Added missing keys
Added key props to mapped elements to avoid React warnings.
5. Fixed variable shadowing 
Renamed filtered result to avoid shadowing the filteredAdvocates state variable.
6. Add styling
7. Add collapsible rows

### be-edits
1. Added indexes on commonly searched/filtered columns. Indexes will improve query performance for searching and filtering advocates by these fields. Added GIN index on JSONB payload column for efficient array searching
2. Added search functionality across all fields and added pagination
3. Removed client-side filtering to use API search
4. Added pagination views 