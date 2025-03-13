import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  const sliderImages = [
    'https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg',
    'https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg',
    'https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head title="Welcome" />
      <div className="min-h-screen bg-white flex flex-col">
        {/* Main Image and Text Section */}
        <div className="flex-1 flex flex-col px-6 pt-10">
          {/* Illustration */}
          <div className="w-full max-w-md mx-auto mb-8">
            <img
              src="/images/ilustrator-onboarding.png"
              className="w-full h-auto"
            />
          </div>

          {/* Text Content */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black leading-tight">
              Kelola omzet Tefamu dengan
              <br />
              satu genggaman bersama
              <br />
              SellMate
            </h1>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col items-center space-y-3">
            <Link
              href={route('register')}
              className="w-[300px] h-[40px] bg-[#DD661D] text-white text-center py-2 rounded font-medium hover:bg-[#BB551A] transition"
            >
              Mulai
            </Link>
            <Link
              href={route('login')}
              className="w-[300px] h-[40px] border border-[#DD661D] text-center py-2 rounded text-gray-600 font-medium hover:bg-[#BB551A] transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
