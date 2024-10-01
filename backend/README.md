
# AI Doctor's Assistant - Backend Component

Welcome to the **Backend Component** of the AI Doctor's Assistant project. This README provides detailed instructions on setting up and running the backend server responsible for user authentication, password reset functionality, message handling, and interaction with a PostgreSQL database using REST frameworks.

## Features

- **User Authentication**: Secure login and registration using JWT tokens.
- **Password Reset Functionality**: Users can reset their passwords securely.
- **RESTful API**: Built with Django REST Framework for robust API endpoints.
- **Message Storage**: Save and retrieve messages to/from a PostgreSQL database.
- **AI Model Integration**: Seamless integration with the fine-tuned Llama 3.1 8B model.
- **Scalable Architecture**: Modular design for easy maintenance and scalability.

## Technologies Used

- **Python 3.8+**
- **Django 3.x**
- **Django REST Framework**
- **Simple JWT**
- **PostgreSQL**
- **Git**

## Prerequisites

- **Python 3.8+** installed on your machine.
- **PostgreSQL** database setup.
- **Virtual Environment** tool (e.g., `venv`, `virtualenv`).
- **Git** installed.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-doctor-assistant-backend.git
cd ai-doctor-assistant-backend
```

### 2. Create and Activate a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

`requirements.txt` should include:

```
Django>=3.0,<4.0
djangorestframework
djangorestframework-simplejwt
psycopg2-binary
python-dotenv
transformers
torch
```

## Configuration

### Set Up Environment Variables

Create a `.env` file in the root directory to store your environment variables:

```ini
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
AI_MODEL_PATH=path/to/your/ai/model
```

### Running the Server

Start the Django development server:

```bash
python manage.py runserver
```
The server will be accessible at `http://localhost:8000/`.
