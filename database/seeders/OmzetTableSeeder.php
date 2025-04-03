<?php

namespace Database\Seeders;

use App\Models\Omzet;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OmzetTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('email', '!=', 'akbartolieb@gmail.com')->get();
        $products = Product::all();
        
        // Generate transactions for the last 30 days
        for ($day = 0; $day < 30; $day++) {
            $date = Carbon::now()->subDays($day);
            
            // Generate 10-20 transactions per day
            $transactionsPerDay = rand(10, 20);
            
            for ($i = 0; $i < $transactionsPerDay; $i++) {
                $user = $users->random();
                $product = $products->random();
                
                $quantity = rand(1, 5);
                
                Omzet::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'jumlah_omzet' => $quantity,
                    'tanggal' => $date->toDateString(),
                    'created_at' => $date->copy()->addHours(rand(8, 20))->addMinutes(rand(0, 59)),
                    'updated_at' => $date->copy()->addHours(rand(8, 20))->addMinutes(rand(0, 59)),
                ]);
            }
        }
    }
} 