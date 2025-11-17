import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="relative">
                <Image
                    src={'/blueprint.jpg'}
                    width={900}
                    height={512}
                    className="h-screen w-screen opacity-40 shadow-lg"
                    alt="blueprint"
                />
                <Link href={"/product/house-configurator"} className="absolute bottom-1/2 right-32 p-12 text-5xl font-bold text-zinc-700 shadow-lg backdrop-blur-sm">
                    <p className="border-b-4 border-zinc-700 pb-2 w-full text-center">TestVM</p>
                    <p className="w-full text-center text-xl">(3d wooden house configurator)</p>
                </Link>
                <p className="absolute bottom-12 right-3 font-bold text-zinc-500">Made by Creative Developer: Joseph</p>
                <p className="absolute bottom-5 right-3 font-bold text-zinc-500">valcano103@gmail.com</p>
            </div>
        </div>
    )
}
