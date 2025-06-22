<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Bill;
use App\Models\User;
use App\Models\Customer;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $customers = Customer::all();

    $data = $customers->map(function ($customer) {
        $hasCurrentMonthBill = Bill::where('user_id', $customer->id)
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->exists();

        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'email' => $customer->email,
            'phone_number' => $customer->phone_number,
            'address'=>$customer->address,
            'customer_type'=>$customer->customer_type,
            'bill_status' => $hasCurrentMonthBill ? 'Set' : 'Not Set',
        ];
    });

    return response()->json($data);
} 
public function store(Request $request)
{
    $fields = $request->validate([
        'name' => 'required|max:100',
        'email' => 'required|email|unique:customers,email',
        'password' => 'required|confirmed|min:8',
        'role' => 'nullable',
        'address' => 'required',
        'customer_type' => 'required',
        'phone_number' => 'nullable|unique:customers,phone_number|regex:/^251\d{9}$/',
    ], [
        'phone_number.regex' => 'The phone number must start with 251 followed by 9 digits (e.g., 251912345678).'
    ]);

    $fields['password'] = Hash::make($fields['password']);

    $customer = Customer::create($fields);

    // Send welcome email to the customer
    Mail::to($customer->email)->send(new WelcomeMail($customer));

    $token = $customer->createToken($customer->name);

    return response()->json([
        'customer' => $customer,
        'token' => $token->plainTextToken
    ], 201);
}

  
    public function show(Customer $customer)
    {
        
        return [
            "customer"=>$customer
        ];
    }

public function update(Request $request, Customer $customer)
{
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'address' => 'required',
        'phone_number' => 'nullable|unique:users',
            ]);

    $emailTakenByCustomer = Customer::where('email', $data['email'])
        ->where('id', '!=', $customer->id)
        ->exists();

    $emailTakenByUser = User::where('email', $data['email'])->exists();

    if ($emailTakenByCustomer || $emailTakenByUser) {
        return response()->json([
            'message' => 'The email is already taken by another user or customer.'
        ], 422);
    }

    $customer->update($data);

    return response()->json([
        'message' => 'Customer updated successfully.',
        'customer' => $customer
    ]);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
        $customer->tokens()->delete();
        $customer->delete();
        return response()->json(['message' => 'Account deleted successfully']);


    }
}
