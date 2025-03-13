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
        $role = Role::where('name', 'super-admin')->first();

        // create new admin
        $user = User::create([
            'name' => 'Akbar Tolib Ramadan',
            'email' => 'akbartolieb@gmail.com',
            'password' => bcrypt('rmdn123-'),
        ]);

        // assign a role to user
        $user->assignRole($role);
    }
}
