<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ReplaceIsAcceptWithEtatInReclamationsTable extends Migration
{
    public function up()
    {
        Schema::table('reclamations', function (Blueprint $table) {
            // Add the new etat column as an enum or string
            $table->enum('etat', ['pas encours', 'encours', 'finis'])->default('pas encours')->after('age');
        });

        // Copy data from isAccept to etat (optional)
        \DB::table('reclamations')->update(['etat' => \DB::raw('IF(isAccept = 1, "finis", "pas encours")')]);

        // Drop the old column
        Schema::table('reclamations', function (Blueprint $table) {
            $table->dropColumn('isAccept');
        });
    }

    public function down()
    {
        Schema::table('reclamations', function (Blueprint $table) {
            // Recreate the isAccept column
            $table->boolean('isAccept')->default(0)->after('age');
        });

        // Copy data back from etat to isAccept (optional)
        \DB::table('reclamations')->update(['isAccept' => \DB::raw('IF(etat = "finis", 1, 0)')]);

        // Drop the etat column
        Schema::table('reclamations', function (Blueprint $table) {
            $table->dropColumn('etat');
        });
    }
}
