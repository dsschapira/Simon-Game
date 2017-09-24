//Define Classes
class Game {
    constructor(){
        this.init(); //make the constructor call init so that we can wipe the object if necessary.
    }
    init(){
        this.on = true;
        this.strict = false;
        this.sequence = getSequence();
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
}
//End Classes

//misc. Functions
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
function compTurn(sequence,game){
    return new Promise(resolve =>{
        resolve(sequence);
    });
}

function playerTurn(sequence,game){
    return new Promise(resolve =>{
        resolve();
    });
}

function playGame(game){
    
    for(let round = 1; round <= game.sequence.length; round++){ //start round at 1 to use as round counter output
        let play_sequence = [];

        for(let turn_index=0; turn_index<round; turn_index++){ //which # button-choice for this round we are on
            play_sequence.push(game.sequence[turn_index]);
        }

        if(game.on){
            let this_turn = async function(seq,game){
                return await compTurn(seq,game);
            } 
            this_turn(play_sequence,game).then(function(){
                let player_turn = async function(seq,game){
                    return await playerTurn(seq,game);
                }
                player_turn(play_sequence,game);
            });
            /*!!!!!!!Current issue here!!!!!!!!
            This will run through ALL of the computer turns first, THEN all of the player turns.
            */
        }
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
    //End Sound Loading
    
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