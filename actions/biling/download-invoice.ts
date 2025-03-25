"use server"

import db from "@/lib/db/db"
import { stripe } from "@/lib/stripe/stripe"
import { auth } from "@clerk/nextjs/server"

export async function DownloadInvoice(id: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const purchase = await db.userPurchase.findUnique({ where: { id, userId } })

  if (!purchase) {
    throw new Error("bad request")
  }

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId)

  if (!session) {
    throw new Error("invoice not found")
  }

  const invoice = await stripe.invoices.retrieve(session.invoice as string)

  return invoice.hosted_invoice_url
}
