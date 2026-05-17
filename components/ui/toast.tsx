"use client"

import * as React from "react"
import { Toaster, toast as sonnerToast } from "sonner"

export const AppToaster = () => <Toaster richColors position="top-right" />

export { sonnerToast as toast }
