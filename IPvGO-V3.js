const getTerritory = (board, controlled) => {
	const moveOptions = [];
	const size = board[0].length;

	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {

			if (controlled[x][y] === 'O' && board[x][y] === 'O') {
				moveOptions.push([x, y]);
			};
		};
	};

	const randomIndex = Math.floor(Math.random() * moveOptions.length);
	return moveOptions[randomIndex] ?? [];
};

//Contend
const getContendMove = (board, controlled, validMoves) => {
	const moveOptions = [];
	const size = board[0].length;
	// Look through all the points on the board
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			// Make sure the point is a valid move
			const isValidMove = validMoves[x][y] === true;
			// const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;
			const isControlled = controlled[x][y] === '?'
			const N = board[x + 1]?.[y]; const NE = board[x + 1]?.[y + 1];
			const S = board[x - 1]?.[y]; const SE = board[x - 1]?.[y + 1];
			const E = board[x]?.[y + 1]; const SW = board[x - 1]?.[y - 1];
			const W = board[x]?.[y - 1]; const NW = board[x + 1]?.[y - 1];
			const board1s = [N, S, E, W, NE, SE, SW, NW];
			const isBoard1s = board1s.find(item => item === 'O');

			if (isValidMove && isControlled && isBoard1s) {
				moveOptions.push([x, y]);
			}
		}
	};

	const randomIndex = Math.floor(Math.random() * moveOptions.length);
	return moveOptions[randomIndex] ?? [];
};

