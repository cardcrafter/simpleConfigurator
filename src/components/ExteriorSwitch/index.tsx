'use client'
import { useCollaps } from "@/store/useCollaps"
import React from "react"

export default function ExteriorSwitch() {
  const { exterior, setExterior } = useCollaps();
  return (
    <div className="absolute w-24 top-2 left-2">
      {/*<!-- Component: Fully rounded lg sized button switch --> */}
      <div className="group relative inline-flex items-center rounded-2xl bg-slate-100">
        <input
          className="peer order-2 hidden"
          type="checkbox"
          value=""
          id="id-c0010"
          onClick={() => setExterior(!exterior)}
        />
        {/*  <!-- First label --> */}
        <label
          className="order-1 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 text-xs font-bold tracking-wide text-white transition-colors hover:bg-emerald-600 focus:bg-emerald-700 peer-checked:bg-transparent peer-checked:text-slate-500 hover:peer-checked:bg-transparent peer-checked:hover:text-slate-600 focus:peer-checked:bg-transparent"
          htmlFor="id-c0010"
        >
          Exterior
        </label>
        {/*  <!-- Second label --> */}
        <label
          className="order-1 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-transparent px-6 text-xs font-bold tracking-wide text-slate-500 transition-colors hover:text-slate-600 peer-checked:bg-emerald-500 peer-checked:text-white hover:peer-checked:bg-emerald-600 peer-checked:hover:text-white focus:peer-checked:bg-emerald-700"
          htmlFor="id-c0010"
        >
          Interior
        </label>
      </div>
    </div>
  )
}