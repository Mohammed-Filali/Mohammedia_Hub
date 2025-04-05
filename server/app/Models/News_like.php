<?php

namespace App\Models;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News_like extends Model
{
    use HasFactory;
    protected $fillable = [
        'news_id',
        'user_id',
        'is_liked',
        'is_disliked',
        'comment',
    ];
    public function news()
    {
        return $this->belongsTo(News::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
