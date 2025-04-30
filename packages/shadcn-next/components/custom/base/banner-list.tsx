import { cn } from '@/lib/utils'
import Marquee from '@/components/ui/marquee'

const reviews = [
  {
    name: '张伟',
    username: '@zhangwei',
    body: '这个产品真是太棒了！用户体验一流',
    img: 'https://avatar.vercel.sh/jack',
  },
  {
    name: '李娜',
    username: '@lina',
    body: '界面设计很美观，操作也很流畅',
    img: 'https://avatar.vercel.sh/jill',
  },
  {
    name: '王强',
    username: '@wangqiang',
    body: '功能非常强大，完全满足我的需求',
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: '赵敏',
    username: '@zhaomin',
    body: '客服响应很快，问题解决得很及时',
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: '刘芳',
    username: '@liufang',
    body: '性价比超高，强烈推荐给大家',
    img: 'https://avatar.vercel.sh/jenny',
  },
  {
    name: '陈明',
    username: '@chenming',
    body: '使用起来非常顺手，学习曲线平缓',
    img: 'https://avatar.vercel.sh/james',
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function MarqueeDemoVertical() {
  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-white dark:from-background"></div>
    </div>
  )
}
