import FirecrawlApp from '@mendable/firecrawl-js';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    const app = new FirecrawlApp({
        apiKey: 'fc-31f771ae71ad453e8927e9fa66c77dc1'
    });

    // Create basic auth credentials
    const credentials = Buffer.from('newsee:newsee').toString('base64');

    // Scrape with basic authentication in headers and perform login actions
    const scrapeResult = await app.scrapeUrl('http://kms.new-see.com:8090', {
        formats: ['markdown'],
        headers: {
            Authorization: `Basic ${credentials}`
        },
        actions: [
            { type: 'wait', milliseconds: 1000 },  // 等待1秒
            { type: 'click', selector: '#login-link' },  // 点击登录链接
            { type: 'wait', milliseconds: 1000 },  // 等待1秒
            { type: 'write', selector: '#os_username', text: 'zengdi' },  // 输入用户名
            { type: 'write', selector: '#os_password', text: '808611' },  // 输入密码
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