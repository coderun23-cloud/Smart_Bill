<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return Notification::all();
    }

    /**
     * Store a newly created notification.
     */
   public function store(Request $request)
{
    $user = Auth::user();

    // Only superadmin can send notifications
    if ($user && $user->role !== 'superadmin') {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $data = $request->validate([
        'message' => 'required|string',
        'notification_type' => 'required|string',
        'sent_to_id' => 'required|exists:users,id'
    ]);

    $data['sent_at'] = now();
    $data['is_read'] = false;

    $notification = Notification::create($data);

    return response()->json([
        'message' => 'Notification sent successfully.',
        'notification' => $notification
    ], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return $notification;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Notification $notification)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $fields = $request->validate([
            'message' => 'sometimes|string',
            'notification_type' => 'sometimes|string',
            'sent_at' => 'sometimes|date',
            'is_read' => 'sometimes|boolean',
        ]);

        $notification->update($fields);

        return response()->json([
            'message' => 'Notification updated successfully.',
            'notification' => $notification
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'superadmin') {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully.']);
    }
}
