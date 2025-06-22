<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    //
   public function users(){
        return User::where('role','admin')->orWhere('role','meterreader')->get();
    }
}
