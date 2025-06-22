// pages/api/rules/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session?.user?.companyId) {
    return res.status(401).json({ error: 'Nicht autorisiert' })
  }
  const { id } = req.query

  if (req.method === 'DELETE') {
    await prisma.rule.delete({
      where: { id: String(id) }
    })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
