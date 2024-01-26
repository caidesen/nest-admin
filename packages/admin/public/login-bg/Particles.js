(() => {
  // самовызывающаяся функция
  const cnv = document.querySelector("#login-bg"); //настраиваем canvas
  const ctx = cnv.getContext("2d"); //указываем в каком контексте работаем

  const cfg = {
    orbsCount: 120, //увеличиваем колличество сфер, для их хранения orbsList[]
    minVelocity: 0.4, //min скорость
    ringsCount: 400, //кол-во колец по которым двигаются частицы
  };

  let mx = -1010,
    my = 0; // получаем координаты мыши
  document.body.addEventListener(`mousemove`, (e) => {
    // слушатель событий переключения мыши на canvas
    mx = e.clientX - cnv.getBoundingClientRect().left;
    my = e.clientY - cnv.getBoundingClientRect().top; // используем для реализации эффекта паралакса
  });
  let cw, ch, cx, cy, ph, pw; //переменные ширины и высоты width, height, x, y; ph расстояние смещения относит центра
  function resize() {
    cw = cnv.width = innerWidth; //cw=widthcanvas = окну просмотра
    ch = cnv.height = innerHeight;
    cx = cw * 0.5;
    cy = ch * 0.5;
    ph = cx * 0.4; //радиус пустоты в центре, чуть меньше высоты области просмотра
    pw = cy * 0.7; // часть ширины, для формирования орбиты овала
  }
  resize(); // вызываем функцию
  window.addEventListener("resize", resize); // слушатель событий на случай, если нужно поменять размер холста

  class Orb {
    // создаем объект и задаем его св-ва
    constructor() {
      this.size = Math.random() * 20 + 2;
      this.angle = Math.random() * 80; //свойство градусa ot 0 do 360
      this.radius =
        (((Math.random() * cfg.ringsCount) | 0) * ph) / cfg.ringsCount; // | округление с помощью битовой операции(альтернатива методу floor)округляет число до целого в меньшую сторону здесь от 0 до 10
      this.impact = this.radius / ph; //влияние, р-р зависит от радиуса вращения и доработать в optic| чем > расстояние до центра, тем > значение Impact
      this.velocity = cfg.minVelocity + Math.random() * cfg.minVelocity; //передвижение частиц, рандом для разной скорости каждой
    }

    refresh() {
      //метод который вызваем каждый кадр для движения и прорисовки сфер
      let radian = (this.angle * Math.PI) / 180; // преобразум метод в радианы

      let cos = Math.cos(radian); //получем косинус и синус
      let sin = Math.sin(radian);

      let offsetX = cos * pw * this.impact; //делаем овал и смещение добавляем к х
      let offsetY = sin * pw * this.impact;

      let paralaxX = (-1010 / cw) * 2 - 1; //позиция_мыши / ширина_холста, используем для наклона. за расположение по высоте отвечает Y
      let paralaxY = 1 / ch; // смещение вверх при позиции курсора

      let x = cx + cos * (ph + this.radius) + offsetX; //центр х, растянуть
      let y =
        cy + sin * (ph + this.radius) - offsetY * paralaxY - paralaxX * offsetX; //сплюснуть

      let distToC = Math.hypot(x - cx, y - cy); // расстояние от центра до частицы получаем через гипотензу
      let distToM = Math.hypot(x - mx, y - my); // расстояние до мыши

      let optic = sin * this.size * this.impact * 0.7; // увеличиваем сферы нижние, чтобы они казались ближе| точки ближе к центру подвергаются минимальным изменениям р-ра
      let mEffect = distToM <= 50 ? (1 - distToM / 50) * 25 : 0; // эффект от мыши. Если дист до сфера <= 50, то расстояние \50. 25 число добавочного р-ра частицы, а если нет то 0

      let size = this.size + optic + mEffect;

      let h = this.angle; // оттенок
      let s = 100; // насыщенность
      let l = (1 - Math.sin(this.impact * Math.PI)) * 90 + 10; //яркость, сделали зависимость от удаленности частиц
      let color = `hsl(${h}, ${s}%, ${l}%)`; // объединяем в один цвет

      if (distToC > ph - 1 || sin > 0) {
        //не отрисовываем частицы за сферой
        ctx.strokeStyle = ctx.fillStyle = color;
        ctx.beginPath(); //откроем путь
        ctx.arc(x, y, size, 0, 2 * Math.PI); // рисуем круг// заменили this.size на size
        ctx.fill(); //заливка
      }

      this.angle =
        (this.angle -
          (distToM < 200 ? this.velocity * distToM * 0.005 : this.velocity)) %
        360; //меням значение угла +||- значение скорость, если менять, то изменится направление. В зависимости от знака движение по часовой стрелке или проти
    }
  }

  //new Orb().refresh(); // отображение объекта

  let orbsList = []; //массив для хранения сфер
  function createStardust() {
    //наполняем orbsList через ф-цию
    for (let i = 0; i < cfg.orbsCount; i++) {
      orbsList.push(new Orb());
    }
  }
  createStardust(); //вызываем

  let bg1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx); //градиент на фон
  bg1.addColorStop(0, `rgb(10, 10, 10)`);
  bg1.addColorStop(0.5, `rgb(10, 10, 20)`);
  bg1.addColorStop(1, `rgb(30, 10, 40)`);

  let bg2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx); //градиент на центр фона

  bg2.addColorStop(1, `rgb(0, 0, 20)`);
  // bg2.addColorStop(0, `rgb(255, 255, 255)`);
  // bg2.addColorStop(.15, `rgb(255, 255, 255)`);
  // bg2.addColorStop(.16, `rgb(189, 224, 255)`);
  // bg2.addColorStop(.23, `rgb(0, 191, 255)`);
  // bg2.addColorStop(.45, `rgb(122, 10, 175)`);
  // bg2.addColorStop(.85, `rgb(9, 9, 25)`);
  // bg2.addColorStop(1, `rgb(0, 0, 20)`);

  function loop() {
    // отобразить каждый элемент orbsList
    cy += Math.random() * 0.5 - 0.25;
    cx += Math.random() * 0.5 - 0.25;

    requestAnimationFrame(loop); // запуск анимации
    ctx.globalCompositeOperation = `normal`; // если убрать все станет белым
    ctx.fillStyle = bg2; //очищение после отрисовки сфер
    ctx.fillRect(0, 0, cw, ch); //. если убрать будет след

    ctx.globalCompositeOperation = `lighter`; // режим наложения
    orbsList.map((e) => e.refresh()); // перебираем каждый элемент с помощью map
  }
  loop();
})();
