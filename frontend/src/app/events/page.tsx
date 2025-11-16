'use client'

import { Header } from '@/components/Header'
import { EventCard } from '@/components/EventCard'
import { Footer } from '@/components/Footer'
import { PageHeader } from '@/components/PageHeader'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, Calendar, Heart, X } from 'lucide-react'
import { fetchEvents, fetchCities, fetchNKO, EventResponse, CityResponse, EventFilters, NKOResponse } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useMemo, useEffect } from 'react'

export default function EventsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedNKO, setSelectedNKO] = useState<string>('all')
  const [selectedDateFrom, setSelectedDateFrom] = useState<string>('')
  const [selectedDateTo, setSelectedDateTo] = useState<string>('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [eventsData, setEventsData] = useState<EventResponse[]>([])
  const [cities, setCities] = useState<CityResponse[]>([])
  const [nkoList, setNkoList] = useState<NKOResponse[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // DEBUG: Log authentication state
  console.log('DEBUG: Events Page - User auth state:', {
    user: user ? { id: user.id, login: user.login, role: user.role } : null,
    authLoading
  })
  console.log('DEBUG: Events Page - Show favorites only:', showFavoritesOnly)

  // Загрузка данных при монтировании компонента и изменении фильтров
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // DEBUG: Log filter parameters
        const filters: EventFilters = {}
        if (selectedCity !== 'all') {
          filters.city = selectedCity
        }
        if (selectedCategory !== 'all') {
          filters.category = [selectedCategory]
        }
        if (searchTerm) {
          filters.regex = searchTerm
        }
        if (selectedNKO !== 'all') {
          filters.nko_id = [parseInt(selectedNKO)]
        }
        if (selectedDateFrom) {
          filters.time_from = selectedDateFrom + 'T00:00:00'
        }
        if (selectedDateTo) {
          filters.time_to = selectedDateTo + 'T23:59:59'
        }
        
        // Добавляем фильтр по избранным только для авторизованных пользователей
        if (showFavoritesOnly && user) {
          filters.favorite = true
          console.log('DEBUG: Events Page - Applying favorites filter for user:', user.id)
        } else if (showFavoritesOnly && !user) {
          console.warn('DEBUG: Events Page - Cannot apply favorites filter - user not authenticated')
          // Не применяем фильтр если пользователь не авторизован
        }
        
        console.log('DEBUG: Events Page - Loading data with filters:', filters)
        console.log('DEBUG: Events Page - Show favorites only:', showFavoritesOnly)
        console.log('DEBUG: Events Page - User authenticated:', !!user)
        
        // Параллельно загружаем события, города и НКО
        const [eventsResponse, citiesResponse, nkoResponse] = await Promise.all([
          fetchEvents(filters),
          fetchCities(),
          fetchNKO()
        ])
        
        // DEBUG: Log event data structure
        console.log('DEBUG: Events - Sample event data:', eventsResponse[0])
        console.log('DEBUG: Events - All event cities:', eventsResponse.map(e => ({ id: e.id, name: e.name, nko_name: e.nko_name })))
        console.log('DEBUG: Events - Loaded events count:', eventsResponse.length)
        
        // Сортируем события по дате (ближайшие первые)
        const sortedEvents = eventsResponse.sort((a, b) => {
          const dateA = new Date(a.starts_at || 0)
          const dateB = new Date(b.starts_at || 0)
          return dateA.getTime() - dateB.getTime()
        })
        
        setEventsData(sortedEvents)
        setCities(citiesResponse)
        setNkoList(nkoResponse)
        
        // Извлекаем уникальные категории из событий
        const uniqueCategories = Array.from(
          new Set(eventsResponse.flatMap(event => event.categories))
        ).sort()
        setCategories(uniqueCategories)
        
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Не удалось загрузить данные. Попробуйте обновить страницу.')
      } finally {
        setLoading(false)
      }
    }

    // Ждем окончания загрузки авторизации перед загрузкой данных
    if (!authLoading) {
      loadData()
    }
  }, [authLoading, selectedCity, selectedCategory, searchTerm, selectedNKO, selectedDateFrom, selectedDateTo, showFavoritesOnly, user])

  const filteredEvents = useMemo(() => {
    // Since we're now using server-side filtering, we just need to handle client-side search
    return eventsData.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return matchesSearch
    })
  }, [eventsData, searchTerm])

  // Модальное окно авторизации
  const AuthModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center min-h-screen z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <h3 className="text-lg font-semibold text-gray-900 text-center">Требуется авторизация</h3>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="text-center text-gray-600 mb-4">
            Чтобы добавлять события в избранное, пожалуйста, войдите в систему
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAuthModal(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Заголовок страницы */}
      <PageHeader
        title="События"
        description="Узнайте о предстоящих мероприятиях, событиях и инициативах в вашем городе"
      />
      
      {/* Фильтры */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Поиск */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Поиск событий..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Фильтр по категории */}
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Фильтр по городу */}
              <div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <SelectValue placeholder="Все города" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все города</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Фильтр по НКО */}
              <div>
                <Select value={selectedNKO} onValueChange={setSelectedNKO}>
                  <SelectTrigger className="border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <SelectValue placeholder="Все НКО" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все НКО</SelectItem>
                    {nkoList.map((nko) => (
                      <SelectItem key={nko.id} value={nko.id.toString()}>
                        {nko.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Фильтр по избранным (для всех пользователей) */}
              <div>
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  onClick={() => {
                    if (!user) {
                      setShowAuthModal(true)
                    } else {
                      setShowFavoritesOnly(!showFavoritesOnly)
                    }
                  }}
                  className={`w-full ${showFavoritesOnly ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  Избранные
                </Button>
              </div>
              
              {/* Сброс фильтров */}
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSelectedCity('all')
                    setSelectedNKO('all')
                    setSelectedDateFrom('')
                    setSelectedDateTo('')
                    setShowFavoritesOnly(false)
                    setShowAuthModal(false)
                  }}
                  className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Сбросить
                </Button>
              </div>
            </div>
            
            {/* Фильтр по датам */}
            <div className="mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Период событий</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="date"
                      placeholder="От"
                      value={selectedDateFrom}
                      onChange={(e) => setSelectedDateFrom(e.target.value)}
                      className="border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    </div>
                  <div className="flex items-center text-gray-500">
                    —
                  </div>
                  <div className="flex-1">
                    <Input
                      type="date"
                      placeholder="До"
                      value={selectedDateTo}
                      onChange={(e) => setSelectedDateTo(e.target.value)}
                      className="border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Результаты поиска */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Индикатор загрузки */}
          {loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <Calendar className="h-8 w-8 text-[var(--color-text-secondary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Загрузка событий...
              </h3>
            </div>
          )}

          {/* Сообщение об ошибке */}
          {error && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Ошибка загрузки
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Обновить страницу
              </Button>
            </div>
          )}

          {/* Результаты когда данные загружены */}
          {!loading && !error && (
            <>
              {/* Количество результатов */}
              <div className="mb-8">
                <p className="text-[var(--color-text-secondary)]">
                  Найдено событий: <span className="font-semibold text-[var(--color-text-primary)]">{filteredEvents.length}</span>
                </p>
              </div>

              {/* Сетка карточек */}
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-[var(--color-text-secondary)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    События не найдены
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-6">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setSelectedCity('all')
                      setSelectedNKO('all')
                      setSelectedDateFrom('')
                      setSelectedDateTo('')
                    }}
                    className="btn-primary"
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}