<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectMileStone extends Model
{
    protected $fillable = [
        'projectId',
        'milestoneTitle',
        'estimateStartDate',
        'estimateEndDate',
        'actualStartDate',
        'actualEndDate',
        'status',
        'order'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'projectId');
    }

    public function images(): HasMany
    {
        return $this->hasMany(MilestoneImage::class, 'projectMileStoneId');
    }
}
