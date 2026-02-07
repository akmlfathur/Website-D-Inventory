<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'parent_id',
        'description',
        'code',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($location) {
            if (!$location->code) {
                $prefix = strtoupper(substr($location->type, 0, 3));
                $count = self::where('type', $location->type)->count();
                $location->code = $prefix . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Location::class, 'parent_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function getItemCountAttribute()
    {
        return $this->items()->count();
    }
}
