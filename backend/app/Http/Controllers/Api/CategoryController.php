<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('items')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:categories',
            'description' => 'nullable|string|max:200',
            'icon' => 'nullable|string|max:10',
            'color' => 'nullable|string|max:10',
        ]);

        $category = Category::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $category,
        ], 201);
    }

    public function show(Category $category)
    {
        $category->loadCount('items');

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:200',
            'icon' => 'nullable|string|max:10',
            'color' => 'nullable|string|max:10',
        ]);

        $category->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diupdate',
            'data' => $category,
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
