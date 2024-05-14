/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  const getRandomMove = (board, liberties, controlled, validMoves) => {
    const moveOptions = [];
    const size = board[0].length;
    // Look through all the points on the board
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // Make sure the point is a valid move
        const isValidMove = validMoves[x][y] === true;
        const N = board[x + 1]?.[y]; const n = liberties[x + 1]?.[y];
        const S = board[x - 1]?.[y]; const s = liberties[x - 1]?.[y];
        const E = board[x]?.[y + 1]; const e = liberties[x]?.[y + 1];
        const W = board[x]?.[y - 1]; const w = liberties[x]?.[y - 1];
        const NE = board[x + 1]?.[y + 1]; const ne = liberties[x + 1]?.[y + 1];
        const SE = board[x - 1]?.[y + 1]; const se = liberties[x - 1]?.[y + 1];
        const SW = board[x - 1]?.[y - 1]; const sw = liberties[x - 1]?.[y - 1];
        const NW = board[x + 1]?.[y - 1]; const nw = liberties[x + 1]?.[y - 1];
        const board1 = [N, S, E, W, NE, SE, SW, NW];
        const liberties1 = [n, s, e, w, ne, se, sw, nw];
        // const board2 = board[x][y];
        // const liberties2 = liberties[x][y];
        const con = controlled[x][y];

        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 4; j++) {
            if (isValidMove && con === '?') {//Make sure the pieces are not on either side's territory
              if (board1[j] === 'X') {
                if (liberties1[j] <= 2) { moveOptions.push([x, y]); }
              };
              if (board1[i] === 'O') {
                if (liberties1[j] == 1) { moveOptions.push([x, y]); }
                else if (liberties1[j] == 2) { moveOptions.push([x, y]); }
                else if (liberties1[i] <= 2 ^ 2 && liberties1[i] > 2) { moveOptions.push([x, y]); }
                else if (liberties1[i] <= 2 ^ 3 && liberties1[i] > 2 ^ 2) { moveOptions.push([x, y]); }
                else if (liberties1[i] <= 2 ^ 4 && liberties1[i] > 2 ^ 3) { moveOptions.push([x, y]); }
                // else if (liberties1[i] <= 2 ^ 5 && liberties1[i] > 2 ^ 4) { moveOptions.push([x, y]); }
              }
            }
          }
        }
      }
    };

    // Choose one of the found moves at random
    const randomIndex = Math.floor(Math.random() * moveOptions.length);
    return moveOptions[randomIndex] ?? [];
  };

  let result, x, y, a, b;

  while (1) {
    ns.go.resetBoardState(ns.go.getOpponent(), 13);

    do {
      const board = ns.go.getBoardState();
      const controlled = ns.go.analysis.getControlledEmptyNodes();
      const liberties = ns.go.analysis.getLiberties();
      // const chains = ns.go.analysis.getChains()
      const validMoves = ns.go.analysis.getValidMoves();
      const [randX, randY] = getRandomMove(board, liberties, controlled, validMoves);
      const [randa, randb] = getRandomMove(board, liberties, controlled, validMoves);

      // Choose a move from our options 
      x = randX;
      y = randY;
      a = randa;
      b = randb;
      if (x === undefined || a === undefined) {
        // Pass turn if no moves are found
        result = await ns.go.passTurn();
      } else {
        result = await ns.go.cheat.playTwoMoves(x, y, a, b);
      };

      ns.clearLog();
      ns.print(liberties);
      await ns.sleep(200);
      // Keep looping as long as the opponent is playing moves
    } while (result?.type !== "gameOver");

    // After the opponent passes, end the game by passing as well
    await ns.go.passTurn();
    await ns.asleep(1000);
  }
}
