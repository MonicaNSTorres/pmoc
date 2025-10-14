"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex flex-col items-start">
            <button onClick={handleBack} className="flex items-center text-blue-800 font-semibold mb-2 space-x-2 hover:cursor-pointer"> 
                <ArrowLeft size={20} />
                <span className='text-md'>Voltar</span>
            </button>
        </div>
    );
}
export default BackButton;