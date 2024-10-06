import ExcelJS from 'exceljs';

const Workbook = ExcelJS.Workbook;

async function main() {
    // Read the Excel file
    const workbook = new Workbook();
    await workbook.xlsx.readFile('./excels/test.xlsx');

    // Get Sheet1 and Sheet2
    const sheet1 = workbook.getWorksheet('Sheet1');
    const sheet2 = workbook.getWorksheet('Sheet2');

    // Get data from Sheet1's A column
    const sheet1AColumn = new Set();
    sheet1.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip the header row
            sheet1AColumn.add(row.getCell(1).value);
        }
    });

    // Iterate through Sheet2's C column
    sheet2.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip the header row
            const cell = row.getCell('C');
            if (sheet1AColumn.has(cell.value)) {
                console.log(`Matching cell found: ${cell.value} at row ${rowNumber}`);
                cell.style = {
                    border: {
                        top: {style: 'thin'},
                        left: {style: 'thin'},
                        bottom: {style: 'thin'},
                        right: {style: 'thin'}
                    },
                    font: {color: {argb: 'FF0000'}},
                    fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF00FF00'}},
                    alignment: {horizontal: 'center', vertical: 'middle'}
                }
            }
        }
    });

    // Write the updated Excel file
    await workbook.xlsx.writeFile('updated-file.xlsx');
}

main();
