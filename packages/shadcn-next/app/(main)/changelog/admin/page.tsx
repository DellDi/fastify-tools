'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Plus, Edit, Trash, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface ChangelogItem {
  id: string
  version: string
  date: string
  changes: string[]
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
  },
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
    })
    setEditingId(null)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">更新日志管理</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            维护对外展示的版本与变更记录
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4" /> 添加新版本
        </Button>
      </div>

      <div className="space-y-5">
        {(newItem ? [newItem, ...changelogData] : changelogData).map((item, index) => (
          <motion.div
            key={item.id || 'new'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="shadow-card">
              {(editingId === item.id || item === newItem) ? (
                <EditForm item={item} onSave={handleSave} onCancel={() => {
                  setEditingId(null)
                  setNewItem(null)
                }}/>
              ) : (
                <>
                  <CardHeader className="flex-row items-center justify-between space-y-0 p-5 pb-3">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-lg font-semibold tracking-tight">
                        v{item.version}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <ul className="space-y-2">
                      {item.changes.map((change, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function EditForm({ item, onSave, onCancel }: { item: ChangelogItem, onSave: (item: ChangelogItem) => void, onCancel: () => void }) {
  const [editedItem, setEditedItem] = useState<ChangelogItem>(item)

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    }} className="space-y-5 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground" htmlFor="version">
            版本
          </label>
          <Input
            id="version"
            type="text"
            name="version"
            value={editedItem.version}
            onChange={handleChangeInput}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground" htmlFor="date">
            日期
          </label>
          <Input
            id="date"
            type="date"
            name="date"
            value={editedItem.date}
            onChange={handleChangeInput}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          更新内容
        </label>
        {editedItem.changes.map((change, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="text"
              value={change}
              onChange={(e) => handleChangeChange(index, e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={() => handleRemoveChange(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddChange}
        >
          添加更新内容
        </Button>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          保存
        </Button>
      </div>
    </form>
  )
}
