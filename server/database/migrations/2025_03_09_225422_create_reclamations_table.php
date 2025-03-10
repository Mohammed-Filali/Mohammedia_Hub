<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReclamationsTable extends Migration
{
    public function up()
    {
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->string('category');
            $table->string('file_path')->nullable(); // chemin du fichier
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reclamations');
    }
}
