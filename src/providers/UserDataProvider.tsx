import { ReactNode, useEffect, useState } from 'react'
import { getAvailableEnvs } from '../utils/getAvailableEnvs'
import { getInitialEnvOptionIndex } from '../utils/getInitialEnvOptionIndex'
import { IResponse } from '../interfaces/IResponse'
import { UserDataContext } from '../contexts/UserDataContext'

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<IResponse>({})
  const [usernames, setUsernames] = useState<Record<string, string>>({})
  const [envOptions, setEnvOptions] = useState<string[]>([])
  const [selectedEnv, setSelectedEnv] = useState<string>('')

  useEffect(() => {
    async function updateData() {
      const [data, usernames] = await Promise.all([
        fetchData(),
        fetchUsernames(),
      ])
      const sortedData = Object.fromEntries(
        Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]))
      ) as IResponse
      setData(sortedData)
      setUsernames(usernames)
    }

    updateData()
  }, [])

  useEffect(() => {
    if (!data) return

    const envOptions = getAvailableEnvs(data)

    setEnvOptions(envOptions)
  }, [data])

  useEffect(() => {
    const initialEnvOptionIndex = getInitialEnvOptionIndex()

    if (envOptions[initialEnvOptionIndex]) {
      setSelectedEnv(envOptions[initialEnvOptionIndex])
    }
  }, [envOptions])

  return (
    <UserDataContext.Provider
      value={{
        data,
        usernames,
        envOptions,
        selectedEnv,
        setSelectedEnv,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

async function fetchData() {
  const response = await fetch('data.json')
  const data = await response.json()
  return data
}

async function fetchUsernames() {
  const response = await fetch('usernames.json')
  const usernames = await response.json()
  return usernames as Record<string, string>
}
