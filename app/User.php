<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract; 
use Jenssegers\Mongodb\Eloquent\Model;

class User extends Model implements 
    AuthenticatableContract
{
    use Notifiable, Authenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['display_name', 'username', 'email', 'password', 'searchable', 'active', 'is_author', 'gender', 'role', 'image', 'image_priority',
        ///   use in embeduser in comment model
        'type_comment', 'user_id',
        // use in embeduser in comic model
        // create comic v.2 : embedAuthors use User not Author Collection
        'description', 'author_id'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
}
