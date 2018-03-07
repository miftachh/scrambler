<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Words;
use App\Models\Score;
use App\Models\Levels;
class MainController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {    
        return view('main');
    }

    public function getLevel($level)
    {
        return Levels::where('desc', $level)->first();
    }

    public function getHighScore()
    {
        return Score::max('score');
    }

    public function getWord(Request $request)
    {
        $level = $this->getLevel($request->get('level'));

        $q = Words::where('level',$level['level'])->inRandomOrder()->take(1); 

        if(count($request->get('q')) > 0){ 
            $q = $q->whereNotIn('words',$request->get('q'));
        }

        $data = $q->get();

        $rand = str_shuffle($data[0]->words);
        $array = str_split($rand); 

        return ['random' => $array , 'temp' => $data[0]->words];
    }

    public function check(Request $request)
    {     
        $data = Words::where('words',$request->get('word'))->first();  
        
        return (int) count($data);
    }

    public function saveScore(Request $request)
    {     
        $data = Score::insert(['score' => $request->get('score'), 'created_at' => \Carbon\Carbon::now()]);
        return 'true';
    }
}
