<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['produk', 'jasa'];
        $products = [
            'Kue', 'Roti', 'Donat', 'Brownies', 'Pizza',
            'Nasi Goreng', 'Mie Goreng', 'Sate', 'Soto', 'Bakso',
            'Desain Logo', 'Desain Banner', 'Edit Video', 'Fotografi', 'Jasa Print',
            'Service Komputer', 'Install Software', 'Maintenance', 'Konsultasi IT', 'Website'
        ];

        // Create 100 products
        for ($i = 0; $i < 100; $i++) {
            $productName = $products[array_rand($products)];
            $category = $categories[array_rand($categories)];
            $isService = $category === 'jasa';

            Product::create([
                'nama_produk' => $productName . ' ' . ($i + 1),
                'deskripsi_produk' => 'Deskripsi untuk ' . $productName . ' ' . ($i + 1),
                'harga_produk' => rand($isService ? 50000 : 10000, $isService ? 500000 : 100000),
                'komisi_produk' => rand(5, 20),
                'kategori' => $category,
            ]);
        }
    }
} 