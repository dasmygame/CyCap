// Define types for our Trace model
export interface IUser {
  _id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

export interface ITrace {
  _id: string
  slug: string
  name: string
  description: string
  price: number
  features: string[]
  coverImage?: string
  avatar?: string
  tags: string[]
  members: string[]
  moderators: string[]
  createdBy: IUser
  __v: number
} 