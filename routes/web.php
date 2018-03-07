<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('started');
});

Auth::routes();

Route::get('/maxscore', ['uses' => 'MainController@getHighScore', 'as' => 'max.score']);
Route::get('/main', ['uses' => 'MainController@index', 'as' => 'main']);  
Route::get('/word', ['uses' => 'MainController@getWord', 'as' => 'get.word']); 
Route::post('/check', ['uses' => 'MainController@check', 'as' => 'check']); 
Route::post('/score', ['uses' => 'MainController@saveScore', 'as' => 'save.score']); 

Route::get('/home', 'HomeController@index')->name('home'); 

Route::group(['prefix' => 'user', 'middleware' => ['auth']], function ($app) {
   Route::get('/', 'UserController@index'); 
}); 