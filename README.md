# Uta Tools

## Project setup

### Requirements

Requires [Bun](https://bun.sh)

```sh
curl -fsSL https://bun.sh/install | bash # Linux, macOS, WSL

# Windows WARNING: No stability is guaranteed on the experimental Windows builds
powershell -c "irm bun.sh/install.ps1|iex"
# Or use scoop instead
scoop bucket add versions
scoop install bun-canary

```

### Get project

Install [git](https://git-scm.com/) from your preferred package manager

```sh
git clone https://github.com/pekochan069/uta-music.git
cd ./uta-music
```

With [GitHub CLI](https://cli.github.com/)

```sh
gh repo clone pekochan069/uta-music
cd ./uta-music
```

### Project Setup & Run

```sh
bun i
bun build
bun start
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |
| `bun format:prettier` | Format source files with `prettier`                     |
| `bun format:biome` | Format source files with `biome`                     |
| `bun lint` | Lint source files with `biome`                     |
| `bun vercel` | Run [vercel](https://vercel.com/dashboard) CLI Tool |
