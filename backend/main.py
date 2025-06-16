from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
import os
from typing import List, Optional

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT', '3306'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'waiting_room')
}

# Pydantic models
class ProviderBase(BaseModel):
    name: str
    wait_time: int = Field(..., ge=0, le=480)
    visible: bool = True
    show_wait_time: bool = True

class ProviderCreate(ProviderBase):
    pass

class Provider(ProviderBase):
    id: int
    
    class Config:
        orm_mode = True

# Database connection helper
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# Initialize database
@app.on_event("startup")
async def startup():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS providers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            wait_time SMALLINT NOT NULL,
            visible BOOLEAN DEFAULT TRUE,
            show_wait_time BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
    except Error as e:
        print(f"Database initialization error: {e}")

# API endpoints
@app.get("/api/providers", response_model=List[Provider])
async def get_providers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM providers")
        providers = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return providers
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/providers", response_model=Provider)
async def create_provider(provider: ProviderCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute(
            "INSERT INTO providers (name, wait_time, visible, show_wait_time) VALUES (%s, %s, %s, %s)",
            (provider.name, provider.wait_time, provider.visible, provider.show_wait_time)
        )
        conn.commit()
        
        provider_id = cursor.lastrowid
        cursor.execute("SELECT * FROM providers WHERE id = %s", (provider_id,))
        new_provider = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return new_provider
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/providers/{provider_id}", response_model=Provider)
async def update_provider(provider_id: int, provider: ProviderBase):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute(
            """UPDATE providers 
            SET name = %s, wait_time = %s, visible = %s, show_wait_time = %s 
            WHERE id = %s""",
            (provider.name, provider.wait_time, provider.visible, provider.show_wait_time, provider_id)
        )
        conn.commit()
        
        cursor.execute("SELECT * FROM providers WHERE id = %s", (provider_id,))
        updated_provider = cursor.fetchone()
        
        if not updated_provider:
            raise HTTPException(status_code=404, detail="Provider not found")
        
        cursor.close()
        conn.close()
        
        return updated_provider
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/providers/{provider_id}")
async def delete_provider(provider_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM providers WHERE id = %s", (provider_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Provider not found")
        
        cursor.close()
        conn.close()
        
        return {"message": "Provider deleted successfully"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))