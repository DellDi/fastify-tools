import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchJiraComponent } from "@/components/jira/search";
import { JiraSaaSTable } from "@/components/jira/table";
import { InvoicesTableSkeleton } from "@/components/jira/tableSkeleton";
import { Suspense } from "react";
import { JiraPaginator } from "@/components/jira/paginator";

export default async function JiraPage({
  page = 1,
  pageSize = 50,
  query,
}: {
  page: number;
  pageSize: number;
  query: string;
}) {
  return (
    <div className="h-full flex flex-col grow mx-auto">
      <Card className="w-full sm:w-full xl:6/7 md:5/6 lg:w-4/5 flex flex-col space-x-2 mx-auto grow overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            SAAS专用工单系统
            <div className="flex h-20 py-2 items-center justify-start">
              <SearchJiraComponent />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grow overflow-auto">
          <Suspense fallback={<InvoicesTableSkeleton pageSize={pageSize} />}>
            <JiraSaaSTable page={page} pageSize={pageSize} query={query} />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <JiraPaginator />
        </CardFooter>
      </Card>
    </div>
  );
}
