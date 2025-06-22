<?php

namespace App\Http\Controllers;

use App\Models\Reading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreReadingRequest;
use App\Http\Requests\UpdateReadingRequest;

class ReadingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index()
{
    // Eager load related user and customer
         $user = Auth::user();

     return Reading::with('user')->with('customer')->where('user_id',$user->id)->get();
}
public function detail($id) {
    return Reading::with(['user', 'customer'])
        ->where('customer_id', $id)
        ->orderBy('reading_date', 'desc')
        ->get(); // Changed from first() to get()
}

  public function store(Request $request)
{
    $user = Auth::user();

    if ($user && $user->role === 'meterreader') {
        // Validate input
        $fields = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'amount' => 'required|numeric',
            'reading_type' => 'required|string',
            'reading_date' => 'required|date',
        ]);

        $fields['user_id'] = $user->id;

        // Extract month and year from the input date
        $readingMonth = date('m', strtotime($fields['reading_date']));
        $readingYear = date('Y', strtotime($fields['reading_date']));

        // Check if a reading already exists for the customer in the same month/year
        $existing = Reading::where('customer_id', $fields['customer_id'])
            ->whereMonth('reading_date', $readingMonth)
            ->whereYear('reading_date', $readingYear)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'This customer already has a reading for this month.'
            ], 409); // 409 Conflict
        }

        // Create the reading
        $reading = Reading::create($fields);

        return response()->json([
            'message' => 'Reading submitted successfully.',
            'reading' => $reading
        ], 201);
    }

    return response()->json([
        'message' => '401 Unauthorized – Only meter readers can submit readings.'
    ], 401);
}

    /**
     * Display the specified resource.
     */
    public function show(Reading $reading)
{
   

    return response()->json([
        'id' => $reading->id,
        'amount' => $reading->amount,
        'reading_type' => $reading->reading_type,
        'reading_date' => $reading->reading_date,
        'meter reader' => [
            'id' => $reading->user->id,
            'name' => $reading->user->name,
        ],
        'customer' => [
            'id' => $reading->customer->id,
            'name' => $reading->customer->name,
        ]
    ]);
}


  
    public function update(Request $request, Reading $reading)
    {
        //
         $user = Auth::user();

        if ($user && $user->role === 'meterreader') {
        // Validate request
        $fields = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'amount' => 'required|numeric',
            'reading_type' => 'required|string',
            'reading_date' => 'required|date',
        ]);

        // Add the authenticated user's ID
        $fields['user_id'] = $user->id;

        // Create the reading
        $reading->update($fields);

        return response()->json([
            'message' => 'Reading updated successfully.',
            'reading' => $reading
        ], 201);
    }

    // Unauthorized response
    return response()->json([
        'message' => '401 Unauthorized – Only meter readers can submit readings.'
    ], 401);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reading $reading)
    {
        //
         $user = Auth::user();
            if ($user && $user->role === 'meterreader') {
        $reading->delete();
        return[
            'message'=>'Reading deleted successfully'
        ];
    }
     return response()->json([
        'message' => 'Unauthorized'
        ], 401);
    }
}
