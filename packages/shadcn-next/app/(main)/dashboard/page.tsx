import ClientHeader from "@/components/custom/ClientHeader";
import Link from "next/link";

const sections = [
    {
        title: "零配置",
        description: "自动编译并打包，从一开始就为生产环境而优化。",
        linkText: "中文文档",
        linkHref: "/login",
    },
    {
        title: "混合模式：SSG 和 SSR",
        description: "在一个项目中同时支持静态生成页面（SSG）和服务器端渲染页面（SSR）。",
        linkText: "中文文档",
        linkHref: "#",
    },
    {
        title: "增量静态生成",
        description: "在构建之后以增量的方式为新增加的页面生成静态页面。",
        linkText: "中文文档",
        linkHref: "#",
    },
    {
        title: "支持 TypeScript",
        description: "自动配置并编译 TypeScript。",
        linkText: "中文文档",
        linkHref: "#",
    },
    {
        title: "快速刷新",
        description: "快速、可靠的实时编辑体验，已在 Facebook 数以万计的组件中使用。",
        linkText: "中文文档",
        linkHref: "#",
    },
    {
        title: "基于文件系统的路由",
        description: "每个 `pages` 目录下的组件都自动成为一个路由。",
        linkText: "中文文档",
        linkHref: "#",
    },
];

export default function Dashboard() {
    return (
        <div className="max-w-screen-2xl mx-auto">
            <ClientHeader/>
            <main className="text-center mt-16 px-4">
                <h1 className="text-5xl font-bold">
                    这是一个用于生产环境的 <span className="text-black dark:text-white">React 框架</span>
                </h1>
                <p className="mt-4 text-gray-600 dark:text-blue-100">
                    Next.js 为您提供生产环境所需的所有功能以及最佳的开发体验：包括静态及服务器端渲染合流架、支持
                    TypeScript、智能化打包、路由预取等功能无需任何配置。
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <Link href="/dashboard">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded">
                            开始使用
                        </button>
                    </Link>
                    <button
                        className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-blue-100 px-6 py-2 rounded">
                        <Link href="/login">中文文档</Link>
                    </button>
                </div>
                <div className="mt-4 text-gray-600 dark:text-blue-100">
                    开源协议：MIT <a href="#" className="text-blue-600">GitHub</a>
                </div>
            </main>
            <section className="mt-16 px-6">
                <h2 className="text-2xl font-bold text-center">为什么选择 Next.js</h2>
                <p className="text-center text-gray-600 dark:text-blue-100 mt-2">
                    全球领先的公司都在使用并喜爱 Next.js
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-900 shadow-md p-6 rounded hover:bg-gray-100 transition border hover:border-blue-600 dark:border-amber-50 dark:hover:border-amber-100"
                        >
                            <h3 className="text-xl font-bold text-black dark:text-white">{section.title}</h3>
                            <p className="mt-2 text-gray-600 dark:text-blue-100">{section.description}</p>
                            <a href={section.linkHref} className="text-blue-600 dark:text-blue-300 mt-4 block">
                                {section.linkText}
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
