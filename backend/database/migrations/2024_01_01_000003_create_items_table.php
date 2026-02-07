<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('sku', 50)->unique();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['asset', 'consumable'])->default('consumable');
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(0);
            $table->string('unit', 20)->default('pcs');
            $table->decimal('price', 15, 2)->default(0);
            $table->string('supplier')->nullable();
            $table->text('description')->nullable();
            $table->json('specifications')->nullable();
            $table->json('images')->nullable();
            $table->string('qr_code')->nullable();
            $table->timestamps();

            $table->index(['name', 'sku']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
