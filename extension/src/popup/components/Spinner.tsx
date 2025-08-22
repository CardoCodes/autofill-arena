"use client"

export function Spinner() {
  return (
    <div className="flex items-center justify-center h-[600px] w-full bg-[#282a36]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff79c6]"></div>
    </div>
  )
}


