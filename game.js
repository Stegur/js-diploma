'use strict';

// Создаем сласс Vector
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Создаем метод plus()
    plus(vector) {

        if (vector instanceof Vector) {
            return new Vector(vector.x + this.x, vector.y + this.y);
        } else {
            throw new Error('Можно прибавлять к вектору только вектор типа Vector');
        }

    }

    // Создаем метод times()
    times(num) {
        return new Vector(this.x * num, this.y * num);
    }
}


// //Проверка
// const start = new Vector(30, 50);
// const moveTo = new Vector(5, 10);
// const finish = start.plus(moveTo.times(2));
//
// console.log(`Исходное расположение: ${start.x}:${start.y}`);
// console.log(`Текущее расположение: ${finish.x}:${finish.y}`);


// Создаем класс Vector
class Actor {
    constructor(position = new Vector(), size = new Vector(1, 1), speed = new Vector()) {


        // исключение если position не является Vector
        if (!(position instanceof Vector && size instanceof Vector && speed instanceof Vector)) {
            throw new Error('В конструктор Actor передан аргумент position неявляющийся Vector');
        }

        // определвем свойство pos, в котором размещен Vector
        this.pos = position;

        // определвем свойство size, в котором размещен Vector
        this.size = size;

        // определвем свойство speed, в котором размещен Vector
        this.speed = speed;

        // определвем метод act, который ничего не делает
        this.act = function () {
        };


    }

    // Определяем свойство только для чтения left, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.

    get left() {
        return this.pos.x;
    };

    // Определяем свойство только для чтения top, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.

    get top() {
        return this.pos.y;
    };

    // Определяем свойство только для чтения right, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.

    get right() {
        return this.pos.x + this.size.x;
    };

    // Определяем свойство только для чтения bottom, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.

    get bottom() {
        return this.pos.y + this.size.y;
    };

    // Определяем свойство type со значением actor, только для чтения

    get type() {
        return 'actor';
    };

    // Создаем метод isIntersect()
    isIntersect(actor) {

        if (!(actor instanceof Actor)) {
            throw new Error('Передан объект другого типа');
        } else if (arguments.length === 0) {
            throw new Error('Объект вызван без аргументов');
        } else if (actor === this) {
            return false;
        }


        return !((this.bottom <= actor.top) || (this.top >= actor.bottom) ||
            (this.left >= actor.right) || (this.right <= actor.left));

    }

}


// Проверка

// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));
//
// function position(item) {
//     return ['left', 'top', 'right', 'bottom']
//         .map(side => `${side}: ${item[side]}`)
//         .join(', ');
// }
//
// function movePlayer(x, y) {
//     player.pos = player.pos.plus(new Vector(x, y));
// }
//
// function status(item, title) {
//     console.log(`${title}: ${position(item)}`);
//     if (player.isIntersect(item)) {
//         console.log(`Игрок подобрал ${title}`);
//     }
// }
//
// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);


// Создаем класс Level
class Level {
    constructor(field = [], actors = []) {
        this.grid = field;
        this.actors = actors;
        this.player = this.actors.find((el) => {
            return el.type === 'player'
        });

        if (this.grid.length === 0) {
            this.height = 0;
            this.width = 0;
        } else {
            this.height = this.grid.length;
            this.width = this.grid.reduce(function (max, el) {
                const maxWidth = max.length;
                const width = el.length;
                return maxWidth > width ? maxWidth : width;
            }, [['']])
        }
        this.status = null;
        this.finishDelay = 1;
    }

    // Создаем Метод isFinished()
    isFinished() {
        return this.status !== null && this.finishDelay < 0;
    }

    // Создаем Метод actorAt()
    actorAt(actor) {

        if (!(actor instanceof Actor)) {
            throw new Error('В actorAt() передан объект другого типа');
        } else {
            return this.actors.find(el => el.isIntersect(actor))
        }
    }

    // Создаем Метод obstacleAt()
    obstacleAt(pos, size) {

        if (!(pos instanceof Vector) || !(size instanceof Vector)) {
            throw new Error('В obstacleAt() передан объект другого типа');
        }
        let obj = new Actor(pos, size);
        if (obj.left < 0 || obj.right > this.width || obj.top < 0) {
            return 'wall';
        } else if (obj.bottom > this.height) {
            return 'lava';
        }

        let left = Math.floor(obj.left);
        let right = Math.ceil(obj.right);
        let top = Math.floor(obj.top);
        let bottom = Math.ceil(obj.bottom);

        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                if (this.grid[y][x]) {
                    return this.grid[y][x];
                }
            }
        }

    }

    // Создаем Метод removeActor()
    removeActor(actor) {
        let index = this.actors.indexOf(actor);
        if (index >= 0) {
            this.actors.splice(index, 1);
        }
    }

    // Создаем Метод noMoreActors()
    noMoreActors(type) {
        return !this.actors.some(actor => actor.type == type)
    }

    // Создаем Метод playerTouched()
    playerTouched(type, obj = {}) {
        if (this.status === null) {
            if (type === 'lava' || type === 'fireball') {
                this.status = 'lost';
            } else if (type === 'coin' && obj.title === 'coin') {
                this.removeActor(obj);
                if (this.noMoreActors('coin')) {
                    return 'won';
                }
            }

        }
    }
}


