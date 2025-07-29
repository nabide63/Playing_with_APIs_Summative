# Playing_with_APIs_Summative
Summative submission May 2025 trimester




CycleCare
CycleCare is a web-based period tracking application designed for users in Kigali, Rwanda. It allows users to track their menstrual cycles, log symptoms, receive personalized health suggestions, and find local stores for menstrual products. The app features a responsive, pink-themed interface with enhanced navigation and is built using HTML, CSS, and JavaScript with localStorage for data persistence.
Features

User Authentication: Sign up and log in using email, password, name, and phone number, stored in localStorage.
Period Tracking: Input the last period date to predict the next cycle (assuming a 28-day cycle).
Symptom Logging: Log symptoms (e.g., cramps, headache) and receive food, medication, and lifestyle suggestions powered by Nutritionix and FDA APIs.
Store Listings: View a list of Kigali-based stores with logos and links to purchase menstrual products.
Responsive Design: Mobile-friendly interface with a hamburger menu, gradient navigation, and smooth animations.
Pink-Themed UI: Consistent aesthetic with pink accents (#ff69b4, #ff85c1, #fce4ec) and Font Awesome icons.

Prerequisites

A modern web browser (e.g., Chrome, Firefox, Edge).
An internet connection for loading Font Awesome icons, store logos, and API calls.
Optional: A local server (e.g., Live Server extension in VS Code) for development.
API key for Nutritionix API (sign up at https://developer.nutritionix.com/).

Setup Instructions

Clone or Download the Repository:
git clone <repository-url>

Alternatively, download the project files as a ZIP and extract them.

Serve the Application:

Option 1: Open index.html directly in a browser (note: some features may require a server due to CORS).
Option 2: Use a local server:
Install VS Code and the Live Server extension.
Right-click index.html and select "Open with Live Server".
Alternatively, use a tool like http-server:npm install -g http-server
http-server

Access the app at http://localhost:8080.




Configure Nutritionix API:

Sign up at https://developer.nutritionix.com/ to obtain an API key and App ID.
Update script.js with your credentials:const appId = 'your-app-id';
const appKey = 'your-app-key';




Ensure Internet Access:

The app requires an internet connection for:
Font Awesome icons (https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css).
Nutritionix API (https://trackapi.nutritionix.com/v2/search/instant).
FDA API (https://api.fda.gov/drug/label.json).
Store logos (external URLs).





Usage

Sign Up:

Navigate to signup.html.
Enter your name, email, password (minimum 6 characters), and 10-digit phone number.
Submit to create an account and redirect to the login page.


Log In:

On login.html, enter your email and password.
Successful login redirects to the home page (index.html).


Track Your Period:

Go to tracking.html.
Select the date of your last period and click "Save Date".
View the predicted next period date (based on a 28-day cycle).
Clear the saved date if needed.


Log Symptoms:

On index.html, select symptoms (e.g., cramps, headache) and submit.
Receive personalized suggestions for food, over-the-counter medications, and lifestyle tips.
Suggestions are saved in localStorage and persist across sessions.


Find Stores:

Visit stores.html to view a list of Kigali-based stores offering menstrual products.
Each store card includes a logo, description, address, and a link to the store’s website.


Logout:

Click the "Logout" button in the navigation bar to return to login.html.



File Structure
CycleCare/
├── index.html        # Home page with symptom logging
├── tracking.html     # Period tracking page
├── stores.html       # Store listings with logos
├── login.html        # Login page
├── signup.html       # Signup page
├── style.css         # Global styles with pink-themed UI and responsive design
├── script.js         # Logic for home page (symptom logging, API calls)
├── tracking.js       # Logic for period tracking
├── stores.js         # Logic for store listings
├── login.js          # Logic for login functionality
├── signup.js         # Logic for signup functionality
└── README.md         # Project documentation

Dependencies

Font Awesome 6.5.1: Used for icons in navigation and store cards.<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">


Nutritionix API: Provides food suggestions based on symptom keywords.
Endpoint: https://trackapi.nutritionix.com/v2/search/instant


FDA API: Provides over-the-counter medication suggestions.
Endpoint: https://api.fda.gov/drug/label.json



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make changes and commit (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Create a pull request with a clear description of your changes.

Please ensure code follows the existing style (e.g., consistent pink theme, responsive design) and includes tests for new features.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact (Whatsapp) +256787702708
For questions or suggestions, please open an issue on the repository or contact the project maintainer at [y.nabide@alustudent.com].