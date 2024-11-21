import ExcelJS from 'exceljs'
import path from 'node:path'

const Workbook = ExcelJS.Workbook

async function mainStart() {
  const workbook = new Workbook()
  const currentDir = process.cwd()
  const pathFile = path.join(currentDir, 'excel-to-sql', '金茂财务数据（脱敏）.xlsx')
  await workbook.xlsx.readFile(pathFile)

  const housekeepingWorkbook = workbook.getWorksheet(1)
  if (!housekeepingWorkbook) {
    console.error('Worksheet "Sheet1" not found')
    return
  }

  const fieldToExplain = new Map()
  const keyToField = new Map()
  housekeepingWorkbook.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell((cell, colNumber) => {
        // 取前五列
        if (colNumber > 5) return
        keyToField.set(colNumber, cell.value)
      })
    }
    if (rowNumber > 1) {
      row.eachCell((cell, colNumber) => {
        if (colNumber > 5) return
        const field = keyToField.get(colNumber)
        const question = `${ row.getCell(colNumber).value }的对应的字段是`
        if (fieldToExplain.has(question)) return
        fieldToExplain.set(question, field)
      })
    }
  })

  const fieldToExplainWorkbook = workbook.addWorksheet('fieldToExplain')
  fieldToExplainWorkbook.columns = [
    { header: '问题', key: 'question' },
    { header: '回答', key: 'answer' },
  ]
  fieldToExplain.forEach((answer, question) => {
    fieldToExplainWorkbook.addRow({ question, answer })
  })

  await workbook.xlsx.writeFile('field-to-explain.xlsx')
}

mainStart().then(() => {
  console.log('done')
})
