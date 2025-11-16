from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal, Union
import httpx
import os
from datetime import datetime

# Создаем FastAPI приложение для MCP
app = FastAPI(
    title="MCP Server - НКО Добрые дела Росатома",
    description="Model Context Protocol сервер для портала Добрые дела Росатома",
    version="1.0.0"
)

# URL бэкенда из переменной окружения
BACKEND_URL = os.getenv("BACKEND_URL", "http://cora:8000")

# HTTP клиент для запросов к бэкенду
http_client = httpx.AsyncClient(base_url=BACKEND_URL, timeout=30.0)


# ===== БАЗОВЫЕ ЭНДПОИНТЫ =====

@app.get("/")
async def root():
    """Корневой эндпоинт MCP сервера"""
    return {
        "name": "НКО Добрые дела Росатома MCP Server",
        "version": "1.0.0",
        "backend": BACKEND_URL,
        "capabilities": {
            "tools": ["get_news", "get_events", "get_nko", "search", "get_favorites"],
            "resources": ["news", "events", "nko", "cities"],
            "prompts": ["help_user", "find_volunteer_opportunities"]
        }
    }


@app.get("/health")
async def health():
    """Health check для мониторинга"""
    try:
        response = await http_client.get("/health")
        backend_status = "healthy" if response.status_code == 200 else "unhealthy"
    except:
        backend_status = "unreachable"
    
    return {
        "status": "healthy",
        "backend": backend_status,
        "timestamp": datetime.utcnow().isoformat()
    }


# ===== PYDANTIC МОДЕЛИ =====

class ToolRequest(BaseModel):
    """Базовая модель для запросов инструментов"""
    pass


class NewsToolRequest(ToolRequest):
    jwt_token: str = ""
    city: Optional[str] = None
    favorite: Optional[bool] = None
    regex: Optional[str] = None


class EventsToolRequest(ToolRequest):
    jwt_token: str = ""
    nko_id: Optional[List[int]] = None
    city: Optional[str] = None
    favorite: Optional[bool] = None
    category: Optional[List[str]] = None
    regex: Optional[str] = None
    time_from: Optional[str] = None
    time_to: Optional[str] = None


class NKOToolRequest(ToolRequest):
    jwt_token: str = ""
    city: Optional[str] = None
    favorite: Optional[bool] = None
    category: Optional[List[str]] = None
    regex: Optional[str] = None


class SearchRequest(ToolRequest):
    query: str
    entity_type: Optional[str] = None  # "news", "events", "nko"


# ===== TOOLS - Инструменты для Claude =====

@app.post("/tools/get_news")
async def tool_get_news(request: NewsToolRequest) -> Dict[str, Any]:
    """
    Инструмент: Получить список новостей
    
    Этот инструмент позволяет получить новости портала с различными фильтрами.
    Можно фильтровать по городу, искать избранные новости (требуется токен),
    или использовать регулярные выражения для поиска.
    """
    try:
        params = {}
        if request.jwt_token:
            params["jwt_token"] = request.jwt_token
        if request.city:
            params["city"] = request.city
        if request.favorite is not None:
            params["favorite"] = request.favorite
        if request.regex:
            params["regex"] = request.regex
        
        response = await http_client.get("/news", params=params)
        response.raise_for_status()
        
        return {
            "success": True,
            "data": response.json(),
            "count": len(response.json())
        }
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении новостей: {str(e)}")


@app.post("/tools/get_events")
async def tool_get_events(request: EventsToolRequest) -> Dict[str, Any]:
    """
    Инструмент: Получить список мероприятий
    
    Позволяет найти мероприятия с фильтрацией по:
    - НКО (одно или несколько)
    - Городу
    - Категориям (спорт, образование и т.д.)
    - Времени проведения
    - Избранным (требуется токен)
    """
    try:
        params = {}
        if request.jwt_token:
            params["jwt_token"] = request.jwt_token
        if request.nko_id:
            params["nko_id"] = request.nko_id
        if request.city:
            params["city"] = request.city
        if request.favorite is not None:
            params["favorite"] = request.favorite
        if request.category:
            params["category"] = request.category
        if request.regex:
            params["regex"] = request.regex
        if request.time_from:
            params["time_from"] = request.time_from
        if request.time_to:
            params["time_to"] = request.time_to
        
        response = await http_client.get("/event", params=params)
        response.raise_for_status()
        
        return {
            "success": True,
            "data": response.json(),
            "count": len(response.json())
        }
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении мероприятий: {str(e)}")

class MCPRequest(BaseModel):
    """Базовая модель MCP запроса"""
    jsonrpc: str = "2.0"
    id: Optional[int] = None
    method: str
    params: Optional[Dict[str, Any]] = None


class MCPError(BaseModel):
    """Модель ошибки MCP"""
    code: int
    message: str
    data: Optional[Dict[str, Any]] = None


