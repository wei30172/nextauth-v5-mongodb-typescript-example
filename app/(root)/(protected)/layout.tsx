import { Navbar } from "./_components/navbar"

const ProtectedLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-full flex fex-col items-center justify-center">
       <Navbar />
      {children}
    </div>
   )
}
 
export default ProtectedLayout