<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['inbound', 'outbound', 'adjustment']);
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('staff_id')->constrained('users')->onDelete('cascade');
            $table->string('supplier')->nullable();
            $table->string('invoice_no')->nullable();
            $table->string('purpose')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();

            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
