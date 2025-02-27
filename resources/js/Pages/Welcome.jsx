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
      <div className="bg-gray-50 text-black dark:bg-black dark:text-white min-h-screen flex flex-col">
        <div className="relative h-[50vh] md:h-[60vh] mb-14">
          <img
            src={sliderImages[currentIndex]}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderImages.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
              ></span>
            ))}
          </div>
        </div>
        <div className="max-w-lg px-6 lg:mx-auto">
          <p className="text-left text-3xl lg:text-center mb-6">
            <span>Catat pemasukan TEFA</span>
            <br />
            <span>kamu bersama SellMate</span>
          </p>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <Link
            href={route('login')}
            className="rounded-sm px-8 py-2 border border-violet-300 bg-white text-violet-600 hover:bg-violet-50 transition"
          >
            Log in
          </Link>
          <Link
            href={route('register')}
            className="rounded-sm px-8 py-2 bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
}
