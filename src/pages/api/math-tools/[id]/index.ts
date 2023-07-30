import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { mathToolValidationSchema } from 'validationSchema/math-tools';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.math_tool
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMathToolById();
    case 'PUT':
      return updateMathToolById();
    case 'DELETE':
      return deleteMathToolById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMathToolById() {
    const data = await prisma.math_tool.findFirst(convertQueryToPrismaUtil(req.query, 'math_tool'));
    return res.status(200).json(data);
  }

  async function updateMathToolById() {
    await mathToolValidationSchema.validate(req.body);
    const data = await prisma.math_tool.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMathToolById() {
    const data = await prisma.math_tool.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
