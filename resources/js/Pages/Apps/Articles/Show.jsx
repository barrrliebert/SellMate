import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DOMPurify from 'dompurify';

export default function Show({ article }) {
    return (
        <>
            <Head title={article.title} />
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                
                {/* Tombol Kembali dipindahkan ke atas */}
                <div className="mb-4">
                    <a href={route('apps.articles.index')} className="text-blue-600 hover:underline">
                        ← Kembali ke daftar artikel
                    </a>
                </div>

                <h1 className="text-2xl font-bold">{article.title}</h1>
                <p className="text-gray-500 text-sm mb-4">Oleh {article.author} - {article.published_at}</p>
                
                {/* Tampilkan Gambar Jika Ada */}
                {article.thumbnail && (
                    <img 
                        src={article.thumbnail.startsWith('http')
                            ? article.thumbnail
                            : `/storage/${article.thumbnail}`
                        } 
                        alt={article.title} 
                        className="w-full rounded-lg mb-4"
                    />
                )}

                {/* Tampilkan Konten dengan HTML dari React Quill */}
                <div 
                    className="text-gray-700 dark:text-gray-300 prose max-w-full"
                    dangerouslySetInnerHTML={{ __html: article.description }}
                />
            </div>
        </>
    );
}

Show.layout = page => <AppLayout children={page} />;
