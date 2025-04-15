# Reno Supabase API

This is a FastAPI application that provides a RESTful API interface to interact with your Supabase database. It includes Swagger documentation for easy testing and integration.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure your `.env` file is properly configured with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Application

Start the server:
```bash
python main.py
```

The API will be available at:
- API: http://localhost:8000
- Swagger Documentation: http://localhost:8000/docs
- ReDoc Documentation: http://localhost:8000/redoc

## API Endpoints

### Users
- GET /users - Get all users
- POST /users - Create a new user

### Todos
- GET /todos - Get all todos
- POST /todos - Create a new todo
- PUT /todos/{todo_id} - Update a todo
- DELETE /todos/{todo_id} - Delete a todo

## Testing with Swagger

1. Open http://localhost:8000/docs in your browser
2. You can test all endpoints directly from the Swagger UI
3. Click on any endpoint to expand it and see the available parameters
4. Click "Try it out" to test the endpoint
5. Fill in the required parameters and click "Execute"

## Security

- The API uses CORS middleware to allow cross-origin requests
- All endpoints are protected by Supabase authentication
- Make sure to keep your `.env` file secure and never commit it to version control
