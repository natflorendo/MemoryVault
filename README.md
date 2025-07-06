# MemoryVault

## Table of Contents
* [Overview](#overview)
* [Live Demo](#live-demo)
* [Features](#features)
* [Visuals](#visuals)
* [Requirements](#requirements)
* [How To Run Locally](#how-to-run-locally)
* [Tech Stack](#tech-stack)
* [Desired Future Improvements](#desired-future-improvements)
* [Helpful Resources](#helpful-resources)

---

## Overview
MemoryVault is a full-stack journaling platform designed to help users reflect on, organize, and revisit their personal thoughts and experiences. Many prople find value in long-form journaling sessions, often sitting down to write for 15-20 minutes or more. However, this isn't always practical, especially with a busy routine. 

MemoryVault was created as a lightweight alternative that is perfect for capturing brief thoughts and moments when you don’t have time to write for long. With a simple and intuitive interface, users can log entries that are automatically analyzed using sentiment analysis and emotion detection powered by Hugging Face Inference API. This AI integration helps generate meaningful tags and insights without requiring extra effort from the user. The platform also offers secure authentication along with search and filtering tools, creating a private and intelligent space for self-reflection and emotional tracking over time.

---

## Live Demo
https://memoryvault-client.onrender.com

---

## Features
* **Text-Based Journal Editor**: Users can create and edit journal entries using a text editor built with Tiptap, allowing for rich formatting and seamless writing experiences.
* **Secure Authentication**: The app supports both traditional email/password login and Google OAuth, using JWT (JSON Web Tokens) to securely manage user sessions and protect user data.
* **AI-Powered Sentiment & Emotion Tagging**: Each journal entry is analyzed using Hugging Face APIs to automatically detect emotional tone and sentiment, enabling intelligent tagging and organization of thoughts.
* **Advanced Search and Filtering**: Users can search through their entries and apply filters based on tags, emotional categories, or creation dates to easily retrieve past thoughts and reflections.
* **Calendar Activity Heatmap**: A calendar-style heatmap that displays how many journal entries a user creates each day, with darker colors representing higher activity. This feature currently provides a year-long (365-day) visual overview of journaling habits, helping users track consistency and reflect on periods of high or low activity.
* **Automated Testing with CI/CD**: The backend includes a GitHub Actions pipeline that automatically runs tests and migrations for every push or pull request, ensuring code stability and quality.
* **Database Integration**: All user data, including journal entries and tags, is stored in a PostgreSQL database using Prisma for secure, structured, and efficient access.

---

## Visuals
Coming soon...

---

## Requirements
Before running the repository locally, ensure you have the following installed:
* **Node.js** (v20 or later): Required to run both the frontend and backend.
* **npm** (comes with Node.js): Used to install project dependencies.
* **PostgreSQL** (v13 or later): A relational database used to store journal entries, user data, and tags.
* **Git**: To clone the repository and manage code.
* **Optional - VS Code** (or your preferred code editor): Recommended for development, debugging, and running scripts easily.

---

## How To Run Locally
### 1. Clone the Repository
```bash
git clone "https://github.com/natflorendo/MemoryVault.git"
cd MemoryVault
```


### 2. Set Up Environemnt Variables (Required)
Navigate to the backend directory and copy the example environment file:
```bash
cd MemoryVault-server
cp .env.example .env
```
Then, open `.env` and replace the placeholder values with your actual credentials.

After setting up the `.env` file in `MemoryVault-server`, navigate back to the root folder using `cd ..`.

**🔴\*\*NOTE\*\*: Do not commit your `.env` file. It's excluded via `.gitignore`**.


### 3. Option A: One-command Setup (Recommended)
Use this to install all dependencies (frontend, backend, and root-level) with a single command:
```bash
npm run setup
```
This will:
* Install backend dependencies (*MemoryVault-server*)
* Install frontend dependencies (*MemoryVault-client*)
* Install *root-level* dependencies

Once setup is complete, you can run the app concurrently:
```bash
npm run dev
```

**⚠️ Avoid using slashes (/) in parent folder names.**
If you clone or move this project into a folder with a name like `CS 440/442`, your shell will interpret that as a nested folder structure, which can break scripts that rely on npx, ts-node, or prisma.

### 4. Option B: Run Backend and Frontend Concurrently (Manual Setup - One Terminal)
```bash
# Step 1: Install dependencies in backend
cd MemoryVault-server
npm install
npx prisma generate
npx prisma migrate dev --name init

# Step 2: Install dependencies in frontend
cd ../MemoryVault-client
npm install

# Step 3: Install root-level dependencies and run both
cd ..
npm install
npm run dev
```


### 5. Option C: Run Backend and Frontend Separately (Requires Two Terminals)
#### In Terminal 1 – Setup Backend:
```bash
cd MemoryVault-server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run devStart
```

#### In Terminal 2 – Setup Frontend
```bash
cd ../MemoryVault-client
npm install
npm run dev
```
---

## Tech Stack
| Layer    | Tech Used                                      |
|----------|------------------------------------------------|
| Language | TypeScript                                     |
| Frontend | React (Vite) + Tiptap + Axios                  |
| Backend  | Node.js (Express) + Passport.js                |
| Database | PostgreSQL + Prisma ORM                        |
| Auth	   | JWT + Google OAuth                             |
| AI       | Hugging Face Inference API                     |
| DevOps   | GitHub Actions (CI)                            |

---

## Desired Future Improvements
Here is a list of some features and enchancements I'd like to expand upon in the future:
* **Improved Auto-Correction** - Enhance the current auto-correction experience, potentially using the LanguageTool API for smarter grammar and spelling suggestions.
* **Custom List Symbols** - Improve bulleted and numbered lists by allowing different bullet styles or symbols for better visual organization.
* **Linked Notes (Chaining)** - Enable users to link related notes together for easier navigation and continuity of thought. (similar to how obsidian does it)
* **Folders and Note Organization** - Implement a Folder model (one-to-many relationship) so users can group their notes. This would include the ability to create folders and assign notes to them.
* **Speech-to-Text Input** - Add a voice input option to allow users to dictate their entries, improving accessibility and convenience.
* **Toggle for Mood Tagging** - Provide a user setting to turn off automatic sentiment/emotion tagging for those who prefer simpler entries.
* **Custom Tag Colors** - Allow users to assign specific colors to individual tags for better visual organization.
* **Advanced Filtering in Recent Tab** – Enhance the "Recent" tab with options to sort notes by ascending/descending date, filter by time range (e.g., today, this week), time of day (e.g., morning, afternoon, evening, late night), and combine filters for more refined browsing.
* **Advanced Tag Filtering and Search** - Add the ability to sort tags in ascending or descending order, and introduce a search bar for quickly finding specific tags.
* **Multi-Year Calendar Heatmap Support** - Extend the current 365-day heatmap to support entries older than one year. When a user has journal entries that go beyond the past year, the app will automatically create tabs for each year and update the calendar view to display activity for that full year, starting from January 1st.
* **Text Styling Options** - Add support for rich formatting like bold, italics, underline, and headers. (This is low priority since the app is primarily meant for quick, lightweight journaling)
* **Responsive Design** - Improve layout and UI responsiveness to provide a smooth and consistent user experience across all devices and screen sizes (e.g. mobile phones and tablets).

---

## Helpful Resources
* Install Node.js:
    * [Macbook](https://www.youtube.com/watch?v=l53HbzbSwxQ)
    * [Windows](https://www.youtube.com/watch?v=kC56yUZCKu4)
* Set up PostgresSQL:
    * [Macbook](https://www.youtube.com/watch?v=wTqosS71Dc4)
    * [Windows](https://www.youtube.com/watch?v=IYHx0ovvxPs)
* [Prisma Docs](https://www.prisma.io/docs)
* [Passport Google OAuth](https://www.passportjs.org/packages/passport-google-oauth20/)
* [Hugging Face Inference API](https://huggingface.co/inference-api)
* [Tiptap Editor Docs](https://tiptap.dev/docs?gad_source=1&gad_campaignid=22014820935&gbraid=0AAAAAqkAF24w78DkB6_WwplqML8UC7WSn&gclid=Cj0KCQjw1JjDBhDjARIsABlM2StR-Qt5-NgFDZEmzC6JS9dFiPwJF168zxgk-6l8fqyLiwNAfi0sHO8aAnLIEALw_wcB)
* [JWT Explained](https://jwt.io/introduction)