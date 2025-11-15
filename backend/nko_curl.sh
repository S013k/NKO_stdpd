#!/bin/bash

curl -X POST http://localhost/api/nko \
  -H "Content-Type: application/json" \
  -d '{"jwt_token": "test-token", "city": "Москва"}'

curl -X POST http://localhost/api/nko \
  -H "Content-Type: application/json" \
  -d '{"jwt_token": "test-token", "category": "Экологические инициативы"}'

curl -X POST http://localhost/api/nko \
  -H "Content-Type: application/json" \
  -d '{"jwt_token": "test-token", "regex": "инициативы"}'

# Получение конкретного НКО по ID
curl -X GET http://localhost/api/nko/1
