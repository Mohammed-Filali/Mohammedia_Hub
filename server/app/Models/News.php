<?php

namespace App\Models;
use App\Models\News_like;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'image',
    ];
    public function likes()
    {
        return $this->hasMany(News_like::class);
    }
    public function getLikesCountAttribute()
    {
        return $this->likes()->where('is_liked', true)->count();
    }
    public function getDislikesCountAttribute()
    {
        return $this->likes()->where('is_disliked', true)->count();
    }
    public function getCommentsCountAttribute()
    {
        return $this->likes()->whereNotNull('comment')->count();
    }
    public function getComments()
    {
        return $this->likes()->whereNotNull('comment')->with('user')->get();
    }

    public function getFileUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }
}
