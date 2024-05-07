interface HeaderProps {
  label: string
}

export const Header = ({
  label,
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <p className="text-muted-foreground text-lg">
        {label}
      </p>
    </div>
  )
}