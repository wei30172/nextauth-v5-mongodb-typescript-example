import { useTranslations } from "next-intl"

export default function Home() {
  const tUi = useTranslations("HomePage.ui")

  return (
    <div>
      <h1>{tUi("title")}</h1>
    </div>
  )
}
