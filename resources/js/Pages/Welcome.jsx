import { useState, useEffect } from 'react';
import { Link, Head, router } from '@inertiajs/react';

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

  const handleAuthClick = (path) => {
    if (auth?.user) {
      // Debug role
      console.log('User roles:', auth.user.roles);
      
      // Cek apakah user memiliki role 'users-access'
      const hasUserAccess = auth.user.roles.some(role => role.name === 'users-access');
      
      if (hasUserAccess) {
        router.get(route('apps.user.dashboard'));
      } else {
        router.get(route('apps.dashboard'));
      }
    } else {
      // Jika belum login, arahkan ke halaman register/login
      router.get(route(path));
    }
  };

  return (
    <>
      <Head title="Welcome" />
      <div className="min-h-screen bg-white">
        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Image Section - Left on large screens, Top on small screens */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              <img
                src="/images/ilustrator-onboarding.png"
                className="w-full h-auto"
                alt="SellMate Illustration"
              />
            </div>
          </div>

          {/* Text and Buttons Section - Right on large screens, Bottom on small screens */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:pr-12 lg:pl-0">
            {/* Text Content */}
            <div className="mb-8 lg:mb-12">
              <h1 className="text-2xl lg:text-3xl font-bold text-black leading-tight">
                Kelola omzet Tefamu dengan
                <br />
                satu genggaman bersama
                <br />
                SellMate
              </h1>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center lg:items-start space-y-3">
              <button
                onClick={() => handleAuthClick('register')}
                className="w-full lg:max-w-lg h-[40px] bg-[#DD661D] text-white text-center py-2 rounded font-medium hover:bg-[#BB551A] transition"
              >
                Mulai
              </button>
              <button
                onClick={() => handleAuthClick('login')}
                className="w-full lg:max-w-lg border border-[#DD661D] text-center py-2 rounded text-gray-600 font-medium hover:bg-[#BB551A] hover:text-white transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
