<!DOCTYPE html>
<html lang="en">
    <head>
        <title>AweSplash - Free HTML Splash Page</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,600&amp;subset=latin-ext" rel="stylesheet">

        <!-- CSS -->
        <link href="{{ asset('assets/css/main.css') }}" rel="stylesheet"> 
        <!-- JS -->
        <script src="{{ asset('assets/js/vendor/modernizr-2.8.3.min.js') }}"></script>
        <script src="{{ asset('assets/js/vendor/jquery-1.12.0.min.js') }}"></script>
    </head>
    <body>
        <div class="site" id="page" > 
            <section class="hero-section hero-section--image clearfix clip">
                <div class="hero-section__wrap">
                    <div class="hero-section__option"> 
                    </div>
                    <!-- .hero-section__option -->

                    <div class="container">
                        <div class="row">
                            <div class="offset-lg-2 col-lg-8">
                                <div class="title-01 title-01--11 text-center">
                                    <h2 class="title__heading">
                                        <span>Scrambler</span>
                                        <strong class="hero-section__words">
                                            <span class="title__effect is-visible">Animals</span> 
                                        </strong>
                                    </h2>
                                    <div class="title__description">Word scrambler is a word guessing game, Get Play!</div>

                                    <!-- Options btn color: .btn-success | .btn-info | .btn-warning | .btn-danger | .btn-primary -->
                                    <div class="title__action"><a href="{{route('main').'?level=easy'}}" class="btn btn-success">Easy</a></div><br>
                                     <div class="title__action"><a href="{{route('main').'?level=medium'}}" class="btn btn-primary">Medium</a></div><br>
                                      <div class="title__action"><a href="{{route('main').'?level=hard'}}" class="btn btn-danger">Hard</a></div><br>
                                </div> <!-- .title-01 -->
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div> 
         <div class="button-group">
          <p style="color: white;">Miftach - 2018</p> 
        </div>
        <!-- JS -->
        <script src="{{ asset('assets/js/plugins/animate-headline.js') }}"></script>
        <script src="{{ asset('assets/js/main.js') }}"></script>
    </body>
</html>
