interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
  address?: {
    city: string
    street: string
  }
  company?: {
    name: string
    catchPhrase: string
  }
}
export type { User }