class MCPResponse(BaseModel):
    """Базовая модель MCP ответа"""
    jsonrpc: str = "2.0"
    id: Optional[int] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[MCPError] = None
    
    class Config:
        # Исключаем None значения из сериализации
        exclude_none = True


class MCPSuccessResponse(BaseModel):
    """Успешный MCP ответ"""
    jsonrpc: str = "2.0"
    id: Optional[int] = None
    result: Dict[str, Any]


class MCPErrorResponse(BaseModel):
    """MCP ответ с ошибкой"""
    jsonrpc: str = "2.0"
    id: Optional[int] = None
    error: MCPError

class ToolSchema(BaseModel):
    """Схема инструмента MCP"""
    name: str
    description: str
    inputSchema: Dict[str, Any]


class ResourceSchema(BaseModel):
    """Схема ресурса MCP"""
    uri: str
    name: str
    description: Optional[str] = None
    mimeType: Optional[str] = "application/json"


class PromptSchema(BaseModel):
    """Схема промпта MCP"""
    name: str
    description: str
    arguments: Optional[List[Dict[str, Any]]] = None


@app.post("/")
async def mcp_endpoint(request: MCPRequest) -> Union[MCPSuccessResponse, MCPErrorResponse]:
    """
    Главный эндпоинт MCP протокола
    Обрабатывает все MCP запросы согласно спецификации
    """
    try:
        method = request.method
        params = request.params or {}
        
        # Initialize
        if method == "initialize":
            return MCPSuccessResponse(
                id=request.id,
                result={
                    "protocolVersion": "2024-11-05",
                    "serverInfo": {
                        "name": "nko-rosatom-mcp",
                        "version": "1.0.0"
                    },
                    "capabilities": {
                        "tools": {},
                        "resources": {},
                        "prompts": {}
                    }
                }
            )
        
        # List tools
        elif method == "tools/list":
            tools = [
                ToolSchema(
                    name="get_news",
                    description="Получить список новостей портала с фильтрацией по городу и другим параметрам",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "jwt_token": {"type": "string", "description": "JWT токен для получения избранных"},
                            "city": {"type": "string", "description": "Фильтр по городу"},
                            "favorite": {"type": "boolean", "description": "Только избранные новости"},
                            "regex": {"type": "string", "description": "Поиск по тексту"}
                        }
                    }
                ),
                ToolSchema(
                    name="get_events",
                    description="Получить список мероприятий с фильтрацией по различным параметрам",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "jwt_token": {"type": "string", "description": "JWT токен"},
                            "nko_id": {"type": "array", "items": {"type": "integer"}, "description": "ID НКО"},
                            "city": {"type": "string", "description": "Город"},
                            "favorite": {"type": "boolean", "description": "Только избранные"},
                            "category": {"type": "array", "items": {"type": "string"}, "description": "Категории"},
                            "regex": {"type": "string", "description": "Поиск по тексту"},
                            "time_from": {"type": "string", "description": "Время начала (ISO)"},
                            "time_to": {"type": "string", "description": "Время окончания (ISO)"}
                        }
                    }
                ),
                ToolSchema(
                    name="get_nko",
                    description="Получить список некоммерческих организаций",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "jwt_token": {"type": "string", "description": "JWT токен"},
                            "city": {"type": "string", "description": "Город"},
                            "favorite": {"type": "boolean", "description": "Только избранные"},
                            "category": {"type": "array", "items": {"type": "string"}, "description": "Категории"},
                            "regex": {"type": "string", "description": "Поиск по тексту"}
                        }
                    }
                ),
                ToolSchema(
                    name="search",
                    description="Универсальный поиск по всем сущностям (новости, мероприятия, НКО)",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Поисковый запрос"},
                            "entity_type": {
                                "type": "string", 
                                "enum": ["news", "events", "nko"],
                                "description": "Тип сущности для поиска (опционально)"
                            }
                        },
                        "required": ["query"]
                    }
                ),
                ToolSchema(
                    name="get_cities",
                    description="Получить список всех городов в системе",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "regex": {"type": "string", "description": "Фильтр по названию"}
                        }
                    }
                )
            ]
            return MCPSuccessResponse(
                id=request.id,
                result={"tools": [tool.dict() for tool in tools]}
            )
        
        # Call tool
        elif method == "tools/call":
            tool_name = params.get("name")
            arguments = params.get("arguments", {})
            
            result = None
            
            if tool_name == "get_news":
                result = await tool_get_news(NewsToolRequest(**arguments))
            elif tool_name == "get_events":
                result = await tool_get_events(EventsToolRequest(**arguments))
            elif tool_name == "get_nko":
                result = await tool_get_nko(NKOToolRequest(**arguments))
            elif tool_name == "search":
                result = await tool_search(SearchRequest(**arguments))
            elif tool_name == "get_cities":
                cities_result = await tool_get_cities(arguments.get("regex"))
                result = cities_result
            else:
                return MCPErrorResponse(
                    id=request.id,
                    error=MCPError(
                        code=-32601,
                        message=f"Unknown tool: {tool_name}"
                    )
                )
            
            return MCPSuccessResponse(
                id=request.id,
                result={
                    "content": [
                        {
                            "type": "text",
                            "text": str(result)
                        }
                    ]
                }
            )
        
        # List resources
        elif method == "resources/list":
            resources = [
                ResourceSchema(
                    uri="news://{id}",
                    name="Новость",
                    description="Детальная информация о новости"
                ),
                ResourceSchema(
                    uri="event://{id}",
                    name="Мероприятие",
                    description="Детальная информация о мероприятии"
                ),
                ResourceSchema(
                    uri="nko://{id}",
                    name="НКО",
                    description="Детальная информация об НКО"
                )
            ]
            return MCPSuccessResponse(
                id=request.id,
                result={"resources": [res.dict() for res in resources]}
            )
        
        # Read resource
        elif method == "resources/read":
            uri = params.get("uri", "")
            
            if uri.startswith("news://"):
                news_id = int(uri.replace("news://", ""))
                result = await resource_news(news_id)
            elif uri.startswith("event://"):
                event_id = int(uri.replace("event://", ""))
                result = await resource_event(event_id)
            elif uri.startswith("nko://"):
                nko_id = int(uri.replace("nko://", ""))
                result = await resource_nko(nko_id)
            else:
                return MCPErrorResponse(
                    id=request.id,
                    error=MCPError(
                        code=-32602,
                        message=f"Invalid resource URI: {uri}"
                    )
                )
            
            return MCPSuccessResponse(
                id=request.id,
                result={
                    "contents": [
                        {
                            "uri": uri,
                            "mimeType": "application/json",
                            "text": str(result)
                        }
                    ]
                }
            )
        
        # List prompts
        elif method == "prompts/list":
            prompts = [
                PromptSchema(
                    name="help_user",
                    description="Помочь пользователю найти информацию на портале"
                ),
                PromptSchema(
                    name="find_volunteer_opportunities",
                    description="Помочь найти подходящие волонтерские мероприятия"
                )
            ]
            return MCPSuccessResponse(
                id=request.id,
                result={"prompts": [p.dict() for p in prompts]}
            )
        
        # Get prompt
        elif method == "prompts/get":
            prompt_name = params.get("name")
            
            if prompt_name == "help_user":
                result = await prompt_help_user()
            elif prompt_name == "find_volunteer_opportunities":
                result = await prompt_find_volunteer()
            else:
                return MCPErrorResponse(
                    id=request.id,
                    error=MCPError(
                        code=-32602,
                        message=f"Unknown prompt: {prompt_name}"
                    )
                )
            
            return MCPSuccessResponse(
                id=request.id,
                result={
                    "description": result["description"],
                    "messages": [
                        {
                            "role": "user",
                            "content": {
                                "type": "text",
                                "text": result["template"]
                            }
                        }
                    ]
                }
            )
        
        else:
            return MCPErrorResponse(
                id=request.id,
                error=MCPError(
                    code=-32601,
                    message=f"Method not found: {method}"
                )
            )
    
    except Exception as e:
        return MCPErrorResponse(
            id=request.id,
            error=MCPError(
                code=-32603,
                message=f"Internal error: {str(e)}"
            )
        )
