<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
 public function register(Request $request)
{
    $fields = $request->validate([
        'name' => "required|max:100",
        'email' => "required|email",
        'subject' => "required|max:150",  
        'message' => "required|max:1000", 
    ]);

    $message = Contact::create($fields);

    return response()->json([
        "success" => true,
        "message" => "Your contact message has been submitted successfully.",
        "contact" => $message,
    ], 201);
}

    public function displayMessage(){
        return Contact::all();
    }
}
