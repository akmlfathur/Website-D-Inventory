<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'item_id',
        'quantity',
        'user_id',
        'staff_id',
        'supplier',
        'invoice_no',
        'purpose',
        'notes',
        'location_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($transaction) {
            $item = Item::find($transaction->item_id);

            if ($item) {
                if ($transaction->type === 'inbound') {
                    $item->stock += $transaction->quantity;
                } elseif ($transaction->type === 'outbound') {
                    $item->stock -= $transaction->quantity;
                }
                $item->save();
            }
        });
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
