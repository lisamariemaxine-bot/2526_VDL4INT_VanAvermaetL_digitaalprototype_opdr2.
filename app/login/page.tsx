"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

/**
 * FULL AUTH FLOW (UI ONLY)
 * - Login
 * - Register
 * - Forgot Password
 * - Reset Password
 *
 * Backend / API calls intentionally mocked.
 */

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false)

  const mockSubmit = (e: React.FormEvent, action: string) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast(`${action} Successful`, {
        description: "This is a mocked authentication flow.",
      })
    }, 1000)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            {"Login, create an account, or reset your password"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={(e) => mockSubmit(e, 'Login')} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" required />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" required />
                </div>

                <Button className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form onSubmit={(e) => mockSubmit(e, 'Register')} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" required />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" required />
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" required />
                </div>

                <Button className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>

            {/* FORGOT PASSWORD */}
            <TabsContent value="forgot">
              <form onSubmit={(e) => mockSubmit(e, 'Password Reset')} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" required />
                </div>

                <Button variant="secondary" className="w-full" disabled={loading}>
                  {loading ? "Sending link..." : "Send reset link"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
