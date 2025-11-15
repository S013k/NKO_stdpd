import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin, Phone, Mail, Globe, Users, Calendar, ArrowLeft, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { nkoData } from '@/data/nko'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function NKODetailPage({ params }: PageProps) {
  const { slug } = await params
  const nko = nkoData.find(organization => organization.id === slug)

  if (!nko) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero секция организации */}
      <section className="bg-gradient-to-r from-[#15256D] to-[#003274] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              href="/nko"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к списку организаций
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Логотип */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                {nko.logo ? (
                  <Image 
                    src={nko.logo} 
                    alt={nko.name}
                    width={128}
                    height={128}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">
                      {nko.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Информация об организации */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold">
                  {nko.name}
                </h1>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {nko.category}
                </span>
              </div>
              
              <p className="text-xl text-white/90 mb-6 max-w-3xl">
                {nko.description}
              </p>
              
              {/* Кнопки действий */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-white text-[var(--color-primary)] hover:bg-gray-100">
                  <Users className="h-4 w-4 mr-2" />
                  Стать волонтером
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]">
                  <Heart className="h-4 w-4 mr-2" />
                  Подписаться
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]">
                  <Share2 className="h-4 w-4 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Контактная информация */}
      <section className="py-12 bg-[var(--color-bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Контактные данные */}
            <Card className="border-[var(--color-border)]">
              <CardHeader>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Контактная информация
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {nko.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[var(--color-primary)] mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-secondary)]">{nko.address}</span>
                  </div>
                )}
                
                {nko.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-[var(--color-primary)] mr-3 flex-shrink-0" />
                    <a 
                      href={`tel:${nko.phone}`} 
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {nko.phone}
                    </a>
                  </div>
                )}
                
                {nko.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-[var(--color-primary)] mr-3 flex-shrink-0" />
                    <a 
                      href={`mailto:${nko.email}`} 
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {nko.email}
                    </a>
                  </div>
                )}
                
                {nko.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-[var(--color-primary)] mr-3 flex-shrink-0" />
                    <a 
                      href={nko.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {nko.website}
                    </a>
                  </div>
                )}
                
                {/* Социальные сети */}
                {nko.social && (
                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Социальные сети:
                    </p>
                    <div className="flex gap-2">
                      {nko.social.vk && (
                        <a 
                          href={nko.social.vk} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[var(--color-primary)] text-white rounded text-sm hover:bg-[var(--color-primary-hover)] transition-colors"
                        >
                          VK
                        </a>
                      )}
                      {nko.social.telegram && (
                        <a 
                          href={nko.social.telegram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[var(--color-primary)] text-white rounded text-sm hover:bg-[var(--color-primary-hover)] transition-colors"
                        >
                          Telegram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Описание деятельности */}
            <Card className="border-[var(--color-border)] lg:col-span-2">
              <CardHeader>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Описание деятельности
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {nko.fullDescription || nko.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Волонтерские возможности */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-[var(--color-border)]">
            <CardHeader>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                Что могут делать волонтеры
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {nko.volunteerFunction}
              </p>
              <div className="mt-6">
                <Button size="lg" className="btn-primary">
                  <Users className="h-4 w-4 mr-2" />
                  Стать волонтером
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Проекты организации */}
      {nko.projects && nko.projects.length > 0 && (
        <section className="py-12 bg-[var(--color-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">
              Наши проекты
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nko.projects.map((project, index) => (
                <Card key={index} className="border-[var(--color-border)] hover-lift">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">
                      {project}
                    </h4>
                    <p className="text-[var(--color-text-secondary)] text-sm">
                      Узнайте больше о нашем проекте и присоединяйтесь к нам
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}