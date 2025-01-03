CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 邮件模板表
create table if not exists email_templates
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(255) NOT NULL,
    subject    VARCHAR(255) NOT NULL,
    body       TEXT         NOT NULL,
    variables  JSONB, -- 模板变量定义
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    updated_at TIMESTAMPTZ      DEFAULT NOW()
);

-- 邮件发送记录表
create table if not exists email_logs
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES email_templates (id),
    to_email    VARCHAR(255) NOT NULL,
    variables   JSONB,                 -- 实际发送时的变量值
    status      VARCHAR(50)  NOT NULL, -- 发送状态：pending, sent, failed
    error       TEXT,                  -- 错误信息
    sent_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ      DEFAULT NOW()
);

-- 魔法链接表
create table if not exists magic_links
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email      VARCHAR(255) NOT NULL,
    token      VARCHAR(255) NOT NULL UNIQUE,
    purpose    VARCHAR(50)  NOT NULL, -- 用途：registration, password_reset 等
    expires_at TIMESTAMPTZ  NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ      DEFAULT NOW()
);

-- 订阅表
create table if not exists subscriptions
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) NOT NULL,
    status      VARCHAR(50)  NOT NULL, -- 状态：active, unsubscribed
    preferences JSONB,                 -- 订阅偏好设置
    created_at  TIMESTAMPTZ      DEFAULT NOW(),
    updated_at  TIMESTAMPTZ      DEFAULT NOW()
);
