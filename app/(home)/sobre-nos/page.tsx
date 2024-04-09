'use client';
import LoadingError from '@/components/error-loading'
import Loading from '@/components/loading'
import { RichTextReadOnly } from 'mui-tiptap';
import React from 'react'
import useSWR from 'swr'
import useExtensions from '@/app/(dashboard)/admin/sobre-nos/useExtensions';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function TestPage() {
    const extensions = useExtensions()
    const { data, isLoading, error } = useSWR('/api/admin/sobreNos')
    if (isLoading) return <Loading />
    if (error) return <LoadingError />
    return (
        <>
            <h1 className='flex mb-4 justify-center items-center text-4xl font-extrabold leading-none tracking-tight text-verde-escuro md:text-5xl lg:text-6xl dark:text-white m-5'>SOBRE NÓS</h1>
            <Separator />
            <div className='flex flex-col grow p-5'>
                <p className='text-2xl text-verde-escuro font-bold'>HISTÓRIA DA COOPERATIVA SICOOB FRUTAL</p>
                <div className='p-5 space-y-2'>
                    <p className='text-xl'>
                        O Sicoob Frutal é uma Cooperativa de Crédito que foi constituída em setembro de 1993, com início das atividades em fevereiro de 1994. A ideia de abrir uma Cooperativa de Crédito em Frutal, surgiu dentro do Conselho de Administração da Cooperativa mãe: Cofrul.
                    </p>
                    <p className='text-xl'>
                        A Cooperativa prosperou e desde então, 8 agências e 1 Unidade Administrativa foram abertas: Em 03/12/1996 inaugurou-se a Agência de Pirajuba, em 13/04/1998 a Agência do Distrito de Aparecida de Minas, em 25/04/2003 a sede própria na Praça da Matriz de Frutal – Agência Matriz, em 28/07/2004 a Agência de Fronteira, em 06/06/2005 a Agência de Comendador Gomes, em 23/02/2012 a Agência do CIAP junto ao Sindicato Rural de Frutal, em 21/11/2014 foi criada a UAD (Unidade Administrativa, primeiramente localizada na Praça Dr. França, próxima a prefeitura de Frutal), em 31/07/2015 inaugurou-se a Agência JK e nesta mesma data a UAD (Unidade Administrativa) foi transferida da Praça Dr. França para a Avenida JK, 111 e em 20/06/2023 inaugurou-se a Agência de São José do Rio Preto. Além das inaugurações, no dia 27/10/2023 a Unidade Administrativa foi segmentada em dois prédios, sendo o Centro Administrativo na Av. JK, 101 e a Unidade de Negócios Estratégicos, na Av. JK, 111.
                    </p>
                    <p className='text-xl'>
                        O Sicoob Frutal se desenvolveu de forma impressionante e o crescimento está totalmente alinhado com o propósito de “Conectar pessoas para promover justiça financeira e prosperidade” e a missão de “Promover soluções e experiências inovadoras e sustentáveis por meio da cooperação”.

                    </p>
                    <p className='text-xl'>
                        Esse é o Sicoob Frutal: uma Cooperativa feita de Valores!
                    </p>
                </div>
                <Separator />
                <div className='flex flex-row p-5 items-center'>
                    <div className='w-2/4 p-5'>
                        <p className='text-2xl text-verde-escuro font-bold'>A FENEG</p>
                        <p className='text-xl'>
                            A Feira de Negócios Sicoob Frutal foi idealizada para ser algo diferente e inovador, focada em negócios e cultura. Por isso, o Sicoob Frutal e Sebrae se uniram mais uma vez para promover o desenvolvimento econômico e social da região.
                        </p>
                        <p className='text-xl'>
                            A Feira oportuniza as empresas, exporem e venderem seus produtos e serviços por meio de financiamentos com taxas diferenciadas e competitivas no mercado, fomentando a sustentabilidade dos negócios.
                        </p>
                        <p className='text-xl'>
                            O agronegócio, o comércio e os demais pilares negociais do território são beneficiados, uma vez que são ofertados pela cooperativa recursos para custeio, investimento, financiamentos e capital de giro, além de um vasto portfólio de produtos e serviços disponibilizados pelos expositores em condições muito favoráveis.
                        </p>
                        <p className='text-xl'>
                            No âmbito de conhecimento e conexão o evento proporciona uma programação repleta de aprendizado com temáticas de grande relevância, além da geração networking.
                        </p>
                        <p className='text-xl'>
                            Em 2023 a primeira edição da feira foi responsável pela injeção de mais de R$ 100 milhões na economia regional, graças à ampla oferta de taxas e condições facilitadas pelas empresas nos estandes.
                        </p>
                        <p className='text-xl'>
                            Agradecemos profundamente a todos que participaram do sucesso da 1ª FENEG. E deixamos aqui nosso convite para a FENEG 2024!
                        </p>
                    </div>
                    <div className='w-2/4'>
                        <Image src={'https://res.cloudinary.com/dt8o4rsmt/image/upload/v1709054154/sobre-nos/egicw1lehibdi6qwin3j.jpg'} width={800} height={800} alt='Foto abertura evento.' />
                    </div>
                </div>
            </div>
            <Separator />
            <div className='flex grow p-5'>
                <video controls autoPlay muted className='object-fill'>
                    <source src="https://res.cloudinary.com/dt8o4rsmt/video/upload/v1709555429/sobre-nos/bqndgotdu1usst9izvks.mp4" type="video/mp4" />
                    Seu navegador não suporta a execução de videos.
                </video>
            </div>
        </>
    )
}
