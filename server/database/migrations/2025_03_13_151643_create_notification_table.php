<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('notification', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id'); // L'utilisateur concerné
        $table->string('message'); // Le message de la notification
        $table->boolean('read')->default(false); // Si la notification est lue ou non
        $table->timestamps();

        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification');
    }
};
