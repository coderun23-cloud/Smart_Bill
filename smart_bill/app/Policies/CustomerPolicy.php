<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CustomerPolicy
{
   
    public function forceDelete(User $user, Customer $customer): bool
    {
        return false;
    }
}
