"use client"

import { UpdateWorkflowCron } from "@/actions/workflows/update-worflow-cron"
import { CustomDialogHeader } from "@/components/custom-dialog-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import cronstrue from "cronstrue"
import parser from "cron-parser"
import { RemoveWorkflowSchedule } from "@/actions/workflows/remove-workflow-schedule"
import { Separator } from "@/components/ui/separator"

function SchedulerDialog(props: { workflowId: string; cron: string | null }) {
  const [cron, setCron] = useState(props.cron || "")
  const [validCron, setValidCron] = useState(false)
  const [readableCron, setReadableCron] = useState("")

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" })
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" })
    },
  })

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule removed successfully", { id: "cron" })
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" })
    },
  })

  useEffect(() => {
    try {
      parser.parseExpression(cron)
      const humanCronStr = cronstrue.toString(cron)
      setValidCron(true)
      setReadableCron(humanCronStr)
    } catch (error) {
      setValidCron(false)
    }
  }, [cron])

  const workflowHasValidCron = props.cron && props.cron.length > 0
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="size-3" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Specify a cron expresion to schedule periodic workflow execution,
            All times are in UTC.
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />

          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm",
              validCron
                ? "border-primary text-primary"
                : "border-destructive text-destructive"
            )}
          >
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="px-8">
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant="outline"
                  disabled={
                    mutation.isPending || removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" })
                    removeScheduleMutation.mutate(props.workflowId)
                  }}
                >
                  Remove current schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2 mb-6">
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              disabled={mutation.isPending || !validCron}
              className="w-full"
              onClick={() => {
                toast.loading("Saving...", { id: "cron" })
                mutation.mutate({ id: props.workflowId, cron })
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SchedulerDialog
