<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Word Scrumbler</title>

  <link href="{{ asset('style/main.css') }}" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  
</head>
<body>
  <div class="container">
    
    <div class="heading">
      <h1 class="title time_box">0</h1>
      <div class="scores-container">
        <div class="score-container score">0</div>
        <div class="best-container max-score">0</div>
      </div>
    </div>

    <div class="above-game">
      <p class="game-intro"><a class="restart-button" href="{{url('/')}}">Back To Menu</a></p>
      <a class="restart-button refresh">Refresh Words</a>
    </div>
 
      <div class="game-message">
        <p></p>
        <div class="lower"> 
        </div>
      </div>

      <div class="sortable"></div>
 
        <div class="below-game" style="position: static; margin-top: 250px "> 
          <p class="game-intro save"><a class="restart-button">SUBMIT</a></p> 
        </div>

    </div> 

{{-- success  --}}
<div id="correct" title="Correct">
  <p>Your answer is Correct</p>
</div>

<div id="wrong" title="Wrong">
  <p>Your answer is wrong !!!</p>
</div>

     
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script type="text/javascript">
    $(function() {
  // this initializes the dialog (and uses some common options that I do)
  $("#correct").dialog({
    autoOpen : false, modal : true, show : "clip", hide : "blind"
  });
  $("#wrong").dialog({
    autoOpen : false, modal : true, show : "clip", hide : "blind"
  });
 
});
</script>
 <script>
  $(document).ready(function () {

    $('.sortable').sortable({});

    var wordExist = [];
    var score = 0;
    var max_score = 0;
    var level = '{{app('request')->input('level')}}';
    var scrambler = function(){

         function getWord() {
               $('.sortable').html('');
                var data = {'q' : wordExist, 'level' : '{{app('request')->input('level')}}'};
                $.ajax({
                        url: '{{route('get.word')}}',  
                        data: data,
                        type: 'get',
                        success: function(data)
                        {   
                             $.each(data.random, function( index, value ) { 
                               var temp = '<div class="grid-cell" style="cursor: pointer;"><div class="tile"><input type="hidden" name="words[]" value="'+value+'" ><div class="tile-inner">'+value+'</div></div></div>';
                               $('.sortable').append(temp);  
                            });

                            setPast(data.temp);
                            timer.startInterval();
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            scrambler.getWord(); 
                          }
                    });
            } 

       
        function setPast(word){
            wordExist.push(word); 
        }

        function getScore(correct){
            if(correct){

                switch(level) {
                    case 'medium':
                        score += 15;
                        break;
                    case 'hard':
                        score += 20;
                        break;
                    default:
                        score += 10;
                }

                
            } else{
                if(score <= 5){
                    alert('Your answer is wrong, Back to start');
                    window.location.assign("{{url('/')}}"); 
                }
                score = score - 5;
            }
            
            $('.score').html(score);
        }

        function getBestScore(){
            var data = {'_token': "{{ csrf_token() }}"};
            $.ajax({
                url: '{{route('max.score')}}',  
                type: 'get',
                success: function(data)
                {     
                    $('.max-score').html(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    scrambler.getBestScore(); 
                  }
            }); 
        }

        function saveScore(){
            if(score > 0){
                $.ajax({
                    url: '{{route('save.score')}}',  
                    data: {'_token': "{{ csrf_token() }}",'score': score},
                    type: 'post',
                    dataType: "json",
                    beforeSend: function () {
                        $(".loader").show();
                    },
                    complete: function () {
                        $(".loader").hide();
                    },
                    success: function (data) {
                        
                    }
                });
            }
        }

        return {
              getWord: getWord,
              getScore: getScore,
              saveScore: saveScore,
              getBestScore: getBestScore
            }
    }();

    scrambler.getWord();
    scrambler.getBestScore();

    $('.refresh').click(function() { 
        scrambler.getWord();
    });
    
    $('.save').click(function() { 

        var array = [];
        $('input[name^="words"]').each(function() {
            array.push($(this).val());
        });
        
        var result = array.join('') ;

        var data = {'_token': "{{ csrf_token() }}",'word': result};
 
         $.ajax({
                url: '{{route('check')}}',  
                data: data,
                type: 'post',
                dataType: "json",
                beforeSend: function () {
                    $(".loader").show();
                },
                complete: function () {
                    $(".loader").hide();
                },
                success: function (data) {
                    if(data){ 
                        scrambler.getScore(true);
                        scrambler.getWord(); 
                        $("#correct").dialog("open");
                    } else{  
                        $("#wrong").dialog("open");
                        scrambler.getScore(false); 
                    }
                     
                }
            });
    }); 
 
    
    var timer = function(){

           var counter = 60;
           var timer = null;

           function countdown(){
               if (counter == 10) {
                   $(".time_box").html(counter);
               }
               if (counter <= 0) {
                   stopInterval();

                   if(score > 0){
                      alert("Your time is over, your score is "+score);
                   } else{
                      alert("Your time is over, back to menu");
                   }
                    
                   scrambler.saveScore();
                   window.location.assign("{{url('/')}}"); 
               }
               else {
                   counter--;
                   $(".time_box").html(counter);
               }
            }
            function reset() {
               clearInterval(timer);
               counter=0;
            }
            function startInterval() {
               $(".time_box").html(counter);
               timer= setInterval(countdown, 1000);
            }
            function stopInterval() {
               clearInterval(timer);
            }

            return {
              startInterval: startInterval
            }

        }(); 

});

  </script>

</body>
</html>
