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
            if (!(vector instanceof Vector)) {
                throw 'Можно прибавлять к вектору только вектор типа Vector';
            }
            return new Vector(vector.x + this.x, vector.y + this.y);
        } catch (e) {
            console.error(e);
        }
    }

    // Создаем метод times()
    times(num) {
        return new Vector(this.x * num, this.y * num);
    }
}
