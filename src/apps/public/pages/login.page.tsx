import { Button } from "@/components/ui/button"
import AuthSideView from "../components/auth-side-view"
import { LoginForm as LoginByPasswordForm } from "../components/login-page/login-form"
import { KeyRound } from "lucide-react"
import { Icons } from "@/components/ui/icons"
import { useState } from "react"
import LoginByPasskeyForm from "../components/login-page/login-by-passkey-form"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { z } from "zod"

const loginMethodSchema = z.enum(["password", "passkey"]);

export default function LoginPage() {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const { success, data } = loginMethodSchema.safeParse(searchParams.get("method") ?? "password");

  return (
    <div className="relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-w-full">
      <AuthSideView />
      <div className="lg:p-8 h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[600px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back!
          </h1>
          <p className="text-sm text-muted-foreground">
            Please sign in to your account
          </p>
        </div>

        {
          success && (data === "password") ? (
            <LoginByPasswordForm setIsFormSubmitting={setIsFormSubmitting} />
          ) : (
            <LoginByPasskeyForm setIsFormSubmitting={setIsFormSubmitting} />
          )
        }

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        <section className="space-y-2">
          {
            success && (data === "password") ? (
              <Button
                variant={"outline"}
                disabled={isFormSubmitting}
                type="button"
                className="w-full"
                onClick={() => !isFormSubmitting && setSearchParams("method", "passkey")}
              >
                <KeyRound className="h-4 w-4" />
                Use passkey to login
              </Button>
            ) : (
              <Button
                variant={"outline"}
                disabled={isFormSubmitting}
                type="button"
                className="w-full"
                onClick={() => !isFormSubmitting && setSearchParams("method", "password")}
              >
                <KeyRound className="h-4 w-4" />
                Use password to login
              </Button>
            )
          }

          <Button
            variant="outline"
            type="button"
            className="w-full"
            disabled={isFormSubmitting}
          >
            <Icons.gitHub className="h-4 w-4" />
            Continue with GitHub
          </Button>
        </section>
      </div>
    </div>
  )
}