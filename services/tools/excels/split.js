import ExcelJS from 'exceljs'
import fs from 'node:fs'
import path from 'node:path'

const Workbook = ExcelJS.Workbook

async function splitExcelFiles(filePaths) {
  for (const filePath of filePaths) {
    const workbook = new Workbook()
    await workbook.xlsx.readFile(filePath)

    const fileName = path.basename(filePath, path.extname(filePath))

    workbook.eachSheet(async (worksheet) => {
      const newWorkbook = new Workbook()
      const newSheet = newWorkbook.addWorksheet(worksheet.name)

      worksheet.eachRow((row, rowNumber) => {
        const newRow = newSheet.getRow(rowNumber)
        row.eachCell((cell, colNumber) => {
          newRow.getCell(colNumber).value = cell.value
        })
        newRow.commit()
      })

      const exportDir = path.join('./temp', 'export')
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true })
      }

      await newWorkbook.xlsx.writeFile(path.join(exportDir, `${ fileName }-${ worksheet.name }.xlsx`))
    })
  }
}

const excelFiles = ['./temp/金茂满意度关联数据（脱敏）.xlsx', './temp/金茂财务数据（脱敏）.xlsx', './temp/金茂财务数据（脱敏）- 年.xlsx']
splitExcelFiles(excelFiles)
