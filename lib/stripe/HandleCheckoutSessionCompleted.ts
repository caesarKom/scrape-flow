import { getCreditsPack, PackId } from "@/types/billing"
import { writeFile } from "fs"
import "server-only"
import Stripe from "stripe"
import db from "../db/db"

export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  //writeFile("session_completed.json", JSON.stringify(event), (err) => {})
  if (!event.metadata) {
    throw new Error("missing metadata")
  }
  const { userId, packId } = event.metadata
  if (!userId) {
    throw new Error("missing user id")
  }
  if (!packId) {
    throw new Error("missing pack id")
  }
  const purchasePack = getCreditsPack(packId as PackId)
  if (!purchasePack) {
    throw new Error("purchased pack not found")
  }

  await db.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: purchasePack.credits,
    },
    update: {
      credits: {
        increment: purchasePack.credits,
      },
    },
  })

  await db.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      descryption: `${purchasePack.name} - ${purchasePack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    },
  })
}
