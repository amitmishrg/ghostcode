export type ThemeColors = {
  primary: string;
  planMode: string;
  selection: string;
  thinking: string;
  success: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  dialogSurface: string;
  thinkingBorder: string;
  dimSeparator: string;
};

export type Theme = {
  name: string;
  codename: string;
  tagline: string;
  colors: ThemeColors;
};

export const THEMES: Theme[] = [
  {
    name: 'Spectre',
    codename: 'USER',
    tagline: 'Cyan grid — ghost in the machine',
    colors: {
      primary: '#00D4FF',
      planMode: '#7B61FF',
      selection: '#00A8CC',
      thinking: '#7B61FF',
      success: '#00FF9F',
      error: '#FF3355',
      info: '#00D4FF',
      background: '#020408',
      surface: '#0A1218',
      dialogSurface: '#060B10',
      thinkingBorder: '#1A3A4A',
      dimSeparator: '#2A4A5A',
    },
  },
  {
    name: 'Haunt',
    codename: 'ARES',
    tagline: 'Crimson signal — combat protocol',
    colors: {
      primary: '#FF3333',
      planMode: '#FF8866',
      selection: '#CC2222',
      thinking: '#FF8866',
      success: '#FF6644',
      error: '#FF1111',
      info: '#FF5555',
      background: '#0A0404',
      surface: '#180808',
      dialogSurface: '#0C0404',
      thinkingBorder: '#4A2020',
      dimSeparator: '#6A3030',
    },
  },
  {
    name: 'Poltergeist',
    codename: 'CLU',
    tagline: 'Orange override — system control',
    colors: {
      primary: '#FF6600',
      planMode: '#FFB347',
      selection: '#CC5200',
      thinking: '#FFB347',
      success: '#FFAA00',
      error: '#FF2200',
      info: '#FF8833',
      background: '#0A0602',
      surface: '#181008',
      dialogSurface: '#0C0804',
      thinkingBorder: '#4A3010',
      dimSeparator: '#6A4820',
    },
  },
  {
    name: 'Wraith',
    codename: 'ATHENA',
    tagline: 'Gold wisdom — strategic insight',
    colors: {
      primary: '#FFD700',
      planMode: '#C4A7E7',
      selection: '#CCAA00',
      thinking: '#C4A7E7',
      success: '#AACC44',
      error: '#FF5555',
      info: '#FFE066',
      background: '#0A0804',
      surface: '#161208',
      dialogSurface: '#0C0A04',
      thinkingBorder: '#4A4020',
      dimSeparator: '#6A5830',
    },
  },
  {
    name: 'Phantasm',
    codename: 'APHRODITE',
    tagline: 'Magenta pulse — spectral allure',
    colors: {
      primary: '#FF1493',
      planMode: '#FF69B4',
      selection: '#CC1075',
      thinking: '#FF69B4',
      success: '#FF66CC',
      error: '#FF0044',
      info: '#FF44AA',
      background: '#0A0208',
      surface: '#160818',
      dialogSurface: '#0C040C',
      thinkingBorder: '#4A1840',
      dimSeparator: '#6A2858',
    },
  },
  {
    name: 'Glitch',
    codename: 'CORRUPT',
    tagline: 'Phosphor terminal — signal decay',
    colors: {
      primary: '#00FF41',
      planMode: '#BD00FF',
      selection: '#00CC33',
      thinking: '#BD00FF',
      success: '#39FF14',
      error: '#FF0040',
      info: '#00FF88',
      background: '#050505',
      surface: '#0C0C0C',
      dialogSurface: '#080808',
      thinkingBorder: '#1A331A',
      dimSeparator: '#2A4A2A',
    },
  },
];

export const DEFAULT_THEME = THEMES.find((t) => t.name === 'Spectre')!;
