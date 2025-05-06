const ProtectedLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-full flex flex-col items-center justify-center">
      {children}
    </div>
   )
}
 
export default ProtectedLayout