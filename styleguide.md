# Стилевой гайд для сайта «Добрые дела Росатома»

***

## 1. Обзор проекта

- **Название:** Добрые дела Росатома
- **Тип:** Многостраничный портал
- **Аудитория:** жители городов присутствия ГК Росатом, НКО, волонтёры, координаторы
- **Дизайн:** современный, минимализм, точное соответствие брендбуку Росатома

***

## 2. Цветовая палитра

| Название            | HEX      | RGB           | CMYK           | Применение                              |
|---------------------|----------|---------------|----------------|-----------------------------------------|
| Pantone 660 C       | #025EA1  | 2, 94, 161    | 95, 67, 8, 0   | Акцент, кнопки, ссылки, выделения       |
| Pantone 284 C       | #6CACE4  | 108, 172, 228 | 59, 17, 0, 0   | Вторичный акцент, hover                 |
| Pantone White       | #FFFFFF  | 255,255,255   | 0,0,0,0        | Фон, текст на тёмном                    |
| Pantone Black       | #000000  | 0,0,0         | 0,0,0,100      | Основной текст, контуры                 |
| 90 Black (серый)    | #333333  | 51,51,51      | 0,0,0,90       | Основной текст на светлом               |
| Pantone 427 C       | #D3D3D3  | 211,211,211   | 0,0,0,23       | Разделители, фоны блоков                |

### Семантические цвета

- Успех: **6C02B (зелёный, Pantone 7738 C)
- Предупреждение: **CC30B (жёлтый, Pantone 7409 C)
- Ошибка: #FF0000 (красный, Pantone 485 C)
- Информация: **#6925 (оранжевый, Pantone 7578 C)

### Градиенты

- Основной: `linear-gradient(90deg, #15256D 0%, #003274 100%)`
- Для hero и крупных фонов

***

## 3. Типографика

- **Шрифт:** Rosatom (Light, Regular, Bold, Italic)
- **Заголовки:**
  - H1: Rosatom Bold, 32-38px, цвет #333333
  - H2: Rosatom Bold, 24-28px, цвет #025EA1
  - H3: Rosatom Regular, 18-20px, цвет #333333
  - H4: Rosatom Regular, 14-16px, цвет #333333
- **Параграф:** Rosatom Regular, 14-16px, #333333, line-height: 1.5-1.6
- **Вспомогательный:** Rosatom Light, 12-14px, #666666
- **Подписи:** Rosatom Light, 10-12px, #999999
- **Кнопки:** Rosatom Regular 14px, 500 (medium), центр
- **Label формы:** Rosatom Regular 13px, #333333

***

## 4. Сетка и отступы

- Основная единица: **8px**
- xs: 4px -  sm: 8px -  md: 16px -  lg: 24px -  xl: 32px -  2xl: 48px

### Примеры

- **Button:** Padding 16x12px, min-height 44px
- **Card:** Padding 24px, border-radius 8-12px, тень
- **Form:** Padding 12x10px, border-radius 6px
- **Контейнер:** max-width 1280px, рабочая 1216px

***

## 5. Компоненты

### Кнопки

```css
.btn-primary {
  background-color: #025EA1;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Rosatom', sans-serif;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-height: 44px;
}
.btn-primary:hover { background-color: #003274; }
.btn-primary:active { background-color: #002152; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
```

- Вторичная: #F0F0F0, #025EA1, border 1px #CCCCCC
- Ссылка: прозрачный фон, #025EA1
- С иконкой: 20x20px + 8px отступ

### Поля ввода

```css
input[type="text"], input[type="email"], textarea {
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px; font-family: 'Rosatom', sans-serif; color: #333333;
  transition: all 0.3s ease;
}
input:focus, textarea:focus {
  outline: none; border-color: #025EA1;
  box-shadow: 0 0 0 3px rgba(2,94,161,0.2);
}
input::placeholder { color: #CCCCCC; }
```

- Checkbox: 20x20px, border-radius 3px, checked #025EA1
- Сообщение об ошибке: #FF0000, 12px

### Карточка

```html
<div class="card">
  <img src="..." class="card__image">
  <span class="tag">Категория</span>
  <h3>Название</h3>
  <p>Описание</p>
  <button class="btn-secondary">Подробнее</button>
</div>
```
- card: background #FFF, border 1px #E0E0E0, radius 8px, padding 24px, тень
- Hover: усиленная тень, translateY(-4px)

### Теги и бейджи

