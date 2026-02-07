<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Filter by role
        if ($request->role) {
            $query->where('role', $request->role);
        }

        $perPage = $request->per_page ?? 10;
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'in:super_admin,staff,employee',
            'department' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan',
            'data' => $user,
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'in:super_admin,staff,employee',
            'department' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $data = $request->except('password');
        if ($request->password) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diupdate',
            'data' => $user,
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak bisa menghapus akun sendiri',
            ], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus',
        ]);
    }
}
