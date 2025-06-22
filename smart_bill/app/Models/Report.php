<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    /** @use HasFactory<\Database\Factories\ReportFactory> */
    use HasFactory;
protected $fillable = [
    'sender_id',
    'sender_role',
    'report_type',
    'content'
];


    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

}
