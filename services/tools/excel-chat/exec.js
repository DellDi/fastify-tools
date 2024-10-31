import OpenAI from 'openai'
import ExcelJS from 'exceljs'

// 使用AI模型的能力找出列表中的城市，省份。重新填充到excel中
const Workbook = ExcelJS.Workbook

async function mainStart() {
  // Read the Excel file
  const workbook = new Workbook()
  await workbook.xlsx.readFile('./excel-chat/sheet-jinmao/金茂财务数据（原始数据）.xlsx')

  // Get Sheet4 财务汇总
  const sheet4 = workbook.getWorksheet(4)
  const cityMap = new Map()

  sheet4.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip the header row
      const cityLike = row.getCell(4)
      if (cityLike.value) cityMap.set(cityLike.value, {
        prov: '',
        city: '',
      })
    }
  })
  try {
    // 分成3段执行，避免token长度过长
    const keys = Array.from(cityMap.keys())
    const quarter = Math.ceil(keys.length / 3)
    await useAiDeepArea(new Map(keys.slice(0, quarter).map(key => [key, cityMap.get(key)])), cityMap)
    await useAiDeepArea(new Map(keys.slice(quarter, quarter * 2).map(key => [key, cityMap.get(key)])), cityMap)
    await useAiDeepArea(new Map(keys.slice(quarter * 2).map(key => [key, cityMap.get(key)])), cityMap)
  } catch (e) {
    throw e
  }

  sheet4.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip the header row
      const cellProv = row.getCell(7)
      const cellCity = row.getCell(8)
      const cityLike = row.getCell(4)
      cityLike.value && (cellProv.value = cityMap.get(cityLike.value).prov)
      cityLike.value && (cellCity.value = cityMap.get(cityLike.value).city)
    }
  })

  await workbook.xlsx.writeFile('金茂财务数据-地理位置.xlsx')
}

async function useAiDeepArea(cityMap, orgMap) {
  //  for backward compatibility, you can still use `https://api.deepseek.com/v1` as `baseURL`.
  const openai = new OpenAI({
    // 支持 8K 最大输出长度进行 Beta 测试
    baseURL: 'https://api.deepseek.com/beta',
    apiKey: 'sk-da340bf2f8ea4a3d96296d745ed5bf86',
  })
  const userContent = Array.from(cityMap.keys()).join(',')
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system', content: `你是一个文本数据分析师，可以根据名称，识别出标准行政区域名称,如果文本片段中包含'嘉善'、'嘉业',标记为'浙江省'、'嘉兴市'。
        Please parse the "question" and "answer" and output them in JSON format
        ps：长沙金茂悦物业服务中心,武汉阳逻金茂悦物业服务中心,株洲金茂悦物业服务中心
        EXAMPLE JSON OUTPUT:： {
          '长沙金茂悦物业服务中心': {
            'prov': '湖南省',
            'city': '长沙市',
          },
          '武汉阳逻金茂悦物业服务中心': {
            'prov': '湖北省',
            'city': '武汉市',
          },
          '株洲金茂悦物业服务中心': {
            'prov': '湖南省',
            'city': '株洲市',
          },
        }
      `,
      },
      { role: 'user', content: userContent },
    ],
    model: 'deepseek-chat',
    max_tokens: 8000,
    response_format: { type: 'json_object' },
  })

  let data = completion.choices[0].message.content
  console.log(data)
  if (typeof data === 'string') {
    data = JSON.parse(data)
  }
  for (const [key, value] of Object.entries(data)) {
    if (orgMap.has(key)) {
      orgMap.set(key, value)
    }
  }
}

mainStart().then(() => console.log('done')).catch(e => console.error(e))
