import { IResponse } from '../interfaces/IResponse'

export function getAvailableEnvs(data: IResponse): string[] {
  const envs: string[] = []
  for (const user in data) {
    for (const env in data[user]) {
      const isNewEnv = !envs.includes(env)
      if (isNewEnv) envs.push(env)
    }
  }
  return envs
}
