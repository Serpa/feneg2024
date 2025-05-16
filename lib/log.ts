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

export async function log({ userId, action, details }: { userId: number; action: string; details: object }) {
  await prisma.log.create({
    data: {
      userId,
      action,
      details,
      ip: "127.0.0.1",
    },
  })
}