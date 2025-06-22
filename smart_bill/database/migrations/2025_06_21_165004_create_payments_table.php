<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->string('first_name');
        $table->string('last_name');
        $table->string('email');
        $table->string('tx_ref')->unique();
        $table->decimal('amount', 10, 2);
        $table->string('phone');
        $table->string('status')->default('pending');
        
        $table->unsignedBigInteger('bill_id');  // New foreign key column
        
        $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
