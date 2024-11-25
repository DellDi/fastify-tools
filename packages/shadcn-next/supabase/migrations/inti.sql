-- 创建 login_logs 表
CREATE TABLE IF NOT EXISTS public.login_logs
(
    id         UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES auth.users (id),
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- 创建 verification_codes 表
CREATE TABLE IF NOT EXISTS public.verification_codes
(
    id         UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id    UUID                     NOT NULL REFERENCES auth.users (id),
    code       VARCHAR(6)               NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON public.verification_codes (user_id);

