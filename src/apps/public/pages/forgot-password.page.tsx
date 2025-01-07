import ForgotPasswordForm from "../components/forgot-password/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="lg:p-8 h-screen mx-auto flex flex-col justify-center space-y-6 w-[90%] max-w-[600px]">
      <div className="flex flex-col text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot Password
        </h1>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}