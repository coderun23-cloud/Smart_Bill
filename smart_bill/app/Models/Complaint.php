<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class complaint extends Model
{
    //
    protected $fillable = [
        'user_id',
        'subject',
        'description',
        'status',
        'resolution_date',
    ];

    // Relationship to the user
    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
