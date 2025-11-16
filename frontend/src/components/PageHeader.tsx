'use client'

import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-r from-[#15256D] to-[#003274] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {title}
          </h1>
          <p className="text-xl md:text-2xl font-light text-white max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        
        {children && (
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}