const chessCharacter = Object.freeze({ "END": -1, "VOI": 0, "PON": 1, "KNI": 2, "BIS": 3, "ROO": 4, "QUE": 5, "KIN": 6 })
const canIGoThereFlags = Object.freeze({ "WHITE": 1, "BLACK": 1 << 1, "VOID": 1 << 2, "ENDOFMAP": 1 << 3 })
var chessCharacterGrid = create2DArray(10, 10)
var chessGridDocument = create2DArray(10, 10)
var isCanGoArr = create2DArray(10, 10)
var characterClicked = { clicked: false, x: 0, y: 0 };
var myColor;

const webSocket = new WebSocket("ws://10.80.161.31:3001/");
webSocket.onopen = () => { console.log("Connected Server!"); };
webSocket.onmessage = function (event) { console.log(`${event.data}`); }
webSocket.onclose = () => { console.log("서버 웹소켓 연결 종료"); }
webSocket.onerror = function (event) { console.log(`Error Occur${event}`) }

for (var i = 1; i <= 8; i++) {
    for (var j = 1; j <= 8; j++) {
        chessGridDocument[i][j] = document.getElementById('N' + i + j)
    }
}
for (var i = 1; i <= 8; i++) {
    for (var j = 1; j <= 8; j++) {
        (function (m, n) {
            chessGridDocument[m][n].addEventListener("click", () => {
                if (characterClicked.clicked) {
                    var dot = document.querySelectorAll('.dot')
                    dot.forEach(element => element.parentNode.removeChild(element))
                    if (isCanGoArr[m][n]) {
                        moveCharacter(characterClicked.x, characterClicked.y, m, n)
                    }
                    characterClicked.clicked = false
                }
                else if (chessCharacterGrid[m][n] != chessCharacter.VOI) {
                    characterClicked.clicked = true
                    characterClicked.x = m
                    characterClicked.y = n
                    isCanGoArr = isCanGo(m, n)
                    drawDOT(isCanGoArr)
                }
            }, false);
        })(i, j);
    }
}

initChessCharacterGird()
drawChessCharacterAll(true)

function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    return arr;
}

function drawChessCharacterAll(white) {
    if (white) {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                drawCharacter(chessCharacterGrid[i][j], i, j);
            }
        }
    }
    else {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                drawCharacter(chessCharacterGrid[i][j], 9 - i, 9 - j);
            }
        }
    }
}

function initChessCharacterGird() {
    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            chessCharacterGrid[i][j] = chessCharacter.VOI;
        }
    }

    for (var i = 1; i < 9; i++) {
        chessCharacterGrid[i][2] = chessCharacter.PON;
    }
    for (var i = 1; i < 9; i++) {
        chessCharacterGrid[i][7] = chessCharacter.PON << 4;
    }
    chessCharacterGrid[1][1] = chessCharacter.ROO;
    chessCharacterGrid[8][1] = chessCharacter.ROO;
    chessCharacterGrid[1][8] = chessCharacter.ROO << 4;
    chessCharacterGrid[8][8] = chessCharacter.ROO << 4;

    chessCharacterGrid[2][1] = chessCharacter.KNI;
    chessCharacterGrid[7][1] = chessCharacter.KNI;
    chessCharacterGrid[2][8] = chessCharacter.KNI << 4;
    chessCharacterGrid[7][8] = chessCharacter.KNI << 4;

    chessCharacterGrid[3][1] = chessCharacter.BIS;
    chessCharacterGrid[6][1] = chessCharacter.BIS;
    chessCharacterGrid[3][8] = chessCharacter.BIS << 4;
    chessCharacterGrid[6][8] = chessCharacter.BIS << 4;

    chessCharacterGrid[5][1] = chessCharacter.KIN;
    chessCharacterGrid[5][8] = chessCharacter.KIN << 4;
    chessCharacterGrid[4][1] = chessCharacter.QUE;
    chessCharacterGrid[4][8] = chessCharacter.QUE << 4;


    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (i == 0 || i == 9 || j == 0 || j == 9) {
                chessCharacterGrid[i][j] = chessCharacter.END;
            }
        }
    }
}

function drawCharacter(character, x, y) {
    if (character == chessCharacter.PON) {
        chessGridDocument[x][y].className += ' white_pon'
    }
    else if (character == chessCharacter.PON << 4) {
        chessGridDocument[x][y].className += ' black_pon'
    }
    else if (character == chessCharacter.KNI) {
        chessGridDocument[x][y].className += ' white_knight'
    }
    else if (character == chessCharacter.KNI << 4) {
        chessGridDocument[x][y].className += ' black_knight'
    }
    else if (character == chessCharacter.BIS) {
        chessGridDocument[x][y].className += ' white_bisop'
    }
    else if (character == chessCharacter.BIS << 4) {
        chessGridDocument[x][y].className += ' black_bisop'
    }
    else if (character == chessCharacter.ROO) {
        chessGridDocument[x][y].className += ' white_rook'
    }
    else if (character == chessCharacter.ROO << 4) {
        chessGridDocument[x][y].className += ' black_rook'
    }
    else if (character == chessCharacter.QUE) {
        chessGridDocument[x][y].className += ' white_queen'
    }
    else if (character == chessCharacter.QUE << 4) {
        chessGridDocument[x][y].className += ' black_queen'
    }
    else if (character == chessCharacter.KIN) {
        chessGridDocument[x][y].className += ' white_king'
    }
    else if (character == chessCharacter.KIN << 4) {
        chessGridDocument[x][y].className += ' black_king'
    }
}

function removeCharacter(x, y) {
    chessGridDocument[x][y].className = (x % 2) ^ (y % 2) ? 'square bright' : 'square dark'
}

function moveCharacter(firx, firy, secx, secy) {
    var temp = chessCharacterGrid[firx][firy];
    chessCharacterGrid[firx][firy] = 0;
    chessCharacterGrid[secx][secy] = temp;
    removeCharacter(firx, firy);
    removeCharacter(secx, secy);
    drawCharacter(chessCharacterGrid[secx][secy], secx, secy)
}
window.onkeydown = function () {
    var kcode = event.keyCode;
    if (kcode == 116) webSocket.close();
}