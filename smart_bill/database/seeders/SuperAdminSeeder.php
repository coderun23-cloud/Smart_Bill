<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imagePath = 'images/mr.jpg'; // Make sure the image is in public/images folder
        User::updateOrCreate(
            ['email' => 'superadmin@gmail.com'], // Ensure the Super Admin's email is unique
            [
                'name' => 'Super Admin',
                'password' => Hash::make('superadmin123'), // Replace with a strong password
                'role' => 'superadmin', 
                'phone_number'=>'0982847827',
                'image' => $imagePath,
                'address'=>'Addis Ababa'
            ]
        );

        $this->command->info('Super Admin user seeded successfully.');
    }
}
