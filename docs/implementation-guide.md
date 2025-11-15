# Практическое руководство по реализации «Добрые дела Росатома»

## Пошаговый процесс разработки

### Этап 1: Подготовка проекта

#### 1.1 Создание Next.js проекта
```bash
npx create-next-app@latest nko-rosatom --typescript --tailwind --eslint --app
cd nko-rosatom
```

#### 1.2 Установка зависимостей
```bash
npm install @radix-ui/react-icons lucide-react
npm install -D @types/node
```

#### 1.3 Настройка shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select
```

### Этап 2: Настройка стилей и шрифтов

#### 2.1 Подключение шрифтов Rosatom
Скопировать файлы шрифтов из папки `shrifty/Rosatom_ttf/` в `public/fonts/`

#### 2.2 Настройка CSS переменных в `globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@font-face {
  font-family: 'Rosatom';
  src: url('/fonts/Rosatom-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Rosatom';
  src: url('/fonts/Rosatom-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Rosatom';
  src: url('/fonts/Rosatom-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Rosatom';
  src: url('/fonts/Rosatom-Italic.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
}

:root {
  /* Цветовая палитра Росатома */
  --color-primary: #025EA1;
  --color-primary-hover: #003274;
  --color-secondary: #6CACE4;
  --color-success: #56C02B;
  --color-error: #FF0000;
  --color-warning: #FCC30B;
  --color-info: #FD6925;

  /* Текстовые цвета */
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F8F8F8;
  --color-border: #E0E0E0;
  --color-border-light: #CCCCCC;

  /* Типографика */
  --font-family: 'Rosatom', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;
  --font-size-5xl: 38px;

  /* Отступы */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Скругления и тени */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.2);

  /* Анимации */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  line-height: 1.6;
}
```

### Этап 3: Создание компонентов

#### 3.1 Базовые компоненты UI

**components/ui/button.tsx**
```tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] min-h-[44px] px-6",
        secondary: "bg-[var(--color-bg-secondary)] text-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-border-light)]",
        outline: "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### 3.2 Компонент Header

**components/Header.tsx**
```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, MapPin } from 'lucide-react'
import { Button } from './ui/button'
import Image from 'next/image'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo-rosatom.png" 
              alt="Росатом" 
              width={120} 
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/nko" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
              НКО
            </Link>
            <Link href="/news" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
              Новости
            </Link>
            <Link href="/knowledge" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
              База знаний
            </Link>
            <Link href="/calendar" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
              Календарь
            </Link>
          </nav>

          {/* Выбор города */}
          <div className="hidden md:flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
            <select className="border border-[var(--color-border)] rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <option>Москва</option>
              <option>Саров</option>
              <option>Обнинск</option>
            </select>
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Мобильная навигация */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/nko" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                НКО
              </Link>
              <Link href="/news" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                Новости
              </Link>
              <Link href="/knowledge" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                База знаний
              </Link>
              <Link href="/calendar" className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                Календарь
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
```

#### 3.3 Компонент Hero

**components/Hero.tsx**
```tsx
import { Button } from './ui/button'
import { MapPin } from 'lucide-react'

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-[#15256D] to-[#003274] text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Добрые дела Росатома
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          все инициативы вашего города в одном месте
        </p>
        
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg opacity-90 leading-relaxed">
            Единый портал для жителей, волонтёров и НКО, где собрана вся информация о социальных, 
            экологических, культурных, образовательных и спортивных инициативах в городах 
            присутствия Росатома.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
            <MapPin className="h-5 w-5" />
            <select className="bg-transparent text-white border-none focus:outline-none font-medium">
              <option>Москва</option>
              <option>Саров</option>
              <option>Обнинск</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6">
            Станьте частью добрых дел в вашем городе!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
              <h3 className="font-semibold text-lg mb-2">📍 Карта</h3>
              <p>Найдите организации по городу и направлению деятельности.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
              <h3 className="font-semibold text-lg mb-2">📚 База знаний</h3>
              <p>Просматривайте видео и материалы для скачивания.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
              <h3 className="font-semibold text-lg mb-2">📅 Календарь</h3>
              <p>Отметьте интересные события, чтобы ничего не пропустить.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
              <h3 className="font-semibold text-lg mb-2">📰 Новости</h3>
              <p>Будьте в курсе последних инициатив и грантов.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### Этап 4: Создание мокданных

#### 4.1 Данные НКО

**data/nko.ts**
```typescript
export interface NKO {
  id: string
  name: string
  category: string
  description: string
  fullDescription?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  social?: {
    vk?: string
    telegram?: string
  }
  logo?: string
  volunteerFunction: string
  projects?: string[]
}

export const nkoData: NKO[] = [
  {
    id: '1',
    name: 'Фонд поддержки социальных инициатив',
    category: 'Социальная помощь',
    description: 'Помощь малоимущим семьям, одиноким пожилым людям и людям с ограниченными возможностями.',
    fullDescription: 'Фонд работает с 2015 года и оказывает комплексную поддержку уязвимым категориям граждан. Мы организуем продуктовые наборы, теплую одежду, юридические консультации и психологическую помощь.',
    address: 'г. Москва, ул. Добрая, д. 15',
    phone: '+7 (495) 123-45-67',
    email: 'info@social-fond.ru',
    website: 'https://social-fond.ru',
    social: {
      vk: 'https://vk.com/social_fond',
      telegram: 'https://t.me/social_fond'
    },
    logo: '/images/nko-logo-1.png',
    volunteerFunction: 'Сортировка и упаковка гуманитарной помощи, доставка продуктов, помощь в проведении мероприятий',
    projects: ['Продуктовый банк', 'Теплые вещи', 'Юридическая помощь']
  },
  {
    id: '2',
    name: 'Экологический патруль',
    category: 'Экология',
    description: 'Организация экологических акций, уборка мусора, посадка деревьев и просветительская деятельность.',
    fullDescription: 'Наше движение объединяет неравнодушных граждан, заботящихся о чистоте окружающей среды. Мы проводим регулярные субботники, образовательные лекции в школах и мониторинг экологической ситуации в городе.',
    address: 'г. Москва, пр. Экологический, д. 42',
    phone: '+7 (495) 234-56-78',
    email: 'eco@patrol.ru',
    website: 'https://eco-patrol.ru',
    social: {
      vk: 'https://vk.com/eco_patrol',
      telegram: 'https://t.me/eco_patrol'
    },
    logo: '/images/nko-logo-2.png',
    volunteerFunction: 'Участие в субботниках, проведение экологических уроков, мониторинг загрязнений',
    projects: ['Чистый город', 'Зеленые легкие', 'Эко-образование']
  },
  // Добавить еще 10-13 организаций...
]
```

#### 4.2 Данные новостей

**data/news.ts**
```typescript
export interface News {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  image?: string
  category?: string
}

export const newsData: News[] = [
  {
    id: '1',
    title: 'Росатом объявил о запуске нового грантового конкурса',
    excerpt: 'Государственная корпорация по атомной энергии выделила 50 миллионов рублей на поддержку социальных проектов в городах присутствия.',
    content: 'Государственная корпорация по атомной энергии "Росатом" объявила о старте нового грантового конкурса, направленного на поддержку социальных и благотворительных инициатив в городах присутствия компании. Общий бюджет конкурса составит 50 миллионов рублей.',
    date: '2024-11-15',
    image: '/images/news-1.jpg',
    category: 'Гранты'
  },
  {
    id: '2',
    title: 'В Сарове прошел волонтерский субботник',
    excerpt: 'Более 200 волонтеров приняли участие в уборке парков и скверов города в рамках акции "Чистый город".',
    content: 'В минувшие выходные в Сарове прошла масштабная экологическая акция "Чистий город", в которой приняли участие более 200 волонтеров из различных организаций и предприятий.',
    date: '2024-11-14',
    image: '/images/news-2.jpg',
    category: 'Мероприятия'
  },
  // Добавить еще 10-13 новостей...
]
```

### Этап 5: Создание страниц

#### 5.1 Главная страница

**app/page.tsx**
```tsx
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { NKOCard } from '@/components/NKOCard'
import { NewsCard } from '@/components/NewsCard'
import { Button } from '@/components/ui/button'
import { nkoData } from '@/data/nko'
import { newsData } from '@/data/news'
import Link from 'next/link'

export default function HomePage() {
  const featuredNKO = nkoData.slice(0, 3)
  const latestNews = newsData.slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Превью НКО */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Популярные организации
            </h2>
            <Link href="/nko">
              <Button variant="outline">Все организации</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredNKO.map((nko) => (
              <NKOCard key={nko.id} nko={nko} />
            ))}
          </div>
        </div>
      </section>

      {/* Превью новостей */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Последние новости
            </h2>
            <Link href="/news">
              <Button variant="outline">Все новости</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

### Этап 6: Использование @21st-dev/magic

При создании компонентов можно использовать @21st-dev/magic для генерации красивых UI элементов:

```bash
# Пример запроса для создания карточки НКО
/ui Создай красивую карточку для некоммерческой организации с логотипом, названием, категорией и описанием в стиле Росатом
```

### Этап 7: Тестирование и оптимизация

#### 7.1 Проверка адаптивности
- Тестирование на мобильных устройствах (320px+)
- Тестирование на планшетах (768px+)
- Тестирование на десктопе (1024px+)

#### 7.2 Оптимизация производительности
- Оптимизация изображений (Next.js Image)
- Ленивая загрузка компонентов
- Минимизация CSS и JS

#### 7.3 Кроссбраузерность
- Проверка в Chrome, Firefox, Safari, Edge
- Тестирование на мобильных браузерах

Это руководство обеспечивает пошаговую реализацию проекта с учетом всех требований ТЗ и брендбука Росатома.