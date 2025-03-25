"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"

export async function GetUserPurchaseHistory() {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  return await db.userPurchase.findMany({
    where: { userId },
    orderBy: {
      date: "desc",
    },
  })
}
