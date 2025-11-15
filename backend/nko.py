from typing import Any, Dict, List, Optional

from fastapi import Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Session

from database import get_db
from models import (
    NKOInDB,
    CityInDB,
    NKOCategoryInDB,
    NKOCategoriesLinkInDB,
)


class NKOFilterRequest(BaseModel):
    """Модель запроса для фильтрации НКО"""

    jwt_token: str  # Пока просто строка
    city: Optional[str] = None
    favorite: Optional[bool] = None
    category: Optional[List[str]] = None
    regex: Optional[str] = None


class NKOResponse(BaseModel):
    """Модель ответа с данными НКО"""

    id: int
    name: str
    description: Optional[str]
    logo: Optional[str]
    address: str
    city: Optional[str]
    latitude: float
    longitude: float
    meta: Optional[Dict[str, Any]]
    created_at: Optional[str]
    categories: List[str]


def fetch_nko(filters: NKOFilterRequest, db: Session) -> List[NKOResponse]:
    """
    Получение списка НКО с фильтрацией

    Args:
        filters: Параметры фильтрации
        db: Сессия базы данных

    Returns:
        Список НКО с их категориями
    """
    
    try:
        # Базовый запрос с JOIN к городам
        query = (
            db.query(NKOInDB, CityInDB.name.label("city_name"))
            .join(CityInDB, NKOInDB.city_id == CityInDB.id)
        )
        
        # Фильтр по городу (поиск по имени города)
        if filters.city:
            query = query.filter(CityInDB.name.ilike(f"%{filters.city}%"))
        
        # Фильтр по категориям
        if filters.category and len(filters.category) > 0:
            # Подзапрос для фильтрации по категориям
            subquery = (
                db.query(NKOCategoriesLinkInDB.nko_id)
                .join(NKOCategoryInDB, NKOCategoriesLinkInDB.category_id == NKOCategoryInDB.id)
                .filter(NKOCategoryInDB.name.in_(filters.category))
            )
            query = query.filter(NKOInDB.id.in_(subquery))
        
        # Фильтр по regex (поиск в имени и описании)
        if filters.regex:
            query = query.filter(
                or_(
                    NKOInDB.name.op("~*")(filters.regex),
                    NKOInDB.description.op("~*")(filters.regex)
                )
            )
        
        # TODO: Фильтр по избранным (требует таблицы favorites и user_id из JWT)
        # if filters.favorite and filters.jwt_token:
        #     user_id = decode_jwt(filters.jwt_token)
        #     query = query.filter(exists().where(
        #         and_(Favorites.nko_id == NKOInDB.id, Favorites.user_id == user_id)
        #     ))
        
        # Сортировка по дате создания
        query = query.order_by(NKOInDB.created_at.desc())
        
        # Выполнение запроса
        rows = query.all()
        
        # Получение категорий для каждого НКО
        nko_list = []
        for nko, city_name in rows:
            # Запрос категорий для текущего НКО
            categories = (
                db.query(NKOCategoryInDB.name)
                .join(NKOCategoriesLinkInDB, NKOCategoryInDB.id == NKOCategoriesLinkInDB.category_id)
                .filter(NKOCategoriesLinkInDB.nko_id == nko.id)
                .all()
            )
            categories = [cat[0] for cat in categories]
            
            # Извлечение координат из POINT
            # coords уже обработан result_processor и возвращается как tuple
            if nko.coords and isinstance(nko.coords, (tuple, list)) and len(nko.coords) == 2:
                latitude, longitude = float(nko.coords[0]), float(nko.coords[1])
            else:
                latitude, longitude = 0.0, 0.0
            
            nko_data = NKOResponse(
                id=nko.id,
                name=nko.name,
                description=nko.description,
                logo=nko.logo,
                address=nko.address,
                city=city_name,
                latitude=latitude,
                longitude=longitude,
                meta=nko.meta if nko.meta else None,
                created_at=nko.created_at.isoformat() if nko.created_at else None,
                categories=categories,
            )
            nko_list.append(nko_data)
        
        return nko_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
