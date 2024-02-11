import Image from 'next/image'
import React from 'react'
import SebraeLogo from '@/public/sebrae.png'
import SicoobFrutalLogo from '@/public/sicoobfrutal.png'
import FenegLogo from '@/public/feneg.png'

export default function Header() {
    return (
        <div className='flex w-full align-middle items-center justify-between'>
            <Image
                priority={true}
                src="/feneg.png"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: '150px', height: 'auto' }}
                alt="FENEG Logo"
                className='hover:animate-pulse cursor-pointer'
            />
            <Image
                src="/sicoobfrutal.png"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: '150px', height: 'auto' }}
                alt="FENEG Logo"
                className='hover:animate-pulse cursor-pointer'
            />
            <Image
                src="/sebrae.png"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: '150px', height: 'auto' }}
                alt="FENEG Logo"
                className='hover:animate-pulse cursor-pointer'
            />
        </div>
    )
}
