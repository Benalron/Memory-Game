$(document).ready(function() {
  /* The background colors for the 16 cards*/

  /* Create the 4*4 grid of cards */
  $('#winningBox').hide();
  var createCards = function() {
    $('.main-section').empty();
    $('.main-section').append('<h1 class="text-center">Memory</h1>')
    var colors = ["#D1C9DE", "#D1C9DE", "#D4A45C", "#D4A45C", "#AC3338", "#AC3338", "#242624", "#242624", "#436645", "#436645", "#369EAB", "#369EAB", "#3e2e45", "#3e2e45", "#EF9177", "#EF9177"];
    /* Create the collumns */
    for (x = 1; x < 5; x++) {
      $('.main-section').append('<div class="card-row" id="card-row' + x + '"></div>')
        /* Create the rows*/
      for (y = 1; y < 5; y++) {
        /* Using the arrays length, select a random item from the array, colors*/
        var randomColorNumber = Math.floor(Math.random() * colors.length);
        /* Create the card. Assign the value of the random array item as the background color to the "back" of the card. ((x*4)+(y-4)) assigns each card an individual number used in the ID from 1-16*/
        $('#card-row' + x).append('<div class="card-box"><div class="card" id="card' + ((x * 4) + (y - 4)) + '"><figure class="front"></figure><figure class="back" style="background-color:' + colors[randomColorNumber] + ';"></figure></div></div>');
        /* Remove the item from the array that was assigned*/
        colors.splice(randomColorNumber, 1);
      }
    }
  };
  /* Call the function that creates the grid of cards */
  createCards();
  /* matchCounter keeps track of whether the card selection is the first or second choice. This is needed to determine if its the first choice, or comparing the selection to the first choice*/
  var matchCounter = 0;
  /* Variable for the ID of the first selection */
  var firstSelection = "";
  /* Variable for the ID of the second selection */
  var secondSelection = "";
  /* Variable for the color of the back of the card for the first selection*/
  var firstSelectionColor = "";
  /* Variable for the color of the back of the card for the second selection*/
  var secondSelectionColor = "";
  /* clickPreventer is used in the function to prevent clicking different pairs while the transform animation is in effect */
  var clickPreventer = false;
  /* Total turns*/
  var score = 0;
  /* Amount of successful matches */
  var totalMatches = 0;
  /* High score */
  var highScore = 0;
  $('#newGame').on('click', function(){
    $('#winningBox').fadeOut(1000);
    createCards();
    score = 0
  });
 /* Function for when all matches are made. After 2 seconds, randomly reflips cards over with a 100ms interval between each*/
  var youWin = function() {
    totalMatches = 0;
    window.setTimeout(function() {
      var cardID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      for (x = 0; x < 16; x++) {
        window.setTimeout(function() {
          var randomCard = Math.floor(Math.random() * cardID.length);
          $('#card' + cardID[randomCard]).removeClass('flipped');
          cardID.splice(randomCard, 1);
        }, (100 * x));
      };
    }, 2000);
    $('#winningBox').fadeIn(2000)
    $('#finalScore').html('You won in '+score+' turns.');
    if (highScore == 0 || score < highScore){
      highScore = score;
      $('#highScore').html(highScore+' is your new high score!');
    }
    else {
      $('#highScore').html('high score: '+highScore);
    }
  };

  $('div').on('click','div.card', function() {
    /* Need to re-write this so that the code is only executed if the opposite takes place. This ends the function if you are making the second selection and clicking on the same card you selected for firstSelection. This is preventing a "match" that would be created by having the same background color for firstSelection and secondSelection because its the same card. The second part, $(this).hasClass('flipped') prevents selecting cards that have already been matched*/
    if ($(this).attr("id") == firstSelection || $(this).hasClass('flipped')) {
      return
    }
    /* clickPreventer is assigned as true during the beginning of the second card selection, and assigned false at the end. This prevents you from rapidly flipping over multiple cards by ending the function if clickPreventer is true*/
    if (clickPreventer == true) {
      return
    } else {
      /* If matchCounter is 0, the card selection for the first selection*/
      if (matchCounter == 0) {
        $(this).addClass('flipped');
        firstSelection = $(this).attr("id");
        firstSelectionColor = $(this).children('.back').css('background-color');
        matchCounter += 1;
      }
      /* Second selection */
      else {
        score += 1;
        $('#scoreKeeper').html("Turns: " + score);
        clickPreventer = true;
        $(this).addClass('flipped');
        secondSelection = $(this).attr("id");
        secondSelectionColor = $(this).children('.back').css('background-color');
        /* Reset matchCounter to 0 to start with the first selection again*/
        matchCounter = 0;
        /* Check for a color match */
        if (secondSelectionColor == firstSelectionColor) {
          totalMatches += 1;
          /* Checks if user wins with all pairs matched */
          if (totalMatches == 8) {
            youWin();
          }
          clickPreventer = false;
          /* If it's not a match */
        } else {
          /* Adds a delay so the full card flipping animation can take place. Without this, because the animation is done with CSS transform, the function immediately removes the class and the flipping effect never takes place. You are unable to see the color of the second selection. The 1000 at the end of the function is 1000 miliseconds */
          window.setTimeout(function() {
            $("#" + firstSelection).removeClass('flipped');
            $("#" + secondSelection).removeClass('flipped');
            firstSelection = "";
            clickPreventer = false;
          }, 1000);
        }
      }
    }
  });

});