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
    Schema::create('activities', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id')->nullable(); // ID de l'utilisateur (si applicable)
        $table->string('action'); // Action effectuée (ex: "login", "create_reclamation")
        $table->text('description')->nullable(); // Description détaillée de l'activité
        $table->timestamps(); // created_at et updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
