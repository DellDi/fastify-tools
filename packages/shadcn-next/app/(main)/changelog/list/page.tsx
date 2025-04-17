"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Calendar, Tag } from 'lucide-react'
import { format, parse, isAfter, isBefore } from 'date-fns'

interface ChangelogItem {
  version: string
  date: string
  changes: string[]
  color: string
}

const changelogData: ChangelogItem[] = [
  {
    version: "2.0.0",
    date: "2023-12-01",
    changes: [
      "完全重新设计的用户界面",
      "新增AI驱动的内容推荐系统",
      "性能优化,页面加载速度提升50%"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    version: "1.5.0",
    date: "2023-11-15",
    changes: [
      "引入深色模式",
      "新增5种语言支持",
      "修复了几个关键的bug"
    ],
    color: "from-yellow-400 to-orange-500"
  },
  {
    version: "1.4.2",
    date: "2023-11-01",
    changes: [
      "改进了移动端的响应式设计",
      "优化了图片加载速度",
      "更新了文档"
    ],
    color: "from-green-400 to-cyan-500"
  },
  {
    version: "1.4.1",
    date: "2023-10-15",
    changes: [
      "修复了登录页面的一个bug",
      "改进了错误处理机制",
      "更新了依赖包"
    ],
    color: "from-blue-500 to-indigo-500"
  },
  // 添加更多的更新日志项...
]

export default function EnhancedChangelog() {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)
  const [visibleItems, setVisibleItems] = useState<ChangelogItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [versionFilter, setVersionFilter] = useState("")

  const itemsPerPage = 5

  const filterItems = useCallback(() => {
    return changelogData.filter(item => {
      const matchesSearch = item.changes.some(change =>
        change.toLowerCase().includes(searchTerm.toLowerCase())
      ) || item.version.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDate = (!startDate || isAfter(parse(item.date, 'yyyy-MM-dd', new Date()), parse(startDate, 'yyyy-MM-dd', new Date()))) &&
        (!endDate || isBefore(parse(item.date, 'yyyy-MM-dd', new Date()), parse(endDate, 'yyyy-MM-dd', new Date())))

      const matchesVersion = !versionFilter || item.version.includes(versionFilter)

      return matchesSearch && matchesDate && matchesVersion
    })
  }, [searchTerm, startDate, endDate, versionFilter])

  const loadMore = useCallback(() => {
    const filteredItems = filterItems()
    const newItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    setVisibleItems(prev => [...prev, ...newItems])
    setHasMore(page * itemsPerPage < filteredItems.length)
    setPage(prev => prev + 1)
  }, [filterItems, page])

  useEffect(() => {
    setVisibleItems([])
    setPage(1)
    setHasMore(true)
  }, [searchTerm, startDate, endDate, versionFilter])

  useEffect(() => {
    loadMore()
  }, [loadMore])

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-500 to-fuchsia-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-12 text-center">
          更新日志
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索更新内容..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="按版本筛选..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                value={versionFilter}
                onChange={(e) => setVersionFilter(e.target.value)}
              />
              <Tag className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
        <AnimatePresence>
          {visibleItems.map((item) => (
            <motion.div
              key={item.version}
              className={`bg-white rounded-lg shadow-lg overflow-hidden mb-8`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`bg-linear-to-r ${item.color} p-6 cursor-pointer`}
                onClick={() => setExpandedVersion(expandedVersion === item.version ? null : item.version)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">版本 {item.version}</h2>
                  <motion.div
                    animate={{ rotate: expandedVersion === item.version ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <p className="text-white opacity-75 mt-2">{format(parse(item.date, 'yyyy-MM-dd', new Date()), 'yyyy年MM月dd日')}</p>
              </div>
              <AnimatePresence>
                {expandedVersion === item.version && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    <ul className="list-disc pl-5 space-y-2">
                      {item.changes.map((change, index) => (
                        <li key={index} className="text-gray-700">{change}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors"
            >
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

