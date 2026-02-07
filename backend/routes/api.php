<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StockOpnameController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Protected Routes (require authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/chart', [DashboardController::class, 'chartData']);
    Route::get('/dashboard/recent-transactions', [DashboardController::class, 'recentTransactions']);
    Route::get('/dashboard/notifications', [DashboardController::class, 'notifications']);
    Route::get('/dashboard/category-distribution', [DashboardController::class, 'categoryDistribution']);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Locations
    Route::apiResource('locations', LocationController::class);

    // Items
    Route::get('/items/stats', [ItemController::class, 'stats']);
    Route::apiResource('items', ItemController::class);

    // Transactions
    Route::get('/transactions/stats', [TransactionController::class, 'stats']);
    Route::apiResource('transactions', TransactionController::class)->except(['update', 'destroy']);

    // Requests (item requests)
    Route::get('/requests/stats', [RequestController::class, 'stats']);
    Route::post('/requests/{request}/approve', [RequestController::class, 'approve']);
    Route::post('/requests/{request}/reject', [RequestController::class, 'reject']);
    Route::apiResource('requests', RequestController::class)->except(['update', 'destroy']);

    // Stock Opname
    Route::post('/stock-opname/{stockOpname}/items/{item}', [StockOpnameController::class, 'updateItem']);
    Route::post('/stock-opname/{stockOpname}/complete', [StockOpnameController::class, 'complete']);
    Route::post('/stock-opname/{stockOpname}/cancel', [StockOpnameController::class, 'cancel']);
    Route::apiResource('stock-opname', StockOpnameController::class)->except(['update', 'destroy']);

    // Reports
    Route::get('/reports/inventory-summary', [ReportController::class, 'inventorySummary']);
    Route::get('/reports/transactions', [ReportController::class, 'transactionReport']);
    Route::get('/reports/low-stock', [ReportController::class, 'lowStockReport']);
    Route::get('/reports/assets', [ReportController::class, 'assetReport']);

    // Users (admin only)
    Route::apiResource('users', UserController::class);
});
