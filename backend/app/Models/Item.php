<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'category_id',
        'location_id',
        'type',
        'stock',
        'min_stock',
        'unit',
        'price',
        'supplier',
        'description',
        'specifications',
        'images',
        'qr_code',
    ];

    protected $casts = [
        'specifications' => 'array',
        'images' => 'array',
        'price' => 'decimal:2',
    ];

    protected $appends = ['status'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            if (!$item->sku) {
                $category = Category::find($item->category_id);
                $prefix = $category ? strtoupper(substr($category->name, 0, 3)) : 'ITM';
                $count = self::count();
                $item->sku = $prefix . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function getStatusAttribute()
    {
        if ($this->stock <= 0)
            return 'out_of_stock';
        if ($this->stock <= $this->min_stock)
            return 'low';
        return 'available';
    }
}
