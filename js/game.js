class game {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.score = JSON.parse(localStorage.getItem("Current-Player")).score;
    this.init();
    this.onLoad();
    this.hadchange = false;
    this.$gameover = false;
    this.$newgame = false;
    this.draw();
    this.handle();
    setInterval(() => {
      const scores = document.getElementById("current-score");
      scores.innerHTML = this.score;
    }, 100);
  }
  
  async changeScore() {
    let CurrentUser = JSON.parse(localStorage.getItem("Current-Player")).email;
    let res = await firebase
      .firestore()
      .collection("users")
      .where("email", "==", CurrentUser)
      .get();
    for (let doc of res.docs) {
      let x = doc.data().hightScores;
      let y = this.score;
      await firebase
        .firestore()
        .collection("users")
        .doc(doc.id)
        .update({
          score: this.score,
          arr: [
            this.grid[0][0],
            this.grid[0][1],
            this.grid[0][2],
            this.grid[0][3],
            this.grid[1][0],
            this.grid[1][1],
            this.grid[1][2],
            this.grid[1][3],
            this.grid[2][0],
            this.grid[2][1],
            this.grid[2][2],
            this.grid[2][3],
            this.grid[3][0],
            this.grid[3][1],
            this.grid[3][2],
            this.grid[3][3],
          ],
        });
      if (x < y) {
        await firebase.firestore().collection("users").doc(doc.id).update({
          hightScores: y,
        });
      }
    }
    let currentPlayer = JSON.parse(localStorage.getItem("Current-Player"));
    (async () => {
      let response = await firebase
        .firestore()
        .collection("users")
        .where("email", "==", CurrentUser)
        .get();
      currentPlayer = response.docs[0].data();
      localStorage.setItem("Current-Player", JSON.stringify(currentPlayer));
    })();
  }
  onLoad() {
    let arrX = JSON.parse(localStorage.getItem("Current-Player")).arr;
    this.grid = [
      [arrX[0], arrX[1], arrX[2], arrX[3]],
      [arrX[4], arrX[5], arrX[6], arrX[7]],
      [arrX[8], arrX[9], arrX[10], arrX[11]],
      [arrX[12], arrX[13], arrX[14], arrX[15]],
    ];
    for (let i = 0; i < 15; i++) {
      if (arrX[i] != 0) {
        this.$newgame = false;
      }
    }
  }
  init() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 500;
    this.canvas.height = 500;
    document.body.appendChild(this.canvas);
  }
  draw() {
    this.context.clearRect(0, 0, 500, 500);
    for (let i = 1; i < 4; i++) {
      this.context.beginPath();
      this.context.moveTo(i * 125, 0);
      this.context.lineTo(i * 125, 500);
      this.context.moveTo(0, i * 125);
      this.context.lineTo(500, i * 125);
      this.context.stroke();
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] == 2) {
          this.context.fillStyle = "#EEE4DA";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 4) {
          this.context.fillStyle = "#EEE1C9";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 8) {
          this.context.fillStyle = "#F3B27A";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 16) {
          this.context.fillStyle = "#F69664";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 32) {
          this.context.fillStyle = "#F77C5F";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 64) {
          this.context.fillStyle = "#F75F3B";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 128) {
          this.context.fillStyle = "#EDD073";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 256) {
          this.context.fillStyle = "#EDCC62";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 512) {
          this.context.fillStyle = "#EDC950";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 1024) {
          this.context.fillStyle = "#EDC53F";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] == 2048) {
          this.context.fillStyle = "#EDC22E";
          this.context.fillRect(j * 125 + 1, i * 125 + 1, 123, 123);
        }
        if (this.grid[i][j] != 0) {
          this.context.font = "60px Verdana";
          this.context.fillStyle = "black";
          this.context.textAlign = "center";
          this.context.fillText(this.grid[i][j], j * 125 + 62, i * 125 + 85);
        }
      }
    }
  }

  newgame() {
    this.hadchange = false;
    this.$gameover = false;
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addNum();
    this.score = 0;
    this.changeScore();
    this.addNum();
    this.draw();
    console.log(this.score);
  }

  slideL(row) {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      if (row[i] != 0) {
        arr.push(row[i]);
      }
    }
    for (let i = arr.length; i < 4; i++) {
      arr.push(0);
    }
    return arr;
  }
  slideR(row) {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      if (row[i] == 0) {
        arr.push(row[i]);
      }
    }
    for (let i = 0; i < 4; i++) {
      if (row[i] != 0) {
        arr.push(row[i]);
      }
    }
    return arr;
  }

  gameover(arr) {
    this.$gameover = false;
    let count = 0;
    let tmp = 0;
    let brr = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        brr[i][j] = arr[i][j];
        if (brr[i][j] == 0) {
          count++;
        }
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (count == 0) {
          if (brr[i][j] == brr[i][j + 1] || brr[i][j] == brr[i + 1][j]) {
            tmp++;
          }
        }
      }
    }
    if (tmp == 0 && count == 0) {
      this.$gameover = true;
    }
  }

  addNum() {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] == 0) {
          arr.push({ x: i, y: j });
        }
      }
    }
    if (arr.length > 0) {
      let random = arr[(Math.random() * arr.length) >> 0];
      let num = Math.floor(Math.random() * 4);
      if (num == 3) {
        this.grid[random.x][random.y] = 4;
      } else {
        this.grid[random.x][random.y] = 2;
      }
    }
  }

  change(arr1, arr2) {
    for (let i = 0; i < 4; i++) {
      if (arr1[i] != arr2[i]) {
        this.hadchange = true;
        break;
      }
    }
  }

  handle() {
    document.addEventListener("keydown", (e) => {
      if (e.which == 37) {
        this.hadchange = false;
        for (let i = 0; i < 4; i++) {
          let arr = this.grid[i];
          this.grid[i] = this.slideL(this.grid[i]);
          for (let j = 0; j < 3; j++) {
            if (this.grid[i][j] == this.grid[i][j + 1]) {
              this.grid[i][j] += this.grid[i][j + 1];
              this.score += Number(this.grid[i][j]);
              this.grid[i][j + 1] = 0;
            }
          }
          this.grid[i] = this.slideL(this.grid[i]);
          this.change(arr, this.grid[i]);
        }
        this.changeScore();

        if (this.hadchange) {
          this.addNum();
        }
        this.draw();
        this.gameover(this.grid);
        if (this.$gameover) {
          setTimeout(() => {
            alert(`
				Game Over
				Your Score is : ${this.score}`);
          }, 2000);
        }
      } else if (e.which == 38) {
        this.hadchange = false;
        for (let i = 0; i < 4; i++) {
          let arr = [];
          for (let j = 0; j < 4; j++) {
            arr.push(this.grid[j][i]);
          }
          let arr1 = arr;
          arr = this.slideL(arr);
          for (let j = 0; j < 3; j++) {
            if (arr[j] == arr[j + 1]) {
              arr[j] += arr[j + 1];
              this.score += Number(arr[j]);
              arr[j + 1] = 0;
            }
          }
          arr = this.slideL(arr);
          for (let k = 0; k < 4; k++) {
            this.grid[k][i] = arr[k];
          }
          this.change(arr, arr1);
        }
        this.changeScore();
        if (this.hadchange) {
          this.addNum();
        }
        this.draw();
        this.gameover(this.grid);
        if (this.$gameover) {
          setTimeout(() => {
            alert(`
				  Game Over
				  Your Score is : ${this.score}`);
          }, 2000);
        }
      } else if (e.which == 39) {
        this.hadchange = false;
        for (let i = 0; i < 4; i++) {
          let arr = this.grid[i];
          this.grid[i] = this.slideR(this.grid[i]);
          for (let j = 3; j > 0; j--) {
            if (this.grid[i][j] == this.grid[i][j - 1]) {
              this.grid[i][j] += this.grid[i][j - 1];
              this.score += Number(this.grid[i][j]);
              this.grid[i][j - 1] = 0;
            }
          }
          this.grid[i] = this.slideR(this.grid[i]);
          this.change(arr, this.grid[i]);
        }
        this.changeScore();
        if (this.hadchange) {
          this.addNum();
        }
        this.draw();
        this.gameover(this.grid);
        if (this.$gameover) {
          setTimeout(() => {
            alert(`
				  Game Over
				  Your Score is : ${this.score}`);
          }, 2000);
        }
      } else if (e.which == 40) {
        this.hadchange = false;
        for (let i = 0; i < 4; i++) {
          let arr = [];
          for (let j = 0; j < 4; j++) {
            arr.push(this.grid[j][i]);
          }
          let arr1 = arr;
          arr = this.slideR(arr);
          for (let j = 3; j >= 0; j--) {
            if (arr[j] == arr[j - 1]) {
              arr[j] += arr[j - 1];
              this.score += Number(arr[j]);
              arr[j - 1] = 0;
            }
          }
          arr = this.slideR(arr);
          for (let k = 0; k < 4; k++) {
            this.grid[k][i] = arr[k];
          }
          this.change(arr, arr1);
        }
        this.changeScore();
        if (this.hadchange) {
          this.addNum();
        }
        this.draw();
        this.gameover(this.grid);
        if (this.$gameover) {
          setTimeout(() => {
            alert(`
				  Game Over
				  Your Score is : ${this.score}`);
          }, 2000);
        }
      }
    });
  }
}

let g = new game();
document.getElementById("new-game").addEventListener("click", () => {
  g.newgame();
  setTimeout(() => {
    alert("Game bắt đầu");
  }, 100);
});
