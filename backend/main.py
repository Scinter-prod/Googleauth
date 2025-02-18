from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import jwt
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
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
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

# User database (replace with actual database in production)
users_db = {}

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    if username in users_db:
        user_dict = users_db[username]
        return UserInDB(**user_dict)

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(username)
    if user is None:
        raise credentials_exception
    return user

# Endpoints
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users", response_model=User)
async def create_user(user: User, password: str):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    users_db[user.username] = user_dict
    return user

@app.post("/notes", response_model=NoteInDB)
async def create_note(note: Note, current_user: User = Depends(get_current_user)):
    # Generate a simple embedding (replace with actual embedding generation)
    embedding = [0.1] * 128
    
    note_id = notes_collection.insert([
        [len(notes_collection) + 1],  # ID
        [note.title],
        [note.content],
        [embedding],
        [note.google_doc_id]
    ])
    
    return NoteInDB(id=note_id[0], **note.dict())

@app.get("/notes", response_model=List[NoteInDB])
async def get_notes(current_user: User = Depends(get_current_user)):
    results = notes_collection.query(expr="id > 0", output_fields=["id", "title", "content", "google_doc_id"])
    return [NoteInDB(id=r['id'], title=r['title'], content=r['content'], google_doc_id=r['google_doc_id']) for r in results]

@app.get("/notes/{note_id}", response_model=NoteInDB)
async def get_note(note_id: int, current_user: User = Depends(get_current_user)):
    result = notes_collection.query(expr=f"id == {note_id}", output_fields=["id", "title", "content", "google_doc_id"])
    if not result:
        raise HTTPException(status_code=404, detail="Note not found")
    return NoteInDB(id=result[0]['id'], title=result[0]['title'], content=result[0]['content'], google_doc_id=result[0]['google_doc_id'])

@app.put("/notes/{note_id}", response_model=NoteInDB)
async def update_note(note_id: int, note: Note, current_user: User = Depends(get_current_user)):
    notes_collection.update(
        expr=f"id == {note_id}",
        data={
            "title": note.title,
            "content": note.content,
            "google_doc_id": note.google_doc_id
        }
    )
    return NoteInDB(id=note_id, **note.dict())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

