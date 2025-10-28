# Changes Made
1. Removed document.getElementById
Added searchTerm state and used it to display the search value.
2. Made input controlled Added value={searchTerm} to the input to make it a controlled component and reset properly.
3. Fixed promise chain 
Replaced nested .then() calls with async/await and added error handling.
4. Added missing keys
Added key props to mapped elements to avoid React warnings.
5. Fixed variable shadowing 
Renamed filtered result to avoid shadowing the filteredAdvocates state variable.