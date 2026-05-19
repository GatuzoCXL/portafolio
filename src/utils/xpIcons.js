import { assetUrl } from './assetUrl'

/**
 * MIT-licensed winXP icon mapping table.
 * Maps logical icon IDs to ShizukuIchi/winXP asset paths.
 *
 * If a mapped winXP file is unavailable, the fallback SVG from
 * public/icons/{id}.svg is used silently.
 */
const WINXP_MAP = {
  // Desktop / app icons
  'my-pc': 'icons/win-xp/676(32x32).png',
  'documents': 'icons/win-xp/318(48x48).png',
  'internet-explorer': 'icons/win-xp/forum-projects.png',
  'messenger': 'icons/win-xp/msn.png',
  'media-audio': 'icons/win-xp/my-music.png',
  'control-panel': 'icons/win-xp/300(32x32).png',
  'search': 'icons/win-xp/299(32x32).png',
  'power': 'icons/win-xp/310(32x32).png',
  'tray-speaker': 'icons/win-xp/690(16x16).png',
  'tray-network': 'icons/win-xp/693(16x16).png',
  'recycle-bin': 'icons/win-xp/recycle-bin-full.png',
  'start': 'icons/win-xp/start-button.png',
  'start-logo': 'icons/win-xp/start-logo.png',
  'windows-logo': 'icons/win-xp/windows-logo.png',

  // Toolbar chrome icons (ExplorerChrome / IEBar)
  'toolbar-back': 'icons/win-xp/back.png',
  'toolbar-forward': 'icons/win-xp/forward.png',
  'toolbar-up': 'icons/win-xp/up.png',
  'toolbar-search': 'icons/win-xp/search.png',
  'toolbar-folders': 'icons/win-xp/folders.png',
  'toolbar-view': 'icons/win-xp/view.png',
  'toolbar-refresh': 'icons/win-xp/refresh.png',
  'toolbar-home': 'icons/win-xp/home.png',
  'toolbar-stop': 'icons/win-xp/stop.png',
  'toolbar-go': 'icons/win-xp/290.png',

  // Address bar chrome icons
  'address-icon': 'icons/win-xp/ie-paper.png',
  'address-dropdown': 'icons/win-xp/dropdown.png',
}

/**
 * Resolve an XP shell icon ID to its URL.
 * Checks the winXP mapping first; if the ID is unmapped,
 * falls back to the existing custom SVG in public/icons/.
 *
 * @param {string} id - Logical icon identifier (e.g. 'my-pc', 'documents')
 * @returns {string} Resolved asset URL
 */
export const xpIcon = (id) => {
  const winxpPath = WINXP_MAP[id]
  if (!winxpPath) {
    return assetUrl(`icons/${id}.svg`)
  }

  return assetUrl(winxpPath)
}
