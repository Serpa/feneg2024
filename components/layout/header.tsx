import Image from 'next/image'
import React from 'react'
import SebraeLogo from '@/public/sebrae.png'
import SicoobFrutalLogo from '@/public/sicoobfrutal.png'
import FenegLogo from '@/public/feneg.png'

export default function Header() {
    return (
        <div className='flex w-full align-middle items-center justify-between h-20 p-2'>
            <Image
                priority={true}
                src="/feneg.png"
                width="0"
                height="0"
                sizes="100vw"
                style={{ width: '10rem', height: 'auto' }}
                alt="FENEG Logo"
                className='hover:animate-pulse cursor-pointer'
            />
            <div className='flex h-fit w-fit p-2'>

                <Image
                    src="/sicoobfrutal.png"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: '7rem', height: 'auto' }}
                    alt="Sicoob Frutal Logo"
                    className='p-2 hover:animate-pulse cursor-pointer'
                />
                <Image
                    src="/sicoobitapagipe.png"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: '9rem', height: 'auto' }}
                    alt="Sicoob Itapagipe Logo"
                    className='p-2 hover:animate-pulse cursor-pointer'
                />
                <Image
                    src="/sebrae.png"
                    width="0"
                    height="0"
                    sizes="100vw"
                    style={{ width: '5rem', height: 'auto' }}
                    alt="FENEG Logo"
                    className='hover:animate-pulse cursor-pointer'
                />
            </div>
        </div>
    )
}
