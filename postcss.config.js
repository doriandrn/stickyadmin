module.exports = {
  plugins: {
    'postcss-font-magician': {
      protocol: 'https:',
      display: 'swap',
      // hosted: ['./src/assets/fonts/streamline'],
      // custom: {
      //   streamline: {
      //     variants: {
      //       normal: {
      //         400: {
      //           url: {
      //             // woff2: '../fonts/streamline/streamline.woff2',
      //             ttf: '../fonts/streamline/streamline.ttf',
      //             // eot: '../fonts/streamline/streamline.eot',
      //             // woff2: '../fonts/streamline/streamline.woff2',
      //             // woff: 'path/to/my-body-font-normal-400.woff'
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
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
