<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComplaintController extends Controller
{
    /**
     * Display a listing of the complaints.
     */
    public function index()
    {
        $complaints = Complaint::with('user')->latest()->get();
        return response()->json($complaints);
    }

    /**
     * Store a newly created complaint.
     */
  public function store(Request $request)
{
    $request->validate([
        'subject' => 'required|string|max:255',
        'description' => 'required|string',
    ]);

    $complaint = Complaint::create([
        'user_id' => Auth::id(), // Get user_id from the authenticated user
        'subject' => $request->subject,
        'description' => $request->description,
        'status' => 'pending',
    ]);

    return response()->json($complaint, 201);
}

    /**
     * Display a single complaint.
     */
    public function show(Complaint $complaint)
    {
        return response()->json($complaint->load('user'));
    }

    /**
     * Update the specified complaint.
     */
    public function update(Request $request, Complaint $complaint)
    {
        $validated = $request->validate([
            'status' => 'in:pending,resolved,rejected',
            'resolution_date' => 'nullable|date',
        ]);

        $complaint->update($validated);

        return response()->json([
            'message' => 'Complaint updated successfully.',
            'complaint' => $complaint
        ]);
    }

    /**
     * Remove the specified complaint.
     */
    public function destroy(Complaint $complaint)
    {
        $complaint->delete();

        return response()->json([
            'message' => 'Complaint deleted successfully.'
        ]);
    }
}
