function Graph({ id, width = 300, height = 300, WIN, callbacks }) {
    let canvas;
    const { wheel, mousemove, mouseleave, mouseup, mousedown } = callbacks;
    if (id) {
        canvas = document.getElementById(id);
    } else {
        canvas = document.createElement('canvas');
        document.querySelector('body').appendChild(canvas);
    }
    canvas.addEventListener('wheel',wheel);
    canvas.addEventListener('mousemove',mousemove);
    canvas.addEventListener('mouseleave',mouseleave);
    canvas.addEventListener('mousedown',mousedown);
    canvas.addEventListener('mouseup',mouseup);
    this.sx=x=>x*WIN.WIDTH/canvas.width;
    this.sy=y=>-y*WIN.HEIGHT/canvas.height;
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    canvas.addEventListener('wheel', callbacks.wheel);
    var PI2 = Math.PI * 2;
    function xs(x) {
        return (x - WIN.LEFT) / WIN.WIDTH * canvas.width;
    }
    function ys(y) {
        return (-(y - WIN.BOTTOM) + WIN.HEIGHT) / WIN.HEIGHT * canvas.height;
    }
    this.clear = function () {
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    this.line = function (x1, y1, x2, y2, color, width) {
        context.beginPath();
        context.strokeStyle = color || 'red';
        context.lineWidth = width || 2;
        context.moveTo(xs(x1), ys(y1));
        context.lineTo(xs(x2), ys(y2));
        context.stroke();
        context.closePath();
    }
    this.point = function (x, y, color, size) {
        context.beginPath();
        context.strokeStyle = color || '#f00';
        context.fillStyle = color || '#f00';
        context.arc(xs(x), ys(y), size || 2, 0, PI2);
        context.fill();
        context.stroke();
        context.closePath();
    }
}