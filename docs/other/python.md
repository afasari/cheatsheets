# Python Basics

Python is a high-level, interpreted programming language known for its readability and extensive standard library.

## Python Installation

### Installation

| Platform | Installation Method |
|----------|-------------------|
| **Linux/macOS** | `python3 --version` (usually pre-installed) |
| **Linux** | `sudo apt-get install python3` or `sudo yum install python3` |
| **macOS** | `brew install python3` |
| **Windows** | Download from python.org |

### Python Commands

| COMMAND | DESCRIPTION |
| --- | --- |
| `python3 --version` | Check Python version |
| `python3 script.py` | Run Python script |
| `python3 -m pip install package` | Install package via pip |
| `python3 -m venv myenv` | Create virtual environment |
| `python3 -c "print('Hello')"` | Execute Python command |

### Interactive Shell

```bash
# Start Python REPL
python3

# Start with specific version
python3.9

# Exit REPL
exit()
```

## Python Syntax

### Basic Syntax

```python
# Comments
# This is a single-line comment

"""
This is a multi-line comment
docstring
"""

# Variables
name = "John"
age = 25
height = 5.9
is_student = True

# Print
print("Hello, World!")
print(f"Name: {name}, Age: {age}")  # f-string (Python 3.6+)

# Input
name = input("Enter your name: ")
age = int(input("Enter your age: "))
```

### Data Types

```python
# Numeric types
integer = 42
floating_point = 3.14
complex_number = 2 + 3j

# String
string = "Hello, World!"
multiline_string = """Line 1
Line 2
Line 3"""

# Boolean
bool_true = True
bool_false = False

# None
none_value = None
```

### Operators

```python
# Arithmetic operators
a + b   # Addition
a - b   # Subtraction
a * b   # Multiplication
a / b   # Division
a // b  # Floor division
a % b   # Modulo
a ** b  # Exponentiation

# Comparison operators
a == b  # Equal
a != b  # Not equal
a < b   # Less than
a > b   # Greater than
a <= b  # Less than or equal
a >= b  # Greater than or equal

# Logical operators
a and b  # Logical AND
a or b   # Logical OR
not a     # Logical NOT

# Identity operators
a is b     # Identity
a is not b # Not identity

# Membership operators
x in y    # Member
x not in y # Not member
```

## Python Data Structures

### Lists

```python
# Create list
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["text", 42, 3.14, True]

# Access elements
first_fruit = fruits[0]    # "apple"
last_fruit = fruits[-1]    # "cherry"

# Slicing
subset = fruits[1:3]       # ["banana", "cherry"]
first_two = fruits[:2]       # ["apple", "banana"]
last_two = fruits[-2:]       # ["banana", "cherry"]
every_other = fruits[::2]    # ["apple", "cherry"]

# List operations
fruits.append("orange")           # Add to end
fruits.insert(1, "mango")       # Insert at index
fruits.remove("banana")           # Remove first occurrence
fruits.pop()                    # Remove and return last element
fruits.pop(0)                   # Remove and return at index
fruits.clear()                   # Remove all elements

# List methods
fruits.index("apple")             # Find index of element
fruits.count("apple")            # Count occurrences
fruits.sort()                    # Sort list in-place
fruits.reverse()                  # Reverse list in-place
fruits.copy()                    # Create shallow copy

# List comprehensions
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
```

### Tuples

```python
# Create tuple
coordinates = (3, 4)
single_item = (1,)  # Note the comma

# Access elements
x = coordinates[0]  # 3

# Tuple operations
len(coordinates)     # 2
coordinates.count(3)  # 1
coordinates.index(3)  # 0

# Tuple unpacking
x, y = coordinates  # x=3, y=4
a, *rest = [1, 2, 3, 4]  # a=1, rest=[2, 3, 4]
```

### Dictionaries

```python
# Create dictionary
person = {
    "name": "John",
    "age": 25,
    "city": "New York"
}

# Access elements
name = person["name"]  # "John"
name = person.get("name")  # "John" (safer, returns None if key doesn't exist)

# Add/Update elements
person["email"] = "john@example.com"
person.update({"phone": "555-1234", "address": "123 Main St"})

# Remove elements
del person["age"]
person.pop("city", None)  # Remove and return, default None if not found

# Dictionary methods
person.keys()        # View keys
person.values()      # View values
person.items()       # View key-value pairs
len(person)         # Number of items
"name" in person    # Check if key exists

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

### Sets

```python
# Create set
numbers = {1, 2, 3, 4, 5}
unique = set([1, 2, 2, 3, 4, 4, 5])  # {1, 2, 3, 4, 5}

