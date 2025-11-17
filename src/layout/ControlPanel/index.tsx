'use client'
import CPColors from '@/components/CPColors'
import CPInsulation from '@/components/CPInsulation'
import CPSizes from '@/components/CPSizes'
import Price from '@/components/Price'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

const ControlPanel = () => {
    const { t } = useTranslation();
    return (
        <div className='w-full px-12 text-primary text-lg select-none'>
            <div>
                <p className='text-4xl font-bold '>{t("House MockUp - made V3")}</p>
                <p className=''><span className='text-third text-2xl'>★★★★★ </span>4.9/5 (839 {t("reviews")})</p>
            </div>
            <div className='flex flex-col gap-2'>
                <p className='mt-5 font-bold'>{t("Price")}</p>
                <Price />
                <p className='text-base'>{t("Only 30 days delivery")}</p>
            </div>
            <CPSizes />
            <CPColors />
            <CPInsulation />
            <div className='mb-20'>
                <div className='mt-5 font-bold'>{t("Total") + " " + t("Price")}</div>
                <Price />
            </div>
            <div className='p-4 w-full text-center bg-secondary text-white shadow-lg drop-shadow-lg'>{t("Add To Cart")}</div>
        </div>
    )
}

export default memo(ControlPanel)
