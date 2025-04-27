'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash, X } from 'lucide-react'

interface ChangelogItem {
  id: string
  version: string
  date: string
  changes: string[]
  color: string
}

const initialChangelogData: ChangelogItem[] = [
  {
    id: '1',
    version: '2.0.0',
    date: '2023-12-01',
    changes: [
      '完全重新设计的用户界面',
      '新增AI驱动的内容推荐系统',
      '性能优化,页面加载速度提升50%',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: '2',
    version: '1.5.0',
    date: '2023-11-15',
    changes: [
      '引入深色模式',
      '新增5种语言支持',
      '修复了几个关键的bug',
    ],
    color: 'from-yellow-400 to-orange-500',
  },
]

const colorOptions = [
  'from-purple-500 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-green-400 to-cyan-500',
  'from-blue-500 to-indigo-500',
  'from-red-500 to-yellow-500',
]

export default function ChangelogAdmin() {
  const [changelogData, setChangelogData] = useState<ChangelogItem[]>(initialChangelogData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<ChangelogItem | null>(null)

  const handleEdit = (id: string) => {
    setEditingId(id)
    setNewItem(null)
  }

  const handleSave = (item: ChangelogItem) => {
    if (editingId) {
      setChangelogData(changelogData.map(i => i.id === editingId ? item : i))
    } else if (newItem) {
      setChangelogData([...changelogData, { ...item, id: Date.now().toString() }])
    }
    setEditingId(null)
    setNewItem(null)
  }

  const handleDelete = (id: string) => {
    setChangelogData(changelogData.filter(item => item.id !== id))
  }

  const handleAddNew = () => {
    setNewItem({
      id: '',
      version: '',
      date: '',
      changes: [''],
      color: colorOptions[0],
    })
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-500 to-fuchsia-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-12 text-center">
          更新日志管理
        </h1>
        <button
          onClick={handleAddNew}
          className="mb-8 bg-white text-purple-600 px-4 py-2 rounded-full flex items-center hover:bg-purple-100 transition-colors"
        >
          <Plus className="mr-2"/> 添加新版本
        </button>
        {(newItem ? [newItem, ...changelogData] : changelogData).map((item) => (
          <motion.div
            key={item.id || 'new'}
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(editingId === item.id || item === newItem) ? (
              <EditForm item={item} onSave={handleSave} onCancel={() => {
                setEditingId(null)
                setNewItem(null)
              }}/>
            ) : (
              <div className={`bg-linear-to-r ${item.color} p-6`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">版本 {item.version}</h2>
                  <div>
                    <button onClick={() => handleEdit(item.id)} className="text-white mr-2">
                      <Edit/>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-white">
                      <Trash/>
                    </button>
                  </div>
                </div>
                <p className="text-white opacity-75 mt-2">{item.date}</p>
                <ul className="list-disc pl-5 space-y-2 mt-4 text-white">
                  {item.changes.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function EditForm({ item, onSave, onCancel }: { item: ChangelogItem, onSave: (item: ChangelogItem) => void, onCancel: () => void }) {
  const [editedItem, setEditedItem] = useState<ChangelogItem>(item)

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value })
  }

  const handleChangeChange = (index: number, value: string) => {
    const newChanges = [...editedItem.changes]
    newChanges[index] = value
    setEditedItem({ ...editedItem, changes: newChanges })
  }

  const handleAddChange = () => {
    setEditedItem({ ...editedItem, changes: [...editedItem.changes, ''] })
  }

  const handleRemoveChange = (index: number) => {
    const newChanges = editedItem.changes.filter((_, i) => i !== index)
    setEditedItem({ ...editedItem, changes: newChanges })
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      onSave(editedItem)
    }} className="p-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="version">
          版本
        </label>
        <input
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
          id="version"
          type="text"
          name="version"
          value={editedItem.version}
          onChange={handleChangeInput}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          日期
        </label>
        <input
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
          id="date"
          type="date"
          name="date"
          value={editedItem.date}
          onChange={handleChangeInput}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
          颜色
        </label>
        <select
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline"
          id="color"
          name="color"
          value={editedItem.color}
          onChange={handleChangeInput}
        >
          {colorOptions.map((color, index) => (
            <option key={index} value={color}>
              颜色 {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          更新内容
        </label>
        {editedItem.changes.map((change, index) => (
          <div key={index} className="flex mb-2">
            <input
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden focus:shadow-outline mr-2"
              type="text"
              value={change}
              onChange={(e) => handleChangeChange(index, e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveChange(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              <X size={16}/>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddChange}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          添加更新内容
        </button>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          取消
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          保存
        </button>
      </div>
    </form>
  )
}

