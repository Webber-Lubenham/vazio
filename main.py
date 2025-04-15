from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Reno Supabase API",
    description="API for interacting with Reno Supabase database",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("VITE_SUPABASE_URL"),
    os.getenv("VITE_SUPABASE_ANON_KEY")
)

# Pydantic models for request/response validation
class User(BaseModel):
    full_name: str
    phone: str

class Todo(BaseModel):
    title: str
    completed: bool = False

# Users endpoints
@app.get("/users", tags=["Users"])
async def get_users():
    try:
        response = supabase.table('users').select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users", tags=["Users"])
async def create_user(user: User):
    try:
        response = supabase.table('users').insert(user.dict()).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Todos endpoints
@app.get("/todos", tags=["Todos"])
async def get_todos():
    try:
        response = supabase.table('todos').select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/todos", tags=["Todos"])
async def create_todo(todo: Todo):
    try:
        response = supabase.table('todos').insert(todo.dict()).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/todos/{todo_id}", tags=["Todos"])
async def update_todo(todo_id: int, todo: Todo):
    try:
        response = supabase.table('todos').update(todo.dict()).eq('id', todo_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/todos/{todo_id}", tags=["Todos"])
async def delete_todo(todo_id: int):
    try:
        response = supabase.table('todos').delete().eq('id', todo_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 