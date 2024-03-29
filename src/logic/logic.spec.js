const expect = require('chai').expect;
const generateGrid = require('./generateGrid.js');
const createGame = require('./createGame.js')
const generateRandomCoordinates = require('./generateRandomCoordinates.js');
const checkBoats = require('./checkBoats.js');
const updateGrid = require('./updateGrid.js');
const tryToPlace = require('./tryToPlace.js');
const fire = require('./fire.js');
const computerStrategy = require('./computerStrategy.js');
const getStrategy = require('./getStrategy.js');

describe('generateGrid', () => {
    it('is a function', () => {
        expect(generateGrid).to.be.a('function');
    });
    it('returns an array', () => {
        expect(Array.isArray(generateGrid())).to.equal(true);
    });
    it('returns a 10x10 board when not given any input', () => {
        expect(generateGrid().length).to.equal(10);
    });
    it('returns a board as wide as we specify', () => {
        expect(generateGrid(10, 14).every(el => el.length === 10)).to.equal(true);
        expect(generateGrid(14, 9).every(el => el.length === 14)).to.equal(true);
    });
    it('returns a board as high as we specify', () => {
        expect(generateGrid(10, 14).length).to.equal(14);
        expect(generateGrid(15, 18).length).to.equal(18);
    });
    it('creates the correct size of board', () => {
        expect(generateGrid(10, 14).every(el => el.length === 10)).to.equal(true);
        expect(generateGrid(14, 10).length).to.equal(10);
    });
    it('each cell has an isShip boolean', () => {
        expect(generateGrid()[0][0]).to.haveOwnProperty("isShip")
        expect(generateGrid()[0][0].isShip).to.be.a("boolean")
    });
    it('each cell has an isDiscovered boolean', () => {
        expect(generateGrid()[0][0]).to.haveOwnProperty("isDiscovered")
        expect(generateGrid()[0][0].isDiscovered).to.be.a("boolean")
    });
    it('each cell has a length property', () => {
        expect(generateGrid()[0][0]).to.haveOwnProperty("length")
        expect(generateGrid()[0][0].length).to.equal(null)
    });
    it('each cell has a name property', () => {
        expect(generateGrid()[0][0]).to.haveOwnProperty("name")
        expect(generateGrid()[0][0].name).to.equal(null)
    });
});

describe('createGame', () => {
    it('is a function', () => {
        expect(createGame).to.be.a('function');
    });
    it('returns an object', () => {
        expect(typeof createGame()).to.equal('object');
    });
    it('returns a 10x10 grid when given no inputs', () => {
        expect(createGame().playerA.length).to.equal(10);
    });
    it('returns a 10x10 grid if the grid is too small', () => {
        expect(createGame([[[], [], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], [], []]]).playerA.length).to.equal(10);
        expect(createGame([[], [], [], [], [], [], [], [], [], []]).playerA.length).to.equal(10);
    });
    it('returns a grid with 5 ships when given no inputs', () => {
        expect(createGame().boats.length).to.equal(5);
    });
    it('returns the right number of ships', () => {
        const threeBoats = [
            {
                name: "Carrier",
                length: 5
            },
            {
                name: "Submarine",
                length: 3
            },
            {
                name: "Destroyer",
                length: 2
            },
        ]
        const fakeGameA = generateGrid()
        const fakeGameB = generateGrid()
        expect(createGame(fakeGameA, fakeGameB, threeBoats).boats.length).to.equal(3);
    });
    it('creates a grid which matches the ships', () => {
        const boats = [
            {
                name: "Carrier",
                length: 5
            },
            {
                name: "Submarine",
                length: 3
            },
            {
                name: "Destroyer",
                length: 2
            },
        ]
        const fakeGameA = generateGrid()
        const fakeGameB = generateGrid()
        const game = createGame(fakeGameA, fakeGameB, boats);
        const countOfBoats = boats.reduce((acc, boat) => {
            return acc + boat.length;
        }, 0)
        const countInGrid = game.playerA.reduce((acc, row) => {
            return acc + row.reduce((acc2, cell) => {
                return cell.isShip ? acc2 + 1 : acc2;
            }, 0);
        }, 0);
        expect(countOfBoats === countInGrid).to.equal(true);
    });
});