# Set operations
numbers.add(6)              # Add element
numbers.remove(3)           # Remove element
numbers.discard(10)         # Remove if exists (no error)
numbers.clear()             # Remove all elements

# Set operations
set1 = {1, 2, 3}
set2 = {3, 4, 5}

union = set1 | set2       # {1, 2, 3, 4, 5}
intersection = set1 & set2  # {3}
difference = set1 - set2    # {1, 2}
symmetric_diff = set1 ^ set2  # {1, 2, 4, 5}
```

## Control Flow

### If Statements

```python
# If-else
x = 10
if x > 5:
    print("x is greater than 5")
elif x == 5:
    print("x equals 5")
else:
    print("x is less than 5")

# Ternary operator
result = "greater" if x > 5 else "lesser"

# Multiple conditions
if x > 0 and x < 10:
    print("x is between 0 and 10")

if x == 0 or x == 10:
    print("x is 0 or 10")
```

### For Loops

```python
# For loop over range
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

# For loop over list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# For loop with index
for index, fruit in enumerate(fruits):
    print(f"Index {index}: {fruit}")

# For loop over dictionary
for key, value in person.items():
    print(f"{key}: {value}")

# Break and continue
for i in range(10):
    if i == 5:
        break  # Exit loop
    if i % 2 == 0:
        continue  # Skip to next iteration
    print(i)
```

### While Loops

```python
# While loop
i = 0
while i < 5:
    print(i)
    i += 1

# While with break
i = 0
while True:
    print(i)
    i += 1
    if i >= 5:
        break
```

## Python Functions

### Function Definition

```python
# Simple function
def greet():
    print("Hello, World!")

# Function with parameters
def greet_person(name):
    print(f"Hello, {name}!")

# Function with default parameters
def greet_with_default(name="World"):
    print(f"Hello, {name}!")

# Function with return value
def add(a, b):
    return a + b

# Function with multiple return values
def get_coordinates():
    x = 3
    y = 4
    return x, y

# Lambda function (anonymous function)
square = lambda x: x**2
print(square(5))  # 25

# Function with *args (variable arguments)
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4))  # 10

# Function with **kwargs (keyword arguments)
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="John", age=25, city="NYC")
```

## Python Classes

### Class Definition

```python
# Basic class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        print(f"Hello, I'm {self.name}")

    def __str__(self):
        return f"Person(name={self.name}, age={self.age})"

# Create instance
person = Person("John", 25)
person.greet()  # Hello, I'm John
print(person)  # Person(name=John, age=25)

# Class with inheritance
class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id

    def study(self):
        print(f"{self.name} is studying")

# Create subclass instance
student = Student("Jane", 22, "S12345")
student.greet()  # Hello, I'm Jane
student.study()  # Jane is studying
```

## Python Modules and Packages

### Importing Modules

```python
# Import module
import math
print(math.sqrt(16))  # 4.0

# Import specific function
from math import sqrt
print(sqrt(16))  # 4.0

# Import with alias
import numpy as np
import pandas as pd

# Import all from module (not recommended)
from math import *
```

### Installing Packages

```bash
# Install package
pip install package-name

# Install specific version
pip install package-name==1.0.0

# Install from requirements.txt
pip install -r requirements.txt

# Upgrade package
pip install --upgrade package-name

# Uninstall package
pip uninstall package-name

# List installed packages
pip list

# Show package information
pip show package-name
```

### Virtual Environments

```bash
# Create virtual environment
python3 -m venv myenv

# Activate virtual environment
source myenv/bin/activate  # Linux/macOS
myenv\Scripts\activate  # Windows

# Deactivate virtual environment
deactivate
```

## File Operations

### Reading Files

```python
# Read entire file
with open("file.txt", "r") as f:
    content = f.read()

# Read line by line
with open("file.txt", "r") as f:
    for line in f:
        print(line.strip())

# Read all lines to list
with open("file.txt", "r") as f:
    lines = f.readlines()

