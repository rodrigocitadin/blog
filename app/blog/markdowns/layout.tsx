export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[90%] md:w-[80%] xl:w-[50%] m-auto *:py-1">
      {children}
    </div>
  )
}
