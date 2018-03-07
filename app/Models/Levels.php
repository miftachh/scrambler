<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; 

class Levels extends Model 
{ 
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'level';

    protected $fillable = [
         'id', 'level', 'desc'
    ]; 
} 