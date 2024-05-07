import { RxCheckCircled } from "react-icons/rx"

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({
  message,
}: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className="flex items-center text-sm text-green-600 p-3 my-2 border-green-600 bg-green-100 rounded-md">
      <RxCheckCircled className="h-5 w-5 mr-2 text-green-600" />
      <p>{message}</p>
    </div>
  )
}