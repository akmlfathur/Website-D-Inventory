<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['category', 'location']);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('sku', 'like', "%{$request->search}%");
            });
        }

        // Filter by category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by location
        if ($request->location_id) {
            $query->where('location_id', $request->location_id);
        }

        // Filter by type
        if ($request->type) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->status) {
            if ($request->status === 'low') {
                $query->whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0);
            } elseif ($request->status === 'out_of_stock') {
                $query->where('stock', '<=', 0);
            } elseif ($request->status === 'available') {
                $query->whereColumn('stock', '>', 'min_stock');
            }
        }

        // Pagination
        $perPage = $request->per_page ?? 10;
        $items = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:200',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'type' => 'in:asset,consumable',
            'stock' => 'integer|min:0',
            'min_stock' => 'integer|min:0',
            'price' => 'numeric|min:0',
        ]);

        $item = Item::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil ditambahkan',
            'data' => $item->load(['category', 'location']),
        ], 201);
    }

    public function show(Item $item)
    {
        $item->load([
            'category',
            'location',
            'transactions' => function ($q) {
                $q->with(['user', 'staff'])->latest()->limit(10);
            }
        ]);

        return response()->json([
            'success' => true,
            'data' => $item,
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $request->validate([
            'name' => 'required|string|max:200',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'type' => 'in:asset,consumable',
            'stock' => 'integer|min:0',
            'min_stock' => 'integer|min:0',
            'price' => 'numeric|min:0',
        ]);

        $item->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil diupdate',
            'data' => $item->load(['category', 'location']),
        ]);
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil dihapus',
        ]);
    }

    public function stats()
    {
        $stats = [
            'total_items' => Item::count(),
            'total_assets' => Item::where('type', 'asset')->count(),
            'low_stock' => Item::whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0)->count(),
            'out_of_stock' => Item::where('stock', '<=', 0)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
