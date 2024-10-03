# AI Doctor's Assistant Web Application

## Overview

AI Doctor's Assistant is a comprehensive web application designed to provide medical information and answers to health-related questions. The application utilizes a fine-tuned version of Meta's Llama 3.1 8B parameter model, trained on a large dataset of medical questions and answers. This project combines advanced natural language processing capabilities with a user-friendly web interface, making medical information more accessible to users.

## Demo Video

[![Watch the demo video](https://img.youtube.com/vi/SeEk0V1Cli0/0.jpg)](https://www.youtube.com/watch?v=SeEk0V1Cli0)
https://www.youtube.com/watch?v=SeEk0V1Cli0




## Project Structure

The project is divided into three main components:

1. Model Component
2. Backend Component (Django)(PostgreSQL)
3. Frontend Component (React)

Each component is housed in its own directory within the project structure.

```
ai-doctors-assistant/
├── model/
│   ├── Dataset Preparation/
│   ├── Model Finetuning/
│   └── Model Configuration/
├── backend/
│   └── AI_doctor_assistant/
│   └── chatbot/
└── frontend/
    └── src/
```

## 1. Model Component

### Description

This component handles the AI model that powers the application's ability to understand and respond to medical queries.

### Key Features

- Based on Meta's Llama 3.1 8B parameter model
- Fine-tuned on a large medical Q&A dataset
- Utilizes Low-Rank Adaptation (LoRA) and 4-bit quantization

### Subcomponents

1. **Dataset Preparation**: Scripts for processing and preparing the medical dataset.
2. **Fine-Tuning**: Code for fine-tuning the Llama 3.1 8B model.
3. **Model Configuration**: Configuration files and tokenizers for the fine-tuned model.

### Usage

To use the fine-tuned model:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")
tokenizer = AutoTokenizer.from_pretrained("Samuelawud/Llama-3-1-8B-AI-Doctors-Assistant")

prompt = "What are the symptoms of COVID-19?"
inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(inputs['input_ids'], max_length=128)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)
```

## 2. Backend Component

### Description

The backend is built using Django, providing a robust and scalable server-side solution.

### Key Features

- RESTful API endpoints for communication with the frontend
- JWT (JSON Web Token) authentication
- Database models for user profiles and conversation history
- Integration with the fine-tuned Llama model for processing queries
- Password reset functionality
- PostgresSQL Database

### Setup

1. Navigate to the `backend` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Set up the database: `python manage.py migrate`
4. Create a superuser: `python manage.py createsuperuser`
5. Run the development server: `python manage.py runserver`

## 3. Frontend Component

### Description

The frontend is a React-based single-page application, providing a responsive and intuitive user interface.

### Key Features

- User authentication and registration interface
- Real-time chat interface for interacting with the AI model
- Conversation history for logged-in users
- Responsive design for desktop and mobile devices
- Password reset interface

### Setup

1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Installation and Setup

To set up the entire project:

1. Clone the repository:
   ```
   git clone https://github.com/samuelawud123/ai-doctors-assistant.git
   cd ai-doctors-assistant
   ```

2. Set up the backend:
   ```
   cd ../backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

4. Start the development servers:
   - For backend: `python manage.py runserver` (from the `backend` directory)
   - For frontend: `npm start` (from the `frontend` directory)

## Database Setup and Structure

This project uses **PostgreSQL** as the database backend, replacing the default SQLite. The database stores all essential data related to the chatbot, user messages, authentication, and session management.

### Database Setup

To use PostgreSQL as the database backend for this web app, follow the steps below to ensure proper setup and migration:

1. **Install PostgreSQL**:  
   Ensure that PostgreSQL is installed and running on your machine. You can download PostgreSQL from [here](https://www.postgresql.org/download/).

2. **Create a PostgreSQL Database**:  
   After installing PostgreSQL, create a new database for the project:

   ```bash
   psql -U postgres
   CREATE DATABASE mydatabase;


## Usage

1. Access the web application by navigating to `http://localhost:3000` in your web browser.
2. Register for a new account or log in if you already have one.
3. Start a new conversation by typing your medical question in the chat interface.
4. View your conversation history and manage your account settings from the user dashboard.

## Contributing

You are welcome to contribute to the AI Doctor's Assistant project. Please submit pull requests.

## Acknowledgments

- Meta AI for the Llama model series
- The open-source community for various libraries and frameworks used in this project
- Contributors to the medical questions and answers dataset

For more information, support, or to report issues, please open an issue in this repository.
