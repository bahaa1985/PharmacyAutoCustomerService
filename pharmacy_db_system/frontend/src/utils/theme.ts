export const roleThemeMap: Record<number, { shell: string; accent: string; accentSoft: string; badge: string; text: string }> = {
  1: {
    shell: 'from-rose-600 to-red-700',
    accent: 'bg-rose-600 hover:bg-rose-700',
    accentSoft: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
    text: 'text-rose-700',
  },
  2: {
    shell: 'from-emerald-600 to-green-700',
    accent: 'bg-emerald-600 hover:bg-emerald-700',
    accentSoft: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    text: 'text-emerald-700',
  },
  3: {
    shell: 'from-sky-600 to-blue-700',
    accent: 'bg-sky-600 hover:bg-sky-700',
    accentSoft: 'bg-sky-50 text-sky-700 border-sky-200',
    badge: 'bg-sky-100 text-sky-700',
    text: 'text-sky-700',
  },
  4: {
    shell: 'from-amber-500 to-orange-600',
    accent: 'bg-amber-500 hover:bg-amber-600',
    accentSoft: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    text: 'text-amber-700',
  },
};

export const getRoleTheme = (roleId?: number) => roleThemeMap[roleId ?? 2] ?? roleThemeMap[2];
