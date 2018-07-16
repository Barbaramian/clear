var startBtn = document.getElementsByClassName('startBtn')[0];
var startPage = document.getElementsByClassName('startPage')[0];
var gamePage = document.getElementsByClassName('gamePage')[0];
var winPage = document.getElementsByClassName('winPage')[0];
var losePage = document.getElementsByClassName('losePage')[0];
var num = document.getElementsByClassName('num')[0];
var game = document.getElementsByClassName('game')[0];
var blocks = document.getElementsByClassName('block');
var mine = document.getElementsByClassName('mine');
var winagain = document.getElementsByClassName('winagain')[0];
var loseagain = document.getElementsByClassName('loseagain')[0];

function init() {
    this.startPage.style.display = 'block';
    // 设定雷数
    this.minenum = 10;
    // 剩余雷数
    this.mineover = 10;
    // 每个雷的宽高
    this.blockW = 40;
    this.blockH = 40;

    bindEvent();
    // startGame();
}

function bindEvent() {
    startBtn.onclick = function () {
        startGame();
    }
    game.onmousedown = function (e) {
        e.stopPropagation();
        if (e.which == 1) {
            leftClick(e.target);
        } else if (e.which == 3) {
            rightClick(e.target);
        }
    }
    game.oncontextmenu = function (e) {
        e.preventDefault();
    }
    winagain.onclick = function () {
        reload();
    }
    loseagain.onclick = function () {
        reload();
    }
}

function startGame() {
    this.gamePage.style.display = 'block';
    this.startPage.style.display = 'none';
    this.num.innerText = mineover;

    createMap();
    createMines();
    bindEvent();
}

function createMap() {
    // 创建10*10的游戏区域
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            this.block = document.createElement('div');
            this.block.classList.add('block');
            this.block.setAttribute('id', i + '-' + j);
            this.block.style.position = 'absolute';
            this.block.style.width = this.blockW + 'px';
            this.block.style.height = this.blockH + 'px';
            this.block.style.top = this.blockH * i + 'px';
            this.block.style.left = this.blockW * j + 'px';
            this.game.appendChild(block);
        }
    }
}

function createMines() {
    // 运用数组去重原理，防止存在同一个位置设定多次雷
    var obj = {};
    var i = 0;
    // classname有 mine 设为雷
    while (i < minenum) {
        var random = Math.floor(Math.random() * 100);
        if (!obj[random]) {
            obj[random] = 'a';
            this.blocks[random].classList.add('mine');
            i++;
        }
    }
}

function leftClick(dom) {
    if (!dom.classList.contains('flag')) {
        if (dom && dom.classList.contains('mine')) {
            // 点击到雷 ==》 游戏结束
            lose(dom);
        } else {
            // 点击到非雷区 ==》出现数字，显示附近8个格子有多少雷
            var roundnum = 0;
            dom.classList.add('checked');
            var blockArr = dom && dom.getAttribute('id').split('-');
            var blockX = blockArr && Number(blockArr[0]);
            var blockY = blockArr && Number(blockArr[1]);
            for (var i = blockX - 1; i <= blockX + 1; i++) {
                for (var j = blockY - 1; j <= blockY + 1; j++) {
                    var box = document.getElementById(i + '-' + j);
                    if (box && box.classList.contains('mine')) {
                        roundnum++;
                    }
                }
            }
            dom.innerText = roundnum;
            dom.style.textAlign = 'center';
            dom.style.lineHeight = blockH + 'px';
            // 点击到非雷区 ==》周围8个格子均没有雷 ==》扩散使附近8个格子触发此函数
            if (roundnum == 0) {
                for (var i = blockX - 1; i <= blockX + 1; i++) {
                    for (var j = blockY - 1; j <= blockY + 1; j++) {
                        // if (i != blockX && j != blockY) {
                        var nearbox = document.getElementById(i + '-' + j);
                        if (nearbox && nearbox.length != 0) {
                            if (!nearbox.classList.contains('checked')) {
                                leftClick(nearbox);
                            }
                        }
                        // }
                    }
                }
            }
        }
    }
}

function lose(dom) {
    for (var i = 0; i < minenum; i++) {
        if (dom.getAttribute('id') == mine[i].getAttribute('id')) {
            dom.style.backgroundImage = 'url(img/wrong.png)';
        } else {
            mine[i].style.backgroundImage = 'url(img/mine.png)';
        }
    }
    var timer = setTimeout(function () {
        this.gamePage.style.opacity = '0.3';
        this.losePage.style.display = 'block';
    }, 1500);
}

function win() {
    var timer = setTimeout(function () {
        this.gamePage.style.opacity = '0.3';
        this.winPage.style.display = 'block';
    }, 1500);
}

function rightClick(dom) {
    // 没有出现数字或者没有被标记的格子才能被标记
    if (!dom.classList.contains('flag') && !dom.classList.contains('checked')) {
        dom.classList.add('flag');
        dom.style.backgroundImage = 'url(img/sign.png)';
        // 如果标记到雷上，则剩余雷数 -1
        if (dom.classList.contains('mine')) {
            this.mineover--;
            this.num.innerText = this.mineover;
        }
    } else {
        // 再次点击被标记过的格子会取消标记
        dom.classList.remove('flag');
        dom.style.backgroundImage = 'url(img/cover.png)';
        // 在地雷格子上取消标记，则剩余雷数 +1
        if (dom.classList.contains('mine')) {
            this.mineover++;
            this.num.innerText = this.mineover;
        }
    }
    // 地雷全被标记后，胜利？？？需要改 ==》点开全部非地雷格子才是胜利
    if (this.mineover == 0) {
        win();
    }
}

function reload() {
    this.minenum = 10;
    this.mineover = 10;
    this.blockW = 40;
    this.blockH = 40;
    this.losePage.style.display = 'none';
    this.winPage.style.display = 'none';
    this.gamePage.style.opacity = '1';
    // for (var i = 0; i < blocks.length; i++) {
    //     this.blocks[i].setAttribute('class', '');
    //     this.game.removeChild(blocks[0]);
    //     console.log('reload');
    // }
    // 重排重绘降低效率
    this.game.innerHTML = '';
    startGame();
}

init();