<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Tariff;
use App\Models\Reading;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBillRequest;
use App\Http\Requests\UpdateBillRequest;

class BillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user=Auth::id();
        return Bill::where('user_id',$user->id)->get();
    }

  
 public function store(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:customers,id',
        'generated_by' => 'required|exists:users,id',
        'reading_id' => 'required|exists:readings,id',
        'tariff_id' => 'required|exists:tariffs,id',
        'bill_amount' => 'required|numeric|min:0',
        'status' => 'required|in:paid,unpaid',
        'due_date' => 'required|date',
    ]);

    $alreadyExists = Bill::where('user_id', $validated['user_id'])
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->exists();

    if ($alreadyExists) {
        return response()->json(['error' => 'Bill already created this month.'], 400);
    }

    $bill = Bill::create($validated);

    return response()->json([
        'message' => 'Bill added successfully.',
        'bill' => $bill,
    ], 201);
}


    public function reading($id)
    {
        $reading = Reading::with('customer','user')->where('customer_id', $id)->orderByDesc('created_at')->get();

        if ($reading->isEmpty()) {
            return response()->json(['error' => 'No reading found'], 404);
        }

        $customer = $reading->first()->customer;
        $tariff = Tariff::where('tariff_name', $customer->customer_type)->first();

        return response()->json([
            'readings' => $reading,
            'customer' => $customer,
            'tariff' => $tariff,
        ]);
    }
    
    public function getBillsByCustomer($customerId)
    {
        $bills = Bill::with('reading') // Add this line to load the reading relation
            ->where('user_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bills);
    }

    
   /**
     * Display the specified resource.
     */
    public function show(Bill $bill)
    {
        //
    }

  
    public function update(Request $request, Bill $bill)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bill $bill)
    {
        //
    }
}
