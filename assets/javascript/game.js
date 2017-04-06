var playGame = document.getElementById("play");
playGame.addEventListener("click", loadWord, false);

var words = ["WESTERN","HORSEBACK","WINCHESTER","SHOOTOUT","OUTLAW","TOMBSTONE","TUMBLEWEED","RUSTLER","CARPETBAGGER","SHOWGIRL","SALOON","CATTLEMAN"]; //Use as many or few words as you like
var wordCounter = 0; // counts each word used
var currentWord; // current word
var wordArray; // array of current word
var underline; // underline placeholders
var goodLetters = 0; // counts good letter choices
var missedLetter = 0; // counts bad letter choices
var hanginGallows; // gallows images
var letterGroup; // group of letter choices
var i;

// LOADS EACH WORD OF ARRAY
function loadWord() {    
    currentWord = words[wordCounter]; // sets current word
    wordArray = words[wordCounter].split(""); // array of current word
    letterGroup = document.getElementById("ltrGrp");
    letterGroup.style.display = "inline-block"; // shows letter button choices
    letterGroup.addEventListener("click", letters, false); // event listener of letter buttons
    playGame.style.display = "none"; // hides play button

    // resets gallows img
    hanginGallows = document.getElementById("gallows");
    hanginGallows.src = "assets/images/gallows.png";    

    // show all letter buttons
    var letterButtons = letterGroup.children;
    for (i=0; i<letterButtons.length; i++) {
        letterButtons[i].style.display = "inline-block";
    }
   
    if (currentWord) {
        createLines(); // calls currentWord function
    }
    else {
        alert("That's all the varmints we have for hangin' today");
        endGame();
    }
}

// CREATES THE UNDERLINE PLACEHOLDERS FOR LETTERS
function createLines() {
    wordArray = words[wordCounter].split(""); // array of current word
    underline = document.getElementById("ltrFields");

    for (i=0; i<wordArray.length; i++) {           
        var box = document.createElement("span");
        var space = document.createTextNode(" ");
        box.setAttribute("style","border-bottom:solid 1px white; width:30px; display:inline-block; text-align:center; vertical-align:bottom; color: white;");
        underline.appendChild(box);
        underline.appendChild(space);
    }
}

// CAPTURES LETTER CHOICES AND APPLIES TO PLACEHOLDERS
function letters() {
    wordArray = words[wordCounter].split(""); // array of current word
    var letter = event.target.innerHTML; // captures the letter of the click
    currentWord = words[wordCounter]; // captures current word

    // creates array of matching letter indexes
    var indices = [];
    for (i=0; i<currentWord.length; i++) {
        if (currentWord[i] === letter) indices.push(i);
    }
    // number of failed 'missedLetter' before hangman is hung and game ends
    if (missedLetter < 5) {
        // checks for single or multiple same letters
        if (indices.length != 0) {
            // inserts the matching letter(s) into appropriate placeholder
            for (i=0; i<indices.length; i++) {
                var index = indices[i];
                underline.children[index].innerHTML = letter;
                event.target.style.display = "none"; // hides letter button after use
            }
            var gunShot = document.getElementById("gunshot");
            gunShot.play(); // plays horse audio
            // concat multiple index letters within the letterCount
            goodLetters = goodLetters+indices.length-1;
            goodLetters++;
            // compares correct letters to wordArray to see if word solved
            if (goodLetters >= wordArray.length) {
                // hides all letter buttons
                letterButtons = document.getElementById("ltrGrp").children;
                for (i=0; i<letterButtons.length; i++) {
                    letterButtons[i].style.display = "none";
                }
                for (i=0; i<underline.childNodes.length; i++) {
                    underline.innerHTML = "";
                }
                playGame.style.display = "inline-block";
                playGame.innerHTML = "NICE SHOOTIN'";
                // changes gallows img
                hanginGallows.src = "assets/images/gallows.png";
                // applies a delay between words
                setTimeout(function wordSolved() {
                    missedLetter = 0;            
                    nextWord();
                }, 3000);                                
            }
        }
        // runs if letter is not in currentWord
        else {
            document.getElementById("horse").play(); // plays horse audio
            // changes gallows img
            hanginGallows.src = "assets/images/gallows" + missedLetter + ".png";
            missedLetter++;
            event.target.style.display = "none"; // hides letter button after use
            console.log(missedLetter);
            console.log(wordArray.length);
            console.log(goodLetters);
        }        
    }
    // Runs when number of 'missedLetter' is reached
    else {
        letterGroup.removeEventListener("click", letters, false); // removes event listener from letter buttons     
        playGame.style.display = "inline-block";
        playGame.innerHTML = "YOU'RE HUNG<br>Ar u drinkin' whisky?";
        // changes gallows img
        hanginGallows.src = "assets/images/gallows5.png";
        // hides all letter buttons
        letterButtons = letterGroup.children;
        for (i=0; i<letterButtons.length; i++) {
            letterButtons[i].style.display = "none";
        }
        for (i=0; i<underline.childNodes.length; i++) {
            underline.innerHTML = "";
        }
        // applies a delay between words 
        setTimeout(function wordFailed() {            
            missedLetter = 0;
            nextWord();
        }, 3000);
    }
}

// SETS UP FOR NEXT WORD ATTEMPT
function nextWord() {
    missedLetter = 0; // clears 'missedLetter' before next word challenge
    goodLetters = 0; // clears good letter count
    wordCounter++;

    // shows all letter buttons
    var letterButtons = letterGroup.children;
    for (i=0; i<letterButtons.length; i++) {
        letterButtons[i].style.display = "inline-block";
    }    
    // removes letter _ placeholders
    for (i=0; i<underline.childNodes.length; i++) {
        underline.innerHTML = "";
    }
    playGame.style.display = "inline-block"; // show PLAY GAME button 
    // check whether more words available
    if (words[wordCounter]) {
        loadWord();
    }
    else {
        endGame();
    }
}

// END OF GAME WHEN ALL WORDS HAVE BEEN PLAYED
function endGame() {   
    // hides all letter buttons
    var letterButtons = letterGroup.children;

    for (i=0; i<letterButtons.length; i++) {
        letterButtons[i].style.display = "none";
    }
    for (i=0; i<underline.childNodes.length; i++) {
        underline.innerHTML = "";
    }
    // resets gallows img
    hanginGallows.src = "assets/images/gallows.png";
    playGame.style.display = "inline-block"; // hide PLAY GAME button
    playGame.innerHTML = "NO MORE TO HANG<br>Click Here to Try Again";
    wordCounter = 0; // reset the words available for a restart
}