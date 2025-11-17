/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
import { useSize } from '@/store/useSize'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { memo } from 'react'

const CPSizes = () => {
  const { width, height, length, degree, setWidth, setHeight, setLength, setDegree } = useSize(
    useShallow((state) => ({
      width: state.width,
      height: state.height,
      length: state.length,
      degree: state.degree,
      setWidth: state.setWidth,
      setHeight: state.setHeight,
      setLength: state.setLength,
      setDegree: state.setDegree,
    }))
  )

  const { t } = useTranslation()

  const marks = {
    '4.8': 4.8,
    '6.8': 6.8,
  }

  return (
    <div>
      {/* Width */}
      <div className="flex justify-start">
        <p className="text-xl font-bold">{t('Width')}</p>
        <p className="mx-1 border-2 text-zinc-400 rounded-full w-5 h-5 text-xs text-center font-bold">i</p>
      </div>
      <div className="flex justify-between items-center gap-3 py-3">
        <div className="w-36 border-2 text-center border-zinc-300 py-1">
          {width}
          <span>m</span>
        </div>
        <Slider
          min={3.9}
          max={7.4}
          step={null}
          marks={marks}
          value={width}
          defaultValue={width}
          onChange={(value: any) => setWidth(value)}
        />
      </div>

      {/* Length */}
      <div className="flex justify-start">
        <p className="text-xl font-bold">{t('Length')}</p>
        <p className="mx-1 border-2 text-zinc-400 rounded-full w-5 h-5 text-xs text-center font-bold">i</p>
      </div>
      <div className="flex justify-between items-center gap-3 py-3">
        <div className="w-36 border-2 text-center border-zinc-300 py-1">
          {length}
          <span>m</span>
        </div>
        <Slider
          min={2.5}
          max={30.1}
          step={1.2}
          value={length}
          defaultValue={length}
          onChange={(value: any) => setLength(value)}
        />

      </div>

      {/* Height */}
      <div className="flex justify-start">
        <p className="text-xl font-bold">{t('Height')}</p>
        <p className="mx-1 border-2 text-zinc-400 rounded-full w-5 h-5 text-xs text-center font-bold">i</p>
      </div>
      <div className="flex justify-between items-center gap-3 py-3">
        <div className="w-36 border-2 text-center border-zinc-300 py-1">
          {height}
          <span>m</span>
        </div>
        <Slider
          min={2.4}
          max={2.7}
          step={0.3}
          value={height}
          defaultValue={height}
          onChange={(value: any) => setHeight(value)}
        />
      </div>

      {/* Degree */}
      <div className="flex justify-start">
        <p className="text-xl font-bold">{t('Degree')}</p>
        <p className="mx-1 border-2 text-zinc-400 rounded-full w-5 h-5 text-xs text-center font-bold">i</p>
      </div>
      <div className="flex justify-between items-center gap-3 py-3">
        <div className="w-36 border-2 text-center border-zinc-300 py-1">
          {degree}
          <span>&deg;</span>
        </div>
        <Slider
          min={22}
          max={27}
          step={5}
          value={degree}
          defaultValue={degree}
          onChange={(value: any) => setDegree(value)}
        />
      </div>
    </div>
  )
}

export default memo(CPSizes)
