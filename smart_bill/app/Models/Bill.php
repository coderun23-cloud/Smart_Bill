<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    /** @use HasFactory<\Database\Factories\BillFactory> */
    use HasFactory;
     protected $fillable = [
        'user_id',
        'generated_by',
        'bill_amount',
        'status',
        'tariff_id',
        'reading_id',
        'due_date',
    ];

    // Relationship to Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'user_id');
    }

    // Relationship to User who generated the bill
    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function tariff()
    {
        return $this->belongsTo(Tariff::class);
    }


    public function reading()
    {
        return $this->belongsTo(Reading::class);
    }

}
