-- CreateTable
CREATE TABLE "jira_reconcile_logs" (
    "id" UUID NOT NULL,
    "batch_id" VARCHAR(64) NOT NULL,
    "issue_key" VARCHAR(50) NOT NULL,
    "project_key" VARCHAR(50),
    "assignee" VARCHAR(50),
    "status" VARCHAR(20) NOT NULL,
    "message" TEXT,
    "details" JSONB,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jira_reconcile_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jira_reconcile_logs_batch_id_idx" ON "jira_reconcile_logs"("batch_id");

-- CreateIndex
CREATE INDEX "jira_reconcile_logs_issue_key_idx" ON "jira_reconcile_logs"("issue_key");

-- CreateIndex
CREATE INDEX "jira_reconcile_logs_created_at_idx" ON "jira_reconcile_logs"("created_at");
