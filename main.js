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
        this.playerTurn = false;
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

class Timer {
    constructor(){
        this.init();
    }
    init(){
        this.countdown = 10000;
    }
    setCountdown(val=10000){
        this.countdown = val;
    }
    beginCountdown(game){
        this.timerFcn = window.setTimeout(function(){
            game.addChoice("errVal");
            let tempb = !document.getElementById('blue').click();
            let tempr = !document.getElementById('red').click();
            let tempy = !document.getElementById('yellow').click();
            let tempg = !document.getElementById('green').click();
        },this.countdown);
    }
    resetCountdown(game){
        window.clearTimeout(this.timerFcn);
        this.timerFcn = undefined;
        this.beginCountdown(game);
    }
    Off(){
        window.clearTimeout(this.timerFcn);
        this.timerFcn = undefined;
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
function getTiming(round){
    if(round>=13){
        return 500;
    }
    else if(round>=9){
        return 700;
    }
    else if(round>=5){
        return 1200;
    }
    else{
        return 1500;
    }
}

function allTurns(game,audio,index){
    var timing = getTiming(game.round);
    setTimeout(function(){ 
        if(game.on){ //if the game is turned off while turn is going this will stop it.
            let buttonId = game.sequence[index];
            let sound = audio[game.sequence[index]];

            if(index===0){
                displayRound(game);
            }

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

function displayRound(game){
    document.getElementById("display").innerHTML = (game.round>=10)?game.round:"0"+game.round;
}

function compTurn(game,audio,timer){
    timer.Off();
    game.nextRound(); //First time through this will be 1, so we can use it for round counter as well
    setTimer(game,timer);
    game.notPlayerRound();
    let index=0;
    allTurns(game,audio,index);
}

function playerTurn(game,timer){
    game.playerRound();
    timer.resetCountdown(game);
}

function setTimer(game,timer){
    if(game.round>=13){
        timer.setCountdown(3000);
    }
    else if(game.round>=9){
        timer.setCountdown(4000);
    }
    else if(game.round>=5){
        timer.setCountdown(5000);
    }
    else{
        timer.setCountdown(10000);
    }
}

function buttonClickFcn(event,game,audioFiles,timer){
    game.addChoice(event.target.id);
    timer.resetCountdown(game);
    checkChoices(game,event.target.id,audioFiles,timer);
}

function checkChoices(game,buttonId,audioFiles,timer){
    let subSequence = game.sequence.slice(0,game.playerSequence.length);
    let sound = audioFiles[buttonId];

    if(arraysEqual(subSequence,game.playerSequence)){
        //replace arraysEqual with checking the last entered thing.
        performTurn(buttonId,sound);

        if(arraysEqual(game.playerSequence,game.sequence)){
            endGame(audioFiles);
            timer.Off();
        }
        else if(game.playerSequence.length === game.round){
            let temp = !document.dispatchEvent(game.events["computer"]);
        }
    }
    else{
        clickBtn(buttonId);
        document.getElementById("display").innerHTML = "!!";
        wrongChoice(audioFiles);
        timer.Off();
        setTimeout(function(){
            if(!game.strict){
                let index = 0;
                game.notPlayerRound();
                allTurns(game,audioFiles,index);
            }
            else{
                playGame(game);
            }
        },500);
    }
}

function wrongChoice(audio){
    for(key in audio){
        audio[key].play();
        clickBtn(key);
    }
    setTimeout(function(){
        for (key in audio){
            audio[key].play();
            clickBtn(key);
        }
    },400);

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

function playGame(game){
    game.restart(); //restart gets the Sequence and resets round to 0.

    if(game.on){
        let temp = !document.dispatchEvent(game.events["computer"]);
    }
}

function endGame(audio,reps=0){
    setTimeout(function(){
        document.getElementById("display").innerHTML = (document.getElementById('display').innerHTML==="!!")?":)":"!!";
        audio['red'].play();
        audio['yellow'].play();
        clickBtn('red');
        clickBtn('yellow');
        setTimeout(function(){
            audio['blue'].play();
            audio['green'].play();
            clickBtn('blue');
            clickBtn('green');
        },400);
        if(reps<10){
            reps++;
            endGame(audio,reps);
        }else{
            document.getElementById("display").innerHTML = "- -";
        }
    },300);
}

//End Main Gameplay Functions


//Page Ready
document.addEventListener("DOMContentLoaded", function() { //start doing things once the DOM is ready to be manipulated
    var game ="";
    var timer ="";


    //Load Sounds
    let redAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
    let blueAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
    let greenAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
    let yellowAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
    var audioFiles = {"red":redAudio,"blue":blueAudio,"green":greenAudio,"yellow":yellowAudio};
    //End Sound Loading

    document.addEventListener("compTurnEvent",function(){
        compTurn(game,audioFiles,timer);
    });

    document.addEventListener("playerTurnEvent",function(){
        playerTurn(game,timer);
        //start timer here
    });

    document.querySelector('#on-slider').addEventListener('click',function(){
        let on = turnOnOff(); //initialize new Game object
        if(on){
            game = new Game();
            document.getElementById("display").innerHTML = "- -";
        }else{
            game.turnOff();
            timer.Off();
            document.querySelector("#strict-indicator").style['background-color'] = 'black';
            document.getElementById("display").innerHTML = "";
        }
    });

    document.querySelector("#strict-btn").addEventListener('click',function(){
        if(game.on){
            strictBtnToggle(game);
        }
    });

    document.querySelector("#start-btn").addEventListener('click',function(){
        timer = new Timer();
        if(game.on){
            playGame(game);
        }
        //add initializing display here
    });

    let buttons = document.querySelectorAll('.gameButton');
    for(let i =0; i<buttons.length; i++){
        buttons[i].addEventListener('click',function(e){
            if(game.on && game.playerTurn){
                buttonClickFcn(e,game,audioFiles,timer);
            }
        });
    }
});