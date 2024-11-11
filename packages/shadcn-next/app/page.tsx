'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ClientHeader from '@/components/custom/ClientHeader'
import TextReveal from '@/components/ui/text-reveal'
import { GithubIcon } from 'lucide-react'

const sections = [
  {
    title: '零配置',
    description: '自动编译并打包，从一开始就为生产环境而优化。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-blue-400 to-purple-500',
  },
  {
    title: '混合模式：SSG和SSR',
    description: '在一个项目中同时支持静态生成页面（SSG）和服务器端渲染页面（SSR）。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-green-400 to-cyan-500',
  },
  {
    title: '增量静态生成',
    description: '在构建之后以增量的方式为新增加的页面生成静态页面。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    title: '支持 TypeScript',
    description: '自动配置并编译 TypeScript。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-pink-400 to-red-500',
  },
  {
    title: '快速刷新',
    description: '快速、可靠的实时编辑体验，已在 Facebook 数以万计的组件中使用。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-indigo-400 to-purple-500',
  },
  {
    title: '基于文件系统的路由',
    description: '每个 `pages` 目录下的组件都自动成为一个路由。',
    linkText: '中文文档',
    linkHref: '/login',
    gradient: 'from-teal-400 to-green-500',
  },
]

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black min-h-screen">
      <ClientHeader />
      <main className="text-center mt-16 px-4">
        <motion.h1
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          这是一个用于生产环境的 <span className="text-black dark:text-white">React 框架</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-gray-600 dark:text-blue-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Next.js 为您提供生产环境所需的所有功能以及最佳的开发体验：包括静态及服务器端渲染合流架、支持
          TypeScript、智能化打包、路由预取等功能无需任何配置。
        </motion.p>
        {/*<div className="z-10 mt-8 flex min-h-20 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md dark:bg-black/30 p-4">*/}
        {/*  <TextReveal text="TypeScript、智能化打包、路由预取等功能无需任何配置。" />*/}
        {/*</div>*/}
        <motion.div
          className="mt-8 flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/dashboard">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition duration-300 transform hover:scale-105">
              开始使用
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-blue-100 px-6 py-2 rounded-full hover:shadow-lg transition duration-300 transform hover:scale-105">
              中文文档
            </button>
          </Link>
        </motion.div>
        <motion.div
          className="mt-4 text-gray-600 dark:text-blue-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          开源协议：MIT
          <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-2 inline-flex items-center">
            <GithubIcon className="w-4 h-4 mr-1" />
            GitHub
          </a>
        </motion.div>
      </main>
      <section className="mt-16 px-6 pb-16">
        <motion.h2
          className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          为什么选择 Next.js
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 dark:text-blue-100 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          全球领先的公司都在使用并喜爱 Next.js
        </motion.p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${section.gradient} text-white shadow-lg p-6 rounded-lg hover:shadow-xl transition duration-300 transform hover:scale-105`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold">{section.title}</h3>
              <p className="mt-2 text-gray-100">{section.description}</p>
              <Link href={section.linkHref} className="text-white mt-4 block hover:underline">
                {section.linkText} →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
