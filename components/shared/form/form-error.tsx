import { FiAlertTriangle } from "react-icons/fi"

interface FormErrorProps {
  message?: string
}

export const FormError = ({
  message,
}: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="flex items-center text-sm text-red-600 p-3 my-2 border-red-600 bg-red-100 rounded-md">
      <FiAlertTriangle className="h-5 w-5 mr-2 text-red-600" />
      <p>{message}</p>
    </div>
  )
}