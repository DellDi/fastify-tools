"use server"

export async function getDashboardData() {
    const chartData = [
        { date: '2024-01-01', desktop: 222, mobile: 150 },
    ]

    // 模拟近期20天的数据
    for (let i = 0; i < 29; i++) {
        chartData.push({
            date: `2024-10-${i + 1}`,
            desktop: Math.floor(Math.random() * 500),
            mobile: Math.floor(Math.random() * 500),
        })
    }

    return chartData
}
