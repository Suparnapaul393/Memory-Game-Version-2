var chooseLevelScreen = $("#chooseLevelScreen"),
    chosenLevel,
    ocardsContainer = $("#cardsContainer"),
    cardFlag,
    cardClicked,
    trickCounter = 0,
    pairsRemoved = [],
    gameScreen = $("#gameScreen"),
    animationScreen = $("#animationScreen"),
    clickedCards = [],
    animateText = $("#animateText"),
    animateFireworks = $("#animateFireworks"),
    flipeUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/104215/flipcard.wav",
    bubbleUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/104215/bubble.wav",
    applauseUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/104215/applause.wav";

//~~~~~~~~~ Arrange cards and shuffle content array  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function levelLayoutCreation(nLevel) {
  var nCards;
  switch (nLevel) {
    case "1": 
      nCards = 8;
      break;
    case "2": 
      nCards = 12;
      break;
    case "3": 
      nCards = 16;
      break;
    default: nCards = 8;
  }

/*             ------ remove selection screen and add game screen ------ */

  chooseLevelScreen.addClass("visibilityH");
  gameScreen.addClass("visibilityV");

/*             ------ create all single card containers ------           */

  var cardContainerObj,
      SVGObjectsList = ["semantics", "presentation", "performance", "deviceAccess", "multimedia", "graphics", "connectivity", "storage"],
      currentLevelArray = [];
  for (var i = 1; i < nCards + 1; i++) {
    cardContainerObj = document.createElement("div");
    cardContainerObj.id = "cardContainer" + i;
    cardContainerObj.className = "cardContainer";
    cardContainerObj.classList.add("bounceIn");
    ocardsContainer.append(cardContainerObj);
    cardContainerObj.innerHTML = "<div class='flipper'>" +
      "<div class='front'>" +
      "<\/div>" +
      "<div class='back'>" +
      "<\/div>";
  }
  if(nCards === 16){
    ocardsContainer.addClass("cardsContainerL");  
  }
  
  //~~~~~~~~~ Add Click event listener                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  for (var j = 1; j < nCards + 1; j++) {
    cardContainerObj = $("#cardContainer" + j);
    cardContainerObj.click(function(e) {
      cardClicked = (e.target);
      cardFlag = cardClicked.parentNode;
      if (clickedCards.length < 2) {
        flipCard(cardClicked, cardFlag);
        trickCounter +=1;
        $('#trickCounterData').html(trickCounter);
        return trickCounter;
      }
    });
    // cardContainerObj.addEventListener("tap", gestureHandler, false);
  }

  /*             ------ create specific level array ------               */

  for (var k = 0; k < nCards / 2; k++) {
    currentLevelArray.push(SVGObjectsList[k] + "1");
    currentLevelArray.push(SVGObjectsList[k] + "2");
  }

  /*             ------ inject SVG Elements ------                */

  var cardBack = $(".back");
  var rand = Math.random();
  shuffleArray(currentLevelArray);
  for (var l = 0; l < nCards; l++) {
    cardSVGObj = cardBack[l];
    cardSVGObj.innerHTML = "<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/104215/html5_" + currentLevelArray[l] + "_small.svg'  id='" + currentLevelArray[l] + "'>";
  }

  playSounds("bubble");
}

//~~~~~~~~~ Flip cards and check card pairs         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function flipCard(el, n) {
  clickedCardContainer = cardFlag.childNodes[1];
  clickedCardId = clickedCardContainer.childNodes[0].id;
  cardFlag.classList.toggle("flip");
  playSounds("flip");
  clickedCards.push(clickedCardId);
  if (clickedCards.length === 2) {
    comPair(clickedCards);
  }
}

//~~~~~~~~~ Play sounds                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function playSounds(sound) {
  // var source;
  var audioTagSource;

  switch (sound) {
    case "bubble":
      audioTagSource = $("#multiaudio1");
      break;
    case "flip":
      audioTagSource = $("#multiaudio2");
      break;
    case "applause":
      audioTagSource = $("#multiaudio3");
      break;
  }
  setTimeout(audioTagSource.trigger("play"), 6500);
  // 
}

//~~~~~~~~~ Return to choose level Screen                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function backToLevelChoice() {
  ocardsContainer.html("");
  ocardsContainer.removeClass("cardsContainerL");
  nLevel = 0;
  if (animationScreen.hasClass("displayBlock")) {
    pairsRemoved.length = 0;
    animationScreen.removeClass("displayBlock");
    animationScreen.addClass("displayNone");
  } else if (gameScreen.hasClass("visibilityV")) {
    pairsRemoved.length = 0;
    gameScreen.removeClass("visibilityV");
    gameScreen.addClass("visibilityH");
  }
  chooseLevelScreen.removeClass("visibilityH");
}

//~~~~~~~~~ Shuffle current SVG Array               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**         thanks to http://stackoverflow.com/users/310500/laurens-holst for a beautifull function
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

//~~~~~~~~~ Compare cards to assertain pair or no   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function comPair(clickedCards) {
  var cardsBackArray = $(".back");
  var nCard1Length = clickedCards[0].length;
  var nCard2Length = clickedCards[1].length;
  var card1Str = clickedCards[0].slice(0, nCard1Length - 1);
  var card2Str = clickedCards[1].slice(0, nCard1Length - 1);
  var flippedCards = document.querySelectorAll(".flipper.flip");

  if (card1Str === card2Str) {
    setTimeout(function() {
      for (var m = 0; m < flippedCards.length; m++) {
        var flippedCardContainer = flippedCards[m];
        playSounds("applause");
        flippedCardContainer.classList.add("visibilityH");
      }
    }, 800);
    pairsRemoved.push(card1Str);
  } else {
    setTimeout(function() {
      for (var n = 0; n < flippedCards.length; n++) {
        var flippedCardContainer = flippedCards[n];
        flippedCardContainer.classList.remove("flip");
      }
    }, 800);
  }
  if ((cardsBackArray.length === 8 && pairsRemoved.length > 3) || (cardsBackArray.length === 12 && pairsRemoved.length > 5) || (cardsBackArray.length === 16 && pairsRemoved.length > 7)) {
    animationTime();
  }
  clickedCards.length = 0;
}

function animationTime() {
  setTimeout(function() {
    animationScreen.removeClass("displayNone");
    animationScreen.addClass("displayBlock");
    animateText.addClass("bounceIn");
    animateFireworks.addClass("bounceInUp");
  }, 800);
}

pairsRemoved.length = 0;
$("#levelText").addClass("chooseLevelShow");
$("button").click(function(){
  var elementId = this.id;
  var nLevel = elementId.slice(-1);
  if(elementId.startsWith("btnL")){
    levelLayoutCreation(nLevel);
  }
  else {
    trickCounter = 0;
    backToLevelChoice();
    return trickCounter;
  }
});


