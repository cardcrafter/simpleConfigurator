'use client'

import { useMaterialStore } from '@/store/useMaterialStore'
import { useShallow } from 'zustand/react/shallow'
import ColorsSetting from '@/assets/ColorsSetting.json'
import Color from '@/components/Color'
import Material from '@/components/Material'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
const CPColors = () => {
  const {
    panelColor,
    roofColor,
    roofTexture,
    gutterColor,
    isGutter,
    setGutter,
    setGutterColor,
    setPanelColor,
    setRoofColor,
    setRoofTexture
  } = useMaterialStore(useShallow((state) => ({
    panelColor: state.panelColor,
    roofColor: state.roofColor,
    roofTexture: state.roofTexture,
    gutterColor: state.gutterColor,
    isGutter: state.isGutter,
    setGutter: state.setGutter,
    setGutterColor: state.setGutterColor,
    setPanelColor: state.setPanelColor,
    setRoofColor: state.setRoofColor,
    setRoofTexture: state.setRoofTexture
  })))

  const { t } = useTranslation()

  const currentRoof = ColorsSetting.roof.findLast(item => item.texture === roofTexture)
  const currentGutter = ColorsSetting.gutter.findLast(item => item.map === isGutter)

  return (
    <div className="my-10">
      {/* Roof */}
      <p className="mt-5">
        <span className="font-bold text-xl">{t('Texture & Color')} - </span> {t('Roof')}
      </p>
      <div className="flex justify-start items-center p-2 gap-5">
        {ColorsSetting.roof.map((item, idx) => (
          <Material
            key={idx}
            inx={idx}
            src={item.texture}
            selected={roofTexture === item.texture}
            name={item.name}
            setTexture={setRoofTexture}
          />
        ))}
      </div>
      <div className="flex justify-start items-center p-2 gap-1">
        {currentRoof?.colors.map((clr, idx) => (
          <Color
            key={idx}
            color={clr}
            selected={roofColor === clr}
            name=""
            setColor={setRoofColor}
          />
        ))}
      </div>

      {/* Panel */}
      <p>
        <span className="font-bold text-xl">{t('Color')} - </span> {t('Panel')}
      </p>
      <div className="flex justify-start items-center p-2 gap-5">
        {ColorsSetting.panel.map((item, idx) => (
          <Color
            key={idx}
            color={item.color}
            selected={panelColor === item.color}
            name={item.name}
            setColor={setPanelColor}
          />
        ))}
      </div>

      {/* Gutter */}
      <p className="mt-5">
        <span className="font-bold text-xl">Roof Drainage</span>
      </p>
      <div className="flex justify-start items-start p-2 gap-5">
        {ColorsSetting.gutter.map((item, idx) => (
          <Material
            key={idx}
            inx={idx}
            src={item.map}
            selected={isGutter === item.map}
            name={item.name}
            setTexture={setGutter}
          />
        ))}
      </div>
      <div className="flex justify-start items-start p-2 gap-3">
        {currentGutter?.colors.map((clr, idx) => (
          <Color
            key={idx}
            color={clr}
            selected={gutterColor === clr}
            name=""
            setColor={setGutterColor}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(CPColors)