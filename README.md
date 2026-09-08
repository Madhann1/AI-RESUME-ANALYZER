# AI Resume Analyzer & Interview Assistant

A full-stack, production-quality engineering web application powered by **Spring Boot 3 (Java 21)**, **MySQL**, **React (Vite) + Tailwind CSS**, and a **locally running LLM via Ollama** (`gemma3` / `llama3.2`).

This application allows candidates and recruiters to upload PDF resumes, extract structured skills and profile data using Apache PDFBox, calculate category resume scores (0–100), perform job description matching, generate category-specific interview questions with sample answers, and receive personalized learning recommendations.

> 🔒 **100% Free & Private**: Uses a locally running Ollama LLM endpoint (`http://localhost:11434`). No paid external API keys required!

---

## 🌟 Key Features

- **JWT Authentication & Security**:
  - User registration & login with BCrypt password hashing.
  - Stateless JWT token authentication with request security filter.
- **Dashboard**:
  - Displays total uploaded resumes, average score gauge, total job matches, interview question counts, and recent analysis history.
- **Resume Upload & Parsing**:
  - Restricts uploads to PDF files (max 10MB limit).
  - Uses **Apache PDFBox** for text extraction.
- **AI Resume Evaluation**:
  - Communicates with local **Ollama LLM** (`gemma3` / `llama3.2`).
  - Extracts Name, Email, Phone, Skills, Education, Projects, Work Experience, Certifications, Strengths, Weaknesses, and Improvement Suggestions.
- **Resume Score Breakdown**:
  - Evaluates scores across: Technical Skills, Project Quality, Experience, Formatting, and Technical Depth.
- **Job Description Matching**:
  - Compares resume text against target Job Descriptions.
  - Generates match %, matching skills, missing skills, custom learning paths, and hiring recommendations.
- **Interview Question Generator**:
  - Generates category-specific technical & behavioral interview questions (HR, Java, OOP, DBMS, SQL, Spring Boot, Project-Based, Behavioral).
  - Provides detailed sample answers for every question.
- **Report History**:
  - Stores all reports in MySQL.
  - View full report details or delete past analyses.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.3.2, Maven, Spring Data JPA, Spring Security, Spring Validation |
| **Parsing & Utilities** | Apache PDFBox 3.0.2, Jackson Databind, Lombok, JJWT 0.12.6 |
| **Database** | MySQL (`ai_resume_db`) |
| **Frontend** | React 18, Vite 5, Tailwind CSS v4, Lucide React Icons, Axios |
| **Local AI LLM** | Ollama (`gemma3` or `llama3.2`) |

---

## 🏗️ Architecture Overview

The backend strictly follows a layered architecture pattern:

```
Controller Layer (/api/resumes, /api/auth, /api/job-match, /api/interview)
      ↓
Service Layer (ResumeAnalysisService, OllamaService, PdfParserService, JobMatchService, InterviewService)
      ↓
Repository Layer (Spring Data JPA Repositories)
      ↓
MySQL Database (Users, Resume Reports, Job Matches, Interview Questions)
```

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following installed on your system:
- **Java 21** or later (`java -version`)
- **Node.js v18+** & **npm** (`node -v`, `npm -v`)
- **Maven** (`mvn -v`)
- **MySQL Server** (running on `localhost:3306`)
- **Ollama** ([https://ollama.com/download](https://ollama.com/download))

---

### 2. How to Install & Pull local Ollama AI Model

1. Install **Ollama** on your operating system.
2. Open your terminal and pull the target Large Language Model:
   ```bash
   # Option A: Gemma 3 (Default)
   ollama pull gemma3

   # Option B: Llama 3.2
   ollama pull llama3.2
   ```
3. Start the Ollama server:
   ```bash
   ollama serve
   ```
   *The server runs locally at `http://localhost:11434`.*

---

### 3. MySQL Database Setup

1. Start your local MySQL service on port `3306`.
2. Create the database (optional - Spring Boot auto-creates it if configured):
   ```sql
   CREATE DATABASE IF NOT EXISTS ai_resume_db;
   ```
3. Default connection settings in `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/ai_resume_db?createDatabaseIfNotExist=true&useSSL=false
       username: root
       password: root
   ```
   *(Update username/password if your local MySQL credentials differ)*

---

### 4. Running the Backend (Spring Boot)

```bash
cd backend

# Compile & Run Spring Boot Application
mvn spring-boot:run
```
The backend server will start at: **`http://localhost:8080`**

---

### 5. Running the Frontend (React + Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend application will start at: **`http://localhost:3000`**

---

## 📡 REST API Documentation

### Auth APIs (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Login and retrieve JWT Bearer token |
| `GET` | `/api/auth/me` | Fetch current user details |

### Resume APIs (`/api/resumes`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/resumes/upload` | Upload PDF file, extract text via PDFBox, analyze via Ollama |
| `GET` | `/api/resumes` | Get all resume summary reports for logged-in user |
| `GET` | `/api/resumes/{id}` | Get detailed report by ID |
| `DELETE` | `/api/resumes/{id}` | Delete resume report and uploaded PDF |

### Job Match APIs (`/api/job-match`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/job-match/analyze` | Compare resume with Job Description, extract skill gaps & learning paths |
| `GET` | `/api/job-match/history` | Fetch past job match reports |

### Interview APIs (`/api/interview`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/interview/generate` | Generate category-specific interview questions & answers |
| `GET` | `/api/interview/questions` | Filter interview questions by category or resume report ID |

### Dashboard APIs (`/api/dashboard`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Retrieve aggregate counts, average score, and recent analyses |

---

## 🖼️ Application Screenshots

### 1. Dashboard View
![Dashboard Placeholder](https://via.placeholder.com/1200x600/0f172a/ffffff?text=AI+Resume+Analyzer+-+Dashboard+Stats+%26+Gauge)

### 2. PDF Upload & Processing
![Upload Placeholder](https://via.placeholder.com/1200x600/0f172a/ffffff?text=Interactive+PDF+Upload+%26+Ollama+Processing+Steps)

### 3. Detailed AI Analysis & Score Breakdown
![Analysis Result Placeholder](https://via.placeholder.com/1200x600/0f172a/ffffff?text=Detailed+Candidate+Profile%2C+Scores%2C+Strengths%2C+Weaknesses)

### 4. Job Description Matcher & Learning Paths
![Job Match Placeholder](https://via.placeholder.com/1200x600/0f172a/ffffff?text=Job+Match+Percentage%2C+Missing+Skills+%26+Learning+Paths)

### 5. Category-based Interview Questions Generator
![Interview Questions Placeholder](https://via.placeholder.com/1200x600/0f172a/ffffff?text=Interview+Questions+Filterable+by+Category+with+Sample+Answers)

---

## 💡 Future Enhancements

- Support for multiple LLM providers (e.g. Ollama, LlamaCpp, HuggingFace local models).
- Interactive Live AI Mock Interview Voice Simulator.
- Export resume analysis report to downloadable PDF.
- Batch resume parsing for technical recruiters.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
"# AI-RESUME-ANALYZER" 