// //Пример кода
// const grid = [
//
//     [undefined, undefined],
//     ['wall', 'wall']
// ];
//
// function MyCoin(title) {
//     this.type = 'coin';
//     this.title = title;
// }
//
// MyCoin.prototype = Object.create(Actor);
// MyCoin.constructor = MyCoin;
//
// const goldCoin = new MyCoin('Золото');
// const bronzeCoin = new MyCoin('Бронза');
// const player = new Actor();
// const fireball = new Actor();
//
// const level = new Level(grid, [goldCoin, bronzeCoin, player, fireball]);
//
// level.playerTouched('coin', goldCoin);
// level.playerTouched('coin', bronzeCoin);
//
// if (level.noMoreActors('coin')) {
//     console.log('Все монеты собраны');
//     console.log(`Статус игры: ${level.status}`);
// }
//
// const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
// if (obstacle) {
//     console.log(`На пути препятствие: ${obstacle}`);
// }
//
// const otherActor = level.actorAt(player);
// if (otherActor === fireball) {
//     console.log('Пользователь столкнулся с шаровой молнией');
// }


// Создаем класс LevelParser

class LevelParser {
    constructor(dict) {
        this.dict = dict;
    }

    // создаем метод actorFromSymbol()
    actorFromSymbol(symbol) {
        if (symbol === undefined) {
            return undefined;
        } else {
            return this.dict[symbol];
        }
    }

    // создаем метод actorFromSymbol()
    obstacleFromSymbol(symbol) {
        if (symbol === 'x') {
            return 'wall';
        } else if (symbol === '!') {
            return 'lava';
        } else {
            return undefined;
        }
    }

    // создаем метод createGrid()
    createGrid(arr) {
        if (arr.length === 0) {
            return [];
        } else {
            let plan = [];
            for (let i = 0; i < arr.length; i++) {
                plan.push([arr[i]]);
            }
            return plan;
        }
        // this.obstacleFromSymbol()
    }

    // создаем метод createActors()
    createActors(arr) {
        if (arr.length === 0) {
            return [];
        }
        // this.actorFromSymbol()
    }

    // создаем метод parse()
    parse(arr) {
        return new Level(this.createGrid(), this.createActors())

    }
}


// Пример использования

// const plan = [
//     ' @ ',
//     'x!x'
// ];
//
// const actorsDict = Object.create(null);
// actorsDict['@'] = Actor;
//
// const parser = new LevelParser(actorsDict);
// const level = parser.parse(plan);
//
// level.grid.forEach((line, y) => {
//     line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
// });
//
// level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));


// Создаем класс Fireball

class Fireball extends Actor {
    constructor(position = new Vector(0, 0), speed = new Vector(0, 0)) {
        super(position, speed);
        this.position = position;
        this.speed = speed;
    }

    get type() {
        return 'fireball';
    };

    // создание метода getNextPosition()
    getNextPosition(time = 1) {
        return new Vector(this.position.x + (this.speed.x * time), this.position.y + (this.speed.y * time))
    } // одно из самых понятных для меня описаний

    // создание метода handleObstacle()
    handleObstacle() {
        this.speed.x -= this.speed.x * 2;
        this.speed.y -= this.speed.y * 2;
    }

    // создание метода act()
    act(time, plan) {
        let nextPosition = this.getNextPosition(time);
        if (!plan.obstacleAt(nextPosition, this.size)) { // запутался в методах, какой отрабатывает столкновение?
            this.position = nextPosition;
        } else {
            this.handleObstacle();
        }
    }
}


// Пример использования
// const time = 5;
// const speed = new Vector(1, 0);
// const position = new Vector(5, 5);
//
// const ball = new Fireball(position, speed);
//
// const nextPosition = ball.getNextPosition(time);
// console.log(`Новая позиция: ${nextPosition.x}: ${nextPosition.y}`);
//
// ball.handleObstacle();
// console.log(`Текущая скорость: ${ball.speed.x}: ${ball.speed.y}`);


// создание класса HorizontalFireball
class HorizontalFireball {
    constructor(position) { // при столкновении с препятствием движется в обратную сторону.
        return new Fireball(new Vector(position.x, position.y), new Vector(2, 0)); // как передать его размеры, если у Fireball только 2 агрумента?
    }
}

// создание класса VerticalFireball
class VerticalFireball {
    constructor(position) { // при столкновении с препятствием движется в обратную сторону.
        return new Fireball(new Vector(position.x, position.y), new Vector(0, 2)); // как передать его размеры, если у Fireball только 2 агрумента?
    }
}

// создание класса FireRain
class FireRain {
    constructor(position) { // при столкновении с препятствием начинает движение в том же направлении из исходного положения, которое задано при создании.
        return new Fireball(new Vector(position.x, position.y), new Vector(0, 3)); // как передать его размеры, если у Fireball только 2 агрумента?
    }
}

// создание класса Coin
class Coin extends Actor {
    constructor(position) {
        super();
        this.size.x = 0.6;
        this.size.y = 0.6;
        this.pos.x = position.x + 0.2;
        this.pos.y = position.y + 0.1;
        this.springSpeed = 8;
        this.springDist = 0.07; // или свойства делаем через get? Хотя тесты не работают ни так ни так((
        this.spring = Math.random() * Math.PI;

    }

    get type() {
        return 'coin';
    }

    get springDist() {
        return 0.07;
    }

    // создаем метод spring()
    updateSpring(time = 1) {
        this.spring += this.springSpeed * time;
    }

    // создаем метод getSpringVector()
    getSpringVector() {
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    }

    // создаем метод getNextPosition()
    getNextPosition(time = 1) {
        this.updateSpring(time); // как использовать time?
        return new Vector(this.pos.x + this.getSpringVector().x, this.pos.y + this.getSpringVector().y);
    }

    // моздаем метод act()
    act(time) {
        this.pos = this.getNextPosition(time);
    }
}

// Создаем класс Player
class Player extends Actor {
    constructor(position) {
        super();
        this.pos.x = position.x - 0;
        this.pos.y = position.y - 0.5;
        this.size.x = 0.8;
        this.size.y = 1.5;
        this.speed.x = 0;
        this.speed.y = 0;
    }

    get type() {
        return 'player';
    }
}