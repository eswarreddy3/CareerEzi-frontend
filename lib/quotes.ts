export interface Quote {
  text: string
  author: string
}

// ── Streak = 0 — spark the start ──────────────────────────────────────────────
const COLD_START: Quote[] = [
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
]

// ── Streak 1–3 — building momentum ────────────────────────────────────────────
const WARMING_UP: Quote[] = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "We are what we repeatedly do. Excellence is not an act but a habit.", author: "Aristotle" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Small daily improvements lead to staggering long-term results.", author: "Robin Sharma" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
]

// ── Streak 4–7 — on a roll ────────────────────────────────────────────────────
const ON_A_ROLL: Quote[] = [
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
]

// ── Streak 8–14 — fire mode ───────────────────────────────────────────────────
const FIRE_MODE: Quote[] = [
  { text: "You're on fire 🔥 Keep this streak alive — greatness is a habit.", author: "CareerEzi" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Consistency is what transforms average into excellence.", author: "Anonymous" },
  { text: "If you are working on something exciting that you really care about, you don't have to be pushed. The vision pulls you.", author: "Steve Jobs" },
  { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
]

// ── Streak 15–29 — unstoppable ────────────────────────────────────────────────
const UNSTOPPABLE: Quote[] = [
  { text: "You've been at it for weeks. The companies that will hire you haven't met you yet — but they will.", author: "CareerEzi" },
  { text: "If you want something you've never had, you must be willing to do something you've never done.", author: "Thomas Jefferson" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "The future belongs to those who learn more skills and combine them in creative ways.", author: "Robert Greene" },
  { text: "Sweat now. Celebrate later.", author: "Anonymous" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

// ── Streak 30+ — legend tier ──────────────────────────────────────────────────
const LEGEND: Quote[] = [
  { text: "👑 30 days. No one can stop someone this consistent.", author: "CareerEzi" },
  { text: "We are building India's next generation of engineers — one streak at a time.", author: "CareerEzi" },
  { text: "The strength of the team is each individual member. The strength of each member is the team.", author: "Phil Jackson" },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
  { text: "If you think you are too small to make a difference, try sleeping with a mosquito.", author: "Dalai Lama" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Grit is passion and perseverance for long-term goals.", author: "Angela Duckworth" },
]

// ── Indian founder bonus pool (shown randomly at 20% chance) ─────────────────
export const INDIAN_FOUNDER_QUOTES: Quote[] = [
  { text: "You have to believe in yourself when no one else does — that makes you a winner right there.", author: "Venus Williams" },
  { text: "Dream is not what you see in sleep. Dream is the thing which doesn't let you sleep.", author: "APJ Abdul Kalam" },
  { text: "Don't be trapped by dogma — which is living with the results of other people's thinking.", author: "Steve Jobs" },
  { text: "The size of your dreams must always exceed your current capacity to achieve them.", author: "Ellen Johnson Sirleaf" },
  { text: "However difficult life may seem, there is always something you can do and succeed at.", author: "Stephen Hawking" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "Continuous learning is the minimum requirement for success in any field.", author: "Brian Tracy" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "Excellence is not a skill — it is an attitude.", author: "Ralph Marston" },
]

function pickByDay(pool: Quote[]): Quote {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return pool[dayOfYear % pool.length]
}

export function getDailyQuote(streak: number): Quote {
  // 20% chance to show an Indian founder quote for variety
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  if (dayOfYear % 5 === 0) return pickByDay(INDIAN_FOUNDER_QUOTES)

  if (streak === 0)  return pickByDay(COLD_START)
  if (streak <= 3)   return pickByDay(WARMING_UP)
  if (streak <= 7)   return pickByDay(ON_A_ROLL)
  if (streak <= 14)  return pickByDay(FIRE_MODE)
  if (streak <= 29)  return pickByDay(UNSTOPPABLE)
  return pickByDay(LEGEND)
}
