import pytest
import requests
from datetime import datetime

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def test_about_endpoint():
    """Test the /about endpoint"""
    response = requests.get(f"{BASE_URL}/about")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert all(isinstance(member, dict) for member in data)
    assert all("first_name" in member and "last_name" in member for member in data)

def test_get_user_endpoint():
    """Test the /users/:id endpoint"""
    # Test with non-existent user
    response = requests.get(f"{BASE_URL}/users/999999")
    assert response.status_code == 404
    
    # Test with valid user (assuming user with ID 1 exists)
    response = requests.get(f"{BASE_URL}/users/1")
    if response.status_code == 200:
        data = response.json()
        assert "id" in data
        assert "first_name" in data
        assert "last_name" in data
        assert "total" in data

def test_report_endpoint():
    """Test the /report endpoint"""
    # Test with missing parameters
    response = requests.get(f"{BASE_URL}/report")
    assert response.status_code == 400
    
    # Test with invalid user
    response = requests.get(f"{BASE_URL}/report?id=999999&year=2024&month=3")
    assert response.status_code == 404
    
    # Test with valid parameters (assuming user with ID 123123 exists)
    current_year = datetime.now().year
    current_month = datetime.now().month
    response = requests.get(f"{BASE_URL}/report?id=123123&year={current_year}&month={current_month}")
    if response.status_code == 200:
        data = response.json()
        assert "userid" in data
        assert "year" in data
        assert "month" in data
        assert "costs" in data
        assert isinstance(data["costs"], list)

def test_add_cost_endpoint():
    """Test the /add endpoint"""
    # Test with missing fields
    response = requests.post(f"{BASE_URL}/add", json={})
    assert response.status_code == 400
    
    # Test with invalid category
    invalid_cost = {
        "description": "Test cost",
        "category": "invalid_category",
        "userid": 1,
        "sum": 100
    }
    response = requests.post(f"{BASE_URL}/add", json=invalid_cost)
    assert response.status_code == 400
    
    # Test with non-existent user
    invalid_user_cost = {
        "description": "Test cost",
        "category": "food",
        "userid": 999999,
        "sum": 100
    }
    response = requests.post(f"{BASE_URL}/add", json=invalid_user_cost)
    assert response.status_code == 404
    
    # Test with valid data (assuming user with ID 1 exists)
    valid_cost = {
        "description": "Test cost",
        "category": "food",
        "userid": 1,
        "sum": 100
    }
    response = requests.post(f"{BASE_URL}/add", json=valid_cost)
    if response.status_code == 201:
        data = response.json()
        assert "description" in data
        assert "category" in data
        assert "userid" in data
        assert "sum" in data
        assert "date" in data

def test_create_user_endpoint():
    """Test the /users endpoint"""
    # Test with missing fields
    response = requests.post(f"{BASE_URL}/users", json={})
    assert response.status_code == 400
    
    # Test with existing user ID (assuming user with ID 1 exists)
    existing_user = {
        "id": 1,
        "first_name": "Test",
        "last_name": "User",
        "birthday": "1990-01-01",
        "marital_status": "single"
    }
    response = requests.post(f"{BASE_URL}/users", json=existing_user)
    assert response.status_code == 400
    
    # Test with valid data
    new_user = {
        "id": 999,  # Using a high ID to avoid conflicts
        "first_name": "Test",
        "last_name": "User",
        "birthday": "1990-01-01",
        "marital_status": "single"
    }
    response = requests.post(f"{BASE_URL}/users", json=new_user)
    if response.status_code == 201:
        data = response.json()
        assert "id" in data
        assert "first_name" in data
        assert "last_name" in data
        assert "birthday" in data
        assert "marital_status" in data 