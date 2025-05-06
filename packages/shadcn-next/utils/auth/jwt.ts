
import jsonwebtoken from 'jsonwebtoken'
import type { User } from '@/generated/client'
import { serviceCache } from '@/store/service'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret'

export const jwt = {
    sign: (payload: any) => {
        return jsonwebtoken.sign(payload, JWT_SECRET)
    },
    verify: (token: string) => {
        return jsonwebtoken.verify(token, JWT_SECRET)
    },
    encrypt: (password: string) => {
        return jsonwebtoken.sign({ password }, JWT_SECRET)
    },
    decrypt: (password: string) => {
        return jsonwebtoken.verify(password, JWT_SECRET)
    },
    generateToken: (user: User) => {
        const cachedToken = serviceCache.get(user.id)
        if (cachedToken) {
            return cachedToken
        }
        const token = jsonwebtoken.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET)
        serviceCache.set(user.id, token)
        return token
    },
    verifyToken: (token: string) => {
        try {
            return jsonwebtoken.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
        } catch (error) {
            console.log("🚀 ~ error:", error)
            return new Error('Invalid token')
        }
    },
    verifyTokenWithUser: (user: User, token: string) => {
        // 新增过期时间判断
        const cachedToken = serviceCache.get(user.id)
        if (!cachedToken || cachedToken !== token) {
            return new Error('Invalid token：过期')
        }
        const decoded = jwt.verifyToken(token)
        if (!decoded) {
            return new Error('Invalid token：无效')
        }
        if (decoded instanceof Error || decoded.id !== user.id || decoded.email !== user.email) {
            return new Error('Invalid token：无效')
        }
        return decoded
    },
    generateRefreshToken: (user: User) => {
        return jsonwebtoken.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET)
    },
    verifyRefreshToken: (token: string) => {
        return jsonwebtoken.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
    },
}