@app.post("/tools/get_nko")
async def tool_get_nko(request: NKOToolRequest) -> Dict[str, Any]:
    """
    Инструмент: Получить список НКО
    
    Поиск некоммерческих организаций с фильтрацией по:
    - Городу
    - Категориям деятельности
    - Избранным (требуется токен)
    - Текстовому поиску (regex)
    """
    try:
        params = {}
        if request.jwt_token:
            params["jwt_token"] = request.jwt_token
        if request.city:
            params["city"] = request.city
        if request.favorite is not None:
            params["favorite"] = request.favorite
        if request.category:
            params["category"] = request.category
        if request.regex:
            params["regex"] = request.regex
        
        response = await http_client.get("/nko", params=params)
        response.raise_for_status()
        
        return {
            "success": True,
            "data": response.json(),
            "count": len(response.json())
        }
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении НКО: {str(e)}")


@app.post("/tools/search")
async def tool_search(request: SearchRequest) -> Dict[str, Any]:
    """
    Инструмент: Универсальный поиск
    
    Поиск по всем сущностям (новости, мероприятия, НКО) или по конкретному типу.
    Использует текстовый запрос для поиска по названиям, описаниям и другим полям.
    """
    try:
        results = {}
        
        # Поиск по новостям
        if not request.entity_type or request.entity_type == "news":
            news_response = await http_client.get("/news", params={"regex": request.query})
            if news_response.status_code == 200:
                results["news"] = news_response.json()
        
        # Поиск по мероприятиям
        if not request.entity_type or request.entity_type == "events":
            events_response = await http_client.get("/event", params={"regex": request.query})
            if events_response.status_code == 200:
                results["events"] = events_response.json()
        
        # Поиск по НКО
        if not request.entity_type or request.entity_type == "nko":
            nko_response = await http_client.get("/nko", params={"regex": request.query})
            if nko_response.status_code == 200:
                results["nko"] = nko_response.json()
        
        total_count = sum(len(v) for v in results.values())
        
        return {
            "success": True,
            "query": request.query,
            "results": results,
            "total_count": total_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка поиска: {str(e)}")


@app.get("/tools/get_cities")
async def tool_get_cities(regex: Optional[str] = None) -> Dict[str, Any]:
    """
    Инструмент: Получить список городов
    
    Получает список всех городов в системе с возможностью фильтрации.
    """
    try:
        params = {}
        if regex:
            params["regex"] = regex
        
        response = await http_client.get("/city", params=params)
        response.raise_for_status()
        
        return {
            "success": True,
            "data": response.json(),
            "count": len(response.json())
        }
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении городов: {str(e)}")


# ===== RESOURCES - Ресурсы для детальной информации =====

@app.get("/resources/news/{news_id}")
async def resource_news(news_id: int) -> Dict[str, Any]:
    """
    Ресурс: Детальная информация о новости
    
    Возвращает полную информацию о конкретной новости по ID.
    """
    try:
        response = await http_client.get(f"/news/{news_id}")
        response.raise_for_status()
        return {
            "success": True,
            "data": response.json()
        }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Новость не найдена")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении новости: {str(e)}")


