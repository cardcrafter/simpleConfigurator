import InsulationSetting from '@/assets/InsulationSetting.json'
import Insulation from '@/components/Insulation'
import { useInsulation } from '@/store/useInsulation'
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';

const CPInsulation = () => {
  const [roofInsulation, wallInsulation, setRoofInsulation, setWallInsulation] = useInsulation(useShallow((state) => [
    state.roofInsulation,
    state.wallInsulation,
    state.setRoofInsulation,
    state.setWallInsulation
  ]));
  const { t } = useTranslation();
  return (
    <div className='my-10'>
      <p><span className='font-bold text-xl'>{t("Insulation")} - </span> {t("Wall")}</p>
      <div className='flex flex-wrap justify-start items-center p-2 gap-5'>
        {
          InsulationSetting.wall.map((item, idx) => (
            <Insulation key={idx} name={item.name} selected={wallInsulation === item.value} src={item.src} setInsulation={setWallInsulation} value={item.value} price={"+" + item.price + "SEK"} />
          ))
        }
      </div>
      <p className='mt-5'><span className='font-bold text-xl'>{t("Insulation")} - </span> {t("Roof")}</p>
      <div className='flex flex-wrap justify-start items-center p-2 gap-5'>
        {
          InsulationSetting.roof.map((item, idx) => (
            <Insulation key={idx} name={item.name} selected={roofInsulation === item.value} src={item.src} setInsulation={setRoofInsulation} value={item.value} price={"+" + item.price + "SEK"} />
          ))
        }
      </div>
    </div>
  )
}

export default memo(CPInsulation)