/**
 * Утилита для работы с логотипами из статических изображений
 */

export interface LogoConfig {
  name: string
  description: string
  path: string
}

// Конфигурация логотипов Росатома
export const ROSATOM_LOGOS: Record<string, LogoConfig> = {
  horizontalColor: {
    name: 'LOGO_ROSATOM_rus_HOR_COLOR_PNG.png',
    description: 'Горизонтальный логотип в цвете',
    path: '/images/LOGO_ROSATOM_rus_HOR_COLOR_PNG.png'
  },
  horizontalWhite: {
    name: 'LOGO_ROSATOM_rus_HOR_WHITE_PNG.png',
    description: 'Горизонтальный белый логотип',
    path: '/images/LOGO_ROSATOM_rus_HOR_WHITE_PNG.png'
  },
  verticalColor: {
    name: 'LOGO_ROSATOM_rus_VERT_COLOR_PNG.png',
    description: 'Вертикальный логотип в цвете',
    path: '/images/LOGO_ROSATOM_rus_VERT_COLOR_PNG.png'
  },
  verticalWhite: {
    name: 'LOGO_ROSATOM_rus_VERT_WHITE_PNG.png',
    description: 'Вертикальный белый логотип',
    path: '/images/LOGO_ROSATOM_rus_VERT_WHITE_PNG.png'
  }
}

// Типы логотипов Росатома для удобства
export type RosatomLogoType = keyof typeof ROSATOM_LOGOS

/**
 * Получить URL логотипа Росатома по типу
 */
export function getRosatomLogoUrl(type: RosatomLogoType): string {
  return ROSATOM_LOGOS[type]?.path || ROSATOM_LOGOS.horizontalColor.path
}

/**
 * Получить конфигурацию логотипа Росатома
 */
export function getRosatomLogoConfig(type: RosatomLogoType): LogoConfig {
  return ROSATOM_LOGOS[type] || ROSATOM_LOGOS.horizontalColor
}

/**
 * Получить все доступные логотипы Росатома
 */
export function getAllRosatomLogos(): LogoConfig[] {
  return Object.values(ROSATOM_LOGOS)
}

/**
 * Получить URL логотипа НКО на основе данных из базы
 */
export function getNKOLogoUrlFromData(logoData: string): string {
  console.log('DEBUG: getNKOLogoUrlFromData - logoData:', logoData)
  
  // Если логотип начинается с http, используем внешнюю ссылку
  if (logoData.startsWith('http')) {
    console.log('DEBUG: Using external URL:', logoData)
    return logoData
  }
  
  // Для локальных файлов в папке nko-logo, используем S3 API
  if (logoData.startsWith('nko-logo/')) {
    // Используем S3 API endpoint: /api/s3/{bucket}/{filename}
    const logoFileName = logoData.replace('nko-logo/', '');
    const s3ApiUrl = `/api/s3/nko-logo/${logoFileName}`;
    console.log('DEBUG: Using S3 API URL:', s3ApiUrl);
    return s3ApiUrl;
  }
  
  // Иначе используем S3 путь (для обратной совместимости)
  const s3Url = `/api/s3/${logoData}`
  console.log('DEBUG: Using S3 URL:', s3Url)
  return s3Url
}

/**
 * Получить URL логотипа НКО с запасным вариантом
 */
export function getNKOLogoUrlWithFallback(logoData: string, fallbackLogo?: string): string {
  // Если нет данных о логотипе, используем fallback
  if (!logoData) {
    const fallback = fallbackLogo || ROSATOM_LOGOS.verticalColor.path
    console.log('DEBUG: No logo data, using fallback:', fallback)
    return fallback
  }
  
  // Используем основные данные о логотипе
  const logoUrl = getNKOLogoUrlFromData(logoData)
  console.log('DEBUG: getNKOLogoUrlWithFallback - logoData:', logoData, 'logoUrl:', logoUrl, 'fallbackLogo:', fallbackLogo)
  
  return logoUrl
}

/**
 * Получить URL логотипа НКО (для обратной совместимости)
 */
export function getNKOLogoUrl(logoId: string): string {
  // Используем S3 API для обратной совместимости
  const s3ApiUrl = `/api/s3/nko-logo/nko-logo-${logoId}.png`
  console.log('DEBUG: getNKOLogoUrl - logoId:', logoId, 'generated S3 API URL:', s3ApiUrl)
  return s3ApiUrl
}

/**
 * Получить все логотипы НКО (для предзагрузки)
 */
export function getAllNKOLogos(): string[] {
  const logos = []
  for (let i = 1; i <= 12; i++) {
    logos.push(getNKOLogoUrl(i.toString()))
  }
  return logos
}

/**
 * Получить горизонтальные логотипы Росатома
 */
export function getHorizontalLogos(): LogoConfig[] {
  return Object.values(ROSATOM_LOGOS).filter(logo =>
    logo.name.includes('HOR')
  )
}

/**
 * Получить вертикальные логотипы Росатома
 */
export function getVerticalLogos(): LogoConfig[] {
  return Object.values(ROSATOM_LOGOS).filter(logo =>
    logo.name.includes('VERT')
  )
}

/**
 * Получить цветные логотипы Росатома
 */
export function getColorLogos(): LogoConfig[] {
  return Object.values(ROSATOM_LOGOS).filter(logo =>
    logo.name.includes('COLOR')
  )
}

/**
 * Получить белые логотипы Росатома
 */
export function getWhiteLogos(): LogoConfig[] {
  return Object.values(ROSATOM_LOGOS).filter(logo =>
    logo.name.includes('WHITE')
  )
}

// Константы для часто используемых логотипов
export const DEFAULT_LOGO = ROSATOM_LOGOS.horizontalColor.path
export const WHITE_LOGO = ROSATOM_LOGOS.horizontalWhite.path
export const VERTICAL_LOGO = ROSATOM_LOGOS.verticalColor.path

// Обратная совместимость
export const getLogoUrl = getRosatomLogoUrl
export const getLogoConfig = getRosatomLogoConfig
export const getAllLogos = getAllRosatomLogos
export type LogoType = RosatomLogoType

// Новые функции уже экспортированы выше