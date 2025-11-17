import ExteriorSwitch from '@/components/ExteriorSwitch'
import Loading from '@/components/Loading'
import ControlPanel from '@/layout/ControlPanel'
import Scene from '@/layout/Scene'
import React from 'react'

export default function Configurator() {
  return (
    <div className='p-2 md:p-4 lg:p-12 flex flex-col items-center  justify-center'>
      <div className='flex flex-col md:flex-row justify-center items-start gap-7 md:gap-0 lg:gap-7 w-full md:w-[85%]'>
        <div className='relative md:sticky md:top-20 aspect-3/2 bg-zinc-300 w-full h-auto md:w-3/5'>
          <Scene />
          <ExteriorSwitch />
        </div>
        <div className='w-full md:w-2/5'>
          <ControlPanel />
        </div>
      </div>
      <Loading />
    </div>
  )
}
