'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { News } from '@/data/news'

interface NewsCardProps {
  news: News
}

export function NewsCard({ news }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Card className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col">
      {/* Изображение новости */}
      <div className="relative h-48 bg-[var(--color-bg-secondary)]">
        {news.image ? (
          <Image 
            src={news.image} 
            alt={news.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
            <div className="text-white text-center p-4">
              <div className="text-4xl mb-2">📰</div>
              <p className="text-sm font-medium">Новость</p>
            </div>
          </div>
        )}
        
        {/* Категория и дата */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {news.category && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] rounded-full text-xs font-medium">
              {news.category}
            </span>
          )}
          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-xs font-medium">
            {formatDate(news.date)}
          </span>
        </div>
      </div>

      <CardHeader className="p-6 pb-4">
        <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-3 line-clamp-2 leading-tight">
          {news.title}
        </h3>
        
        <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3 leading-relaxed">
          {news.excerpt}
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex-1">
        {news.city && (
          <div className="flex items-center text-[var(--color-text-secondary)] text-sm">
            <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mr-2"></div>
            <span>{news.city}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/news/${news.id}`} className="w-full">
          <Button variant="outline" className="w-full btn-secondary group">
            Читать полностью
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}