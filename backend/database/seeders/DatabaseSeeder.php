<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@company.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'department' => 'IT',
            'is_active' => true,
        ]);

        // Create staff user
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@company.com',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'department' => 'Operasional',
            'is_active' => true,
        ]);

        // Create employee user
        User::create([
            'name' => 'Rina Dewi',
            'email' => 'rina@company.com',
            'password' => Hash::make('password123'),
            'role' => 'employee',
            'department' => 'Marketing',
            'is_active' => true,
        ]);

        // Create categories
        $categories = [
            ['name' => 'Elektronik', 'description' => 'Peralatan elektronik', 'color' => '#6366F1'],
            ['name' => 'ATK', 'description' => 'Alat tulis kantor', 'color' => '#10B981'],
            ['name' => 'Furniture', 'description' => 'Perabotan kantor', 'color' => '#F59E0B'],
            ['name' => 'Peralatan IT', 'description' => 'Komputer dan aksesoris', 'color' => '#EF4444'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Create locations
        $locations = [
            ['name' => 'Gudang Utama', 'code' => 'GU-001', 'description' => 'Gudang penyimpanan utama'],
            ['name' => 'Gudang B', 'code' => 'GB-001', 'description' => 'Gudang cadangan'],
            ['name' => 'Kantor Lantai 1', 'code' => 'KL1-001', 'description' => 'Area kantor lantai 1'],
            ['name' => 'Kantor Lantai 2', 'code' => 'KL2-001', 'description' => 'Area kantor lantai 2'],
        ];

        foreach ($locations as $loc) {
            Location::create($loc);
        }

        // Create sample items
        $items = [
            [
                'name' => 'Laptop Dell XPS 15',
                'sku' => 'ELK-001',
                'category_id' => 1,
                'location_id' => 1,
                'stock' => 10,
                'min_stock' => 5,
                'price' => 25000000,
                'unit' => 'unit',
                'type' => 'asset',
                'description' => 'Laptop Dell XPS 15 inch, i7, 16GB RAM',
            ],
            [
                'name' => 'Kertas A4 80gsm',
                'sku' => 'ATK-001',
                'category_id' => 2,
                'location_id' => 1,
                'stock' => 100,
                'min_stock' => 20,
                'price' => 55000,
                'unit' => 'rim',
                'type' => 'consumable',
                'description' => 'Kertas HVS A4 80 gram',
            ],
            [
                'name' => 'Meja Kantor',
                'sku' => 'FRN-001',
                'category_id' => 3,
                'location_id' => 3,
                'stock' => 25,
                'min_stock' => 5,
                'price' => 1500000,
                'unit' => 'unit',
                'type' => 'asset',
                'description' => 'Meja kantor ukuran 120x60cm',
            ],
            [
                'name' => 'Mouse Wireless Logitech',
                'sku' => 'IT-001',
                'category_id' => 4,
                'location_id' => 1,
                'stock' => 30,
                'min_stock' => 10,
                'price' => 350000,
                'unit' => 'unit',
                'type' => 'consumable',
                'description' => 'Mouse wireless Logitech M331',
            ],
            [
                'name' => 'Printer HP LaserJet',
                'sku' => 'IT-002',
                'category_id' => 4,
                'location_id' => 3,
                'stock' => 5,
                'min_stock' => 2,
                'price' => 4500000,
                'unit' => 'unit',
                'type' => 'asset',
                'description' => 'Printer HP LaserJet Pro',
            ],
        ];

        foreach ($items as $item) {
            Item::create($item);
        }
    }
}
