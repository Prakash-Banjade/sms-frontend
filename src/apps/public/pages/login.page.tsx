import AuthSideView from "../components/auth-side-view"
import { LoginForm } from "../components/login-page/login-form"

export default function LoginPage() {
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
        <LoginForm />
      </div>
    </div>
  )
}