import crypto from 'crypto';

/**
 * 使用 crypto 生成随机盐，并使用 SHA256 对密码和盐进行哈希。
 * 返回盐和哈希值的十六进制字符串。
 *
 * @param {string} password 明文密码
 * @returns {{ salt: string, hash: string }} 包含盐和哈希值的对象。
 */
function hashPasswordWithSaltCrypto(password: string) {
    // 1. 生成 16 字节的随机盐
    const salt = crypto.randomBytes(16).toString('hex');

    // 2. 将盐和密码组合在一起 (这里选择将盐附加到密码前面)
    const saltedPassword = salt + password;

    // 3. 使用 SHA256 创建哈希
    const hash = crypto.createHash('sha256').update(saltedPassword).digest('hex');

    return { salt: salt, hash: hash };
}

/**
 * 验证输入的密码是否与存储的盐和哈希值匹配。
 *
 * @param {string} inputPassword 用户输入的明文密码
 * @param {string} storedSalt 从存储中获取的盐的十六进制字符串
 * @param {string} storedHash 从存储中获取的哈希值的十六进制字符串
 * @returns {boolean} 如果密码匹配则返回 true，否则返回 false。
 */
function verifyPasswordCrypto(inputPassword: string, storedSalt: string, storedHash: string) {
    // 1. 使用存储的盐和用户输入的密码进行相同的组合
    const saltedInputPassword = storedSalt + inputPassword;

    // 2. 对组合后的字符串进行哈希
    const inputHash = crypto.createHash('sha256').update(saltedInputPassword).digest('hex');

    // 3. 比较计算出的哈希值和存储的哈希值
    return inputHash === storedHash;
}

export { hashPasswordWithSaltCrypto, verifyPasswordCrypto };    