
export default function SuccessMessage({children}: {children : React.ReactNode}) {
  return (
    <p className="text-center my-4  bg-green-500 text-white fond-bold text-sm p-3 uppercase ">
      {children}
    </p>
  )
}
