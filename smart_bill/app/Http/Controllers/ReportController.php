<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
       $reports = Report::with('sender')->get();
        return response()->json($reports);

    }
    public function report(){
        $user=Auth::user();
        return Report::where('sender_id',$user->id)->get();
    }
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user && $user->role === 'meterreader' || $user->role==='admin') {
            $fields = $request->validate([
                'report_type' => 'required|string|max:200',
                'content' => 'required|string',
            ]);

            $fields['sender_id'] = $user->id;
            $fields['sender_role'] = $user->role;

            $report = Report::create($fields);

            return response()->json([
                'message' => 'Report submitted successfully.',
                'report' => $report
            ], 201);
        }

        return response()->json([
            'message' => 'Unauthorized – Only admins and meter readers can submit reports.'
        ], 401);
    }
    public function show(Report $report)
    {
      return response()->json([
        'id'=>$report->id,
        'report_type'=>$report->report_type,
        'content'=>$report->content,
        'sender_name'=>$report->sender->name,
        'sender_role'=>$report->sender->role
        ]
    );
    }

   
    public function update(Request $request, Report $report)
    {
        //
         $user = Auth::user();
        if ($user && $user->role === 'meterreader' || $user->role==='admin') {
            $fields = $request->validate([
                'report_type' => 'required|string|max:200',
                'content' => 'required|string',
            ]);

            $fields['sender_id'] = $user->id;
            $fields['sender_role'] = $user->role;

            $report->update($fields);

            return response()->json([
                'message' => 'Report updated successfully.',
                'report' => $report
            ], 201);
        }

        return response()->json([
            'message' => 'Unauthorized – Only admins and meter readers can submit reports.'
        ], 401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        //
          $user = Auth::user();
        if ($user && $user->role === 'meterreader' || $user->role==='admin') {
            $report->delete();
             return[
            'message'=>'Report deleted successfully'
        ];
        }
          return response()->json([
        'message' => 'Unauthorized'
        ], 401);
    }
}
