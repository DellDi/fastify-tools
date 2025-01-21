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

-- 初始化邮件模板
INSERT INTO email_templates (name, subject, body, variables)
VALUES (
    'magic-link',
    '验证您的邮箱地址',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>邮箱验证</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { background-color: #f9f9f9; border-radius: 5px; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">FastifyTS</div>
        </div>
        <p>亲爱的 {{username}}，</p>
        <p>感谢您注册我们的服务！请点击下面的按钮验证您的邮箱地址：</p>
        <div style="text-align: center;">
            <a href="{{verification_link}}" class="button">验证邮箱</a>
        </div>
        <p>或者复制以下链接到浏览器地址栏：</p>
        <p style="word-break: break-all;">{{verification_link}}</p>
        <p>此链接将在 {{expiration_time}} 后过期。如果您没有注册账号，请忽略此邮件。</p>
        <div class="footer">
            <p>此邮件由系统自动发送，请勿回复。</p>
            <p>&copy; 2024 FastifyTS. 保留所有权利。</p>
        </div>
    </div>
</body>
</html>',
    '{
        "username": "用户名",
        "verification_link": "验证链接",
        "expiration_time": "过期时间"
    }'::jsonb
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
