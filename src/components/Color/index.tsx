import React, { memo } from 'react'
import { useTranslation } from 'react-i18next';

type Props = {
    color: string;
    name: string;
    selected: boolean;
    setColor: (arg0: string) => void;
}
const Color = ({ color, selected, name, setColor }: Props) => {
    const { t } = useTranslation();
    return (
        <div className='flex flex-col gap-2 items-center justify-start'>
            <button
                className={`w-12 h-12 duration-700 transition-colors rounded-full border-4 hover:border-zinc-400  drop-shadow-lg shadow-lg${selected ? ' border-zinc-500' : ' border-zinc-50'}`}
                style={{ backgroundColor: color }}
                onClick={() => setColor(color)}
            />
            <p className='text-xs font-extrabold text-zinc-700'>{t(name)}</p>
        </div>
    )
}

export default memo(Color)
