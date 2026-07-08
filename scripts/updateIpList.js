import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const IPS_REPO = process.env.IPS_REPO
const GITHUB_ORG = process.env.GITHUB_ORG
const REPO_URL = process.env.REPO_URL
const MATCH_THRESHOLD = 70

const execAsync = (command) =>
  new Promise((resolve, reject) => {
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message))
        return
      }
      resolve(stdout)
    })
  })

function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function extractObjectLiteral(source) {
  const marker = 'const IPs'
  const markerIndex = source.indexOf(marker)
  if (markerIndex === -1) {
    throw new Error('Marcador "const IPs" não encontrado em table.ts')
  }

  const equalsIndex = source.indexOf('=', markerIndex)
  const braceStart = source.indexOf('{', equalsIndex)
  if (braceStart === -1) {
    throw new Error('Objeto IPs não encontrado em table.ts')
  }

  let depth = 0
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) return source.slice(braceStart, i + 1)
    }
  }

  throw new Error('Objeto IPs malformado em table.ts')
}

function parseTableTs(text) {
  const literal = extractObjectLiteral(text)
  // eslint-disable-next-line no-new-func
  return new Function(`return ${literal}`)()
}

async function fetchTableViaGh() {
  const stdout = await execAsync(
    `gh api repos/${IPS_REPO}/contents/table.ts --jq .content`
  )
  const content = stdout.trim()
  if (!content) throw new Error('Conteúdo vazio retornado pela API do GitHub')
  return Buffer.from(content, 'base64').toString('utf-8')
}

async function fetchTableViaGit() {
  const databasePath = path.join(ROOT, 'database')
  const tablePath = path.join(databasePath, 'table.ts')

  if (!fs.existsSync(databasePath)) {
    console.log(`Clonando ${REPO_URL} em ./database ...`)
    await execAsync(`git clone ${REPO_URL} "${databasePath}"`)
  } else {
    console.log('Atualizando ./database via git pull ...')
    await execAsync(`git -C "${databasePath}" pull origin main`)
  }

  return fs.promises.readFile(tablePath, 'utf-8')
}

async function fetchTableText() {
  try {
    console.log(`Buscando table.ts via gh api (${IPS_REPO}) ...`)
    return await fetchTableViaGh()
  } catch (ghError) {
    console.warn(`gh api falhou: ${ghError.message}`)
    console.log('Tentando fallback via git clone/pull ...')
    return fetchTableViaGit()
  }
}

async function fetchOrgMembers() {
  const stdout = await execAsync(
    `gh api orgs/${GITHUB_ORG}/members --paginate --jq ".[].login"`
  )
  const logins = stdout
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const members = []
  for (const login of logins) {
    const profileJson = await execAsync(`gh api users/${login}`)
    const profile = JSON.parse(profileJson)
    members.push({
      login: profile.login,
      name: profile.name ?? '',
    })
  }

  return members
}

function getNameTokens(name) {
  return name.split(/\s+/).map(normalize).filter(Boolean)
}

function scoreMember(personKey, member) {
  const key = normalize(personKey)
  const login = member.login.toLowerCase()
  const nameTokens = getNameTokens(member.name)
  const firstName = nameTokens[0] ?? ''
  const lastName = nameTokens[nameTokens.length - 1] ?? ''

  if (login === key) return 100
  if (firstName === key) return 90
  if (lastName === key) return 85
  if (login.includes(key)) return 80
  if (nameTokens.some((token) => token === key)) return 70

  return 0
}

function matchPersonToMember(personKey, members) {
  const scored = members
    .map((member) => ({
      member,
      score: scoreMember(personKey, member),
    }))
    .filter(({ score }) => score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) return null

  if (scored.length > 1 && scored[0].score === scored[1].score) {
    console.warn(
      `Match ambíguo para "${personKey}": ${scored[0].member.login} e ${scored[1].member.login} — excluído`
    )
    return null
  }

  return scored[0].member
}

function sortKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  )
}

async function writeJson(filePath, content) {
  const jsonString = JSON.stringify(content, null, 2) + '\n'
  await fs.promises.writeFile(filePath, jsonString, 'utf-8')
  console.log(`Arquivo escrito: ${filePath}`)
}

async function main() {
  const tableText = await fetchTableText()
  const allIPs = parseTableTs(tableText)
  const members = await fetchOrgMembers()

  const data = {}
  const usernames = {}
  const noMatch = []

  for (const personKey of Object.keys(allIPs)) {
    const match = matchPersonToMember(personKey, members)

    if (!match) {
      noMatch.push(personKey)
      continue
    }

    data[personKey] = allIPs[personKey]
    usernames[personKey] = match.login
  }

  if (noMatch.length > 0) {
    console.log(
      `Removido (não é membro AGX ou sem match): ${noMatch.join(', ')}`
    )
  }

  const sortedData = sortKeys(data)
  const sortedUsernames = sortKeys(usernames)

  await writeJson(path.join(ROOT, 'public/data.json'), sortedData)
  await writeJson(path.join(ROOT, 'public/usernames.json'), sortedUsernames)

  console.log(
    `\nSincronização concluída: ${Object.keys(sortedData).length} pessoas ativas`
  )
}

main().catch((error) => {
  console.error(`Falha na sincronização de IPs: ${error.message}`)
  process.exit(1)
})
