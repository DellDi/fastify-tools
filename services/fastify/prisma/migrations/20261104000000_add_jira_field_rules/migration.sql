-- CreateTable
CREATE TABLE "jira_field_rules" (
    "id" UUID NOT NULL,
    "project_key" VARCHAR(50) NOT NULL,
    "issue_type_id" VARCHAR(50) NOT NULL,
    "field_id" VARCHAR(100) NOT NULL,
    "field_name" VARCHAR(255) NOT NULL DEFAULT '',
    "kind" VARCHAR(20) NOT NULL DEFAULT 'text',
    "strategy" VARCHAR(20) NOT NULL DEFAULT 'llm',
    "learned_value" JSONB,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "stale" BOOLEAN NOT NULL DEFAULT false,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "fail_count" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "last_seen_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jira_field_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jira_field_rules_project_key_issue_type_id_field_id_key" ON "jira_field_rules"("project_key", "issue_type_id", "field_id");

-- CreateIndex
CREATE INDEX "jira_field_rules_project_key_issue_type_id_idx" ON "jira_field_rules"("project_key", "issue_type_id");
