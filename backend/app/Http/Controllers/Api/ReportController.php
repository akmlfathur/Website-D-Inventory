<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function inventorySummary(Request $request)
    {
        $items = Item::with(['category', 'location'])
            ->select([
                'items.*',
                DB::raw('(stock * price) as total_value')
            ])
            ->get();

        $summary = [
            'total_items' => $items->count(),
            'total_stock' => $items->sum('stock'),
            'total_value' => $items->sum(fn($i) => $i->stock * $i->price),
            'low_stock_count' => $items->filter(fn($i) => $i->status === 'low')->count(),
            'out_of_stock_count' => $items->filter(fn($i) => $i->status === 'out_of_stock')->count(),
        ];

        $byCategory = Category::withCount('items')
            ->with([
                'items' => function ($q) {
                    $q->select('id', 'category_id', 'stock', 'price');
                }
            ])
            ->get()
            ->map(function ($cat) {
                return [
                    'category' => $cat->name,
                    'total_items' => $cat->items_count,
                    'total_stock' => $cat->items->sum('stock'),
                    'total_value' => $cat->items->sum(fn($i) => $i->stock * $i->price),
                ];
            });

        $byLocation = Location::withCount('items')
            ->with([
                'items' => function ($q) {
                    $q->select('id', 'location_id', 'stock', 'price');
                }
            ])
            ->get()
            ->map(function ($loc) {
                return [
                    'location' => $loc->name,
                    'total_items' => $loc->items_count,
                    'total_stock' => $loc->items->sum('stock'),
                    'total_value' => $loc->items->sum(fn($i) => $i->stock * $i->price),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'by_category' => $byCategory,
                'by_location' => $byLocation,
                'items' => $items,
            ],
        ]);
    }

    public function transactionReport(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'nullable|in:inbound,outbound,adjustment',
        ]);

        $query = Transaction::with(['item', 'user', 'staff'])
            ->whereBetween('created_at', [$request->start_date, $request->end_date . ' 23:59:59']);

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        $summary = [
            'total_transactions' => $transactions->count(),
            'total_inbound' => $transactions->where('type', 'inbound')->count(),
            'total_outbound' => $transactions->where('type', 'outbound')->count(),
            'total_adjustment' => $transactions->where('type', 'adjustment')->count(),
            'inbound_quantity' => $transactions->where('type', 'inbound')->sum('quantity'),
            'outbound_quantity' => $transactions->where('type', 'outbound')->sum('quantity'),
        ];

        // Daily breakdown
        $dailyData = $transactions->groupBy(function ($tx) {
            return $tx->created_at->format('Y-m-d');
        })->map(function ($dayTxs, $date) {
            return [
                'date' => $date,
                'inbound' => $dayTxs->where('type', 'inbound')->sum('quantity'),
                'outbound' => $dayTxs->where('type', 'outbound')->sum('quantity'),
                'total' => $dayTxs->count(),
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'daily' => $dailyData,
                'transactions' => $transactions,
            ],
        ]);
    }

    public function lowStockReport()
    {
        $items = Item::with(['category', 'location'])
            ->whereColumn('stock', '<=', 'min_stock')
            ->orderBy('stock')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'sku' => $item->sku,
                    'category' => $item->category->name ?? '-',
                    'location' => $item->location->name ?? '-',
                    'current_stock' => $item->stock,
                    'min_stock' => $item->min_stock,
                    'shortage' => $item->min_stock - $item->stock,
                    'unit' => $item->unit,
                    'status' => $item->status,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_items' => $items->count(),
                'items' => $items,
            ],
        ]);
    }

    public function assetReport()
    {
        $assets = Item::with(['category', 'location'])
            ->where('type', 'asset')
            ->orderBy('category_id')
            ->get();

        $summary = [
            'total_assets' => $assets->count(),
            'total_value' => $assets->sum(fn($i) => $i->stock * $i->price),
        ];

        $byCategory = $assets->groupBy('category.name')->map(function ($items, $category) {
            return [
                'category' => $category,
                'count' => $items->count(),
                'total_stock' => $items->sum('stock'),
                'total_value' => $items->sum(fn($i) => $i->stock * $i->price),
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'by_category' => $byCategory,
                'assets' => $assets,
            ],
        ]);
    }
}
