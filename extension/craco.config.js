module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.svg$/,
            use: ['@svgr/webpack']
          }
        ]
      }
    }
  },
} 