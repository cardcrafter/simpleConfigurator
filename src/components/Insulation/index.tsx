import Image from 'next/image';
import React, { memo } from 'react'

type Props = {
    src: string;
    value: number;
    name: string;
    price: string;
    selected: boolean;
    setInsulation: (arg0: number) => void;
}
const Insulation = ({ src, value, selected, name, price, setInsulation }: Props) => {
    return (
        <button
            className={`duration-700 px-12 transition-colors border-4 bg-white hover:border-zinc-400  drop-shadow-lg shadow-lg${selected ? ' border-zinc-500' : ' border-zinc-50'}`}
            onClick={() => setInsulation(value)}
        >
            <Image src={src} width={100} height={100} alt={name} className='opacity-60 w-auto h-auto' />
            <p className='absolute bottom-1/2 right-0 text-center w-full text-sm font-extrabold text-zinc-700'>{name}</p>
            <p className='text-xs absolute bottom-3 right-1/2 translate-x-1/2'>{price}</p>
        </button>
    )
}

export default memo(Insulation)