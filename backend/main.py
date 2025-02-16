from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Milvus (Vector DB) setup
MILVUS_HOST = os.getenv("MILVUS_HOST")
MILVUS_PORT = os.getenv("MILVUS_PORT")

if not MILVUS_HOST or not MILVUS_PORT:
    raise RuntimeError("Milvus host and port must be set in environment variables!")

connections.connect("default", host=MILVUS_HOST, port=MILVUS_PORT)

# Define the schema for the notes collection
note_schema = CollectionSchema([
    FieldSchema("id", DataType.INT64, is_primary=True),
    FieldSchema("title", DataType.VARCHAR, max_length=100),
    FieldSchema("content", DataType.VARCHAR, max_length=1000),
    FieldSchema("embedding", DataType.FLOAT_VECTOR, dim=128),
    FieldSchema("google_doc_id", DataType.VARCHAR, max_length=255)
])

# Create the collection
notes_collection = Collection("notes", note_schema)

# Models
class Note(BaseModel):
    title: str
    content: str
    google_doc_id: Optional[str] = None

class NoteInDB(Note):
    id: int

class User(BaseModel):
    username: str
    email: str

class UserInDB(User):
    hashed_password: str

users_db = {}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    return users_db.get(username)

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user["hashed_password"]):
        return False
    return UserInDB(**user)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except (ExpiredSignatureError, InvalidTokenError):
        raise credentials_exception
    return get_user(username)

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/notes", response_model=NoteInDB)
async def create_note(note: Note, current_user: User = Depends(get_current_user)):
    insert_result = notes_collection.insert([
        [1],  # Temporary ID (should be auto-generated)
        [note.title],
        [note.content],
        [[0.1] * 128],  # Dummy embedding
        [note.google_doc_id]
    ])
    generated_id = insert_result.primary_keys[0]
    return NoteInDB(id=generated_id, **note.dict())

@app.put("/notes/{note_id}", response_model=NoteInDB)
async def update_note(note_id: int, note: Note, current_user: User = Depends(get_current_user)):
    notes_collection.update(
        expr=f"id == {note_id}",
        set_={
            "title": note.title,
            "content": note.content,
            "google_doc_id": note.google_doc_id
        }
    )
    return NoteInDB(id=note_id, **note.dict())

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
