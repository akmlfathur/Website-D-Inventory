<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use App\Models\Item;
use App\Models\Transaction;
use Illuminate\Http\Request;

class StockOpnameController extends Controller
{
    public function index(Request $request)
    {
        $query = StockOpname::with(['location', 'creator']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $opnames = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 10);

        return response()->json([
            'success' => true,
            'data' => $opnames,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'opname_date' => 'required|date',
            'location_id' => 'nullable|exists:locations,id',
            'notes' => 'nullable|string',
        ]);

        $opname = StockOpname::create([
            'opname_date' => $request->opname_date,
            'location_id' => $request->location_id,
            'notes' => $request->notes,
            'status' => 'draft',
            'created_by' => $request->user()->id,
        ]);

        // Auto-populate items based on location
        $itemQuery = Item::query();
        if ($request->location_id) {
            $itemQuery->where('location_id', $request->location_id);
        }

        $items = $itemQuery->get();
        foreach ($items as $item) {
            StockOpnameItem::create([
                'stock_opname_id' => $opname->id,
                'item_id' => $item->id,
                'system_stock' => $item->stock,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Stock opname berhasil dibuat',
            'data' => $opname->load(['items.item', 'location', 'creator']),
        ], 201);
    }

    public function show(StockOpname $stockOpname)
    {
        $stockOpname->load(['items.item', 'location', 'creator', 'completer']);

        return response()->json([
            'success' => true,
            'data' => $stockOpname,
        ]);
    }

    public function updateItem(Request $request, StockOpname $stockOpname, StockOpnameItem $item)
    {
        if ($stockOpname->status === 'completed' || $stockOpname->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Stock opname sudah selesai atau dibatalkan',
            ], 400);
        }

        $request->validate([
            'actual_stock' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $item->update([
            'actual_stock' => $request->actual_stock,
            'notes' => $request->notes,
        ]);

        // Update status to in_progress if draft
        if ($stockOpname->status === 'draft') {
            $stockOpname->update(['status' => 'in_progress']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil diupdate',
            'data' => $item->load('item'),
        ]);
    }

    public function complete(Request $request, StockOpname $stockOpname)
    {
        if ($stockOpname->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Stock opname sudah selesai',
            ], 400);
        }

        // Check if all items have actual_stock filled
        $incompleteItems = $stockOpname->items()->whereNull('actual_stock')->count();
        if ($incompleteItems > 0) {
            return response()->json([
                'success' => false,
                'message' => "Masih ada {$incompleteItems} item yang belum diisi stok aktual",
            ], 400);
        }

        // Apply stock adjustments
        foreach ($stockOpname->items as $opnameItem) {
            if ($opnameItem->difference !== 0) {
                $item = Item::find($opnameItem->item_id);
                $item->stock = $opnameItem->actual_stock;
                $item->save();

                // Create adjustment transaction
                Transaction::create([
                    'type' => 'adjustment',
                    'item_id' => $opnameItem->item_id,
                    'quantity' => abs($opnameItem->difference),
                    'staff_id' => $request->user()->id,
                    'notes' => "Stock opname adjustment ({$stockOpname->code}): " .
                        ($opnameItem->difference > 0 ? '+' : '') . $opnameItem->difference,
                ]);
            }
        }

        $stockOpname->update([
            'status' => 'completed',
            'completed_by' => $request->user()->id,
            'completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Stock opname berhasil diselesaikan',
            'data' => $stockOpname->load(['items.item', 'location', 'creator', 'completer']),
        ]);
    }

    public function cancel(Request $request, StockOpname $stockOpname)
    {
        if ($stockOpname->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Stock opname yang sudah selesai tidak bisa dibatalkan',
            ], 400);
        }

        $stockOpname->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Stock opname berhasil dibatalkan',
        ]);
    }
}
