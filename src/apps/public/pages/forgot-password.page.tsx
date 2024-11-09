import AuthSideView from "../components/auth-side-view"
import ForgotPasswordForm from "../components/forgot-password/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-w-full">
      <AuthSideView />
      <div className="lg:p-8 h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[600px]">
        <div className="flex flex-col text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot Password
          </h1>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}