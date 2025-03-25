"use client"

import { DownloadInvoice } from "@/actions/biling/download-invoice"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

export const InvoiceBtn = ({ id }: { id: string }) => {
  const mutacion = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => (window.location.href = data as string),
    onError: () => {
      toast.error("Something went wrong")
    },
  })

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-sm gap-2 text-muted-foreground px-1"
      disabled={mutacion.isPending}
      onClick={() => mutacion.mutate(id)}
    >
      Invoice
      {mutacion.isPending && <Loader2Icon className="size-4 animate-spin" />}
    </Button>
  )
}
