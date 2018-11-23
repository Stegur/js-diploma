'use strict';

// Создаем сласс Vector
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Создаем метод plus()
    plus(vector) {
        try {
            if (vector instanceof Vector) {
                return new Vector(vector.x + this.x, vector.y + this.y);
            } else {
                throw 'Можно прибавлять к вектору только вектор типа Vector';
            }
        } catch (e) {
            new Error(e);
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


// Создаем сласс Vector
class Actor {
    constructor(position = new Vector(), size = new Vector(1, 1), speed = new Vector()) {

        try {
            // исключение если position не является Vector
            if (!(position instanceof Vector)) {
                throw 'В конструктор Actor передан аргумент position неявляющийся Vector';

                // исключение если size не является Vector
            } else if (!(size instanceof Vector)) {
                throw 'В конструктор Actor передан аргумент size неявляющийся Vector';

                // исключение если speed не является Vector
            } else if (!(speed instanceof Vector)) {
                throw 'В конструктор Actor передан аргумент speed неявляющийся Vector';
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

            // Определяем свойство только для чтения left, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.
            Object.defineProperty(this, 'left', {
                value: this.pos.x,
            });

            // Определяем свойство только для чтения top, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.
            Object.defineProperty(this, 'top', {
                value: this.pos.y,
            });

            // Определяем свойство только для чтения right, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.
            Object.defineProperty(this, 'right', {
                value: this.pos.x + this.size.x,
            });

            // Определяем свойство только для чтения bottom, в котором установлены границы объекта по осям X и Y с учетом его расположения и размера.
            Object.defineProperty(this, 'bottom', {
                value: this.pos.y + this.size.y,
            });

            // Определяем свойство type со значением actor, только для чтения
            Object.defineProperty(this, 'type', {
                value: 'actor',
            });


        } catch (e) {
            new Error(e);
        }
    }

    // Создаем метод isIntersect()
    isIntersect(actor) {
        try {
            if (!(actor instanceof Actor)) {
                throw 'Передан объект другого типа'
            } else if (arguments.length === 0) {
                throw 'Объект вызван без аргументов'
            } else if (actor === this) {
                return false;
            }

            if (this.pos === actor.pos) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            new Error(e);
        }
    }
}

// // Проверка
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