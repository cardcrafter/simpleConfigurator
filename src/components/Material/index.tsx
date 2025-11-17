import Image from 'next/image';
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next';

type Props = {
    inx: number;
    src: string;
    name: string;
    selected: boolean;
    setTexture: (arg0: string) => void;
}
const Material = ({ src, selected, name, inx, setTexture }: Props) => {
    const { t } = useTranslation();
    return (
        <div className='flex flex-col gap-2 items-center justify-start'>
            <button
                className={`w-16 h-16 duration-700 transition-colors rounded-full border-4 overflow-hidden hover:border-slate-400 drop-shadow-lg  shadow-lg${selected ? ' border-slate-500' : ' border-slate-50'}`}
                onClick={() => setTexture(src)}
            >
                {
                    inx > 0 ? (
                        <Image alt={name} src={src} width={200} height={200} className='w-32 h-auto scale-200' />
                    ) : (
                        <p className='w-full h-full bg-white'></p>
                    )
                }
            </button>
            <p className='text-xs font-extrabold text-zinc-700'>{t(name)}</p>
        </div>
    )
}

export default memo(Material)
