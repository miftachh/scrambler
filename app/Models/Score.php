<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; 

class Score extends Model 
{ 
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'score';

    protected $fillable = [
         'id', 'score' , 'created_at'
    ]; 
 
} 