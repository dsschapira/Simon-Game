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

//Begin Callable Functions

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
//End Callable Functions


//Page Ready
document.addEventListener("DOMContentLoaded", function() { //start doing things once the DOM is ready to be manipulated
    var game ="";

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

});