import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    // Add your login logic here
    if (email === 'delldi808611@outlook.com' && password === '123456') {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}
