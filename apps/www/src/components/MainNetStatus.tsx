import { ArrowRight } from "lucide-react";
import React from "react";

export const MainNetStatus = () => {
  return (
    <div className="w-full my-8 flex justify-center items-center gap-2.5 font-medium font-sans">
      <div className="bg-[#0D2236] rounded-[4px] py-0.5 px-1.5 text-sm text-[#0075FF]">Mainnet Beta</div>
      <h1 className="text-[16px] text-white">v2.4.0 is Live</h1>
      <button className='flex items-center gap-1.5 transition-all text-sm bg-white text-black hover:scale-105 rounded-full py-1 px-1.5'>
        Learn more
        <ArrowRight className='w-3.5 h-3.5' />
      </button>
    </div>
  )
}