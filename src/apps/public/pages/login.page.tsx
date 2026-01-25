import { Button } from "@/components/ui/button"
import { LoginForm as LoginByPasswordForm } from "../components/login-page/login-form"
import { KeyRound, SquareAsterisk, UserCircle } from "lucide-react"
import { useState } from "react"
import LoginByPasskeyForm from "../components/login-page/login-by-passkey-form"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { z } from "zod"
import { useLoginAsGuest } from "@/hooks/useLoginAsGuest"
import { Role } from "@/types/global.type"

const loginMethodSchema = z.enum(["password", "passkey"]);

export default function LoginPage() {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { onSubmit: loginAsGuest, isPending: isGuestLoginPending } = useLoginAsGuest();

  const { success, data } = loginMethodSchema.safeParse(searchParams.get("method") ?? "password");

  const lastLogin = localStorage.getItem('lastLogin');

  return (
    <div className="lg:p-8 h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[600px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome {lastLogin && "back!"}
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
              disabled={isFormSubmitting || isGuestLoginPending}
              type="button"
              className="w-full"
              onClick={() => !isFormSubmitting && setSearchParams("method", "passkey")}
            >
              <KeyRound />
              Use passkey to login
            </Button>
          ) : (
            <Button
              variant={"outline"}
              disabled={isFormSubmitting || isGuestLoginPending}
              type="button"
              className="w-full"
              onClick={() => !isFormSubmitting && setSearchParams("method", "password")}
            >
              <SquareAsterisk />
              Use password to login
            </Button>
          )
        }
      </section>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or Try Out As
          </span>
        </div>
      </div>
      <section className="grid grid-cols-3 gap-2">
        <Button
          variant={"outline"}
          type="button"
          className="w-full"
          onClick={() => loginAsGuest(Role.ADMIN)}
          disabled={isGuestLoginPending}
        >
          <UserCircle />
          Guest Admin
        </Button>
        <Button
          variant={"outline"}
          type="button"
          className="w-full"
          onClick={() => loginAsGuest(Role.TEACHER)}
          disabled={isGuestLoginPending}
        >
          <UserCircle />
          Guest Teacher
        </Button>
        <Button
          variant={"outline"}
          type="button"
          className="w-full"
          onClick={() => loginAsGuest(Role.STUDENT)}
          disabled={isGuestLoginPending}
        >
          <UserCircle />
          Guest Student
        </Button>
      </section>
      <section className="border border-destructive rounded-lg p-4">
        <ul className="list-disc list-inside">
          <li className="text-destructive">Guest users limited to view only</li>
          <li className="text-destructive">Guest users can't perform any action</li>
          <li>For full access please contact developer at <a href="mailto:mail@prakashbanjade.com" className="text-primary hover:underline">mail@prakashbanjade.com</a></li>
        </ul>
      </section>
    </div>
  )
}