- tag: фон #F0F0F0, текст #333, border-radius 4px, padding 4x12px
- category-tag: фон rgba(2,94,161,0.1), текст #025EA1, radius 16px

### Модальные окна

- Оверлей: rgba(0,0,0,0.4)
- Модаль: #FFF, radius 12px, padding 32px, max-width 600px, тень

### Навигация

- Header: высота 64px, #FFF, border-bottom 1px #E0E0E0, меню 14px #333, active #025EA1
- Sidebar: 280px desktop, фон #F8F8F8, иконки 20x20px
- Breadcrumb: 12px #666, separator #CCC

***

## 6. Макеты страниц

### Главная

1. Header
2. Hero: gradient, H1 + подзаголовок + город (select/dropdown) + кнопка
3. Call-to-action блоки: 4 карточки (иконка, заголовок, описание, кнопка)
4. Список НКО: слайдер/сетка 3 колонки, карточки
5. События: вертикальный список, иконка календаря
6. Footer: 4 колонки, соцсети, копирайт

### Список НКО

- Заголовок + фильтры (город, поиск, категории)
- Сортировка: select
- Сетка: 3/2/1 колонки по устройству
- Пагинация

### Профиль НКО

- Hero: gradient, лого по центру
- H1, категория, контакты, описание, события, галерея
- Sidebar: зарег. волонтёром, избранное, инфо-блоки

***

## 7. Состояния

- Hover: плавное изменение фона и тени (0.3s)
- Focus: border #025EA1, тень
- Active: text #025EA1, underline
- Disabled: opacity 0.5, cursor not-allowed
- Skeleton loaders: фон #F0F0F0, пульсация (1.5s)

***

## 8. Адаптивность

- Цветовая схема: светлая, опционально тёмная
- Mobile: 320-767px; полная ширина, шрифты -2px
- Tablet: 768-1023px; 2 колонки
- Desktop: 1024+; max-width 1280px
- Wide: 1440+, расширенные отступы

#### Размеры элементов на экранах

| Элемент   | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| H1        | 38px    | 32px   | 28px   |
| H2        | 28px    | 24px   | 20px   |
| P         | 16px    | 15px   | 14px   |
| Button    | 44px    | 44px   | 48px   |

***

## 9. Иконки

- Stroke, толщина 2px, 16/20/24/32/48px
- Цвет #025EA1, #666, #FFF

***

## 10. Анимации

- duration: fast (150ms), base (300ms), slow (500ms)
- easing: ease-in-out, ease-out, ease-in
- эффекты: opacity, slide, rotate, skeleton pulse

***

## 11. Интерактивные эффекты

- Кнопки: риппл 400ms, visual feedback <100ms
- Карточки: поднятие, усиление тени
- Form: disabled при загрузке, spinner внутри
- Валидация: ошибка - мигание, slide-in текста, icon (200ms); успешная - зелёная граница, fade-out error

***

## 12. Примеры CSS-переменных для проекта

```css
:root {
  --color-primary: #025EA1;
  --color-primary-hover: #003274;
  --color-secondary: #6CACE4;
  --color-success: #56C02B;
  --color-error: #FF0000;
  --color-warning: #FCC30B;
  --color-info: #FD6925;

  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-bg-primary: #FFF;
  --color-bg-secondary: #F8F8F8;
  --color-border: #E0E0E0;
  --color-border-light: #CCCCCC;

  --font-family: 'Rosatom', sans-serif;
  --font-size-sm: 12px; --font-size-base: 14px; --font-size-lg: 16px;
  --font-size-xl: 20px; --font-size-2xl: 28px; --font-size-3xl: 38px;

  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px;
  --spacing-lg: 24px; --spacing-xl: 32px; --spacing-2xl: 48px;

  --radius-sm: 4px; --radius-md: 6px; --radius-lg: 8px; --radius-xl: 12px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.2);
  --transition-fast: 150ms ease-in-out; --transition-base: 300ms ease-in-out; --transition-slow: 500ms ease-in-out;
}
```
***

## 13. Чеклист фронтэнда

- Все шрифты Rosatom загружены и подключены
- CSS переменные описаны
- Брейкпоинты заданы
- Глобальные резеты оформлены
- Иконки подготовлены (SVG)
- Цветовая палитра сохранена

***

## 14. Поддержка браузеров

- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, Mobile Safari 14+

***

## Итог

- Гайд полностью совместим с брендбуком и ТЗ
- Описаны все компоненты, стили, состояния, адаптивность и взаимодействие
- Можно сразу переходить к разработке UI для сайта
