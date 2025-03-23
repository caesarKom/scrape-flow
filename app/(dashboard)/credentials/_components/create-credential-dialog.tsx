"use client"

import { CustomDialogHeader } from "@/components/custom-dialog-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, ShieldEllipsis } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credential"

import { CreateCredential } from "@/actions/credentials/create-credential"
import { Textarea } from "@/components/ui/textarea"

export const CreateCredentialDialog = ({
  triggerText,
}: {
  triggerText?: string
}) => {
  const [open, setOpen] = useState(false)

  const form = useForm<createCredentialsSchemaType>({
    resolver: zodResolver(createCredentialsSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credenial created", { id: "create-credenial" })
    },
    onError: () => {
      toast.error("Failed to create credenial", { id: "create-credenial" })
    },
  })

  const onSubmit = useCallback(
    (values: createCredentialsSchemaType) => {
      toast.loading("Creating credential...", { id: "create-credenial" })
      mutate(values)
      setOpen(false)
    },
    [mutate]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset()
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>

      <DialogContent className="px-0">
        <CustomDialogHeader icon={ShieldEllipsis} title="Create Credential" />

        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique an descriptive name for the credential{" "}
                      <br />
                      This name will be user to identify the credential.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with this credential
                      <br />
                      This value will be securely encrypted and stored.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
