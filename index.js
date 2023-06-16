#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const args = require('args')
const { Iconv } = require('iconv')
const xliff12ToJs = require('xliff/xliff12ToJs')
const i18nStringsFiles = require('i18n-strings-files')

args.option(
  'output-dir',
  'Output directory which will contains .strings files.',
  './Strings'
)
args.option(
  'namespacing-separator',
  'If specified, enables namespacing. All content before the last occurence of the namespacing separator will not be included in the original translation.\n' +
    'Example: When namespacing-seprator is set to ":::", "Tags:::Item" will result in a .strings entry of "Tags:::Item" = "Item".',
  ''
)

const flags = args.parse(process.argv)

const outputDir = flags['output-dir'] ?? './Strings'
const namespacingSeparator = flags['namespacing-separator']
const inputFile = args.sub[0]

const main = async () => {
  const inputXliff = await fs.readFile(inputFile, { encoding: 'utf8' })

  const xliff = await xliff12ToJs(inputXliff)

  for (const namespace in xliff.resources) {
    const outputFilePath = path.resolve(process.cwd(), outputDir, namespace)
    const outputFolder = outputFilePath
      .split(path.sep)
      .slice(0, -1)
      .join(path.sep)
    await fs.mkdir(outputFolder, { recursive: true })

    const output = {}
    for (const id in xliff.resources[namespace]) {
      const { source, target, note } = xliff.resources[namespace][id]
      const defaultText = namespacingSeparator
        ? source.split(namespacingSeparator).slice(-1)
        : source
      output[id] = { text: target ?? defaultText, comment: note }
    }

    const result = i18nStringsFiles
      .compile(output, { wantsComments: true })
      .replace(/;\n/g, ';\n\n') // Add one more \n to align with Xcode output.
    const iconv = new Iconv('UTF-8', 'UTF-16')
    await fs.writeFile(outputFilePath, iconv.convert(result))
  }
}

main().then()
