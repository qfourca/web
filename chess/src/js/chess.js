const array = document.querySelectorAll('.square')
const box = document.querySelector('.box')
console.log(array[0])

const chessGrid = create2DArray(10, 10)
// for (var i = 1; i <= 8; i++) {
//     for (var j = 1; j <= 8; j++) {
//         chessGrid[i][j] = document.getElementById('N' + i + j)
//         chessGrid[i][j].addEventListener('click', () => {
//             console.log(chessGrid[i][j].id);
//         })
//     }
// }

const

function init() {
    box.addEventListener('click', () => {

    })
}

function click(x, y) {

}
function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    return arr;
}