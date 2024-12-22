<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'projectTitle',
        'projectCreator',
        'slug',
    ];

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMileStone::class, 'projectId')->orderBy('order');
    }
}
