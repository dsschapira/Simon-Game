//Define Classes
class Game {
    constructor(){
        this.init(); //make the constructor call init so that we can wipe the object if necessary.
    }
    init(){
        this.strict = false;
        this.sequence = [];
    }
    addToSequence(val){
        this.sequence.push(val);
    }
}
//End Classes

//Globals
TURNED_ON = false;
//End Globals


//Begin Callable Functions

function turnOnOff(game){
    document.querySelector("#on-slider").classList.toggle('game-turned-on');

    if(document.querySelector("#on-slider").classList.value==="game-turned-on"){
        TURNED_ON = true;
    }
    
    game = new Game();
}

//End Callable Functions


//Page Ready
document.addEventListener("DOMContentLoaded", function() { //start doing things once the DOM is ready to be manipulated
    var game;

    document.querySelector('#on-slider').addEventListener('click',function(){
        turnOnOff(game); //initialize new Game object
    });

});