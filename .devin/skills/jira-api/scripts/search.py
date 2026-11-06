#!/usr/bin/env python3
"""一键执行 Jira JQL 搜索：自动 login 拿 cookies 后调 /jira/search。

用法:
    python3 search.py "<JQL>" [startAt] [maxResults]

环境变量:
    JIRA_API_BASE   覆盖默认 base URL（默认 https://delldiagi.top/fastify）
    JIRA_USER       可选 Jira 登录名（不传用服务端公共账号）
    JIRA_PASSWORD   可选 Jira 密码

输出: /jira/search 接口的原样 JSON（stdout）。
退出码: 0 成功；非 0 时 stderr 有错误说明。
"""
import json
import os
import sys
import urllib.request
import urllib.error

BASE = os.environ.get("JIRA_API_BASE", "https://delldiagi.top/fastify").rstrip("/")


def post(path: str, payload: dict) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise SystemExit(f"HTTP {e.code} {path}: {body}") from e


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(2)

    jql = sys.argv[1]
    start_at = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    max_results = int(sys.argv[3]) if len(sys.argv) > 3 else 20

    login_body = {}
    if os.environ.get("JIRA_USER"):
        login_body["jiraUser"] = os.environ["JIRA_USER"]
        login_body["jiraPassword"] = os.environ.get("JIRA_PASSWORD", "")

    def do_login() -> str:
        session = post("/jira/login", login_body)
        cookies = session.get("cookies")
        if not cookies:
            raise SystemExit(f"登录响应缺少 cookies: {session}")
        return cookies

    def do_search(cookies: str) -> dict:
        return post(
            "/jira/search",
            {
                "jql": jql,
                "jiraCookies": cookies,
                "startAt": start_at,
                "maxResults": max_results,
            },
        )

    cookies = do_login()
    try:
        result = do_search(cookies)
    except SystemExit as e:
        # 会话过期（401/403）→ 静默重登重试一次，不向调用方泄漏
        if "HTTP 401" not in str(e) and "HTTP 403" not in str(e):
            raise
        result = do_search(do_login())
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
