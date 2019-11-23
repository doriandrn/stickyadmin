module.exports = {
  plugins: {
    'postcss-font-magician': {
      protocol: 'https:',
      display: 'swap',
      variants: {
        'Fira Sans': {
          '400': ['woff, eot, woff2'],
          '500': ['woff, eot, woff2'],
          '600': ['woff, eot, woff2'],
          '700': ['woff, eot, woff2']
        }
      }
    },
    'postcss-short': {},
    'postcss-pxtorem': {},
    'autoprefixer': {},
    'postcss-clean': {}
  }
}
