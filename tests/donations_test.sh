#!/bin/bash

# API Testing Commands for Birthday Donations API
# Make sure your docker containers are running: docker-compose up -d

echo "🚀 Testing Birthday Donations API"
echo "================================="

BASE_URL="http://localhost:8080"

# 1. Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq .
echo -e "\n"

# 2. Valid Event Request (should work with sample data)
echo "2. Testing Valid Event Request (Emma's Birthday - ID: 1)..."
curl -s -X POST "$BASE_URL/api/events/request" \
  -H "Content-Type: application/json" \
  -d '{"event_id": 1}' | jq .
echo -e "\n"

# 3. Non-existent Event
echo "3. Testing Non-existent Event (ID: 999)..."
curl -s -X POST "$BASE_URL/api/events/request" \
  -H "Content-Type: application/json" \
  -d '{"event_id": 999}' | jq .
echo -e "\n"

# 4. Invalid JSON
echo "4. Testing Invalid JSON..."
curl -s -X POST "$BASE_URL/api/events/request" \
  -H "Content-Type: application/json" \
  -d '{"invalid": json}' | jq .
echo -e "\n"

# 5. Missing event_id
echo "5. Testing Missing event_id..."
curl -s -X POST "$BASE_URL/api/events/request" \
  -H "Content-Type: application/json" \
  -d '{"wrong_field": 123}' | jq .
echo -e "\n"

# 6. Wrong HTTP Method
echo "6. Testing Wrong HTTP Method (GET instead of POST)..."
curl -s -X GET "$BASE_URL/api/events/request" | jq .
echo -e "\n"

# 7. Wrong Content-Type
echo "7. Testing Wrong Content-Type..."
curl -s -X POST "$BASE_URL/api/events/request" \
  -H "Content-Type: text/plain" \
  -d '{"event_id": 1}' | jq .
echo -e "\n"

# 8. Test Response Time
echo "8. Testing Response Time..."
time curl -s -X POST "$BASE_URL/api/events/request" \
  -H "Content-Type: application/json" \
  -d '{"event_id": 1}' > /dev/null
echo -e "\n"

echo "✅ API Testing Complete!"
echo "If you see proper JSON responses above, your API is working!"
