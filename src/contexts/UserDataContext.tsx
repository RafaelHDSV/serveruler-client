import { createContext } from 'react'
import { IResponse } from '../interfaces/IResponse'

interface UserDataContextProps {
  data: IResponse
  usernames: Record<string, string>
  envOptions: string[]
  selectedEnv: string
  setSelectedEnv: (env: string) => void
}

export const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
)
