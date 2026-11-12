-- CreateTable
CREATE TABLE "changelogs" (
    "id" UUID NOT NULL,
    "version" VARCHAR(50) NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "changes" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "changelogs_pkey" PRIMARY KEY ("id")
);