# Read with encoding
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()
```

### Writing Files

```python
# Write file (overwrite)
with open("output.txt", "w") as f:
    f.write("Hello, World!")

# Append to file
with open("output.txt", "a") as f:
    f.write("\nNew line")

# Write multiple lines
with open("output.txt", "w") as f:
    lines = ["Line 1", "Line 2", "Line 3"]
    f.writelines([line + "\n" for line in lines])

# Write with encoding
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Unicode content: 你好世界")
```

### File and Directory Operations

```python
import os
import pathlib

# Using os module
os.getcwd()              # Get current directory
os.listdir()             # List files in directory
os.mkdir("newdir")       # Create directory
os.makedirs("dir/subdir") # Create directory with subdirectories
os.remove("file.txt")    # Remove file
os.rmdir("emptydir")     # Remove empty directory
os.removedirs("dir")    # Remove directory tree
os.path.exists("file.txt")  # Check if path exists

# Using pathlib
from pathlib import Path
path = Path("file.txt")
path.exists()            # Check if exists
path.is_file()          # Check if file
path.is_dir()           # Check if directory
path.read_text()         # Read file content
path.write_text("content")  # Write file content
```

## Python Error Handling

### Try-Except

```python
# Basic error handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")

# Multiple exceptions
try:
    value = int(input("Enter a number: "))
    result = 10 / value
except ValueError:
    print("Invalid input")
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"An error occurred: {e}")

# Finally block
try:
    file = open("file.txt", "r")
    content = file.read()
finally:
    file.close()  # Always executed

# Else block
try:
    result = 10 / value
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print(f"Result: {result}")
```

## Python Best Practices

1. **Use Virtual Environments** - Isolate project dependencies
2. **Follow PEP 8** - Python style guide
3. **Use Type Hints** - Optional type annotations
4. **Write Docstrings** - Document functions and classes
5. **Use List Comprehensions** - Pythonic way to create lists
6. **Handle Exceptions** - Graceful error handling
7. **Use `with` for Files** - Automatic file closure
8. **Avoid Global Variables** - Use function arguments
9. **Use `__name__ == '__main__'`** - For script execution
10. **Follow Naming Conventions** - snake_case for variables/functions, PascalCase for classes

## Useful Python Libraries for DevOps

| Library | Purpose | Example Usage |
|---------|---------|---------------|
| **requests** | HTTP requests | `requests.get('https://api.example.com')` |
| **boto3** | AWS SDK | `boto3.client('s3')` |
| **azure-sdk** | Azure SDK | `azure.storage.blob.BlobServiceClient` |
| **docker** | Docker API | `docker.from_env()` |
| **kubernetes** | K8s API | `kubernetes.client.AppsV1Api()` |
| **jinja2** | Template engine | `jinja2.Environment().from_string()` |
| **paramiko** | SSH connections | `paramiko.SSHClient()` |
| **psutil** | System monitoring | `psutil.cpu_percent()` |

## Python One-Liners

```bash
# Quick calculations
python3 -c "print(2**10)"  # 1024

# Base64 encode/decode
python3 -c "import base64; print(base64.b64encode(b'Hello').decode())"
python3 -c "import base64; print(base64.b64decode('SGVsbG8=').decode())"

# JSON pretty print
python3 -m json.tool data.json

# HTTP server (Python 3)
python3 -m http.server 8000

# Simple HTTP request
python3 -c "import urllib.request; print(urllib.request.urlopen('https://httpbin.org/ip').read().decode())"

# Remove duplicates from list
python3 -c "print(list(dict.fromkeys([1,2,2,3,3,4]).keys()))"
```

## Common Python File Patterns

```python
if __name__ == '__main__':
    # Code to run when script is executed directly
    pass
```

```python
#!/usr/bin/env python3
# Shebang for executable Python scripts
```

## Python vs Other Languages

| Feature | Python | JavaScript | Go |
|---------|--------|-------------|-----|
| **Typing** | Dynamic (optional types) | Dynamic | Static |
| **Execution** | Interpreted | Interpreted/JIT | Compiled |
| **Learning Curve** | Easy | Easy | Moderate |
| **Performance** | Moderate | Moderate | Fast |
| **Ecosystem** | Extensive | Extensive | Growing |
| **Use Cases** | Data science, automation, web | Frontend, serverless | Systems programming, microservices |
