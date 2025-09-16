AI Resume Analyzer
A clean, focused application that analyzes a resume against a job description using the Google Gemini AI. This project is made demonstrate core concepts of frontend-backend communication and API .

✨ Core Features
File Upload: Accepts a resume in PDF or DOCX format.

AI Analysis: Sends the resume and a job description to the Google Gemini API for processing.

Direct Feedback: Displays a match score, extracted skills, and improvement suggestions.

🛠️ Tech Stack

Frontend: React.js (using Vite) & Tailwind CSS

Backend: Node.js & Express.js

AI: Google Gemini API

Authentication: JWT

🚀 How to Run This Project Locally
Prerequisites
Node.js installed on your machine.

A Google Gemini API Key. You can get one for free from Google AI Studio.

Step 1: Clone the Repository
git clone [https://github.com/tanmaygupta7781/ai-resume-analyzer.git](https://github.com/tanmaygupta7781/ai-resume-analyzer.git)
cd ai-resume-analyzer

Step 2: Set Up and Run the Backend
Navigate to the backend folder:

cd backend

Install the necessary packages:

npm install

Create an environment file named .env. Copy the contents of .env.example and add your Gemini API key.

File: backend/.env

GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

Start the backend server:

npm run dev

The backend will now be running at http://localhost:5000. Keep this terminal open.

Step 3: Set Up and Run the Frontend
Open a new, separate terminal and navigate to the frontend folder:

cd frontend

Install the necessary packages:

npm install

Start the frontend development server:

npm run dev

The frontend will now be running at http://localhost:5173 (or a similar port).

Step 4: Use the Application
Open your web browser and go to the URL provided by the frontend server (e.g., http://localhost:5173). You can now upload a resume and see the analysis.
