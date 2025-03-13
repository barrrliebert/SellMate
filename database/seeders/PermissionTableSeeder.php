<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // dashboard permissions
        Permission::create(['name' => 'dashboard-access']);

         // users permissions
         Permission::create(['name' => 'users-access']);
         Permission::create(['name' => 'users-data']);
         Permission::create(['name' => 'users-create']);
         Permission::create(['name' => 'users-update']);
         Permission::create(['name' => 'users-delete']);

         // roles permissions
         Permission::create(['name' => 'roles-access']);
         Permission::create(['name' => 'roles-data']);
         Permission::create(['name' => 'roles-create']);
         Permission::create(['name' => 'roles-update']);
         Permission::create(['name' => 'roles-delete']);

         // permissions permissions
         Permission::create(['name' => 'permissions-access']);
         Permission::create(['name' => 'permissions-data']);
         Permission::create(['name' => 'permissions-create']);
         Permission::create(['name' => 'permissions-update']);
         Permission::create(['name' => 'permissions-delete']);

         // products permissions
         Permission::create(['name' => 'products-access']);
         Permission::create(['name' => 'products-data']);
         Permission::create(['name' => 'products-create']);
         Permission::create(['name' => 'products-update']);
         Permission::create(['name' => 'products-delete']);

         // omzet permissions
         Permission::create(['name' => 'omzet-access']);
         Permission::create(['name' => 'omzet-create']);
         Permission::create(['name' => 'omzet-data']);

         // target permissions
         Permission::create(['name' => 'target-access']);
         Permission::create(['name' => 'target-create']);
         Permission::create(['name' => 'target-update']);
         Permission::create(['name' => 'target-delete']);
         Permission::create(['name' => 'target-data']);
    }
}
