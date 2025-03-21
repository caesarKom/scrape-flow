"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"

export async function GetAvailableCredits() {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const balance = await db.userBalance.findUnique({
    where: { userId },
  })
  if (!balance) {
    return -1
  }
  return balance.credits
}
