let wordlist;
let target;
const endScreen = document.getElementById("end");
const validCharacters = "abcdefghijklmnopqrstuvwxyz";
let words = [];
let currentLetter = [0, 0];
let playing = true;

fetch('./wordlist.json')
    .then((response) => response.json())
    .then((json) => {
        wordList = json;
        target = wordList[Math.floor(Math.random() * wordList.length)];
        // target = "plant";
        console.log(target);
        document.getElementById("displayTarget").innerText += target.toUpperCase();
    });


let keyboard = [];
for (let i = 0; i < 3; i++) {
    let row = document.getElementsByClassName("keyboard")[0].getElementsByClassName("row")[i];
    keyboard[i] = [];
    for (let j = 0; j < row.getElementsByClassName("key").length; j++) {
        keyboard[i][j] = row.getElementsByClassName("key")[j];

        keyboard[i][j].onclick = () => {
            if (playing) {
                let key = keyboard[i][j]
                let [k, l] = currentLetter;
                console.log(key.innerText, k, l);
                if (key.innerText != "ENTER" && key.innerText != "") {
                    if (words[k][l].value == "") words[k][l].value = key.innerText;
                    if (l != 4) {
                        words[k][l].disabled = true;
                        words[k][l + 1].disabled = false;
                        words[k][l + 1].focus();
                        currentLetter = [k, l + 1];
                    }
                    return;
                }
                if (key.innerText == "ENTER") {
                    if (l == 4 && words[k][l].value != "") {
                        checkAttempt(k, l);
                    }
                    return;
                }
                if (key.innerText == "") {
                    if (l != 0) {
                        if (l == 4 && words[k][l].value != "") {
                            words[k][l].value = "";
                        } else {
                            words[k][l].disabled = true;
                            words[k][l - 1].value = "";
                            words[k][l - 1].disabled = false;
                            words[k][l - 1].focus();
                            currentLetter = [k, l - 1];
                        }
                    }
                }
            }
        }
    }
}


for (let i = 0; i < 6; i++) {
    words[i] = document.getElementsByClassName("word")[i].getElementsByClassName("letter");
    for (let j = 0; j < 5; j++) {
        words[i][j].disabled = true;
        words[i][j].oninput = () => {
            if (playing) {
                if (j != 4) {
                    words[i][j].disabled = true;
                    words[i][j + 1].disabled = false;
                    words[i][j + 1].focus();
                    currentLetter = [i, j + 1];
                }
            }
        }
        words[i][j].onkeydown = (e) => {
            if (playing) {
                if (validCharacters.includes(e.key.toLowerCase()) || e.key == "Backspace" || e.key == "Delete" || e.key == "Enter") {
                    if (e.key == "Backspace" || e.key == "Delete") {
                        if (j != 0) {
                            if (j == 4 && words[i][j].value != "") {
                                words[i][j].value = "";
                            } else {
                                words[i][j].disabled = true;

                                words[i][j - 1].value = "";
                                words[i][j - 1].disabled = false;
                                words[i][j - 1].focus();
                                currentLetter = [i, j - 1];
                            }
                        }
                    }
                    if (e.key == "Enter") {
                        if (j == 4 && words[i][j].value != "") {
                            checkAttempt(i, j);

                        }
                    }
                } else {
                    e.preventDefault();
                }
            }
        };
    }
}

words[0][0].disabled = false;
words[0][0].focus();


function checkAttempt(i, j) {
    let word = words[i][0].value.toLowerCase() + words[i][1].value.toLowerCase() + words[i][2].value.toLowerCase() + words[i][3].value.toLowerCase() + words[i][4].value.toLowerCase();

    if (wordList.includes(word)) {
        words[i][j].disabled = true;
        if (i != 5) {
            words[i + 1][0].disabled = false;
            words[i + 1][0].focus();
            currentLetter = [i + 1, 0];
        }
        if (word == target) {
            gameOver("won");
        }
        let lettersUsed = "";
        for (let k = 0; k < 5; k++) {
            let l = word.charAt(k);
            let t = target.charAt(k);
            if (l == t) {
                words[i][k].classList.add("correct");
                lettersUsed += l;

                rowblock: for (let row of keyboard) {
                    for (let key of row) {
                        if (key.innerText.toLowerCase() == l) {
                            key.classList.add("correct");
                            break rowblock;
                        }
                    }
                }
            }
        }
        for (let k = 0; k < 5; k++) {
            let l = word.charAt(k);
            let t = target.charAt(k);
            if (target.includes(l) && !lettersUsed.includes(l)) {
                words[i][k].classList.add("almost");
                lettersUsed += l;
                rowblock: for (let row of keyboard) {
                    for (let key of row) {
                        if (key.innerText.toLowerCase() == l) {
                            key.classList.add("almost");
                            break rowblock;
                        }
                    }
                }
            }
        }
        for (let k = 0; k < 5; k++) {
            let l = word.charAt(k);
            let t = target.charAt(k);
            if (!target.includes(l) || (target.includes(l) && lettersUsed.includes(l))) {
                words[i][k].classList.add("wrong");
                rowblock: for (let row of keyboard) {
                    for (let key of row) {
                        if (!lettersUsed.includes(key.innerText.toLowerCase()) && word.includes(key.innerText.toLowerCase())) {
                            key.classList.add("wrong");
                        }
                    }
                }
            }
        }

        if (i == 5 && word != target) {
            gameOver("lost");
        }
    } else {
        alert(word + " is not in word list");
    }
}

function gameOver(state) {
    if (state == "won") {
        document.getElementById("displayState").innerText += "WON!!!";
        endScreen.showModal();
    } else {
        document.getElementById("displayState").innerText += "LOST ☹️";
        endScreen.showModal();
    }
    playing = false;
    words[currentLetter[0]][currentLetter[1]].disabled = true;
}

document.onkeydown = (e) => {
    if (e.key == ";" && e.ctrlKey) {
        alert(target);
    }
}