export type Grade = "1" | "2" | "3" | "4"
export type SubjectId = "deutsch" | "religion"

export type Topic = {
  id: string
  label: string
  grades: Grade[]
  description: string
  focus: string[]
  samplePrompts: string[]
  category: string
}

export type Category = {
  id: string
  label: string
  summary: string
}

export type Subject = {
  id: SubjectId
  title: string
  tagline: string
  description: string
  grades: Grade[]
  categories: Category[]
  topics: Topic[]
}
