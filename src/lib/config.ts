export const Config = {
  SUPPORTED_EXTS: new Set(['.jpg', '.jpeg', '.png', '.dcm', '.dicom']),

  HANDLE_R: 6,
  MIN_BOX: 1e-4,

  SIDEBAR_MIN: 280,
  SIDEBAR_MAX: 640,
  SIDEBAR_INIT: 380,

  RECENTS_KEY: 'theia_recents',
  RECENTS_MAX: 10,

  COLOR_PALETTE: [
    '#60a5fa', '#34d399', '#f59e0b', '#ef4444', '#a78bfa', '#f472b6',
    '#2dd4bf', '#fb923c', '#22c55e', '#eab308', '#38bdf8', '#a3e635',
    '#f43f5e', '#8b5cf6',
  ],

  COLD_TO_WARM: ['#3b82f6', '#06b6d4', '#10b981', '#a3e635', '#f59e0b', '#f97316', '#ef4444'],

  RENDER_INTERVAL_MS: 16,
  ZOOM_MIN: 0.2,
  ZOOM_MAX: 10.0,

  DARK: {
    bgPrimary:   '#0f172a',
    bgSecondary: '#1f2937',
    bgTertiary:  '#0b0f14',
    fgPrimary:   '#e5e7eb',
    border:      '#334155',
    select:      '#374151',
  },

  FIXED_ANNOTATION_SET_NAME: 'local_annotations',
} as const;
