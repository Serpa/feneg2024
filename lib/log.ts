import prisma from "@/lib/prisma";

export async function logAction(userId: number, action: string, details: object, ip: string) {
  await prisma.log.create({
    data: {
      userId,
      action,
      details,
      ip,
    },
  });
}