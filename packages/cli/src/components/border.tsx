export const EmptyBorder = {
  topLeft: '',
  bottomLeft: '',
  vertical: '',
  topRight: '',
  bottomRight: '',
  horizontal: ' ',
  bottomT: '',
  topT: '',
  cross: '',
  leftT: '',
  rightT: '',
};

export const SplitBorderChars = {
  ...EmptyBorder,
  vertical: '┃',
};

export const HudLeftBorder = {
  ...EmptyBorder,
  vertical: '▌',
  topLeft: '┏',
  bottomLeft: '┗',
};

export const GridBorder = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
  bottomT: '╩',
  topT: '╦',
  cross: '╬',
  leftT: '╠',
  rightT: '╣',
};

export const ScanBorder = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  bottomT: '┴',
  topT: '┬',
  cross: '┼',
  leftT: '├',
  rightT: '┤',
};
