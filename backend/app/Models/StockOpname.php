<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOpname extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'opname_date',
        'location_id',
        'status',
        'created_by',
        'completed_by',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'opname_date' => 'date',
        'completed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($opname) {
            if (!$opname->code) {
                $year = now()->year;
                $month = now()->format('m');
                $count = self::whereYear('created_at', $year)->whereMonth('created_at', now()->month)->count();
                $opname->code = 'SO-' . $year . $month . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function completer()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function items()
    {
        return $this->hasMany(StockOpnameItem::class);
    }
}
