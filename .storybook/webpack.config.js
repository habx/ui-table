const { TsConfigPathsPlugin } = require('awesome-typescript-loader')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [require.resolve('awesome-typescript-loader')],
  })

  config.resolve.extensions.push('.ts', '.tsx')

  config.resolve.plugins = config.resolve.plugins || []

  config.resolve.plugins.push(new TsConfigPathsPlugin())

  return config
}