describe('generateRandomCoordinates', () => {
    it('is a function', () => {
        expect(generateRandomCoordinates).to.be.a('function');
    });
    it('returns an array', () => {
        expect(Array.isArray(generateRandomCoordinates())).to.equal(true);
    });
    it('returns an array of length 2', () => {
        expect(generateRandomCoordinates().length).to.equal(2);
    });
    it('returns 2 numbers', () => {
        expect(generateRandomCoordinates()[0]).to.be.a('number')
        expect(generateRandomCoordinates()[1]).to.be.a('number')
    });
});

describe('checkBoats', () => {
    it('is a function', () => {
        expect(checkBoats).to.be.a('function');
    });
    it('returns an array', () => {
        expect(Array.isArray(checkBoats())).to.equal(true);
    });
    it('returns an array of objects', () => {
        expect(checkBoats().every(boat => typeof boat === 'object')).to.equal(true);
    });
    it('returns standard boats if some boat does not have length', () => {
        const shortBoat = [
            {
                length: 0
            }
        ];
        const invisiboat = [
            {}
        ];
        const shortBoatInGroup = [
            {
                length: 2
            },
            {
                length: 5
            },
            {
                length: 0
            }
        ];
        expect(checkBoats(shortBoat).every(boat => boat.length)).to.equal(true);
        expect(checkBoats(invisiboat).every(boat => boat.length)).to.equal(true);
        expect(checkBoats(shortBoatInGroup).every(boat => boat.length)).to.equal(true);
        expect(checkBoats().every(boat => boat.length)).to.equal(true);
    });
    it('returns standard boats if some boat is too short', () => {
        const shortBoat = [
            {
                length: 1
            }
        ];
        const shortBoatInGroup = [
            {
                length: 2
            },
            {
                length: 5
            },
            {
                length: 1
            }
        ];
        expect(checkBoats(shortBoat).every(boat => boat.length > 1)).to.equal(true);
        expect(checkBoats(shortBoatInGroup).every(boat => boat.length > 1)).to.equal(true);
        expect(checkBoats().every(boat => boat.length > 1)).to.equal(true);
    });
    it('returns standard boats if some boat is too long', () => {
        const longBoat = [
            {
                length: 7
            }
        ];
        const niceBoat = [
            {
                length: 6
            }
        ];
        const longBoatInGroup = [
            {
                length: 2
            },
            {
                length: 7
            },
            {
                length: 1
            }
        ];
        expect(checkBoats(longBoat).every(boat => boat.length < 7)).to.equal(true);
        expect(checkBoats(longBoatInGroup).every(boat => boat.length < 7)).to.equal(true);
        expect(checkBoats(niceBoat).every(boat => boat.length < 7)).to.equal(true);
        expect(checkBoats().every(boat => boat.length < 7)).to.equal(true);
    });
    it('returns standard boats if there are too many boats', () => {
        const lotsOfBoats = [
            {
                length: 2
            },
            {
                length: 6
            },
            {
                length: 4
            },
            {
                length: 5
            },
            {
                length: 3
            },
            {
                length: 3
            },
            {
                length: 3
            },
            {
                length: 3
            },
            {
                length: 2
            }
        ];
        expect(checkBoats(lotsOfBoats).length < 10).to.equal(true);
    });
});

