import * as Papa from 'papaparse'

export const parseCsvFileData = async (file: File): Promise<any[][]> => {
  const csvData: string = await new Promise((resolve, reject) => {
    try {
      const myReader = new FileReader()
      myReader.onloadend = async () => {
        resolve(myReader.result as string)
      }
      myReader.readAsText(file)
    } catch (e) {
      reject(e)
    }
  })
  const { data } = Papa.parse(csvData)
  return data as any[][]
}
