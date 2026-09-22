<img src="ui/public/images/hero-day.png" alt="Fetch Media" width="180" align="right" />

# Fetch Media

**Fetch Media** is a self-hosted download manager for your own network — a custom fork of
[YTPTube](https://github.com/arabcoders/ytptube) that adds a friendlier layer of personalisation on top, and gives
the project its own identity through a mascot hero.

It keeps everything the base project does (yt-dlp powered downloads, scheduled tasks, presets, conditions, NFO
generation, the HTTP API) and reworks how it feels to use day to day:

- **Two views of the same app.** A **Simple** mode built around one question — *what do you want to download?* —
  and an **Advanced** dashboard with the full workspace. Simple is the default.
- **A brand of its own.** A hand-illustrated hero, an editorial palette (warm cream by day, deep cocoa by night),
  a unified navbar/footer and typographic accents in Fraunces + Noto Sans.
- **Human-readable presets.** The option sets are explained in plain language instead of raw yt-dlp flags, with
  the description of each one right under the field.
- **Six locales everywhere.** Every UI string added by this fork ships in English, Español, العربية, Français, 日本語
  and 中文 — enforced by an `i18n:check` gate that fails if a key is missing anywhere.
- **Mobile-first responsiveness.** Both views are audited down to 320 px, with their own breakpoints.
- **A tidier queue.** Ghost cards while an item enters the queue, live pause/resume state, and notifications whose
  badge only ever counts what you have not read.

> [!NOTE]
> This is an independent custom version. It is not affiliated with, nor endorsed by, the YTPTube maintainer.
> Upstream documentation still applies to everything not touched here — see [About YTPTube](#about-ytptube-the-upstream-project).

## What this fork changes

The UI was rebuilt rather than reskinned. The main differences from upstream:

| Area | What changed |
| --- | --- |
| Routing | The Simple view lives at **`/`** and the Advanced dashboard at **`/advanced`**. The old `/simple` URL redirects to `/`. |
| Default view | `YTP_SIMPLE_MODE` defaults to `true`, so a fresh instance opens in Simple mode. |
| Navigation | A single navbar, a sidebar rail aligned with the footer band, and a mode switch to move between the two views. |
| Tables and grids | History and Files fall back to grid cards below 1280 px so columns never collide; the Files table truncates long names instead of scrolling sideways. |
| Feedback | Enqueueing shows a *Preparing…* hint plus a ghost card in the queue, so a download that finishes in a second still visibly entered the queue. |
| Theming | Day/night palettes as CSS tokens, pattern backgrounds, and `solid`/`duotone` icons unified across components. |
| Sharing | The per-item "share link" popover is disabled (it deformed the actions column on narrow layouts). |

The rest of the surface (tasks, conditions, notifications, logs, console, presets, API, browser extension) behaves
as documented upstream.

## Getting started

### Requirements

- **Docker** (or Podman) with Compose — the backend ships as a container image.
- **`bun`** — only if you want to build or develop the frontend.
- Optional: hardware acceleration for transcoding, or NFS/SMB mounts for your library, both shown as commented
  examples in [`compose.yaml`](compose.yaml).

### Run it

```bash
git clone https://github.com/marcialbrb/fetch-media.git
cd fetch-media
mkdir -p ./{config,downloads/{files,tmp}}
docker compose up -d --build
```

Open `http://localhost:8081` and create the first local account. The container runs with your user and group IDs so
downloaded files stay accessible from the host.

State that must survive restarts lives in `./config` (settings database, logs, archives); downloads go to
`./downloads/files` and `./downloads/tmp` is scratch space.

> [!IMPORTANT]
> Do not expose the instance to an untrusted network without authentication. Authenticated users are instance
> administrators and can pass yt-dlp options, including options that run commands. For a LAN service, keep it behind
> your router and set credentials — see [Security](#security).

### Point the frontend at the backend

The frontend is a separate Nuxt app. For local development it proxies to the backend through a single env var:

```bash
cd ui
bun install
NUXT_API_URL="localhost:8081/api/" bun run dev
```

## Configuration

All backend settings use the **`YTP_`** prefix and can be passed as environment variables in `compose.yaml`, or
changed at runtime from the web interface. The ones worth knowing when you first deploy:

| Variable | Purpose |
| --- | --- |
| `YTP_SIMPLE_MODE` | `true` by default. Set to `false` to open in the Advanced dashboard. |
| `YTP_AUTH_USERNAME` / `YTP_AUTH_PASSWORD` | Credentials for non-interactive or shared deployments. |
| `YTP_DOWNLOAD_PATH` | Where finished media is written (default `/downloads/files`). |
| `YTP_TEMP_PATH` | Scratch directory for partial downloads (default `/downloads/tmp`). |
| `YTP_CORS_ORIGINS` | Set this if you serve the frontend from a different origin; without it the API answers `403` on cross-origin requests. |
| `YTP_BGUTIL_ENABLED` | Background artwork fetching; keep it alongside the other flags if you recreate the container. |

The full reference, including presets, output templates, and per-extractor limits, is in the
[environment variable reference](FAQ.md#environment-variables).

**Presets** (the option sets such as `1080p`, `Audio Only`, or the NFO makers) are defined in
`app/features/presets/defaults.py`, and can also be created and edited from the interface. Two details worth
knowing before you edit that file:

- Default presets are seeded into the settings database, and only re-seeded when `DEFAULT_PRESET_UPDATED_AT` is
  newer than the stored value — bump that timestamp after editing, or the old copy wins.
- The seeded **name** is normalised to lowercase with underscores (`Audio Only` becomes `audio_only`), because the
  name doubles as the preset identifier. Use each preset's `description` for the human-facing text.

## Development

Two processes: the backend in Docker, the frontend with Bun.

```bash
# backend (leave it running, it owns the API and the database)
docker compose up -d

# frontend
cd ui
bun install
NUXT_API_URL="localhost:8081/api/" bun run dev
```

Frontend quality gates — all of these are expected to pass before a change is considered done:

```bash
cd ui
bun test              # unit tests (composables, utils, i18n helpers)
bun run lint          # eslint
bun run typecheck     # vue-tsc over the Nuxt app
bun run i18n:check    # every key present in all six locales
bun run format        # oxfmt (use format:check in CI)
```

The backend test suite targets **Linux**, which is where the project actually runs. On Windows a handful of
filesystem-dependent tests fail for structural reasons (line endings, symlink permissions, path separators) rather
than because of code issues — run the suite inside the container or on Linux for a meaningful result.

## Customizing the look

The personalisation layer is deliberately made of plain files, so a re-theme does not require touching component
logic:

- **`IDEA.md`** — the brand brief: palette, typography and layout intent. Start here.
- **`ui/app/assets/css/tailwind.css`** — the day/night design tokens as CSS variables plus the pattern backgrounds
  and the hero's responsive rules.
- **`ui/public/images/`** — `hero-day.png` / `hero-night.png` (the mascot), `app-icon.png`, `favicon.png`,
  `pattern-day.jpg` / `pattern-night.jpg` (the backgrounds).
- **`ui/i18n/locales/*.json`** — the six locales. Add a key to one, add it to all, then run `i18n:check`.
- **`app/features/presets/defaults.py`** — the preset names, flags and descriptions users read in the UI.

Everything else follows upstream conventions, so the [upstream documentation](#documentation) stays valid for the
backend side.

## About YTPTube (the upstream project)

![Build Status](https://github.com/arabcoders/ytptube/actions/workflows/main.yml/badge.svg)
![MIT License](https://img.shields.io/github/license/arabcoders/ytptube.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/arabcoders/ytptube.svg)
![GHCR Pulls](https://ghcr-badge.elias.eu.org/shield/arabcoders/ytptube/ytptube)

YTPTube is a self-hosted download manager, automation interface, and media library preparation layer for
[yt-dlp](https://github.com/yt-dlp/yt-dlp). It handles one-off downloads, recurring sources, metadata-based rules,
concurrent queues, and organized output from the same web interface.

YTPTube's automation tools can be used separately or together:

- **Tasks** check channels, playlists, feeds, and supported custom sources on a schedule.
- **Presets** store reusable yt-dlp options, output templates, paths, cookies, and post-processing settings.
- **Conditions** optionally inspect metadata returned by yt-dlp and apply matching options.

See [Features](docs/features.md) for the full workflow.

## Screenshots

Standard interface:

![Standard interface](https://raw.githubusercontent.com/ArabCoders/ytptube/dev/sc_short.jpg)

Simple mode:

![Simple mode](https://raw.githubusercontent.com/ArabCoders/ytptube/dev/sc_simple.jpg)

The interface is available in English, العربية, Français, 中文, and 日本語. See the [language FAQ](FAQ.md#how-do-i-change-the-ui-language).

## What It Handles

- Individual URLs, playlists, channels, live streams, and upcoming streams
- Concurrent downloads with global and per-extractor limits
- Scheduled Tasks for recurring sources and sites without RSS feeds
- Reusable default presets, including NFO Maker and media-server presets
- Conditions that apply yt-dlp options from extracted metadata
- Notifications for selected events through Apprise or direct HTTP webhooks
- Browser extension ([source](webext/)) for [Firefox desktop and Android](https://addons.mozilla.org/en-US/firefox/addon/ytptube-extension/) and [Chrome/Chromium](https://chromewebstore.google.com/detail/ytptube-extension/kiepfnpeflemfokokgjiaelddchglfil)
- [iOS Shortcuts](docs/features.md#send-links-to-ytptube), a [bookmarklet](FAQ.md#simple-bookmarklet), and an [HTTP API](API.md)
- A file browser and built-in player with external sidecar subtitle support and optional file action controls
- Kodi-style TV and movie NFO sidecars, `.info.json` metadata, artwork, and media library naming
- curl-cffi impersonation and a bundled PO-token provider
- An optional browser extraction over existing Chrome instance
- Optional direct yt-dlp control through the terminal interface
- Optional integration with FlareSolverr or Trawl to allow yt-dlp to bypass some WAF protection.
- Queue and archive controls, live logs, diagnostics, and optional resource monitoring
- Docker, Podman, Unraid, and [native builds](docs/native-builds.md) for Windows, macOS, and Linux

Read [Features](docs/features.md) for details and links to the relevant configuration guides.

## Media Libraries

YTPTube NFO Maker integration turns yt-dlp metadata into Kodi-style TV or movie `.nfo` sidecars, cleans descriptions for
library use, creates stable IDs, and keeps each NFO beside its media file. NFO files can be generated during the download
or later from history.

Scheduled Tasks can separately create collection metadata like `tvshow.nfo`, `.info.json`, and artwork images when the 
source provides them. A separate info-reader Preset writes predictable channel and season layouts with yt-dlp metadata 
for compatible Jellyfin, Emby, Plex, and WatchState workflows.

See [Media Servers and NFO Maker](docs/features.md#media-servers-and-nfo-maker) for the three workflows and their limits.

## Quick Start

The included [`compose.yaml`](compose.yaml) runs YTPTube with the bundled POT provider, Chromium browser extraction, and
FlareSolverr support. It also contains commented host-specific examples for hardware acceleration and NFS/SMB storage.
See the [environment variable reference](FAQ.md#environment-variables) for additional application settings.

Create the directories and start the container:

```bash
mkdir -p ./{config,downloads/{files,tmp}}
docker compose up -d
```

Open `http://localhost:8081` and create the first local account.

The container runs as your user and group IDs so downloaded files remain accessible to the host account. Podman users
can replace the `user` line with `userns_mode: keep-id` and run `podman-compose up -d`.

<details>
<summary>Docker command</summary>

```bash
mkdir -p ./{config,downloads/{files,tmp}} && docker run -itd --rm \
  --user "$(id -u):$(id -g)" \
  --name ytptube \
  -e YTP_TEMP_PATH=/downloads/tmp \
  -e YTP_DOWNLOAD_PATH=/downloads/files \
  -p 8081:8081 \
  -v ./config:/config:rw \
  -v ./downloads:/downloads:rw \
  ghcr.io/arabcoders/ytptube:latest
```

</details>

<details>
<summary>Podman command</summary>

```bash
mkdir -p ./{config,downloads/{files,tmp}} && podman run -itd --rm \
  --userns=keep-id \
  --name ytptube \
  -e YTP_TEMP_PATH=/downloads/tmp \
  -e YTP_DOWNLOAD_PATH=/downloads/files \
  -p 8081:8081 \
  -v ./config:/config:rw \
  -v ./downloads:/downloads:rw \
  ghcr.io/arabcoders/ytptube:latest
```

</details>

## Other Installations

### Unraid

Install the **Community Applications** plugin, search for **ytptube**, and use the pre-configured template.

### Native Builds

Download the Windows, macOS, or Linux archive from [GitHub Releases](https://github.com/arabcoders/ytptube/releases).
Read the [native-build guide](docs/native-builds.md) for installation and usage instructions.

## Security

> [!IMPORTANT]
> Do not expose YTPTube to an untrusted network without authentication. Authenticated users are instance administrators 
> and can pass yt-dlp options, including options that execute commands.

Server installations require local account setup. Only disable authentication when a trusted reverse proxy controls 
access or the instance is restricted to a private network. Read the [security recommendations](FAQ.md#security-recommendations)
before exposing an instance and use [security advisories](https://github.com/arabcoders/ytptube/security/advisories/new) 
to report vulnerabilities.

## Documentation

- [Documentation index](docs/README.md)
- [Features](docs/features.md)
- [Native builds](docs/native-builds.md)
- [Configuration, usage, and troubleshooting](FAQ.md)
- [HTTP API](API.md)
- [Security policy](SECURITY.md)
- [Contribution process](CONTRIBUTING.md)

## Project Policy

YTPTube is a personal-first project. Contributions are welcome ONLY after approval from the maintainer following prior 
discussion. Any unsolicited pull requests will be declined. Read [CONTRIBUTING.md](CONTRIBUTING.md) before starting any 
work to not waste your and the maintainer's time.

AI-assisted tools have been used in this project and will continue to be used where I find them useful. This project is
built for my own needs and use cases, and I maintain it according to my own preferences.

You are welcome to use it if it works for you, but I will not change the project's development approach to accommodate 
your objections. I believe these tools can be genuinely useful when used appropriately. If the use of AI-assisted tools 
is a deal-breaker for you, this project may not be the right fit for you. Feel free to build your own.

YTPTube is not affiliated with yt-dlp or any supported service. It is intended for downloading content you are 
permitted to access, not for piracy or unlawful use.

## Community

For short questions, join the [Discord server](https://discord.gg/G3GpVR8xpb). YTPTube is maintained as a solo project, 
so replies may take some time.

If you want to support the work financially, please donate to a children's charity such as [Make-A-Wish International](https://worldwish.org) instead.

## Credits

Fetch Media is built on [YTPTube](https://github.com/arabcoders/ytptube) by
[ArabCoders](https://github.com/ArabCoders), released under the MIT license. All upstream functionality and
documentation belong to its author; this fork only adds the interface layer described in
[What this fork changes](#what-this-fork-changes).
