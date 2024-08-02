// Array of page IDs corresponding to different sections of the application
let currentPage = 0;
const pages = ['error-container', 'login-page', 'landing-page', 'survey-1', 'survey-2', 'survey-3', 'ending-page'];

/**
 * Function to display a specific page and hide others
 * @param {number} pageIndex - Index of the page to show
 * @param {string} errorMessage - Optional error message to display on the error page
 */

export function showPage(pageIndex, errorMessage = '') { 
    pages.forEach((pageId, index) => {      // Iterate through all pages and set their visibility
        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            if (index === pageIndex) {
                pageElement.style.display = 'block';    // Shows selected page
                pageElement.classList.remove('hidden');
                if (index >= 3 && index <= 5) {     // Adds class to survey pages - allows for different styling
                    pageElement.classList.add('survey-page');
                }
            } else {
                pageElement.style.display = 'none';     // Hides all other pages
                pageElement.classList.add('hidden');
                if (index >= 3 && index <= 5) { 
                    pageElement.classList.remove('survey-page');    // Removes class from survey pages when not displayed
                }
            }
        }
    });

    if (pageIndex === 0) {      // If the error page is being shown, display the error message
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.innerText = errorMessage;
            errorMessageElement.style.display = 'block';
        } else {
            console.error('Error message element not found');
        }
    }
}

/**
 * Function to handle option selection on survey pages
 * @param {number} currentPage - Current page index
 * @param {string} answer - Selected answer
 */

export function chooseOption(currentPage, answer) {
    console.log(`Answer selected on page ${currentPage}: ${answer}`);
    currentPage++;      // Assigns the currentPage variable to the next page
    showPage(currentPage);      // Shows the next page
}

/**
 * Function to handle login and signup form submission
 * @param {Event} event - The form submission event
 */

export async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;     // Retrieves values from form
    const password = document.getElementById('password').value;
    const signup = document.getElementById('signup').checked;

    try {
        const response = await fetch('/', {     // Sends a POST request to the server
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, signup })
        });

        const result = await response.json();

        if (signup) {    // Checks if the user is signing up or logging in
            if (result.message === 'User already exists') {
                showPage(0);
            } else {
                showPage(2);
            }
        } else {
            if (result.message === 'Login successful') {
                showPage(2);
            } else {
                showPage(0);
            }
        }
    } catch (error) {
        console.error('Error:', error);     // Log any errors that occur during the request
        document.getElementById('error-container').innerText = 'Internal server error';
    }
}

document.addEventListener('DOMContentLoaded', () => {       // Event listener for DOMContentLoaded to ensure the DOM is fully loaded before attaching event listeners
    document.querySelector('form').addEventListener('submit', async (event) => { // Attaches event listener to form submission
        event.preventDefault();     // Prevents the default form submission
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
    });
});