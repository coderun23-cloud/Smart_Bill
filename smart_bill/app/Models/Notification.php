<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    /** @use HasFactory<\Database\Factories\NotificationFactory> */
    use HasFactory;
  protected $fillable = [
        'message',
        'notification_type',
        'sent_at',
        'is_read',
        'sent_to_id'
    ];

    public function recipient()
    {
        return $this->belongsTo(User::class, 'sent_to_id');
    }

}
