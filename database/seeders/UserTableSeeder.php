<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get admin role
        $adminRole = Role::where('name', 'super-admin')->first();
        $userRole = Role::where('name', 'users-access')->first();

        // create new admin
        $admin = User::create([
            'name' => 'Akbar Tolib Ramadan',
            'email' => 'akbartolieb@gmail.com',
            'password' => bcrypt('rmdn123-'),
        ]);

        // assign admin role
        $admin->assignRole($adminRole);

        // Create 100 regular users
        User::factory()->count(100)->create()->each(function ($user) use ($userRole) {
            $user->assignRole($userRole);
        });
    }
}
