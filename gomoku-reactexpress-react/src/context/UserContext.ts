import { createContext } from 'react'
import { User } from '../types'

// User Context holds whether user is logged in or not. 
type UserContextType = {
  user?: User
  login: (username: string, password: string) => Promise<true | string>
  register: (username: string, password: string) => Promise<true | string>
  logout: () => void
}

const UserContext = createContext<UserContextType>({} as UserContextType)
export default UserContext
