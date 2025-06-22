<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Payment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Payment::all();
    }

  
  
public function store(Request $request)
{
    $request->validate([
        'first_name' => 'required|string',
        'last_name' => 'required|string',
        'email' => 'required|email',
        'phone' => 'required|string',
        'amount' => 'required|numeric|min:1',
        // include bill_id validation if you want
    ]);

    $tx_ref = 'TX_' . uniqid();

    Payment::create([
        'first_name' => $request->first_name,
        'last_name' => $request->last_name,
        'email' => $request->email,
        'phone' => $request->phone,
        'amount' => $request->amount,
        'tx_ref' => $tx_ref,
        'status' => 'pending',
        'bill_id' => $request->bill_id,  
    ]);
    Bill::where('id', $request->bill_id)->update(['status' => 'paid']);

    $response = Http::withToken(env('CHAPA_SECRET_KEY'))
        ->post('https://api.chapa.co/v1/transaction/initialize', [
            'amount' => $request->amount,
            'email' => $request->email,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'tx_ref' => $tx_ref,
            'callback_url' => route('payment.callback'),
            'return_url' =>env('FRONTEND_URL') . '/payment-success',
            'currency' => 'ETB',
        ]);

    $body = $response->json();

    \Log::info('Chapa init response:', $body);

    if (!isset($body['status']) || $body['status'] !== 'success') {
        return response()->json([
            'message' => 'Failed to initialize Chapa payment: ' . ($body['message'] ?? 'Unknown error')
        ], 500);
    }

    // Return JSON response with checkout URL to frontend
    return response()->json([
        'checkout_url' => $body['data']['checkout_url'],
    ]);
}



public function callback(Request $request)
{
    $tx_ref = $request->tx_ref;

    $response = Http::withToken(env('CHAPA_SECRET_KEY'))
        ->get("https://api.chapa.co/v1/transaction/verify/{$tx_ref}");

    $body = $response->json();
    $payment = Payment::where('tx_ref', $tx_ref)->first();

    if (!$payment) {
        return response()->json([
            'message' => 'Payment not found',
        ], 404);
    }

    if ($body['status'] === 'success') {
        $payment->status = 'success';
        $payment->save();

        // Return frontend URL to redirect user on success
        return response()->json([
            'message' => 'Payment successful',
            'return_url' => env('FRONTEND_URL') . '/payment-success',
        ]);
    }

    $payment->status = 'failed';
    $payment->save();

    // Return frontend URL to redirect user on failure
    return response()->json([
        'message' => 'Payment failed',
        'redirect_url' => env('FRONTEND_URL') . '/payment-failed', // <-- React route
    ]);
}


    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
     public function success()
    {
        
        return view('payment.success');
    }

    public function failed()
    {
        return view('payment.failed');
    }
}
