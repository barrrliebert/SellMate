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
        Schema::table('videos', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title')->nullable();
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->string('slug')->unique()->after('title')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn('slug');
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
