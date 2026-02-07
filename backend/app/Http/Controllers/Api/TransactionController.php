<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['item', 'user', 'staff']);

        // Filter by type
        if ($request->type) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        $perPage = $request->per_page ?? 10;
        $transactions = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:inbound,outbound,adjustment',
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'user_id' => 'nullable|exists:users,id',
            'supplier' => 'nullable|string',
            'invoice_no' => 'nullable|string',
            'purpose' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['staff_id'] = $request->user()->id;

        $transaction = Transaction::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dicatat',
            'data' => $transaction->load(['item', 'user', 'staff']),
        ], 201);
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['item', 'user', 'staff', 'location']);

        return response()->json([
            'success' => true,
            'data' => $transaction,
        ]);
    }

    public function stats(Request $request)
    {
        $startDate = $request->start_date ?? now()->startOfMonth();
        $endDate = $request->end_date ?? now()->endOfMonth();

        $stats = [
            'total_inbound' => Transaction::where('type', 'inbound')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'total_outbound' => Transaction::where('type', 'outbound')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'today_inbound' => Transaction::where('type', 'inbound')
                ->whereDate('created_at', today())
                ->count(),
            'today_outbound' => Transaction::where('type', 'outbound')
                ->whereDate('created_at', today())
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
