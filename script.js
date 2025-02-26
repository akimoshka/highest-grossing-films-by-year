'use strict'; // Prevent common errors

let moviesData = []; // Declare an array to store movie data globally

// Wait for the DOM to load before executing the script
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the JSON file containing movie data
    fetch("movies.json")
        .then(response => response.json())
        .then(movies => {
            moviesData = movies; // Store the fetched movies in the global array
            displayMovies(movies); // Display movies in the table
            addRowClickHandlers(); // Add click handlers to rows for popups
        })
        .catch(error => console.error("Error loading movies:", error));

    // Add sorting functionality to the sorting buttons
    document.querySelectorAll(".sort-btn").forEach(button => {
        button.addEventListener("click", function () {
            const column = this.getAttribute("data-column"); // Get the column to sort by
            const order = this.getAttribute("data-order"); // Get the sorting order (asc/desc)

            // Sort a copy of moviesData to avoid modifying the original data
            let sortedMovies = [...moviesData].sort((a, b) => {
                let valA = a[column];
                let valB = b[column];

                // Convert string values to lowercase to ensure case-insensitive sorting
                if (typeof valA === "string") valA = valA.toLowerCase();
                if (typeof valB === "string") valB = valB.toLowerCase();

                return order === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
            });

            displayMovies(sortedMovies); // Display sorted movies
            addRowClickHandlers(); // Reattach click handlers after re-rendering
        });
    });

    // Add search functionality
    document.querySelectorAll(".search-input").forEach(input => {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") { // Trigger search when pressing Enter
                filterMovies(moviesData);
                addRowClickHandlers(); // Reattach click handlers after filtering
            }
        });
    });

    // Close popup when clicking the close button
    document.querySelector(".close-btn").addEventListener("click", function () {
        document.getElementById("popup").style.display = "none";
    });

    // Close popup when clicking outside of it
    window.addEventListener("click", function (event) {
        const popup = document.getElementById("popup");
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});

// Add event listeners to each row to open the popup when clicked
function addRowClickHandlers() {
    document.querySelectorAll("#movies-table tbody tr").forEach(row => {
        row.addEventListener("click", function () {
            const movieTitle = this.cells[0].innerText; // Get the movie title from the first column
            const movie = moviesData.find(m => m.title === movieTitle); // Find the corresponding movie object
            if (movie) {
                showPopup(movie); // Show movie details in a popup
            }
        });
    });
}

// Display movie details in a popup
function showPopup(movie) {
    const popupBody = document.getElementById("popup-body");
    popupBody.innerHTML = `
        <h2 class="popup-title">${movie.title}</h2>
        <div class="popup-info">
            <div class="popup-row"><span class="popup-label">Year:</span> <span class="popup-value">${movie.release_year}</span></div>
            <div class="popup-row"><span class="popup-label">Director:</span> <span class="popup-value">${movie.director || "N/A"}</span></div>
            <div class="popup-row"><span class="popup-label">Budget:</span> <span class="popup-value">${formatCurrency(movie.budget)}</span></div>
            <div class="popup-row"><span class="popup-label">Box Office:</span> <span class="popup-value">${formatCurrency(movie.box_office)}</span></div>
            <div class="popup-row"><span class="popup-label">Production Company:</span> <span class="popup-value">${movie.production_company || "N/A"}</span></div>
            <div class="popup-row"><span class="popup-label">Distributor:</span> <span class="popup-value">${movie.distributed_by || "N/A"}</span></div>
            <div class="popup-row"><span class="popup-label">Runtime:</span> <span class="popup-value">${movie.running_time || "N/A"}</span></div>
            <div class="popup-row"><span class="popup-label">Languages:</span> <span class="popup-value">${movie.languages || "N/A"}</span></div>
        </div>
    `;
    document.getElementById("popup").style.display = "flex"; // Show the popup
}

// Filter movies based on user input in search fields
function filterMovies(movies) {
    const filters = {}; // Store search criteria

    document.querySelectorAll(".search-input").forEach(input => {
        const column = input.getAttribute("data-column"); // Get the column to filter by
        const value = input.value.trim().toLowerCase(); // Get the search input and normalize it
        if (value) filters[column] = value; // Store the filter value if it's not empty
    });

    // Filter movies based on the entered search values
    const filteredMovies = movies.filter(movie => {
        return Object.keys(filters).every(column => {
            return String(movie[column]).toLowerCase().includes(filters[column]); // Case-insensitive search
        });
    });

    displayMovies(filteredMovies); // Display the filtered movies
}

// Populate the table with movies
function displayMovies(movies) {
    const tbody = document.querySelector("#movies-table tbody");
    tbody.innerHTML = ""; // Clear the row before inserting new ones

    movies.forEach(movie => {
        const row = document.createElement("tr"); // Create a new row
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.release_year}</td>
            <td>${movie.director || "N/A"}</td>
            <td>${formatCurrency(movie.budget)}</td>
            <td>${formatCurrency(movie.box_office)}</td>
            <td>${movie.production_company || "N/A"}</td>
            <td>${movie.distributed_by || "N/A"}</td>
            <td>${movie.running_time || "N/A"}</td>
            <td>${movie.languages || "N/A"}</td>
        `;
        tbody.appendChild(row); // Send the row to the table
    });
}

// Format currency values for budget and box office
function formatCurrency(value) {
    return value ? `$${Number(value).toLocaleString()}` : "N/A"; // Convert to currency format or return "N/A"
}