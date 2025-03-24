"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function SetupUser() {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }
  const balance = await db.userBalance.findUnique({ where: { userId } })
  if (!balance) {
    // Free 100 credits
    await db.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    })
  }

  redirect("/")
}
