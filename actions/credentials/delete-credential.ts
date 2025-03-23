"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function DeleteCredential(name: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  await db.credential.delete({
    where: {
      userId_name: {
        userId,
        name,
      },
    },
  })

  revalidatePath("/credentials")
}
