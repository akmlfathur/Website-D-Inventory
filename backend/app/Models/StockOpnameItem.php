<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOpnameItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'stock_opname_id',
        'item_id',
        'system_stock',
        'actual_stock',
        'difference',
        'notes',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            if ($item->actual_stock !== null) {
                $item->difference = $item->actual_stock - $item->system_stock;
            }
        });
    }

    public function stockOpname()
    {
        return $this->belongsTo(StockOpname::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