@app.get("/resources/event/{event_id}")
async def resource_event(event_id: int) -> Dict[str, Any]:
    """
    Ресурс: Детальная информация о мероприятии
    
    Возвращает полную информацию о конкретном мероприятии по ID.
    """
    try:
        response = await http_client.get(f"/event/{event_id}")
        response.raise_for_status()
        return {
            "success": True,
            "data": response.json()
        }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Мероприятие не найдено")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении мероприятия: {str(e)}")


@app.get("/resources/nko/{nko_id}")
async def resource_nko(nko_id: int) -> Dict[str, Any]:
    """
    Ресурс: Детальная информация об НКО
    
    Возвращает полную информацию о конкретной НКО по ID.
    """
    try:
        response = await http_client.get(f"/nko/{nko_id}")
        response.raise_for_status()
        return {
            "success": True,
            "data": response.json()
        }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="НКО не найдена")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении НКО: {str(e)}")


# ===== PROMPTS - Готовые промпты для Claude =====

@app.get("/prompts/help_user")
async def prompt_help_user() -> Dict[str, Any]:
    """
    Промпт: Помощь пользователю портала
    
    Инструкция для AI-ассистента по помощи пользователям портала.
    """
    return {
        "name": "help_user",
        "description": "Помочь пользователю найти информацию на портале Добрые дела Росатома",
        "template": """
Ты - дружелюбный ассистент портала "Добрые дела Росатома".

Твоя задача - помогать пользователям:
1. Находить интересные мероприятия для волонтерства
2. Узнавать информацию об НКО в их городе
3. Читать актуальные новости о благотворительности
4. Ориентироваться в возможностях портала

Используй доступные инструменты:
- get_news - для поиска новостей
- get_events - для поиска мероприятий
- get_nko - для поиска НКО
- search - для общего поиска
- get_cities - для списка городов

Будь вежливым, информативным и помогай пользователям стать волонтерами!
        """
    }


@app.get("/prompts/find_volunteer_opportunities")
async def prompt_find_volunteer() -> Dict[str, Any]:
    """
    Промпт: Поиск возможностей для волонтерства
    
    Специализированная инструкция для помощи в поиске волонтерских возможностей.
    """
    return {
        "name": "find_volunteer_opportunities",
        "description": "Помочь найти подходящие волонтерские мероприятия",
        "template": """
Помоги пользователю найти подходящие волонтерские возможности.

Шаги:
1. Спроси о городе пользователя
2. Узнай о интересующих категориях (помощь детям, экология, образование и т.д.)
3. Используй get_events с соответствующими фильтрами
4. Покажи наиболее подходящие мероприятия
5. Предложи информацию об НКО, организующих эти мероприятия

Подчеркни важность волонтерства и помоги сделать первый шаг!
        """
    }


# Событие завершения - закрытие HTTP клиента
@app.on_event("shutdown")
async def shutdown():
    await http_client.aclose()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
