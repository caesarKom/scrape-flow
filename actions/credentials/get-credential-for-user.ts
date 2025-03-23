"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"

export async function GetCredentialForUser() {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  return await db.credential.findMany({
    where: { userId },
    orderBy: {
      name: "asc",
    },
  })
}
