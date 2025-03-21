import { GetAvailableCredits } from "@/actions/biling/get-available-credits"
import { useQuery } from "@tanstack/react-query"
import { CoinsIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { ReactCountUpWrapper } from "./react-countup-wrapper"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"

export const UserAvalilableCreditsBadge = () => {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000,
  })

  return (
    <Link
      href={"/billing"}
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({ variant: "outline" })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="size-4 animate-spin" />}
        {!query.isLoading && query.data && (
          <ReactCountUpWrapper value={query.data} />
        )}
        {!query.isLoading && query.data === undefined && "-"}
      </span>
    </Link>
  )
}
