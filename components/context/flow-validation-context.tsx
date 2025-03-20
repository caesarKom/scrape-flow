"use client"
import { AppNodeMissingInputs } from "@/types/appNode"
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[]
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>
  clearErrors: () => void
}

export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null)

export function FlowValidationContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>([])

  const clearErrors = () => {
    setInvalidInputs([])
  }

  return (
    <FlowValidationContext.Provider
      value={{ invalidInputs, setInvalidInputs, clearErrors }}
    >
      {children}
    </FlowValidationContext.Provider>
  )
}

export default function useFlowValidation() {
  const context = useContext(FlowValidationContext)
  if (!context) {
    throw new Error(
      "useFlowValidation must be used with in a FlowValidationContext"
    )
  }
  return context
}
