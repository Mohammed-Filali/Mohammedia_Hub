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
            $table->string('name');
            $table->string('adress');
            $table->string('CIN');
            $table->string('telephone');
            $table->integer('age');
            $table->boolean('isAccept')->default(0);
            $table->string('email');
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reclamations');
    }
}
