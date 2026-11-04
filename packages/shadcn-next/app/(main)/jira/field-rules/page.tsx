import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldRulesTable } from '@/components/jira/field-rules/table'

export default function JiraFieldRulesPage() {
  return (
    <div className="mx-auto flex h-full grow flex-col">
      <Card className="mx-auto flex w-full grow flex-col space-x-2 overflow-hidden sm:w-full md:w-5/6 lg:w-11/12 xl:w-6/7">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            字段经验规则
            <p className="mt-1 text-sm font-normal text-muted-foreground">
              记录每个「项目 + 问题类型」下必填字段的取值策略。LLM 连续 3 次同选才晋级为「固定」，可在下方人工校准。
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="grow overflow-auto">
          <FieldRulesTable />
        </CardContent>
      </Card>
    </div>
  )
}
