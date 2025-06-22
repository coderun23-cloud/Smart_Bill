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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            $table->string('message');
            $table->string('notification_type'); // e.g., "bill", "reading", etc.
            $table->timestamp('sent_at')->nullable(); // can be filled when sent
            $table->boolean('is_read')->default(false);

            $table->foreignId('sent_to_id')->constrained('users')->onDelete('cascade');
            // The user (superadmin) who will receive this notification

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
