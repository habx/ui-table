import { get, reduce } from 'lodash'
import Papa, { UnparseObject } from 'papaparse'

export const softCompare = (a: any, b: any): boolean =>
  typeof a !== 'object'
    ? a === b
    : reduce(
        a,
        (ctx: boolean, value, key) => {
          if (Array.isArray(value)) {
            return (
              value?.length === get(b, key, [])?.length &&
              value.reduce(
                (arrayCtx, v) => arrayCtx && get(b, key, []).includes(v),
                true
              ) &&
              ctx
            )
          }
          if (typeof value === 'object') {
            return softCompare(value, get(b, key)) && ctx
          }
          return `${value}` === `${get(b, key)}` && ctx
        },
        true
      )

export const readCsvFile = (file: File) =>
  new Promise((resolve, reject) => {
    try {
      const myReader = new FileReader()
      myReader.onloadend = async () => {
        resolve(myReader.result)
      }
      myReader.readAsText(file)
    } catch (e) {
      reject(e)
    }
  })

export const exportToCSV = (
  filename: string,
  rows: Array<Object> | Array<Array<any>> | UnparseObject
) => {
  const csvFile = Papa.unparse(rows)

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
