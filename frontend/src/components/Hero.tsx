'use client'

import { Button } from '@/components/ui/button'
import { MapPin, Users, BookOpen, Calendar, Newspaper } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cities } from '@/data/nko'
import { useState } from 'react'

export function Hero() {
  const [selectedCity, setSelectedCity] = useState('Москва')

  return (
    <section className="bg-gradient-to-r from-[#15256D] to-[#003274] text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Добрые дела Росатома
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light text-white">
          все инициативы вашего города в одном месте
        </p>
        
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg opacity-90 leading-relaxed text-white">
            Единый портал для жителей, волонтёров и НКО, где собрана вся информация о социальных,
            экологических, культурных, образовательных и спортивных инициативах в городах
            присутствия Росатома.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
            <MapPin className="h-5 w-5" />
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-40 bg-transparent text-white border-none focus:outline-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Станьте частью добрых дел в вашем городе!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left hover-lift">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-white">Карта</h3>
              </div>
              <p className="text-white/80">
                Найдите организации по городу и направлению деятельности.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left hover-lift">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-white">База знаний</h3>
              </div>
              <p className="text-white/80">
                Просматривайте видео и материалы для скачивания.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left hover-lift">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-white">Календарь</h3>
              </div>
              <p className="text-white/80">
                Отметьте интересные события, чтобы ничего не пропустить.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left hover-lift">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <Newspaper className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-white">Новости</h3>
              </div>
              <p className="text-white/80">
                Будьте в курсе последних инициатив и грантов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}