# Local Network IP Inspector

This project is a local network IP inspector that helps you manage and monitor IP addresses and services within your local network.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Local Network IP Inspector provides a user-friendly interface to view and manage IP addresses and services in your local network. It includes features such as checking the status of services, copying IP addresses to the clipboard, and opening IP addresses in a new window.

## Features

- View a list of services and their corresponding IP addresses and ports.
- Check the online status of services.
- Copy IP addresses to the clipboard.
- Open IP addresses in a new browser window.
- Automatic IP sync from the AGX `ips` repository on startup.
- GitHub avatars for active AGX org members.

## Installation

1. Clone the repository:

   ```sh
   git clone git@github.com:joaolfern/serveruler-client.git
   cd serveruler-client
   ```

2. Install dependencies:

   ```sh
   yarn
   ```

3. Install and authenticate [GitHub CLI](https://cli.github.com/):

   ```sh
   gh auth login
   ```

4. Copy environment variables (optional — defaults work for AGX):

   ```sh
   cp .env.example .env
   ```

## Usage

1. Run `yarn ip` to sync IPs and GitHub usernames from the remote repository.

2. Create an optimized build with `yarn build`

3. Access Serveruler at `http://localhost:5173`.

### Windows startup automation

The `serveruler-start.bat` in Windows Startup runs `yarn ip` before `yarn dev` on every boot, keeping IPs and avatars up to date automatically.

**Prerequisite:** `gh` must be authenticated (`gh auth status`) with access to the `AGX-Software` org and the `ips` repository.

## Scripts

- `yarn dev`: Starts the development server.
- `yarn build`: Builds the project for production.
- `yarn ip`: Syncs IPs from `AGX-Software/ips` and generates `public/usernames.json` from active AGX GitHub org members.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `IPS_REPO` | `AGX-Software/ips` | GitHub repo path for `table.ts` |
| `GITHUB_ORG` | `AGX-Software` | Org used to filter active members and map avatars |
| `REPO_URL` | `git@github.com:AGX-Software/ips.git` | Git fallback URL for `yarn ip` when `gh api` is unavailable |

### How IP sync works

1. Fetches `table.ts` via `gh api` (primary) or `git clone/pull` (fallback).
2. Parses the IP object with a brace-counting parser.
3. Lists members of the `AGX-Software` GitHub org.
4. Matches each person in `table.ts` to an org member by login/name scoring.
5. Writes `public/data.json` (IPs) and `public/usernames.json` (GitHub logins).
6. People not in the org (e.g. former members) are excluded automatically.

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
