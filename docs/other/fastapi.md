# FastAPI

Modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.

## FastAPI Installation

### Installation Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `pip install fastapi` | Install FastAPI |
| `pip install "uvicorn[standard]"` | Install ASGI server with standard extras |
| `pip install pydantic` | Install Pydantic (data validation) |
| `pip install python-multipart` | Support form data |
| `pip install jinja2` | Support Jinja2 templates |

### Basic Installation

```bash
# Install FastAPI and ASGI server
pip install fastapi uvicorn[standard]

# Install with all dependencies
pip install fastapi[all] uvicorn[standard]
```

## FastAPI Application

### Minimal Application

```python
# main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

# Run application
# uvicorn main:app --reload
```

### Application with Multiple Routes

```python
from fastapi import FastAPI, HTTPException
from typing import Optional

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}

@app.post("/items/")
def create_item(item: dict):
    return {"item": item}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: dict):
    return {"item_id": item_id, "item": item}

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    return {"message": f"Item {item_id} deleted"}
```

## Pydantic Models

### Model Definition

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Item(BaseModel):
    name: str
    description: Optional[str] = Field(
        None,
        title="The description of the item",
        max_length=300
    )
    price: float = Field(..., gt=0, description="The price must be greater than zero")
    tax: Optional[float] = None
    tags: List[str] = []

class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime = datetime.now()

class Order(BaseModel):
    items: List[Item]
    user_id: int
```

### Model Validation

```python
from pydantic import BaseModel, validator, EmailStr

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    age: Optional[int] = Field(None, ge=18, le=120)  # greater or equal 18, less or equal 120
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def password_strength(cls, v):
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
```

## FastAPI Path Operations

### Path Parameters

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

@app.get("/users/{username}")
def read_user(username: str):
    return {"username": username}

@app.get("/files/{file_path:path}")
def read_file(file_path: str):
    return {"file_path": file_path}
```

### Query Parameters

```python
from typing import Optional

@app.get("/items/")
def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

@app.get("/search/")
def search(q: Optional[str] = None, page: int = 1):
    return {"query": q, "page": page}
```

### Request Body

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.post("/items/")
def create_item(item: Item):
    return {"item": item}
```

### Mixed Parameters

```python
@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item, q: Optional[str] = None):
    return {"item_id": item_id, "item": item, "q": q}
```

## FastAPI Response Handling

### Response Model

```python
from fastapi import Response

@app.get("/items/{item_id}", response_model=Item)
def read_item(item_id: int):
    return Item(name="Item", price=9.99)
```

### Status Codes

```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item_id": item_id}
```

### Custom Response

```python
@app.get("/custom-response")
def custom_response():
    return Response(
        content="Custom Response",
        media_type="text/plain",
        status_code=200
    )
```

### JSON Response

```python
from fastapi import JSONResponse

@app.get("/json-response")
def json_response():
    return JSONResponse(
        content={"message": "This is JSON"},
        status_code=200
    )
```

## FastAPI Data Validation

### Validation Examples

```python
from pydantic import BaseModel, Field, validator
from typing import Optional, List

class Item(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0, description="Price must be positive")
    quantity: int = Field(..., ge=0, description="Quantity must be 0 or greater")
    tags: List[str] = Field(default=[])
    description: Optional[str] = Field(None, max_length=500)
    
    @validator('name')
    def name_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('Name must be alphanumeric')
        return v
```

### Validation Errors

```python
from fastapi import Request, HTTPException
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )
```

## FastAPI Middleware

### Custom Middleware

```python
from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/")
def read_root():
    return {"message": "Hello World"}
```

### CORS Middleware

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}
```

### Logging Middleware

```python
import logging

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logging.info(f"Response: {response.status_code}")
    return response
```

## FastAPI Database Integration

### SQLAlchemy Integration

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Model
class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route with database
from fastapi import Depends

@app.post("/items/")
def create_item(item: Item, db: Session = Depends(get_db)):
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/items/")
def read_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    return items
```

### MongoDB Integration

```python
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends

client = AsyncIOMotorClient("mongodb://localhost:27017")
database = client.mydatabase

async def get_database():
    return database

@app.post("/items/")
async def create_item(item: Item, db = Depends(get_database)):
    result = await db.items.insert_one(item.dict())
    return item

@app.get("/items/")
async def read_items(db = Depends(get_database)):
    items = await db.items.find().to_list(length=100)
    return items
```

## FastAPI Authentication

### JWT Authentication

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

# Configuration
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User model
class User(BaseModel):
    username: str
    email: str

# Token model
class Token(BaseModel):
    access_token: str
    token_type: str

# Routes
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return {"username": username, "email": "user@example.com"}
```

### API Key Authentication

