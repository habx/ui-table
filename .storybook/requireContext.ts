const requireContext = (
  base = '.',
  scanSubDirectories = false,
  regularExpression = /\.js$/
) => {
  const fs = require('fs')
  const path = require('path')
  // @ts-ignore
  if (typeof require.context !== 'undefined') {
    // @ts-ignore
    return require.context(base, scanSubDirectories, regularExpression)
  }

  const files: { [key: string]: boolean } = {}

  function readDirectory(directory: string) {
    fs.readdirSync(directory).forEach((file: File) => {
      const fullPath = path.resolve(directory, file)

      if (fs.statSync(fullPath).isDirectory()) {
        if (scanSubDirectories) readDirectory(fullPath)

        return
      }

      if (!regularExpression.test(fullPath)) return

      files[fullPath] = true
    })
  }

  readDirectory(path.resolve(__dirname, base))

  function Module(file: string) {
    return require(file)
  }

  // @ts-ignore
  Module.keys = () => Object.keys(files)

  return Module
}

module.exports = requireContext
