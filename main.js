window.onload = function () {
    let WIN = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20
    };
    const funcs = [
        {
            f: (x) => x * x,
            color: '#f0f',
            width: 2,
        }
    ];
    const ui = new UI({ addFunction, delFunction });
    function addFunction(f, num) {
        funcs[num] = {
            f,
            color: '#f23',
            width: 3
        };
        render();
    };

    function delFunction(num) {
        funcs[num] = null;
        render();
    };

    let canMove = false;
    const mouseup = () => {
        canMove = false;
    }
    const mousedown = () => {
        canMove = true;
    }
    const mouseleave = () => {
        canMove = false;
    }
    const xs = x => {
        return (x - WIN.LEFT) / WIN.WIDTH * canvas.width;
    }
    const ys = y => {
        return (-(y - WIN.BOTTOM) + WIN.HEIGHT) / WIN.HEIGHT * canvas.height;
    }
    const mousemove = (event) => {
        if (canMove) {
            WIN.LEFT -= graph.sx(event.movementX);
            WIN.BOTTOM -= graph.sy(event.movementY);
            render();
        }
    }
    let a = document.getElementById('a');
    let b = document.getElementById('b');
    let button = document.getElementById('button');
    let result = document.getElementById('result');
    var graph = new Graph({
        id: 'canvas',
        width: 400,
        height: 400,
        WIN,
        callbacks: { wheel, mousemove, mouseleave, mouseup, mousedown }
    });
    function getZero(f, a, b, eps = 0.0001) {
        if (Math.abs(f(a)) + Math.abs(f(b)) <= 300) {
            if (f(a) * f(b) > 0) return null;
            if (f(a) === 0) return a;
            if (f(b) === 0) return b;
            if (Math.abs(f(a) - f(b)) <= eps) return (a + b) / 2;
            const half = (a + b) / 2;
            if (f(a) * f(half) <= 0) return getZero(f, a, half, eps);
            if (f(half) * f(b) <= 0) return getZero(f, half, b, eps);
        }
    }
    function getZeros(f, n = 300) {
        const segments = [];
        let a = WIN.LEFT;
        const dx = WIN.WIDTH / n;
        let b = WIN.LEFT;
        while (x <= WIN.WIDTH + WIN.LEFT) {
            if (f(a) * f(b) < 0) {
                segments.push({ a, b });
                a = b;
            }
            b += dx;
        }
        segments.forEach(({ a, b }) => getZero)
        console.log(segments);
    }
    var ZOOM_STEP = 0.2;
    function wheel(event) {
        let delta = (event.wheelDelta > 0) ? -ZOOM_STEP : ZOOM_STEP;
        if (WIN.WIDTH + delta >= 0) {
            WIN.WIDTH += delta;
            WIN.HEIGHT += delta;
            WIN.LEFT -= delta / 2;
            WIN.BOTTOM -= delta / 2;
        }
        render();
    }
    function printOXY() {
        graph.line(WIN.LEFT, 0, WIN.LEFT + WIN.WIDTH, 0, 'black');
        graph.line(0, WIN.BOTTOM, 0, WIN.BOTTOM + WIN.HEIGHT, 'black')
        for (let i = 0; i <= WIN.LEFT + WIN.WIDTH; i++) {
            graph.line(i, WIN.BOTTOM, i, WIN.BOTTOM + WIN.HEIGHT, 'blue', 1)
        }
        for (let i = 0; i <= WIN.HEIGHT + WIN.BOTTOM; i++) {
            graph.line(WIN.LEFT, i, WIN.LEFT + WIN.HEIGHT, i, 'blue', 1)
        }
        for (let i = 0; i >= WIN.LEFT; i--) {
            graph.line(i, WIN.BOTTOM, i, WIN.BOTTOM + WIN.HEIGHT, 'blue', 1)
        }
        for (let i = 0; i >= WIN.BOTTOM; i--) {
            graph.line(WIN.LEFT, i, WIN.LEFT + WIN.HEIGHT, i, 'blue', 1)
        }
    }
    function f(x) {
        return Math.tan(x);
    }
    function printFunction(f, n) {
        let x = WIN.LEFT;
        const dx = WIN.WIDTH / n;
        while (x <= WIN.WIDTH + WIN.LEFT) {
            graph.line(x, f(x), x + dx, f(x + dx));
            x += dx;
            if (getZero(f, x, x + dx, 0.0001) != null) {
                graph.point(getZero(f, x, x + dx, 0.0001), f(getZero(f, x, x + dx, 0.0001)), 'green', 2);
            }
        }
    }
    function render() {
        graph.clear();
        printOXY();
        funcs.forEach(func => func && printFunction(func.f, func.color, func.width))
    }
    render();
}
//текст для вывода подписи функции брать из самой функции
//подписать графики и нарисовать нули функции