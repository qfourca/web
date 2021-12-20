function isCanGo(x, y) {
    var arr
    switch (chessCharacterGrid[x][y]) {
        case chessCharacter.PON:
        case chessCharacter.PON << 4: arr = isPonCanGo(x, y); break;
        case chessCharacter.KNI:
        case chessCharacter.KNI << 4: arr = isKnightCanGo(x, y); break;
        case chessCharacter.BIS:
        case chessCharacter.BIS << 4: arr = isBisopCanGo(x, y); break;
        case chessCharacter.ROO:
        case chessCharacter.ROO << 4: arr = isRookCanGO(x, y); break;
        case chessCharacter.QUE:
        case chessCharacter.QUE << 4: arr = isQueenCanGO(x, y); break;
        case chessCharacter.KIN:
        case chessCharacter.KIN << 4: arr = isKingCanGo(x, y); break;
    }
    return arr;
}
function drawDOT(arr) {
    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            if (arr[i][j]) {
                chessGridDocument[i][j].innerHTML = "<div class='dot'></div>"
            }
        }
    }
}
function canIGoThere(x, y, flags) {
    if (chessCharacterGrid[x][y] == chessCharacter.END) {
        return true;
    }
    else if (chessCharacterGrid[x][y] == chessCharacter.VOI && (flags & canIGoThereFlags.VOID)) {
        return true;
    }
    else if (chessCharacterGrid[x][y] > 15 && (flags & canIGoThereFlags.BLACK)) {
        return true;
    }
    else if (chessCharacterGrid[x][y] >= chessCharacter.PON && chessCharacterGrid[x][y] < 15 && (flags & canIGoThereFlags.WHITE)) {
        return true;
    }
}
function isPonCanGo(x, y) {
    array = create2DArray(10, 10);
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            array[i][j] = false;
        }
    }

    if (chessCharacterGrid[x][y] < 16) { //체스 말의 색깔 판별 코드
        array[x + 1][y + 1] = canIGoThere(x + 1, y + 1, canIGoThereFlags.BLACK)
        array[x - 1][y + 1] = canIGoThere(x - 1, y + 1, canIGoThereFlags.BLACK)
        if (canIGoThere(x, y + 1, canIGoThereFlags.VOID)) {
            array[x][y + 1] = true;
            if (canIGoThere(x, y + 2, canIGoThereFlags.VOID) && y == 2) {
                array[x][y + 2] = true;
            }
        }
    }
    else {
        array[x + 1][y - 1] = canIGoThere(x + 1, y - 1, canIGoThereFlags.WHITE)
        array[x - 1][y - 1] = canIGoThere(x - 1, y - 1, canIGoThereFlags.WHITE)
        if (canIGoThere(x, y - 1, canIGoThereFlags.VOID)) {
            array[x][y - 1] = true;
            if (canIGoThere(x, y - 2, canIGoThereFlags.VOID) && y == 7) {
                array[x][y - 2] = true;
            }
        }
    }
    return array
}
function isKnightCanGo(x, y) {
    array = create2DArray(10, 10);
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            array[i][j] = false;
        }
    }
    colorFlag = chessCharacterGrid[x][y] < 16 ? canIGoThereFlags.BLACK : canIGoThereFlags.WHITE
    array[x + 2][y - 1] = canIGoThere(x + 2, y - 1, colorFlag | canIGoThereFlags.VOID)
    array[x + 2][y + 1] = canIGoThere(x + 2, y + 1, colorFlag | canIGoThereFlags.VOID)
    array[x - 2][y + 1] = canIGoThere(x - 2, y + 1, colorFlag | canIGoThereFlags.VOID)
    array[x - 2][y - 1] = canIGoThere(x - 2, y - 1, colorFlag | canIGoThereFlags.VOID)
    array[x + 1][y + 2] = canIGoThere(x + 1, y + 2, colorFlag | canIGoThereFlags.VOID)
    array[x - 1][y + 2] = canIGoThere(x - 1, y + 2, colorFlag | canIGoThereFlags.VOID)
    array[x + 1][y - 2] = canIGoThere(x + 1, y - 2, colorFlag | canIGoThereFlags.VOID)
    array[x - 1][y - 2] = canIGoThere(x - 1, y - 2, colorFlag | canIGoThereFlags.VOID)
    return array
}
function isBisopCanGo(x, y) {
    array = create2DArray(10, 10);
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            array[i][j] = false;
        }
    }
    colorFlag = chessCharacterGrid[x][y] < 16 ? canIGoThereFlags.BLACK : canIGoThereFlags.WHITE
    for (var i = 1; x + i < 9 && y + i < 9; i++) {
        const xcali = x + i; const ycali = y + i;
        array[xcali][ycali] = canIGoThere(xcali, ycali, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(xcali, ycali, canIGoThereFlags.VOID)) { break; }
    }
    for (var i = 1; x - i > 0 && y + i < 9; i++) {
        const xcali = x - i; const ycali = y + i;
        array[xcali][ycali] = canIGoThere(xcali, ycali, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(xcali, ycali, canIGoThereFlags.VOID)) { break; }
    }
    for (var i = 1; x + i < 9 && y - i > 0; i++) {
        const xcali = x + i; const ycali = y - i;
        array[xcali][ycali] = canIGoThere(xcali, ycali, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(xcali, ycali, canIGoThereFlags.VOID)) { break; }
    }
    for (var i = 1; x - i > 0 && y - i > 0; i++) {
        const xcali = x - i; const ycali = y - i;
        array[xcali][ycali] = canIGoThere(xcali, ycali, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(xcali, ycali, canIGoThereFlags.VOID)) { break; }
    }
    return array;
}
function isRookCanGO(x, y) {
    array = create2DArray(10, 10);
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            array[i][j] = false;
        }
    }
    colorFlag = chessCharacterGrid[x][y] < 16 ? canIGoThereFlags.BLACK : canIGoThereFlags.WHITE
    for (var i = 1; y + i < 9; i++) {
        const cal = y + i
        array[x][cal] = canIGoThere(x, cal, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(x, cal, canIGoThereFlags.VOID)) { break; }
    }
    for (var i = 1; y - i > 0; i++) {
        const cal = y - i
        array[x][cal] = canIGoThere(x, cal, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(x, cal, canIGoThereFlags.VOID)) { break; }
    }
    for (var i = 1; x + i < 9; i++) {
        const cal = x + i
        array[cal][y] = canIGoThere(cal, y, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(cal, y, canIGoThereFlags.VOID)) { break; }
    }
    for (var i = 1; x - i > 0; i++) {
        const cal = x - i
        array[cal][y] = canIGoThere(cal, y, canIGoThereFlags.VOID | colorFlag)
        if (!canIGoThere(cal, y, canIGoThereFlags.VOID)) { break; }
    }
    return array;
}
function isQueenCanGO(x, y) {
    const arrB = isBisopCanGo(x, y)
    const arrR = isRookCanGO(x, y)
    var retarr = create2DArray(10, 10)
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            retarr[i][j] = arrB[i][j] || arrR[i][j]
        }
    }
    return retarr
}
function isKingCanGo(x, y) {
    array = create2DArray(10, 10);
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            array[i][j] = false;
        }
    }
    colorFlag = chessCharacterGrid[x][y] < 16 ? canIGoThereFlags.BLACK : canIGoThereFlags.WHITE
    array[x + 1][y + 1] = canIGoThere(x + 1, y + 1, canIGoThereFlags.VOID | colorFlag)
    array[x - 1][y + 1] = canIGoThere(x - 1, y + 1, canIGoThereFlags.VOID | colorFlag)
    array[x + 1][y - 1] = canIGoThere(x + 1, y - 1, canIGoThereFlags.VOID | colorFlag)
    array[x - 1][y - 1] = canIGoThere(x + 1, y - 1, canIGoThereFlags.VOID | colorFlag)
    array[x + 1][y] = canIGoThere(x + 1, y, canIGoThereFlags.VOID | colorFlag)
    array[x - 1][y] = canIGoThere(x - 1, y, canIGoThereFlags.VOID | colorFlag)
    array[x][y + 1] = canIGoThere(x, y + 1, canIGoThereFlags.VOID | colorFlag)
    array[x][y - 1] = canIGoThere(x, y - 1, canIGoThereFlags.VOID | colorFlag)
    return array;
}