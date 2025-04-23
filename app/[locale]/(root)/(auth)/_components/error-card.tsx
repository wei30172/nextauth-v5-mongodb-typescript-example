import { useTranslations } from "next-intl"

import { FiAlertTriangle } from "react-icons/fi"
import { FormWrapper } from "@/components/shared/form/form-wrapper"

export const ErrorCard = () => {
  const tUi = useTranslations("ErrorCard.ui")

  return (
    <FormWrapper
      headerLabel={tUi("header")}
      backButtonLabel={tUi("backButton")}
      backButtonHref="/signin"
    >
      <div className="w-full flex justify-center items-center">
        <FiAlertTriangle className="text-destructive" />
      </div>
    </FormWrapper>
  )
}