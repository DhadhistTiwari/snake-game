 const scoreDisplay = document.querySelector('.score');
    const upBtn = document.getElementById('up');
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    const downBtn = document.getElementById('down');
    const pauseBtn = document.getElementById('pause');

    const gameContainer = document.querySelector('.game-container');
    const snakeHeadEl = document.querySelector('.snake-head');
    const foodEl = document.querySelector('.food');
    const highscoreFood = document.querySelector('.foodHighscr');

    const boxSize = 20;
    const gridSize = 330 / boxSize;
    const maxCells = Math.floor(gridSize);

    let snake = [{ x: 0, y: 0 }];
    let dir = { x: 1, y: 0 };
    let score = 0;
    let speed = 200;
    let lastMoveTime = 0;
    let isPaused = false;
    let food = { x: 5, y: 5 };
    let coinVisible = false;
    let coinTimeout;
    let coinPosition = { x: 8, y: 8 };

    function drawPosition(el, x, y) {
      el.style.left = x * boxSize + 'px';
      el.style.top = y * boxSize + 'px';
    }

    function drawSnake() {
      drawPosition(snakeHeadEl, snake[0].x, snake[0].y);
      document.querySelectorAll('.snake-body').forEach(el => el.remove());
      for (let i = 1; i < snake.length; i++) {
        const part = document.createElement('div');
        part.classList.add('snake-body');
        drawPosition(part, snake[i].x, snake[i].y);
        gameContainer.appendChild(part);
      }
    }

    function moveSnake() {
      if (isPaused) return;

      const newHead = {
        x: snake[0].x + dir.x,
        y: snake[0].y + dir.y
      };

      if (
        newHead.x < 0 || newHead.x >= maxCells ||
        newHead.y < 0 || newHead.y >= maxCells
      ) {
        alert('Game Over! You hit the wall.'+'\n'+'Your Score: '+score);
        resetGame();
        return;
      }

      if (snake.some(part => part.x === newHead.x && part.y === newHead.y)) {
        alert('Game Over! You bit yourself.'+'\n'+'Your Score: '+score);
        resetGame();
        return;
      }

      snake = [newHead, ...snake.slice(0, -1)];

      if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        snake.push({ ...snake[snake.length - 1] });
        placeFood();

        if (score >= 5 && score % 20 === 5) {
          showCoin();
        }

        if (score < 50) {
          speed = 200 - score * 2;
        }
      }

      if (coinVisible && newHead.x === coinPosition.x && newHead.y === coinPosition.y) {
        score += 5;
        scoreDisplay.textContent = score;
        coinVisible = false;
        highscoreFood.classList.add('hidden');
        clearTimeout(coinTimeout);
      }


      drawSnake();
    }

    function showCoin() {
      coinVisible = true;
      coinPosition = {
        x: Math.floor(Math.random() * maxCells),
        y: Math.floor(Math.random() * maxCells)
      };
      drawPosition(highscoreFood, coinPosition.x, coinPosition.y);
      highscoreFood.classList.remove('hidden');

      coinTimeout = setTimeout(() => {
        coinVisible = false;
        highscoreFood.classList.add('hidden');
      }, 6000);
    }
    function placeFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * maxCells),
          y: Math.floor(Math.random() * maxCells)
        };
      } while (snake.some(part => part.x === newFood.x && part.y === newFood.y));
      food = newFood;
      drawPosition(foodEl, food.x, food.y);
    }

    function resetGame() {
      snake = [{ x: 0, y: 0 }];
      dir = { x: 1, y: 0 };
      score = 0;
      speed = 200;
      scoreDisplay.textContent = score;
      isPaused = false;
      highscoreFood.classList.add('hidden');
      drawSnake();
      placeFood();
    }

    document.addEventListener('keydown', function (e) {
      switch (e.key) {
        case "ArrowUp":
          if (dir.y === 0) dir = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (dir.y === 0) dir = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (dir.x === 0) dir = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (dir.x === 0) dir = { x: 1, y: 0 };
          break;
      }
    });

    upBtn.onclick = () => { if (dir.y === 0) dir = { x: 0, y: -1 }; };
    downBtn.onclick = () => { if (dir.y === 0) dir = { x: 0, y: 1 }; };
    leftBtn.onclick = () => { if (dir.x === 0) dir = { x: -1, y: 0 }; };
    rightBtn.onclick = () => { if (dir.x === 0) dir = { x: 1, y: 0 }; };

    function pauseGame() {
      isPaused = !isPaused;
      pauseBtn.classList.toggle('text-red-500', isPaused);
    }

    function gameLoop(timestamp) {
      if (!lastMoveTime || timestamp - lastMoveTime >= speed) {
        moveSnake();
        lastMoveTime = timestamp;
      }
      requestAnimationFrame(gameLoop);
    }

    drawSnake();
    placeFood();
    requestAnimationFrame(gameLoop);