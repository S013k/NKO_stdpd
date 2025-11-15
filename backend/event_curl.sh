#!/bin/bash

BASE_URL="http://localhost:8000"

# 1. Получение всех событий
curl -X GET "${BASE_URL}/event?jwt_token=test" \
  -H "Content-Type: application/json" | jq '.'

# 2. Получение событий с фильтром по НКО
curl -X GET "${BASE_URL}/event?jwt_token=test&nko_id=1" \
  -H "Content-Type: application/json" | jq '.'

# 3. Получение событий с фильтром по нескольким НКО
curl -X GET "${BASE_URL}/event?jwt_token=test&nko_id=1&nko_id=2" \
  -H "Content-Type: application/json" | jq '.'

# 4. Получение событий с фильтром по категории
curl -X GET "${BASE_URL}/event?jwt_token=test&category=Спорт" \
  -H "Content-Type: application/json" | jq '.'

# 5. Получение событий с фильтром по временному диапазону
curl -X GET "${BASE_URL}/event?jwt_token=test&time_from=2024-01-01T00:00:00&time_to=2024-12-31T23:59:59" \
  -H "Content-Type: application/json" | jq '.'

# 6. Получение событий с regex поиском
curl -X GET "${BASE_URL}/event?jwt_token=test&regex=концерт" \
  -H "Content-Type: application/json" | jq '.'

# 7. Получение событий с фильтром по избранным (заглушка)
curl -X GET "${BASE_URL}/event?jwt_token=test&favorite=true" \
  -H "Content-Type: application/json" | jq '.'

# 8. Получение события по ID
curl -X GET "${BASE_URL}/event/1" \
  -H "Content-Type: application/json" | jq '.'

# 9. Создание нового события
curl -X POST "${BASE_URL}/event" \
  -H "Content-Type: application/json" \
  -d '{
    "nko_id": 1,
    "name": "Тестовое событие",
    "description": "Описание тестового события",
    "address": "ул. Тестовая, д. 1",
    "picture": "https://example.com/picture.jpg",
    "latitude": 55.751244,
    "longitude": 37.618423,
    "starts_at": "2024-12-01T10:00:00",
    "finish_at": "2024-12-01T18:00:00",
    "created_by": 1,
    "state": "draft",
    "meta": "{}",
    "categories": ["Спорт", "Культура"]
  }' | jq '.'

# 10. Удаление события (раскомментируйте для использования)
# curl -X DELETE "${BASE_URL}/event/999" \
#   -H "Content-Type: application/json" | jq '.'