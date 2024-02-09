import Image from 'next/image'
import React from 'react'
import SebraeLogo from '@/public/sebrae.png'
import SicoobFrutalLogo from '@/public/sicoobfrutal.png'
import FenegLogo from '@/public/feneg.png'

export default function Header() {
    return (
        <div className='bg-gradient-to-b flex w-full align-middle items-center justify-between p-5'>
            <Image
                src="/feneg.png"
                width={150}
                height={100}
                alt="FENEG Logo"
                className='hover:animate-pulse cursor-pointer'
            />
            <Image
                src="/sicoobfrutal.png"
                width={159.6}
                height={0}
                alt="FENEG Logo"
                className='hover:animate-pulse cursor-pointer'
            />
            <Image
                src="/sebrae.png"
                width={156}
                height={0}
                alt="FENEG Logo"
                className='hover:animate-pulse cursor-pointer'
            />
        </div>
    )
}
