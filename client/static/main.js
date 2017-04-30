var Chart = (function(document) {

  function quadratic(p1, p2, p3, x) {
    return {
      x: (1 - x) * (1 - x) * p1.x + 2 * (1 - x) * x * p2.x + x * x * p3.x,
      y: (1 - x) * (1 - x) * p1.y + 2 * (1 - x) * x * p2.y + x * x * p3.y
    };
  }

  class Chart {
    constructor(target, data, xRange) {
      this.target = target;
      this.$el = document.getElementById(this.target);
      this.rawData = data;
      this.data = this.parseData(data, xRange);
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.$el.clientWidth;
      this.canvas.height = this.$el.clientHeight;
      this.canvas.onmousemove = this.onMouseMove.bind(this);
      this.canvas.onmouseleave = this.onMouseLeave.bind(this);
      window.addEventListener('resize', this.onReSize.bind(this));
      this.ctx = this.canvas.getContext('2d');
      this.$el.appendChild(this.canvas);
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
      let colors = {
        sell: {
          line: '#bdf1c7',
          dot: '#bdf1c7'
        },
        buy: {
          line: '#7ec9e8',
          dot: '#7ec9e8'
        }
      };

      let keys = Object.keys(this.data.lines);

      this.ctx.strokeStyle = '#15192d';
      this.ctx.lineWidth = 2;
      keys.forEach(k => {
        this.ctx.strokeStyle = colors[k].line;
        this.ctx.fillStyle = colors[k].dot;
        let lineData = this.data.lines[k];
        this.ctx.beginPath();
        for (var i = 0; i < lineData.length - 2; i++) {
          let a = this.transformCoords(i, lineData[i]);
          let c = this.transformCoords(i + 1, lineData[i + 1]);
          let x = (a.x + c.x) / 2;
          let y = (a.y + c.y) / 2;
          this.ctx.quadraticCurveTo(a.x, a.y, x, y);
        }
        this.ctx.stroke();
        let o = this.transformCoords(
          lineData.length - 3,
          lineData[lineData.length - 3]
        );
        let coord = this.transformCoords(
          lineData.length - 2,
          lineData[lineData.length - 2]
        );
        this.ctx.beginPath();
        this.ctx.moveTo((o.x + coord.x) / 2, (o.y + coord.y) / 2);
        this.ctx.lineTo(coord.x, coord.y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(coord.x, coord.y, 5, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    onMouseMove(e) {
      let colors = {
        sell: {
          line: '#bdf1c7',
          dot: '#bdf1c7'
        },
        buy: {
          line: '#7ec9e8',
          dot: '#7ec9e8'
        }
      };
      let rect = this.canvas.getBoundingClientRect();
      let w = rect.width / this.data.maxX;
      let index = Math.floor((e.clientX - rect.left + w / 2) / w);
      let x = index * w;
      this.ctx.clearRect(0, 0, rect.width, rect.height);
      this.draw();
      this.ctx.strokeStyle = '#121527';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, rect.height);
      this.ctx.stroke();

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

        let tx = (x - p1.x) / (p3.x - p1.x);

        return {
          color: colors[k].dot,
          point: quadratic(p1, p2, p3, tx)
        };
      });

      values.forEach(v => {
        this.ctx.fillStyle = v.color;
        this.ctx.beginPath();
        this.ctx.arc(v.point.x, v.point.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      });
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

  return {
    create: function({el, data, xRange}) {
      return new Chart(el, data, xRange);
    }
  };
})(window.document);

let baseData = [
  {
    sell: 1040,
    buy: 1048
  },
  {
    sell: 1046,
    buy: 1050
  },
  {
    sell: 1051,
    buy: 1053
  },
  {
    sell: 1043,
    buy: 1047
  },
  {
    sell: 1049,
    buy: 1054
  },
  {
    sell: 1057,
    buy: 1060
  }
].reverse();

let dailyData = [];
for (var i = 0; i < 4; i++) {
  dailyData = dailyData.concat(baseData.reverse());
}

let baseMonthData = baseData.slice(0, 5);
let monthlyData = [];
for (var i = 0; i < 3; i++) {
  monthlyData = monthlyData.concat(baseMonthData.reverse());
}

let yearData = [];
for (var i = 0; i < 2; i++) {
  yearData = yearData.concat(baseData.reverse());
}

Chart.create({
  el: 'top-chart',
  data: dailyData,
  xRange: [0, 23]
}).draw();

Chart.create({
  el: 'left-chart',
  data: monthlyData,
  xRange: [0, 29]
}).draw();

Chart.create({
  el: 'right-chart',
  data: yearData,
  xRange: [0, 11]
}).draw();

document.getElementById('transactions').onclick = function() {
  let modal = document.getElementById('modal');
  modal.className = modal.className.replace('hidden', '');
}
