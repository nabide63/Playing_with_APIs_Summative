Playing_with_APIs_Summative
Summative submission May 2025 trimester

*Overview*
CycleCare is a web-based period tracking application designed for users in Kigali, Rwanda. It allows users to track their menstrual cycles, log symptoms, receive personalized health suggestions, and find local stores for menstrual products. The app features a responsive, pink-themed interface with enhanced navigation and is built using HTML, CSS, and JavaScript with localStorage for data persistence. This application is containerized using Docker, deployed on two Ubuntu-based web servers with Nginx, and balanced using an HAProxy container with a round-robin algorithm. SSL termination is configured on the web servers to ensure secure HTTPS communication.
Features

User Authentication: Sign up and log in using email, password, name, and phone number, stored in localStorage.
Period Tracking: Input the last period date to predict the next cycle (assuming a 28-day cycle).
Symptom Logging: Log symptoms (e.g., cramps, headache) and receive food, medication, and lifestyle suggestions powered by Nutritionix and FDA APIs.
Store Listings: View a list of Kigali-based stores with logos and links to purchase menstrual products.
Responsive Design: Mobile-friendly interface with a hamburger menu, gradient navigation, and smooth animations.
Pink-Themed UI: Consistent aesthetic with pink accents (#ff69b4, #ff85c1, #fce4ec) and Font Awesome icons.

***Video Demo Link***
https://youtu.be/k1JuWk67C-k


APIs Used

Nutritionix API: Provides food suggestions based on symptom keywords.
Official Documentation: Nutritionix API
Purpose: Enhances symptom logging with dietary recommendations.


FDA API: Provides over-the-counter medication suggestions.
Official Documentation: FDA API
Purpose: Offers medication advice based on logged symptoms.


Clue API: Used for retrieving menstrual cycle data and predictions.
Official Documentation: Clue API Documentation
Purpose: Fetches user-specific cycle data, including period start dates, cycle length, and ovulation predictions.


Google Calendar API: Enables users to sync cycle events with their Google Calendar for reminders and planning.
Official Documentation: Google Calendar API Documentation
Purpose: Allows seamless integration of cycle-related events (e.g., period start/end, ovulation) into users' calendars.



Development Challenges and Solutions

API Availability and Scope:
Challenge: Initially struggled to find suitable APIs for period tracking and symptom suggestions, with many requiring paid subscriptions or lacking comprehensive data.
Solution: Integrated free tiers of Nutritionix, FDA, Clue, and Google Calendar APIs, adapting the app to leverage their combined capabilities despite initial limitations.


Local Data Persistence:
Challenge: Ensuring data (e.g., user credentials, symptoms) persisted across sessions without a backend database.
Solution: Utilized localStorage for client-side storage, with encryption for sensitive data using Crypto-JS.


Cross-Origin Issues:
Challenge: API calls faced CORS issues when running locally.
Solution: Configured a local server with CORS headers and tested with a proxy server during development.



Getting Started Locally
Prerequisites

A modern web browser (e.g., Chrome, Firefox, Edge).
An internet connection for loading Font Awesome icons, store logos, and API calls.
Docker and Docker Compose.
API keys for Nutritionix, FDA, Clue, and Google Calendar (sign up at respective developer portals).

Installation

Clone the repository:
git clone git@github.com:nabide63/Playing_with_APIs_Summative.git
cd Playing_with_APIs_Summative


Create a .env file in the project root with your API keys:
echo "NUTRITIONIX_APP_ID=your_app_id\nNUTRITIONIX_API_KEY=your_api_key\nFDA_API_KEY=your_api_key\nCLUE_API_KEY=your_api_key\nGOOGLE_API_KEY=your_api_key" > .env


Install dependencies:
npm install


Run the application locally:
npm start

Access the app at http://localhost:8080.


Docker Image Details

Docker Hub Repository: https://hub.docker.com/repositories/nabide63
Image Name and Tags:
nabide63/playing_with_apis_summative-lb-01: Load balancer image, tagged latest.
nabide63/playing_with_apis_summative-web-01: Web server 1 image, tagged latest.
nabide63/playing_with_apis_summative-web-02: Web server 2 image, tagged latest.



Build Instructions
To build the Docker images locally:
docker build -t nabide63/playing_with_apis_summative-web-01:latest -f Dockerfile.web .
docker build -t nabide63/playing_with_apis_summative-web-02:latest -f Dockerfile.web .
docker build -t nabide63/playing_with_apis_summative-lb-01:latest -f Dockerfile.lb .

Run Instructions
To run the application on Web01/Web02:
docker run -d --name cyclecare-web -p 443:443 --env-file .env -v /etc/ssl/certs:/etc/ssl/certs:ro nabide63/playing_with_apis_summative-web-01:latest

For the load balancer (on a separate server):
docker run -d --name cyclecare-lb -p 443:443 -v /etc/ssl/certs:/etc/ssl/certs:ro nabide63/playing_with_apis_summative-lb-01:latest

Deployment on Web Servers
The application is deployed on two Ubuntu servers (Web01 and Web02) running Docker containers with Nginx for serving the app and handling SSL termination.
SSL Termination

SSL certificates are stored in /etc/ssl/certs on Web01 and Web02.
Nginx is configured to redirect HTTP to HTTPS and serve requests over TLS.

Example Nginx configuration snippet (in /etc/nginx/sites-available/cyclecare):
server {
    listen 80;
    server_name cyclecare.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name cyclecare.example.com;

    ssl_certificate /etc/ssl/certs/fullchain.pem;
    ssl_certificate_key /etc/ssl/certs/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header X-Served-By cyclecare-$hostname;
    }
}

