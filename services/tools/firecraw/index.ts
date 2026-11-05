import FirecrawlApp from '@mendable/firecrawl-js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const app = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY!
    });

    // JIRA_PROXY_AUTH 与内网服务共用同一套 Basic 凭据，值即 Authorization 头完整内容
    // Scrape with basic authentication in headers and perform login actions
    const scrapeResult = await app.scrapeUrl(process.env.FIRECRAWL_URL!, {
        formats: ['markdown'],
        headers: {
            Authorization: process.env.JIRA_PROXY_AUTH!
        },
        actions: [
            { type: 'wait', milliseconds: 1000 },  // 等待1秒
            { type: 'click', selector: '#login-link' },  // 点击登录链接
            { type: 'wait', milliseconds: 1000 },  // 等待1秒
            { type: 'write', selector: '#os_username', text: process.env.FIRECRAWL_LOGIN_USERNAME! },  // 输入用户名
            { type: 'write', selector: '#os_password', text: process.env.FIRECRAWL_LOGIN_PASSWORD! },  // 输入密码
            { type: 'click', selector: '#os_cookie' },  // 点击记住密码
            { type: 'click', selector: '#loginButton' },  // 点击登录按钮
            { type: 'wait', milliseconds: 1000 }  // 等待1秒
        ]
    });

    // 将结果保存为markdown文件
    const outputPath = path.join(__dirname, 'output.md');
    if ('content' in scrapeResult && typeof scrapeResult.content === 'string') {
        fs.writeFileSync(outputPath, scrapeResult.content);
        console.log('Scrape result has been saved to:', outputPath);
    } else {
        console.error('Scraping failed:', scrapeResult);
    }
}

main().catch(console.error);