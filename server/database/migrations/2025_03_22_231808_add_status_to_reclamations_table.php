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
    Schema::table('reclamations', function (Blueprint $table) {
        $table->string('status')->default(''); // Ajouter la colonne status
    });
}

public function down()
{
    Schema::table('reclamations', function (Blueprint $table) {
        $table->dropColumn('status'); // Supprimer la colonne status en cas de rollback
    });
}
};
