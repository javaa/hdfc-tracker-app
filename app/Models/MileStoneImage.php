<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MileStoneImage extends Model
{
    protected $fillable = [
        'projectMileStoneId',
        'image',
        'geoLocation'
    ];

    protected $casts = [
        'geoLocation' => 'array'
    ];

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(ProjectMileStone::class, 'projectMileStoneId');
    }
}
