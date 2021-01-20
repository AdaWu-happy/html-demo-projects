!(function () {
  'use strict';

  // var dotChoose = document.getElementById('dot');
  // var rectChoose = document.getElementById('rect');
  // var picChoose = document.getElementById('pic');
  // var countChoose = document.getElementById('count');
  var a = document.createElement('A');
  a.href = window.location.href;
  var ret = {},
    seg = a.search.replace(/^\?/, '').split('&'),
    len = seg.length,
    i = 0,
    s;
  for (; i < len; i++) {
    if (!seg[i]) continue;
    s = seg[i].split('=');
    ret[s[0]] = s[1];
  }

  // if ('dot' in ret) {
  //   if (ret.dot === 'true') dotChoose.setAttribute('checked', '');
  //   else dotChoose.removeAttribute('checked');
  // }
  // if ('rect' in ret) {
  //   if (ret.rect === 'true') rectChoose.setAttribute('checked', '');
  //   else rectChoose.removeAttribute('checked');
  // }
  // if ('pic' in ret) {
  //   if (ret.pic === 'true') picChoose.setAttribute('checked', '');
  //   else picChoose.removeAttribute('checked');
  // }

  // var hasDot = dotChoose.checked,
  //   hasRect = rectChoose.checked,
  //   hasPic = picChoose.checked,
  //   imgRatio = 1,
  //   count = getSelected();

  // dotChoose.onchange = function() {
  //   hasDot = this.checked;
  //   render();
  // };
  // rectChoose.onchange = function() {
  //   hasRect = this.checked;
  //   render();
  // };
  // picChoose.onchange = function() {
  //   hasPic = this.checked;
  //   render();
  // };
  // countChoose.onchange = function() {
  //   count = getSelected();
  //   idots = rectsplit(count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);
  //   render();
  // };

  // function getSelected() {
  //   var ops = countChoose.getElementsByTagName('OPTION'),
  //     op;
  //   for (var i = 0; i < ops.length; i++) {
  //     op = ops[i];
  //     if (op.selected) return +op.value;
  //   }
  // }

  var canvas = document.getElementById('cas');
  var ctx = canvas.getContext('2d');

  var dots = [];
  var dotscopy, idots;

  var img = new Image();

  var imgRatio = 1; // add

  var maxHeight = 460;
  img.src = './img/test.jpg';
  img.onload = function () {
    var img_w = img.width,
      img_h = img.height;

    if (img_h > maxHeight) {
      imgRatio = maxHeight / img_h;
      img_h = maxHeight;
      img_w *= imgRatio;
    }

    var left = (canvas.width - img_w) / 2;
    var top = (canvas.height - img_h) / 2;

    img.width = img_w;
    img.height = img_h;

    dots = [
      { x: left, y: top },
      { x: left + img_w, y: top },
      { x: left + img_w, y: top + img_h },
      { x: left, y: top + img_h },
    ];

    dotscopy = [
      { x: left, y: top },
      { x: left + img_w, y: top },
      { x: left + img_w, y: top + img_h },
      { x: left, y: top + img_h },
    ];
    // idots = rectsplit(count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);
    idots = rectsplit(4, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);

    render();
  };

  /**
   * 鼠标拖动事件绑定
   * @param e
   */
  window.onmousedown = function (e) {
    if (!dots.length) return;

    var area = getArea(e);
    var dot, i;
    var qy = 40;

    for (i = 0; i < dots.length; i++) {
      dot = dots[i];
      if (area.t >= dot.y - qy && area.t <= dot.y + qy && area.l >= dot.x - qy && area.l <= dot.x + qy) {
        break;
      } else {
        dot = null;
      }
    }

    if (!dot) return;

    window.onmousemove = function (e) {
      var narea = getArea(e);
      var nx = narea.l - area.l;
      var ny = narea.t - area.t;

      dot.x += nx;
      dot.y += ny;

      area = narea;

      render();
    };

    window.onmouseup = function () {
      window.onmousemove = null;
      window.onmouseup = null;
    };
  };

  /**
   * 获取鼠标点击/移过的位置
   * @param e
   * @returns {{t: number, l: number}}
   */
  function getArea(e) {
    e = e || window.event;
    return {
      t: e.clientY - canvas.offsetTop + document.body.scrollTop + document.documentElement.scrollTop,
      l: e.clientX - canvas.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft,
    };
  }

  /**
   * 画布渲染
   */
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // var ndots = rectsplit(count, dots[0], dots[1], dots[2], dots[3]);
    var ndots = rectsplit(4, dots[0], dots[1], dots[2], dots[3]);
    var count = 4; // add

    ndots.forEach(function (d, i) {
      var dot1 = ndots[i];
      var dot2 = ndots[i + 1];
      var dot3 = ndots[i + count + 2];
      var dot4 = ndots[i + count + 1];

      var idot1 = idots[i];
      var idot2 = idots[i + 1];
      var idot3 = idots[i + count + 2];
      var idot4 = idots[i + count + 1];

      if (dot2 && dot3 && i % (count + 1) < count) {
        renderImage(idot3, dot3, idot2, dot2, idot4, dot4, idot1);
        renderImage(idot1, dot1, idot2, dot2, idot4, dot4, idot1);
      }

      // if (hasDot) {
      //   ctx.fillStyle = 'red';
      //   ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
      // }
      ctx.fillStyle = '#fff';
      ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
    });
  }

  /**
   * 计算矩阵，同时渲染图片
   * @param arg_1
   * @param _arg_1
   * @param arg_2
   * @param _arg_2
   * @param arg_3
   * @param _arg_3
   */
  function renderImage(arg_1, _arg_1, arg_2, _arg_2, arg_3, _arg_3, vertex) {
    var count = 4; //add
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(_arg_1.x, _arg_1.y);
    ctx.lineTo(_arg_2.x, _arg_2.y);
    ctx.lineTo(_arg_3.x, _arg_3.y);
    ctx.closePath();
    // if (hasRect) {
    //   ctx.lineWidth = 2;
    //   ctx.strokeStyle = 'red';
    //   ctx.stroke();
    // }
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = 'red';
    // ctx.stroke();

    ctx.clip();

    // if (hasPic) {
    //   var result = matrix.getMatrix.apply(this, arguments);
    //   ctx.transform(result.a, result.b, result.c, result.d, result.e, result.f);
    //   var w = img.width / count;
    //   var h = img.height / count;
    //   ctx.drawImage(
    //     img,
    //     (vertex.x - idots[0].x) / imgRatio - 1,
    //     (vertex.y - idots[0].y) / imgRatio - 1,
    //     w / imgRatio + 2,
    //     h / imgRatio + 2,
    //     vertex.x - 1,
    //     vertex.y - 1,
    //     w + 2,
    //     h + 2
    //   );
    // }
    var result = matrix.getMatrix.apply(this, arguments);
    ctx.transform(result.a, result.b, result.c, result.d, result.e, result.f);
    var w = img.width / count;
    var h = img.height / count;
    ctx.drawImage(
      img,
      (vertex.x - idots[0].x) / imgRatio - 1,
      (vertex.y - idots[0].y) / imgRatio - 1,
      w / imgRatio + 2,
      h / imgRatio + 2,
      vertex.x - 1,
      vertex.y - 1,
      w + 2,
      h + 2
    );

    ctx.restore();
  }

  /**
   * 将 abcd 四边形分割成 n 的 n 次方份，获取 n 等分后的所有点坐标
   * @param n     多少等分
   * @param a     a 点坐标
   * @param b     b 点坐标
   * @param c     c 点坐标
   * @param d     d 点坐标
   * @returns {Array}
   */
  function rectsplit(n, a, b, c, d) {
    var ad_x = (d.x - a.x) / n;
    var ad_y = (d.y - a.y) / n;
    var bc_x = (c.x - b.x) / n;
    var bc_y = (c.y - b.y) / n;

    var ndots = [];
    var x1, y1, x2, y2, ab_x, ab_y;

    for (var i = 0; i <= n; i++) {
      x1 = a.x + ad_x * i;
      y1 = a.y + ad_y * i;
      x2 = b.x + bc_x * i;
      y2 = b.y + bc_y * i;

      for (var j = 0; j <= n; j++) {
        ab_x = (x2 - x1) / n;
        ab_y = (y2 - y1) / n;

        ndots.push({
          x: x1 + ab_x * j,
          y: y1 + ab_y * j,
        });
      }
    }

    return ndots;
  }
})();