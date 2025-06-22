<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;
      protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'tx_ref',
        'amount',
        'phone',
        'status',
        'bill_id',  // Make bill_id fillable
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
