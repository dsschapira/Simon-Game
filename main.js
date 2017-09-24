//Define Classes
class Game {
    constructor(){
        this.init(); //make the constructor call init so that we can wipe the object if necessary.
    }
    init(){
        this.on = true;
        this.strict = false;
        this.events = getEvents();
    }
    restart(){
        this.sequence = getSequence();
        this.round = 10;
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
        if(index===game.round){
            setTimeout(function(){
                let temp = !document.dispatchEvent(game.events["player"]);
            },1000);//Allow 1 second before the player turn is triggered 
        }
        if(index<game.round){
            index++;
            allTurns(game,audio,index);
        }
    },timing);
}

function performTurn(buttonId,audio){
    //buttonId is simply a string of "red","blue","green",or "yellow".
    let button = document.getElementById(buttonId);
    let newColor = buttonId!=="yellow"?"dark"+buttonId:"palegoldenrod";
    button.style.backgroundColor = newColor;
    audio.play();
    setTimeout(function(){
        button.style.backgroundColor = buttonId;
    },200);
    //!!! At somepoint replace variable newColor with a smarter way to get new color.
}

function compTurn(game,audio){
    game.nextRound(); //first time through, game.round = 1 now.
    let index=0;
    allTurns(game,audio,index);
}

function playerTurn(game,audio){
    console.log("It is the player's turn!");
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
            game = "";
        }
    });

    document.querySelector("#strict-btn").addEventListener('click',function(){
        if(game!==""){
            strictBtnToggle(game);
        }
    });

    document.querySelector("#start-btn").addEventListener('click',function(){
        playGame(game);
        //add initializing display here
    });
});