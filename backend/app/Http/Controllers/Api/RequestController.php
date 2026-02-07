<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as ItemRequest;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ItemRequest::with(['user', 'item', 'approver']);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $perPage = $request->per_page ?? 10;
        $requests = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:500',
        ]);

        $itemRequest = ItemRequest::create([
            'user_id' => $request->user()->id,
            'item_id' => $request->item_id,
            'quantity' => $request->quantity,
            'reason' => $request->reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request berhasil diajukan',
            'data' => $itemRequest->load(['user', 'item']),
        ], 201);
    }

    public function show(ItemRequest $request)
    {
        $request->load(['user', 'item', 'approver', 'rejecter']);

        return response()->json([
            'success' => true,
            'data' => $request,
        ]);
    }

    public function approve(Request $httpRequest, ItemRequest $request)
    {
        if ($request->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Request sudah diproses sebelumnya',
            ], 400);
        }

        $request->update([
            'status' => 'approved',
            'approved_by' => $httpRequest->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request berhasil disetujui',
            'data' => $request->load(['user', 'item', 'approver']),
        ]);
    }

    public function reject(Request $httpRequest, ItemRequest $request)
    {
        $httpRequest->validate([
            'reject_reason' => 'required|string|max:500',
        ]);

        if ($request->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Request sudah diproses sebelumnya',
            ], 400);
        }

        $request->update([
            'status' => 'rejected',
            'rejected_by' => $httpRequest->user()->id,
            'rejected_at' => now(),
            'reject_reason' => $httpRequest->reject_reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request berhasil ditolak',
            'data' => $request->load(['user', 'item', 'rejecter']),
        ]);
    }

    public function stats()
    {
        $stats = [
            'pending' => ItemRequest::where('status', 'pending')->count(),
            'approved' => ItemRequest::where('status', 'approved')->count(),
            'rejected' => ItemRequest::where('status', 'rejected')->count(),
            'completed' => ItemRequest::where('status', 'completed')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
