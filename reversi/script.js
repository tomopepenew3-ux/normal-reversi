const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

// 1: 黒猫, 2: 白猫, 0: 空白
const BLACK_CAT = 1;
const WHITE_CAT = 2;
let currentPlayer = WHITE_CAT; // 白猫からスタート

// 8x8の盤面データ（0で初期化）
let board = Array(8).fill(null).map(() => Array(8).fill(0));

// リバーシの初期配置
board[3][3] = WHITE_CAT;
board[3][4] = BLACK_CAT;
board[4][3] = BLACK_CAT;
board[4][4] = WHITE_CAT;

// 挟める方向の全8方向
const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];

// 盤面を画面に描画する関数
function drawBoard() {
    boardElement.innerHTML = '';
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleCellClick(r, c));
            
            if (board[r][c] === BLACK_CAT) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'black');
                cell.appendChild(piece);
            } else if (board[r][c] === WHITE_CAT) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'white');
                cell.appendChild(piece);
            }
            
            boardElement.appendChild(cell);
        }
    }
    updateStatus();
}

// 状態表示のテキストを更新する関数
function updateStatus() {
    const blackCount = board.flat().filter(p => p === BLACK_CAT).length;
    const whiteCount = board.flat().filter(p => p === WHITE_CAT).length;
    
    if (hasValidMoves(currentPlayer)) {
        const playerText = currentPlayer === WHITE_CAT ? "白猫クッキー" : "黒猫クッキー";
        statusElement.innerHTML = `${playerText}の番です<br>白猫: ${whiteCount}枚 | 黒猫: ${blackCount}枚`;
    } else {
        const nextPlayer = currentPlayer === WHITE_CAT ? BLACK_CAT : WHITE_CAT;
        if (hasValidMoves(nextPlayer)) {
            const passerText = currentPlayer === WHITE_CAT ? "白猫" : "黒猫";
            statusElement.innerHTML = `${passerText}は置けないのでパスします！`;
            currentPlayer = nextPlayer;
            setTimeout(updateStatus, 1500);
        } else {
            if (whiteCount > blackCount) {
                statusElement.innerHTML = `ゲーム終了！ 白猫の勝ち！<br>白猫: ${whiteCount}枚 | 黒猫: ${blackCount}枚`;
            } else if (blackCount > whiteCount) {
                statusElement.innerHTML = `ゲーム終了！ 黒猫の勝ち！<br>白猫: ${whiteCount}枚 | 黒猫: ${blackCount}枚`;
            } else {
                statusElement.innerHTML = `ゲーム終了！ 引き分けです！<br>白猫: ${whiteCount}枚 | 黒猫: ${blackCount}枚`;
            }
        }
    }
}

function getFlippablePieces(row, col, player, checkOnly = false) {
    if (board[row][col] !== 0) return [];
    const opponent = player === WHITE_CAT ? BLACK_CAT : WHITE_CAT;
    let piecesToFlip = [];
    
    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        let temp = [];
        
        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
            temp.push([r, c]);
            r += dr;
            c += dc;
        }
        
        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player) {
            if (checkOnly && temp.length > 0) return true;
            piecesToFlip = piecesToFlip.concat(temp);
        }
    }
    return checkOnly ? false : piecesToFlip;
}

function hasValidMoves(player) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) { // ←ここをしっかり c++ に直したよ！
            if (getFlippablePieces(r, c, player, true)) return true;
        }
    }
    return false;
}

function handleCellClick(row, col) {
    const piecesToFlip = getFlippablePieces(row, col, currentPlayer);
    if (piecesToFlip.length === 0) return;
    
    board[row][col] = currentPlayer;
    for (const [r, c] of piecesToFlip) {
        board[r][c] = currentPlayer;
    }
    
    currentPlayer = currentPlayer === WHITE_CAT ? BLACK_CAT : WHITE_CAT;
    drawBoard();
}

// 最初にゲーム画面を描画
drawBoard();