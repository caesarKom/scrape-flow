"use server"

import db from "@/lib/db/db"
import { symmetricEncrypt } from "@/lib/encryptions"
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credential"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function CreateCredential(form: createCredentialsSchemaType) {
  const { success, data } = createCredentialsSchema.safeParse(form)
  if (!success) {
    throw new Error("Invalid form data")
  }
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  //Encrypted value
  const encryptedValue = symmetricEncrypt(data.value)

  const result = await db.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  })
  if (!result) {
    throw new Error("Failed to create credential")
  }
  revalidatePath("/credentials")
}