Reload Nginx after changes:
sudo nginx -s reload

Load Balancer Configuration
An HAProxy container runs on a separate Ubuntu server to distribute traffic between Web01 and Web02 using the round-robin algorithm.
HAProxy Configuration Snippet
In /etc/haproxy/haproxy.cfg:
frontend https_front
    bind *:443 ssl crt /etc/ssl/certs/haproxy.pem
    mode http
    default_backend web_servers

backend web_servers
    mode http
    balance roundrobin
    server web01 web01.example.com:443 check ssl verify none
    server web02 web02.example.com:443 check ssl verify none

Reload HAProxy after changes:
docker exec cyclecare-lb haproxy -f /etc/haproxy/haproxy.cfg -p /var/run/haproxy.pid -sf $(cat /var/run/haproxy.pid)

Testing Load Balancing
To verify round-robin load balancing:

Send multiple requests to the load balancer IP using curl:
curl -I https://loadbalancer.example.com


Inspect the X-Served-By response header:

Alternates between cyclecare-web01 and cyclecare-web02, confirming round-robin distribution.
Evidence provided in the attached screenshot showing alternating X-Served-By: web01 and X-Served-By: web02 headers.

***Attached Screenshot***
![WhatsApp Image 2025-07-31 at 23 00 39_636e2a89](https://github.com/user-attachments/assets/bd8fa80d-e503-47d1-9c42-0e69b25de3bd)


Hardening: Secrets Management
To avoid baking API keys into the Docker image:

Use environment variables passed via --env-file or Docker secrets.
Store the .env file securely outside the repository.
On Web01/Web02, use a secrets management tool like HashiCorp Vault to inject API keys at runtime.

Example using Docker secrets:
echo "your_api_key" | docker secret create nutritionix_api_key -

Update docker run command:
docker run -d --name cyclecare-web -p 443:443 --secret nutritionix_api_key -e NUTRITIONIX_API_KEY=/run/secrets/nutritionix_api_key nabide63/playing_with_apis_summative-web-01:latest

File Structure
Playing_with_APIs_Summative/
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
├── Dockerfile.web    # Dockerfile for web servers
├── Dockerfile.lb     # Dockerfile for load balancer
└── README.md         # Project documentation

Dependencies

Font Awesome 6.5.1: Used for icons in navigation and store cards. (Font Awesome)
Crypto-JS: For encrypting sensitive data in localStorage. (Crypto-JS)
Nginx: For serving the application and SSL termination. (Nginx)
HAProxy: For load balancing. (HAProxy)
Docker: For containerization. (Docker)
Let’s Encrypt: For providing free SSL certificates. (Let’s Encrypt)

Credits

Nutritionix API Developers: Thank you for the Nutritionix API, enabling dietary suggestions.
FDA API Team: Gratitude for the FDA API, providing medication insights.
Clue API Developers: Thanks for the Clue API, enhancing cycle predictions.
Google Calendar API Team: Appreciation for the Google Calendar API, enabling event syncing.
Font Awesome Team: For the iconic design elements.
Stack Overflow Community: For debugging assistance during development.

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
Contact
For questions or suggestions, please open an issue on the repository or contact the project maintainer at y.nabide@alustudent.com or WhatsApp at +256787702708.
