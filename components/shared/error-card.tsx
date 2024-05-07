import { FiAlertTriangle } from "react-icons/fi"
import { FormWrapper } from "@/components/shared/form-wrapper"

export const ErrorCard = () => {
  return (
    <FormWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
      <FiAlertTriangle className="text-destructive" />
      </div>
    </FormWrapper>
  )
}