describe('fire', () => {
    it('is a function', () => {
        expect(fire).to.be.a('function');
    });
    it('returns null if no player', () => {
        expect(fire(null, generateGrid(), 0, 0)).to.equal(null);
    });
    it('returns null if no grid', () => {
        expect(fire('A', null, 0, 0)).to.equal(null);
    });
    it('returns null if no grid length', () => {
        expect(fire('A', [], 0, 0)).to.equal(null);
    });
    it('returns null if x is invalid', () => {
        expect(fire('A', generateGrid(), 11, 0)).to.equal(null);
    });
    it('returns null if y is invalid', () => {
        expect(fire('A', generateGrid(), 0, 11)).to.equal(null);
    });
    it('fires the right cell', () => {
        expect(fire('A', generateGrid(), 0, 0)[0][0].isDiscovered).to.equal(true);
        expect(fire('A', generateGrid(), 6, 2)[2][6].isDiscovered).to.equal(true);
        expect(fire('A', generateGrid(), 6, 2)[1][6].isDiscovered).to.equal(false);
        expect(fire('A', generateGrid(20, 20), 19, 19)[19][19].isDiscovered).to.equal(true);
    });
    it('returns an array if all present and correct', () => {
        expect(Array.isArray(fire('A', generateGrid(), 0, 0))).to.equal(true);
    });
});

describe('computerStrategy', () => {
    it('is a function', () => {
        expect(computerStrategy).to.be.a('function');
    });
    it('returns an object', () => {
        expect(typeof computerStrategy()).to.equal('object');
    });
    it('has three key value pairs', () => {
        expect(computerStrategy()).to.haveOwnProperty('next');
        expect(computerStrategy()).to.haveOwnProperty('plan');
        expect(computerStrategy()).to.haveOwnProperty('lastTry');
    });
    it('has values which are all arrays', () => {
        expect(Array.isArray(computerStrategy().next)).to.equal(true);
        expect(Array.isArray(computerStrategy().plan)).to.equal(true);
        expect(Array.isArray(computerStrategy().lastTry)).to.equal(true);
    });
    it('returns default if there is no grid', () => {
        const input = {
            next: [],
            plan: [],
            lastTry: []
        }
        expect(computerStrategy(input)).to.equal(input);
        expect(computerStrategy(input)).to.equal(input);
        expect(computerStrategy(input)).to.equal(input);
    });
    it('returns a plan if there is none', () => {
        const strategy = {
            next: [],
            plan: [],
            lastTry: []
        }
        const grid = [
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: true, isDiscovered: false}, 
                {isShip: true, isDiscovered: false}, 
                {isShip: true, isDiscovered: false}, 
                {isShip: true, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ]
        ];
        expect(computerStrategy(strategy, grid).plan.length > 0).to.equal(true);
    });
    it('fires the planned cell', () => {
        const strategy = {
            next: [],
            plan: [[0, 0], [1, 1]],
            lastTry: []
        }
        const output = {
            next: [],
            plan: [[1, 1]],
            lastTry: [0, 0]
        }
        const grid = [
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ]
        ];
        expect(computerStrategy(strategy, grid)).to.eql(output);
    });
    it('changes tack if it finds a ship', () => {
        const strategy = {
            next: [],
            plan: [[0, 0], [1, 1], [2, 2]],
            lastTry: []
        }
        const output = {
            next: [[1, 0], [0, 1]],
            plan: [[1, 1], [2, 2]],
            lastTry: [0, 0]
        }
        const grid = [
            [
                {isShip: true, isDiscovered: false}, 
                {isShip: true, isDiscovered: false}, 
                {isShip: true, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ],
            [
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}, 
                {isShip: false, isDiscovered: false}
            ]
        ];
        expect(computerStrategy(strategy, grid)).to.eql(output);
    });
});

describe('getStrategy', () => {
    it('is a function', () => {
        expect(getStrategy).to.be.a('function');
    });
    it('returns an array', () => {
        expect(Array.isArray(getStrategy())).to.equal(true);
    });
    it('returns an array with length if a grid is passed', () => {
        const grid = [[[], [], []], [[], [], []], [[], [], []]]
        expect(getStrategy(grid).length > 0).to.equal(true);
    });
    it('returns an array of arrays of pairs of numbers when there is a grid', () => {
        const grid = [[[], [], []], [[], [], []], [[], [], []]]
        const result = getStrategy(grid)
        expect(typeof result[0][0][0]).to.equal('number') ||
        expect(typeof result[0][0][1]).to.equal('number') ||
        expect(typeof result[0][1][0]).to.equal('number');
        expect(Array.isArray(result)).to.equal(true);
    });
});