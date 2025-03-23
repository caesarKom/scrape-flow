import { GetCredentialForUser } from "@/actions/credentials/get-credential-for-user"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react"
import { Suspense } from "react"
import { CreateCredentialDialog } from "./_components/create-credential-dialog"
import { formatDistanceToNow } from "date-fns"
import { DeleteCredentialDialog } from "./_components/delete-credential-dialog"

export default function CredenialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog triggerText="Create" />
      </div>

      <div className="w-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="size-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring your data remains
            safe.
          </AlertDescription>
        </Alert>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  )
}

async function UserCredentials() {
  const credentials = await GetCredentialForUser()

  if (!credentials) {
    return <div>Something went wrong</div>
  }
  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent size-20 flex items-center justify-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential.
            </p>
          </div>

          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    )
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {credentials.map((credential) => {
        const createdAt = formatDistanceToNow(credential.createdAt, {
          addSuffix: true,
        })

        return (
          <Card key={credential.id} className="w-full p-4 flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-primary/10 size-8 flex items-center justify-center">
                <LockKeyholeIcon size={18} className="stroke-primary" />
              </div>

              <div className="">
                <p className="font-bold">{credential.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>

            <DeleteCredentialDialog name={credential.name} />
          </Card>
        )
      })}
    </div>
  )
}