```python
from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header != "my-secret-api-key":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate API key"
        )
    return api_key_header

@app.get("/protected")
async def protected_route(api_key: str = Depends(get_api_key)):
    return {"message": "Access granted", "api_key": api_key}
```

## FastAPI Background Tasks

### Background Task

```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def write_notification(email: str, message=""):
    with open("log.txt", mode="a") as email_file:
        content = f"notification for {email}: {message}\n"
        email_file.write(content)

@app.post("/send-notification/{email}")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_notification, email, message="Some notification")
    return {"message": "Notification sent in the background"}
```

## FastAPI Templates

### Jinja2 Templates

```python
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/items/{id}", response_class=HTMLResponse)
async def read_item(request: Request, id: str):
    return templates.TemplateResponse("item.html", {"request": request, "id": id})
```

### Template Example (templates/item.html)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Item {{ id }}</title>
</head>
<body>
    <h1>Item {{ id }}</h1>
</body>
</html>
```

## FastAPI Documentation

### Automatic Documentation

| URL | Description |
|-----|-------------|
| `http://localhost:8000/docs` | Interactive API documentation (Swagger UI) |
| `http://localhost:8000/redoc` | Alternative documentation (ReDoc) |

### Custom Documentation

```python
app = FastAPI(
    title="My API",
    description="This is my API description",
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "API Support",
        "url": "http://example.com/support",
        "email": "support@example.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    }
)
```

### Route Documentation

```python
@app.get(
    "/items/{item_id}",
    summary="Get an item by ID",
    description="Retrieve a single item",
    response_model=Item,
    responses={404: {"description": "Item not found"}}
)
def read_item(item_id: int):
    return {"item_id": item_id}
```

## FastAPI Testing

### Test Client

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_read_item():
    response = client.get("/items/1")
    assert response.status_code == 200
    assert response.json() == {"item_id": 1}
```

## FastAPI Deployment

### Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker

```dockerfile
# Dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
```

```yaml
# docker-compose.yml
version: '3'
services:
  api:
    build: .
    ports:
      - "8000:80"
    volumes:
      - .:/app
```

### Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fastapi-app
  template:
    metadata:
      labels:
        app: fastapi-app
    spec:
      containers:
      - name: fastapi-app
        image: fastapi-app:latest
        ports:
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: fastapi-service
spec:
  selector:
    app: fastapi-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

## FastAPI Best Practices

1. **Use Type Hints** - Enables automatic documentation and validation
2. **Use Pydantic Models** - Data validation and serialization
3. **Async/Await** - Use async for I/O operations
4. **Dependency Injection** - For database connections, auth
5. **Use Async Drivers** - SQLAlchemy async, Motor for MongoDB
6. **Handle Exceptions** - Proper error handling and status codes
7. **Use Background Tasks** - For long-running operations
8. **Enable CORS** - If needed for frontend access
9. **Use Environment Variables** - For configuration
10. **Write Tests** - Use TestClient for unit testing

## FastAPI vs Flask vs Django

| Feature | FastAPI | Flask | Django |
|---------|---------|-------|--------|
| **Performance** | Very Fast | Fast | Moderate |
| **Async Support** | Native | Needs extension | Limited |
| **Type Hints** | Required | Optional | Limited |
| **Auto Documentation** | Yes | Needs extension | Yes |
| **Learning Curve** | Easy | Easy | Steeper |
| **Batteries Included** | Minimal | Minimal | Full |
| **Best For** | APIs, Microservices | Small APIs, Prototyping | Full-stack applications |

## Useful FastAPI Packages

| Package | Purpose | Installation |
|---------|---------|-------------|
| **uvicorn** | ASGI server | `pip install uvicorn[standard]` |
| **pydantic** | Data validation | `pip install pydantic` |
| **sqlalchemy** | Database ORM | `pip install sqlalchemy` |
| **alembic** | Database migrations | `pip install alembic` |
| **motor** | MongoDB async driver | `pip install motor` |
| **redis** | Redis client | `pip install redis` |
| **pytest** | Testing framework | `pip install pytest` |
| **passlib** | Password hashing | `pip install passlib` |
| **python-jose** | JWT support | `pip install python-jose[cryptography]` |

## Common FastAPI Issues and Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Add CORSMiddleware with correct origins |
| Slow performance | Use async/await, connection pooling |
| 422 errors | Check Pydantic model validation |
| Database connection issues | Use async database drivers |
| Memory leaks | Use background tasks properly, manage sessions |

## FastAPI One-Liners

```bash
# Create new FastAPI project
mkdir fastapi-app && cd fastapi-app && pip install fastapi uvicorn[standard] && echo "from fastapi import FastAPI
app = FastAPI()

@app.get('/')
def root():
    return {'message': 'Hello World'}
" > main.py

# Run FastAPI application
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
