<?php
namespace App\Http\Controllers;

use App\Models\Tariff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class TariffController extends Controller implements HasMiddleware
{
      public static function middleware(){
        return[
            new Middleware('auth:sanctum',except:['index','show'])
        ];
     }
    public function index()
    {
        return Tariff::all();
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Tariff::class);

        $fields = $request->validate([
            'tariff_name' => 'required|max:100|unique:tariffs',
            'unit_min' => 'required|numeric',
            'unit_max' => 'required|numeric',
            'price' => 'required|numeric',
            'effective_date' => 'required|date'
        ]);

        $tariff = Tariff::create($fields);

        return response()->json([
            'message' => 'Tariff created successfully',
            'tariff' => $tariff
        ]);
    }

    public function show(Tariff $tariff)
    {
        return response()->json(['tariff' => $tariff]);
    }

    public function update(Request $request, Tariff $tariff)
    {
        Gate::authorize('update', $tariff);

        $fields = $request->validate([
            'tariff_name' => 'required|max:100|unique:tariffs,tariff_name,' . $tariff->id,
            'unit_min' => 'required|numeric',
            'unit_max' => 'required|numeric',
            'price' => 'required|numeric',
            'effective_date' => 'required|date'
        ]);

        $tariff->update($fields);

        return response()->json([
            'tariff' => $tariff,
            'message' => 'Tariff updated successfully'
        ]);
    }

    public function destroy(Tariff $tariff)
    {
        Gate::authorize('delete', $tariff);

        $tariff->delete();

        return response()->json(['message' => 'Tariff deleted successfully']);
    }
}
