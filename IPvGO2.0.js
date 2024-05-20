/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');

  //Search opponent's territory
  const getRandom = (board, controlled) => {
    const moveOptions = [];
    const size = board[0].length;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (controlled[x][y] === 'O') {
          moveOptions.push([x, y]);
        }
      }
    };

    const randomIndex = Math.floor(Math.random() * moveOptions.length);
    return moveOptions[randomIndex] ?? [];
  };

  //Retrieve the attack point
  const getRandom2 = (board, liberties, controlled, validMoves) => {
    const moveOptions = [];
    const size = board[0].length;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const isValidMove = validMoves[x][y] === true;
        const con = controlled[x][y];

        const N = board[x + 1]?.[y]; const n = liberties[x + 1]?.[y];
        const S = board[x - 1]?.[y]; const s = liberties[x - 1]?.[y];
        const E = board[x]?.[y + 1]; const e = liberties[x]?.[y + 1];
        const W = board[x]?.[y - 1]; const w = liberties[x]?.[y - 1];

        const boards1 = [N, S, E, W,];
        const liberties1 = [n, s, e, w];
        for (let board1 of boards1) {
          for (let libertie1 of liberties1) {
            if (isValidMove && board1 === 'O' && libertie1 === 1 && con !== 'X') {
              moveOptions.push([x, y]);
            }
          }
        }
      }
    };

    const randomIndex = Math.floor(Math.random() * moveOptions.length);
    return moveOptions[randomIndex] ?? [];
  };

  //Search random point
  const getRandomMove = (board, controlled, validMoves) => {
    const moveOptions = [];
    const size = board[0].length;
    // Look through all the points on the board
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // Make sure the point is a valid move
        const isValidMove = validMoves[x][y] === true;
        const N = board[x + 1]?.[y]; const NE = board[x + 1]?.[y + 1];
        const S = board[x - 1]?.[y]; const SE = board[x - 1]?.[y + 1];
        const E = board[x]?.[y + 1]; const SW = board[x - 1]?.[y - 1];
        const W = board[x]?.[y - 1]; const NW = board[x + 1]?.[y - 1];
        const board1s = [N, S, E, W, NE, SE, SW, NW];
        const con = controlled[x][y];
        const dis1 = N === 'O' && S === 'O' && E === 'O'
        const dis2 = N === 'O' && E === 'O' && W === 'O'
        const dis3 = E === 'O' && S === 'O' && W === 'O'
        const dis4 = N === 'O' && S === 'O' && W === 'O'
        const dis = dis1 || dis2 || dis3 || dis4

        for (let board1 of board1s) {
          if (isValidMove && con === '?' && board1 === 'O' && !dis) {//Make sure the pieces are not on either side's territory
            moveOptions.push([x, y]);
          }
        }
      }
    };

    const randomIndex = Math.floor(Math.random() * moveOptions.length);
    return moveOptions[randomIndex] ?? [];
  };

  let result, x, y, a, b, c, d, A, B;
  // let opponents = ['Slum Snakes', 'Slum Snakes', 'The Black Hand', 'Tetrads', 'Daedalus', 'Illuminati']
  // const resetBoard = ns.go.resetBoardState

  while (1) {
    ns.go.resetBoardState(ns.go.getOpponent(), 13);

    do {
      const board = ns.go.getBoardState();
      const controlled = ns.go.analysis.getControlledEmptyNodes();
      const liberties = ns.go.analysis.getLiberties();
      const validMoves = ns.go.analysis.getValidMoves();
      const [randX, randY] = getRandomMove(board, controlled, validMoves);
      const [randa, randb] = getRandomMove(board, controlled, validMoves);
      const [randc, randd] = getRandom(board, controlled);//Search opponent's territory
      const [rande, randf] = getRandom2(board, liberties, controlled, validMoves);

      // Choose a move from our options 
      x = randX; y = randY;
      a = randa; b = randb;
      c = randc; d = randd;
      A = rande; B = randf;

      try {//The logic to perform the action
        try {
          try {//Attempt to attack white
            result = await ns.go.makeMove(A, B);
          } catch {//Can't find a point of attack,Choose one of the found moves at random
            result = await ns.go.cheat.playTwoMoves(x, y, a, b);
          };
        } catch {//None of the above,Eliminate the opponent's territory
          result = await ns.go.cheat.destroyNode(c, d);
        };
      } catch {//If all actions cannot be performed, skip them
        result = await ns.go.passTurn();
      };

      ns.clearLog();
      ns.print(liberties);
      await ns.sleep(200);
      // Keep looping as long as the opponent is playing moves
    } while (result?.type !== "gameOver");

    // After the opponent passes, end the game by passing as well
    await ns.go.passTurn();
    await ns.asleep(1000);
  };
};
