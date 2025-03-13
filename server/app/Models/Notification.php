<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Notification extends Pivot
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'message',
        'read',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
