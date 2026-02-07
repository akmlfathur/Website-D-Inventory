<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $query = Location::withCount('items');

        // Only get root locations (no parent)
        if ($request->tree) {
            $query->whereNull('parent_id')->with([
                'children' => function ($q) {
                    $q->withCount('items')->with([
                        'children' => function ($q2) {
                            $q2->withCount('items');
                        }
                    ]);
                }
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'in:building,warehouse,room,rack,shelf',
            'parent_id' => 'nullable|exists:locations,id',
            'description' => 'nullable|string',
        ]);

        $location = Location::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil ditambahkan',
            'data' => $location,
        ], 201);
    }

    public function show(Location $location)
    {
        $location->load([
            'parent',
            'children' => function ($q) {
                $q->withCount('items');
            }
        ]);
        $location->loadCount('items');

        return response()->json([
            'success' => true,
            'data' => $location,
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'type' => 'in:building,warehouse,room,rack,shelf',
            'parent_id' => 'nullable|exists:locations,id',
            'description' => 'nullable|string',
        ]);

        $location->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil diupdate',
            'data' => $location,
        ]);
    }

    public function destroy(Location $location)
    {
        $location->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil dihapus',
        ]);
    }
}
