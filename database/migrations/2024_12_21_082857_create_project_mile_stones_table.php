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
        Schema::create('project_mile_stones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('projectId')->constrained('projects');
            $table->string('milestoneTitle', 255);
            $table->date('estimateStartDate')->nullable();
            $table->date('estimateEndDate')->nullable();
            $table->date('actualStartDate')->nullable();
            $table->date('actualEndDate')->nullable();
            $table->string('status')->default('pending');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_mile_stones');
    }
};
