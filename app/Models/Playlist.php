<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    protected $fillable = ['user_id', 'video_id', 'title', 'artist', 'thumbnail', 'type', 'duration', 'order'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