//Random
const getRandomMove = (board, controlled, validMoves) => {
	const moveOptions = [];
	const size = board[0].length;

	// Look through all the points on the board
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			// Make sure the point is a valid move
			const isValidMove = validMoves[x][y] === true;
			// Leave some spaces to make it harder to capture our pieces.
			// We don't want to run out of empty node connections!
			const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;
			const isControlled = controlled[x][y] === '?'

			if (isValidMove && isNotReservedSpace && isControlled) {
				moveOptions.push([x, y]);
			}
		}
	}

	// Choose one of the found moves at random
	const randomIndex = Math.floor(Math.random() * moveOptions.length);
	return moveOptions[randomIndex] ?? [];
};
//Attack
const getAttackMove = (board, controlled, liberties, validMoves) => {
	const moveOptions = [];
	const size = board[0].length;

	// Look through all the points on the board
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			// Make sure the point is a valid move
			const isValidMove = validMoves[x][y] === true;
			// Leave some spaces to make it harder to capture our pieces.
			// We don't want to run out of empty node connections!
			// const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;
			const isControlled = controlled[x][y] !== 'X'
			const N = board[x + 1]?.[y]; const n = liberties[x + 1]?.[y];
			const S = board[x - 1]?.[y]; const s = liberties[x - 1]?.[y];
			const E = board[x]?.[y + 1]; const e = liberties[x]?.[y + 1];
			const W = board[x]?.[y - 1]; const w = liberties[x]?.[y - 1];
			const boards1 = [N, S, E, W,]; const liberties1 = [n, s, e, w];
			const isBoards1 = boards1.find(item => item === 'O');
			const isLiberties1 = liberties1.find(item => item === 1);

			if (isValidMove && isControlled && isBoards1 && isLiberties1) {
				moveOptions.push([x, y]);
			}

		}
	}

	// Choose one of the found moves at random
	const randomIndex = Math.floor(Math.random() * moveOptions.length);
	return moveOptions[randomIndex] ?? [];
};
//Defense
const getDefenseMove = (board, controlled, liberties, validMoves) => {
	const moveOptions = [];
	const size = board[0].length;

	// Look through all the points on the board
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			// Make sure the point is a valid move
			const isValidMove = validMoves[x][y] === true;
			const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;
			const isControlled = controlled[x][y] === '?'
			const N = board[x + 1]?.[y]; const n = liberties[x + 1]?.[y];
			const S = board[x - 1]?.[y]; const s = liberties[x - 1]?.[y];
			const E = board[x]?.[y + 1]; const e = liberties[x]?.[y + 1];
			const W = board[x]?.[y - 1]; const w = liberties[x]?.[y - 1];
			const boards1 = [N, S, E, W,]; const liberties1 = [n, s, e, w];
			const isBoards1 = boards1.find(item => item === 'X');
			const isLiberties1 = liberties1.find(item => item === 1);

			if (isValidMove && isControlled && isBoards1 && isLiberties1 && isNotReservedSpace) {
				moveOptions.push([x, y]);
			}
		}
	};

	// Choose one of the found moves at random
	const randomIndex = Math.floor(Math.random() * moveOptions.length);
	return moveOptions[randomIndex] ?? [];
};

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL'); ns.tail();
	let opponents = ["Netburners", "Slum Snakes", "The Black Hand", "Tetrads", "Daedalus", "Illuminati", "????????????"]
	let result, x, y, xa, ya, xd, yd, xc, yc, xt, yt, xa1, ya1;

	while (true) {

		const reset = ns.go.resetBoardState;
		const getOpponent = ns.go.getOpponent();
		// for (let i = 0; i < opponents.length; i++) {
		// 	if (ns.go.cheat.getCheatSuccessChance() < 0.5) {
		// 		reset(opponents[1], 13);
		// 	} else if (ns.hacknet.hashCapacity() < 20e6) {
		// 		reset(opponents[0], 13);
		// 	} else if (ns.getPlayer().money < 1e12) {
		// 		reset(opponents[2], 13);
		// 	} else if (ns.getHackingLevel < 5000) {
		// 		reset(opponents[3], 13);
		// 	} else if (ns.getHackingLevel < 10000) {
		// 		reset(opponents[4], 13);
		// 	} else if (ns.getHackingLevel < 15000) {
		// 		reset(opponents[5], 13);
		// 	} else {
		// 		reset(opponents[6], 13);
		// 	}
		// };

		reset(getOpponent, 13);//Reset to the current opponent

		do {
			// const getstates = ns.go.analysis.getStats();
			// const getChainss = ns.go.analysis.getChains();
			const cheatsucces = ns.go.cheat.getCheatSuccessChance();
			const board = ns.go.getBoardState();
			const validMoves = ns.go.analysis.getValidMoves();
			const controlled = ns.go.analysis.getControlledEmptyNodes();
			const liberties = ns.go.analysis.getLiberties();
			const bScore = ns.go.getGameState().blackScore;
			const wScore = ns.go.getGameState().whiteScore;
			const [ranX, ranY] = getRandomMove(board, controlled, validMoves);
			const [attX, attY] = getAttackMove(board, controlled, liberties, validMoves);
			const [defX, defY] = getDefenseMove(board, controlled, liberties, validMoves);
			const [conX, conY] = getContendMove(board, controlled, validMoves);
			const [conX1, conY1] = getContendMove(board, controlled, validMoves);
			const [treX, treY] = getTerritory(board, controlled);
			// TODO: more move options

			// Choose a move from our options
			x = ranX; xa = attX; xa1 = conX1; xd = defX; xc = conX; xt = treX
			y = ranY; ya = attY; ya1 = conY1; yd = defY; yc = conY; yt = treY

			try {
				try {
					try {
						try {
							try {
								if (cheatsucces > 0.5 && bScore < wScore) {
									result = await ns.go.cheat.playTwoMoves(xa1, ya1, xc, yc);
								} else { await ns.go.makeMove(xa, ya); }
							} catch {
								result = await ns.go.makeMove(xa, ya);
							}
						} catch {
							result = await ns.go.makeMove(xd, yd);
						}
					} catch {
						result = await ns.go.makeMove(xc, yc);
					}
				} catch {
					result = await ns.go.makeMove(x, y);
				}
			} catch {
				result = await ns.go.passTurn();
			}

			ns.clearLog();
			ns.print(`Opponent    : ${getOpponent}`);
			ns.print(`CheatChance : ${ns.formatPercent(cheatsucces)}`);
			ns.print(`BlackScore  : ${bScore}`);
			ns.print(`WhiteScore  : ${wScore}`);
			ns.print('╔═════════════╣Liberties╠══════════════╗');
			const padding = (num, length) => (Array(length).join("0") + num).slice(-length);
			liberties.map(xx => xx.map(yy => padding(yy, 2))).forEach(o => ns.print(`║${o.join(',')}║`));
			ns.print('╚══════════════════════════════════════╝');

			// Log opponent's next move, once it happens
			await ns.go.opponentNextTurn();
			await ns.sleep(200);

			// Keep looping as long as the opponent is playing moves
		} while (result?.type !== "gameOver");

		await ns.sleep(200);
	};
};
