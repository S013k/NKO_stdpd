#!/bin/bash

# Получение списка НКО с фильтром по городу
curl -G "http://localhost/api/nko" \
  --data-urlencode "jwt_token=test-token" \
  --data-urlencode "city=Москва"

# Получение списка НКО с фильтром по категории (одна категория)
curl -G "http://localhost/api/nko" \
  --data-urlencode "jwt_token=test-token" \
  --data-urlencode "category=Экологические инициативы"

# Получение списка НКО с фильтром по нескольким категориям
curl -G "http://localhost/api/nko" \
  --data-urlencode "jwt_token=test-token" \
  --data-urlencode "category=Помощь детям" \
  --data-urlencode "category=Образование"

# Получение списка НКО с фильтром по regex
curl -G "http://localhost/api/nko" \
  --data-urlencode "jwt_token=test-token" \
  --data-urlencode "regex=инициативы"

# Получение всех НКО без фильтров
curl -G "http://localhost/api/nko" \
  --data-urlencode "jwt_token=test-token"

# Получение конкретного НКО по ID
curl -X GET http://localhost/api/nko/1

# Создание нового НКО
curl -X POST http://localhost/api/nko \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тестовый фонд помощи",
    "description": "Описание тестового фонда для проверки API",
    "logo": "https://test-fond.ru/logo.png",
    "address": "г. Москва, ул. Тестовая, д. 1",
    "city": "Москва",
    "latitude": 55.7558,
    "longitude": 37.6173,
    "meta": {"url": "https://test-fond.ru", "phone": "+7 (495) 123-45-67"},
    "categories": ["Помощь детям", "Образование"]
  }'

# Удаление НКО по ID
curl -X DELETE http://localhost/api/nko/1
