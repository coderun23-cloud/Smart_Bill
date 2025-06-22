<?php

namespace App\Policies;

use App\Models\Tariff;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TariffPolicy
{
   public function create(User $user): Response
    {
        return $user->role === 'superadmin'
        ? Response::allow()
        : Response::deny('Only admins can create a tariff.');
    }

    public function update(User $user, Tariff $tariff): Response
    {
        return $user->role === 'superadmin'
            ? Response::allow()
            : Response::deny('Only admins can update this Tariff.');
    }

    public function delete(User $user, Tariff $tariff): Response
    {
        return $user->role === 'superadmin'
            ? Response::allow()
            : Response::deny('Only admins can delete this category.');
    }
}
