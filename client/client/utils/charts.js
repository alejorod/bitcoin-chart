function quadratic(p1, p2, p3, x) {
  return {
    x: (1 - x) * (1 - x) * p1.x + 2 * (1 - x) * x * p2.x + x * x * p3.x,
    y: (1 - x) * (1 - x) * p1.y + 2 * (1 - x) * x * p2.y + x * x * p3.y
  };
}

function setUpCanvas(canvas, $el, ctx) {
  canvas.width = $el.clientWidth;
  canvas.height = $el.clientHeight;
  canvas.onmousemove = ctx.onMouseMove.bind(ctx);
  canvas.onmouseleave = ctx.onMouseLeave.bind(ctx);
  window.addEventListener('resize', ctx.onReSize.bind(ctx));
}

export default class Chart {
  constructor({el, data, xRange, colors}) {
    this.target = el;
    this.rawData = data;
    this.colors = colors;
    this.data = this.parseData(data, xRange);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.$el = document.getElementById(this.target);
    this.$el.appendChild(this.canvas);
    setUpCanvas(this.canvas, this.$el, this);
  }

  parseData(data, xRange) {
    var d = {
      minX: xRange[0],
      maxX: xRange[1],
      minY: null,
      maxY: null,
      lines: {}
    };

    data.forEach(i => {
      Object.keys(i).forEach((k) => {
        d.lines[k] = d.lines[k] || [];
        d.lines[k].push(i[k]);
      });
    });

    d.minY = Math.min.apply(null, Object.keys(d.lines).map(k => {
      return Math.min.apply(null, d.lines[k]);
    }));

    d.maxY = Math.max.apply(null, Object.keys(d.lines).map(k => {
      return Math.max.apply(null, d.lines[k]);
    }));

    return d;
  }

  transformCoords(x, y) {
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
    let min = this.data.minY - 6;
    let max = this.data.maxY + 6;

    return {
      x: x * width / this.data.maxX,
      y: (-1) * (min * height / (min - max)) * (-y / min + 1) + height
    }
  }

  draw() {
    let keys = Object.keys(this.data.lines);

    this.ctx.lineWidth = 2;

    keys.forEach(k => {
      let begin, end, x, y;
      let lineData = this.data.lines[k];

      this.ctx.strokeStyle = this.colors[k];
      this.ctx.fillStyle = this.colors[k];

      this.ctx.beginPath();
      for (var i = 0; i < lineData.length - 1; i++) {
        begin = this.transformCoords(i, lineData[i]);
        end = this.transformCoords(i + 1, lineData[i + 1]);
        x = (begin.x + end.x) / 2;
        y = (begin.y + end.y) / 2;
        this.ctx.quadraticCurveTo(begin.x, begin.y, x, y);
      }
      this.ctx.stroke();

      begin = this.transformCoords(
        lineData.length - 2,
        lineData[lineData.length - 2]
      );

      end = this.transformCoords(
        lineData.length - 1,
        lineData[lineData.length - 1]
      );

      this.ctx.beginPath();
      this.ctx.arc(
        (begin.x + end.x) / 2,
        (begin.y + end.y) / 2,
        5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  onMouseMove(e) {
    let rect = this.canvas.getBoundingClientRect();
    let w = rect.width / this.data.maxX;
    let realX = e.clientX - rect.left;
    let index = Math.floor((e.clientX - rect.left + w / 2) / w);
    let keys = Object.keys(this.data.lines);
    let values = keys.filter(k => {
      return this.data.lines[k][index - 1] && this.data.lines[k][index + 1];
    }).map(k => {
      let p1 = this.data.lines[k][index - 1];
      let p2 = this.data.lines[k][index];
      let p3 = this.data.lines[k][index + 1];

      p1 = this.transformCoords(index - 1, p1);
      p2 = this.transformCoords(index, p2);
      p3 = this.transformCoords(index + 1, p3);

      p1.x = (p1.x + p2.x) / 2;
      p1.y = (p1.y + p2.y) / 2;

      p3.x = (p2.x + p3.x) / 2;
      p3.y = (p2.y + p3.y) / 2;

      let tx = (realX - p1.x) / (p3.x - p1.x);

      return {
        color: this.colors[k],
        point: quadratic(p1, p2, p3, tx)
      };
    });

    this.ctx.clearRect(0, 0, rect.width, rect.height);
    this.ctx.strokeStyle = '#121527';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(realX, 0);
    this.ctx.lineTo(realX, rect.height);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#fdfdfd';
    for (var i = 0; i < values.length - 1; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(values[i].point.x, values[i].point.y);
      this.ctx.lineTo(values[i + 1].point.x, values[i + 1].point.y);
      this.ctx.stroke();
    }

    values.forEach(v => {
      this.ctx.fillStyle = v.color;
      this.ctx.beginPath();
      this.ctx.arc(v.point.x, v.point.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.draw();
  }

  onMouseLeave(e) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw();
  }

  onReSize(e) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = this.$el.clientWidth;
    this.canvas.height = this.$el.clientHeight;
    this.draw();
  }
}
