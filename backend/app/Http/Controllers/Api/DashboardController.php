<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Transaction;
use App\Models\Request as ItemRequest;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            // Inventory stats
            'total_items' => Item::count(),
            'total_assets' => Item::where('type', 'asset')->count(),
            'low_stock' => Item::whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0)->count(),
            'out_of_stock' => Item::where('stock', '<=', 0)->count(),

            // Transaction stats (this month)
            'inbound_today' => Transaction::where('type', 'inbound')->whereDate('created_at', today())->count(),
            'outbound_today' => Transaction::where('type', 'outbound')->whereDate('created_at', today())->count(),
            'inbound_month' => Transaction::where('type', 'inbound')->whereMonth('created_at', now()->month)->count(),
            'outbound_month' => Transaction::where('type', 'outbound')->whereMonth('created_at', now()->month)->count(),

            // Request stats
            'pending_requests' => ItemRequest::where('status', 'pending')->count(),

            // User stats
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    public function chartData(Request $request)
    {
        $days = $request->days ?? 30;
        $startDate = now()->subDays($days);

        $transactions = Transaction::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('type'),
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(quantity) as total_qty')
        )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date', 'type')
            ->orderBy('date')
            ->get();

        // Format data for chart
        $chartData = [];
        $dates = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dates[$date] = [
                'date' => now()->subDays($i)->format('d M'),
                'masuk' => 0,
                'keluar' => 0,
            ];
        }

        foreach ($transactions as $tx) {
            if (isset($dates[$tx->date])) {
                if ($tx->type === 'inbound') {
                    $dates[$tx->date]['masuk'] = $tx->total_qty;
                } else {
                    $dates[$tx->date]['keluar'] = $tx->total_qty;
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => array_values($dates),
        ]);
    }

    public function recentTransactions()
    {
        $transactions = Transaction::with(['item', 'user', 'staff'])
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }

    public function notifications()
    {
        $notifications = [];

        // Low stock alerts
        $lowStockItems = Item::whereColumn('stock', '<=', 'min_stock')
            ->where('stock', '>', 0)
            ->limit(5)
            ->get();

        foreach ($lowStockItems as $item) {
            $notifications[] = [
                'id' => 'low_stock_' . $item->id,
                'type' => 'warning',
                'message' => "Stok {$item->name} menipis ({$item->stock} {$item->unit} tersisa)",
                'time' => $item->updated_at->diffForHumans(),
            ];
        }

        // Pending requests
        $pendingRequests = ItemRequest::with('user')
            ->where('status', 'pending')
            ->latest()
            ->limit(3)
            ->get();

        foreach ($pendingRequests as $req) {
            $notifications[] = [
                'id' => 'request_' . $req->id,
                'type' => 'info',
                'message' => "Request baru dari {$req->user->name}",
                'time' => $req->created_at->diffForHumans(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function categoryDistribution()
    {
        $categories = Category::withCount('items')
            ->having('items_count', '>', 0)
            ->get()
            ->map(function ($cat) {
                return [
                    'name' => $cat->name,
                    'value' => $cat->items_count,
                    'color' => $cat->color,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }
}
