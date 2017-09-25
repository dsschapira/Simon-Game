//Define Classes
class Game {
    constructor(){
        this.init(); //make the constructor call init so that we can wipe the object if necessary.
    }
    init(){
        this.on = true;
        this.strict = false;
        this.events = getEvents();
        this.playerTurn = false;
        this.playerSequence = [];
    }
    restart(){
        this.sequence = getSequence();
        this.round = 0;
        this.playerTurn = false;
        this.playerSequence = [];
    }
    addToSequence(val){
        this.sequence.push(val);
    }
    toggleStrict(){
        if(this.strict === true){
            this.strict = false;
        }
        else{
            this.strict = true;
        }
    }
    nextRound(){
        this.round++;
    }
    turnOff(){
        this.on = false;
    }
    playerRound(){
        this.playerTurn = true;
        this.playerSequence = [];
    }
    notPlayerRound(){
        this.playerTurn = false;
    }
    addChoice(val){
        this.playerSequence.push(val);
    }
}

//End Classes

//misc. Functions
function getEvents(){
    var compTurnEvent = new CustomEvent("compTurnEvent");
    var playerTurnEvent = new CustomEvent("playerTurnEvent");

    let events = {
        "computer" : compTurnEvent,
        "player": playerTurnEvent
    };

    return events;
}
function getSequence(){
    let buttons = ["red","green","yellow","blue"];
    let retArr = [];
    while(retArr.length<20){
        let button = buttons[Math.floor(Math.random()*4)];
        retArr.push(button);
    }

    return retArr;
}
//end misc.Functions

//Begin Button Functions

function turnOnOff(game){
    document.querySelector("#on-slider").classList.toggle('game-turned-on');

    if(document.querySelector("#on-slider").classList.value==="game-turned-on"){
        return true;
    }else{
        return false;
    }
    
    
}

function strictBtnToggle(game){
    game.toggleStrict();
    if(game.strict){
        document.querySelector("#strict-indicator").style['background-color'] = 'red';
    }
    else{
        document.querySelector("#strict-indicator").style['background-color'] = 'black';
    }
}
//End Button Functions

//Main Gameplay Functions
function allTurns(game,audio,index){

    var timing = game.round<5? 1200: 700; //can make a better function for this later
    setTimeout(function(){

        let buttonId = game.sequence[index];
        let sound = audio[game.sequence[index]];
        performTurn(buttonId,sound);
        if(index===game.round-1){
            setTimeout(function(){
                let temp = !document.dispatchEvent(game.events["player"]);
            },700);//Allow 0.7 seconds before the player turn is triggered 
        }
        else if(index<game.round){
            index++;
            allTurns(game,audio,index);
        }
    },timing);
}

function performTurn(buttonId,audio){
    //buttonId is simply a string of "red","blue","green",or "yellow".
    audio.play();
    clickBtn(buttonId);
    //!!! At somepoint replace variable newColor with a smarter way to get new color.
}

function clickBtn(buttonId){
    let button = document.getElementById(buttonId);
    let newColor = buttonId!=="yellow"?"dark"+buttonId:"palegoldenrod";
    button.style.backgroundColor = newColor;
    
    setTimeout(function(){
        button.style.backgroundColor = buttonId;
    },200);
}

function compTurn(game,audio){
    game.nextRound(); //First time through this will be 1, so we can use it for round counter as well
    game.notPlayerRound();
    let index=0;
    allTurns(game,audio,index);
}

function playerTurn(game,audio){
    game.playerRound();


    console.log("It is the player's turn!");
}

function buttonClickFcn(event,game,audioFiles){
    game.addChoice(event.target.id);
    //Check here if it's correct
    checkChoices(game,event.target.id,audioFiles);
    
    console.log(game);
}

function checkChoices(game,buttonId,audioFiles){
    let subSequence = game.sequence.slice(0,game.playerSequence.length);
    let sound = audioFiles[buttonId];

    if(arraysEqual(subSequence,game.playerSequence)){
        //replace arraysEqual with checking the last entered thing.
        performTurn(buttonId,sound);
        if(game.playerSequence.length === game.round){
            let temp = !document.dispatchEvent(game.events["computer"]);
        }
    }
    else{
        clickBtn(buttonId);
        //Need a soundbite for erroring

        if(!game.strict){
            let index = 0;
            game.notPlayerRound();
            allTurns(game,audioFiles,index);
        }
        else{
            playGame(game);
        }
    }
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

/*Instead of async/await
  Refactor this to use event listeners
  Create custom event for "Computer Done"
  Triggeringt this will trigger player turn
  Correct play will re-trigger computer.
  End looping with incorrect play(in strict, only restart in non-strict) 
  or with turn-off*/
function playGame(game){
    game.restart(); //restart gets the Sequence and resets round to 0.

    if(game.on){
        let temp = !document.dispatchEvent(game.events["computer"]);
    }
}

//End Main Gameplay Functions


//Page Ready
document.addEventListener("DOMContentLoaded", function() { //start doing things once the DOM is ready to be manipulated
    var game ="";

    //Load Sounds
    let redAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
    let blueAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
    let greenAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
    let yellowAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
    var audioFiles = {"red":redAudio,"blue":blueAudio,"green":greenAudio,"yellow":yellowAudio};
    //End Sound Loading

    document.addEventListener("compTurnEvent",function(){
        compTurn(game,audioFiles);
    });

    document.addEventListener("playerTurnEvent",function(){
        playerTurn(game,audioFiles);
    });

    document.querySelector('#on-slider').addEventListener('click',function(){
        let on = turnOnOff(); //initialize new Game object
        if(on){
            game = new Game();
        }else{
            game.turnOff();
        }
    });

    document.querySelector("#strict-btn").addEventListener('click',function(){
        if(game.on){
            strictBtnToggle(game);
        }
    });

    document.querySelector("#start-btn").addEventListener('click',function(){
        if(game.on){
            playGame(game);
        }
        //add initializing display here
    });

    let buttons = document.querySelectorAll('.gameButton');
    for(let i =0; i<buttons.length; i++){
        buttons[i].addEventListener('click',function(e){
            if(game.on && game.playerTurn){
                buttonClickFcn(e,game,audioFiles);
            }
        });
    }
});