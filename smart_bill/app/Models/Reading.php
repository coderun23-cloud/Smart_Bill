<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Customer;

class Reading extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_id',
        'amount',
        'reading_type',
        'reading_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

   public function customer()
{
    return $this->belongsTo(Customer::class);
}

}
