<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; 

class Words extends Model 
{ 
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $table = 'words';

    protected $fillable = [
         'id', 'words'
    ]; 
} 