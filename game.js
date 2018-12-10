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


// Создаем сласс Level
class Level {
    constructor(field = [], actors = []) {
        this.grid = field;
        this.actors = actors;
        this.player = actors.find((el) => {
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
            })
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

        /*  if (!(actor instanceof Actor)) {
              throw new Error('В actorAt() передан объект другого типа');
          } else {
              return this.actors.find((el) => {
                  return el.isIntersect(actor);
              })
          }*/
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

    }

    // Создаем Метод removeActor()
    removeActor(actor) {
        this.actors.forEach(function (el) {
            if (el === actor) {
                let index = this.actors.indexOf(el);
                this.actors.splice(index, 1);
            }
        })
    }

    // Создаем Метод noMoreActors()
    noMoreActors(type) {
        return this.actors.forEach(function (actor) {
            return (actor.type !== type);
        })
    }

    // Создаем Метод playerTouched()
    playerTouched(type, obj = {}) {
        if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
        } else if (type === 'coin' && obj.title === 'coin') {
            this.removeActor(obj);
            if (this.noMoreActors(type)) {
                return 'won';
            }
        }

    }

}


//Пример кода
const grid = [

    [undefined, undefined],
    ['wall', 'wall']
];

function MyCoin(title) {
    this.type = 'coin';
    this.title = title;
}

MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [goldCoin, bronzeCoin, player, fireball]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
    console.log('Все монеты собраны');
    console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
    console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
    console.log('Пользователь столкнулся с шаровой молнией');
}