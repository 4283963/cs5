import { Router, type Request, type Response } from 'express'
import { buildOrgTree } from '../services/tree.service'
import { getDbMode } from '../db'
import type { ApiResponse, TreeNode } from '@shared/types'

const router = Router()

router.get('/tree', async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await buildOrgTree()
    const body: ApiResponse<TreeNode[]> = {
      code: 0,
      message: 'ok',
      data,
    }
    res.json(body)
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: (err as Error).message || 'Failed to build org tree',
      data: null,
    })
  }
})

router.get('/status', (_req: Request, res: Response): void => {
  res.json({
    code: 0,
    message: 'ok',
    data: { db: getDbMode() },
  })
})

export default router
