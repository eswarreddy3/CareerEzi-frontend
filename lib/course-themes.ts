export interface ThemeVariant {
  id: string
  name: string
  emoji: string
  tagline: string
  primary: string
  glow: string
  bgRadial: string
  requiredPoints: number
  cssVars: Record<string, string>
}

export interface CourseThemeConfig {
  variants: ThemeVariant[]
}

// r,g,b are the primary colour's RGB components
function mkTheme(
  id: string, name: string, emoji: string, tagline: string,
  requiredPoints: number,
  primary: string, r: number, g: number, b: number,
): ThemeVariant {
  const glow     = `rgba(${r},${g},${b},0.30)`
  // Subtle ambient radial: faint colour bloom at top-right of the content area
  const bgRadial = `radial-gradient(ellipse 90% 60% at 80% 0%, rgba(${r},${g},${b},0.08) 0%, transparent 65%)`
  return {
    id, name, emoji, tagline, primary, glow, bgRadial, requiredPoints,
    cssVars: {
      '--primary': primary,
      '--ring':    primary,
    },
  }
}

export const COURSE_THEMES: Record<string, CourseThemeConfig> = {
  python: {
    variants: [
      mkTheme('matrix',    'Matrix Rain',  '🟩', 'Hack the code',   0, '#00C851',  0, 200, 81),
      mkTheme('cyberpunk', 'Cyberpunk',    '🔮', 'Neon dreams',     0, '#EC4899', 236, 72, 153),
      mkTheme('ocean',     'Deep Ocean',   '🌊', 'Dive into code',  0, '#06B6D4',  6, 182, 212),
      mkTheme('solar',     'Solar Flare',  '🌋', 'Burn bright',     0, '#F97316', 249, 115, 22),
    ],
  },
  sql: {
    variants: [
      mkTheme('vault',    'Golden Vault',   '🏆', 'Unlock the data',  0, '#F59E0B', 245, 158, 11),
      mkTheme('ice',      'Ice Database',   '❄️',  'Freeze the query', 0, '#38BDF8',  56, 189, 248),
      mkTheme('neongrid', 'Neon Grid',      '⚡', 'Query the grid',   0, '#2DD4BF',  45, 212, 191),
      mkTheme('scroll',   'Ancient Scroll', '📜', 'Wisdom of data',   0, '#D97706', 217, 119,   6),
    ],
  },
  "sql-for-all": {
    variants: [
      mkTheme('vault',    'Golden Vault',   '🏆', 'Unlock the data',  0, '#F59E0B', 245, 158, 11),
      mkTheme('ice',      'Ice Database',   '❄️',  'Freeze the query', 0, '#38BDF8',  56, 189, 248),
      mkTheme('neongrid', 'Neon Grid',      '⚡', 'Query the grid',   0, '#2DD4BF',  45, 212, 191),
      mkTheme('scroll',   'Ancient Scroll', '📜', 'Wisdom of data',   0, '#D97706', 217, 119,   6),
    ],
  },
  dsa: {
    variants: [
      mkTheme('starfield', 'Starfield',    '🌌', 'Explore the cosmos', 0, '#8B5CF6', 139,  92, 246),
      mkTheme('neural',    'Neural Net',   '🧠', 'Connect the nodes',  0, '#6366F1',  99, 102, 241),
      mkTheme('lava',      'Lava Flow',    '🌋', 'Flow through algos', 0, '#EF4444', 239,  68,  68),
      mkTheme('arctic',    'Arctic Code',  '🏔️',  'Cold precision',     0, '#7DD3FC', 125, 211, 252),
    ],
  },
  excel: {
    variants: [
      mkTheme('grid',     'Grid Empire',   '📊', 'Rule the data',    0, '#10B981',  16, 185, 129),
      mkTheme('charts',   'Neon Charts',   '📈', 'Chart your rise',  0, '#84CC16', 132, 204,  22),
      mkTheme('terminal', 'Dark Terminal', '💻', 'Power user mode',  0, '#FB923C', 251, 146,  60),
      mkTheme('sunrise',  'Sunrise',       '🌅', 'Rise and analyze', 0, '#FBBF24', 251, 191,  36),
    ],
  },
}

export function getUnlockedIndices(courseId: string, userPoints: number): number[] {
  const config = COURSE_THEMES[courseId]
  if (!config) return [0]
  return config.variants
    .map((v, i) => ({ i, req: v.requiredPoints }))
    .filter(({ req }) => userPoints >= req)
    .map(({ i }) => i)
}

export function getCourseTheme(courseId: string, index: number): ThemeVariant | null {
  return COURSE_THEMES[courseId]?.variants[index] ?? null
}
