render()

const playField = document.querySelector('.playField')
const popUpWinner = document.querySelector('.winner')
const buttonEndRound = document.querySelector('button')
const roundText = document.querySelector('div.round > span')
const textForHuman = document.querySelector('.turn1 > span')
const textForPc = document.querySelector('.turn2 > span')
const tableResult = document.querySelectorAll('.colresult > .result')
const winCombinations = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]]
const resultStyle = document.querySelectorAll('.result > p')
const buttonNewGame = document.querySelector('.restart > button')

let whoTurn = ''
let win = ''

let HumanMove = ''
let PcMove = ''

game()

function createResultTable(){
    let $colresult = document.querySelector('.colresult')
    let $colPlayer = document.querySelector('.colPlayer')
    let $colRound = document.querySelector('.colRound')
    $colRound.innerHTML += `<div class="head">Раунд</div>`
    $colPlayer.innerHTML += `<div class="head">Участник</div>`
    $colresult.innerHTML += `<div class="head">Результат</div>`
    for(let i = 1; i <= 5; i++){
        $colRound.innerHTML += `<div class="number">${i}</div>`
        $colPlayer.innerHTML += `<div class="player"><p>игрок</p><br><p>компьютер</p></div>`
        $colresult.innerHTML += `<div class="result"><p>${localStorage.getItem('player'+i)}</p><br><p>${localStorage.getItem('PC'+i)}</p></div>`
    }
}

function render() {

    let $body = document.body
    $body.innerHTML = `
        <div class="winner"><div class="info"><div class="text"></div><button>Продолжить</button></div></div>

        <div class="wrap">
            <div class="restart"><button>Начать заново</button></div>
            <div><h1>КРЕСТИКИ-НОЛИКИ</h1></div> 
            <div class="round">Раунд <span></span> из 5</div>
            <div class="turn1">Игрок ходит <span>крестиками</span></div>
            <div class="turn2">Компьютер ходит <span>ноликами</span></div>
            <div class="playField"></div>
            <div><h2>Таблица результатов</h2></div> 
            <div class="table">
                <div class="colRound"></div>
                <div class="lineHor1"></div>
                <div class="lineVer1"></div>
                <div class="colPlayer"></div>
                <div class="lineVer2"></div>
                <div class="colresult"></div>
                <div class="resultTotal"><div class="result">Победитель: <span>???</span></div></div>
            </div>
        </div>
    `

    renderplayField()
    createResultTable()
}

function renderplayField() {
    let $playField = document.querySelector('.playField')
    for (let i = 1; i <= 9; i++) {
        $playField.innerHTML += `<div id="${i}" class="moveSquer moveEnabled"></div>`
    }
}

function countingWinScores() {

    let scorePlayer = 0
    let scorePC = 0

    for (let i = 1 ; i < 6 ; i++) {
    if (localStorage.getItem('player'+i) == 'Победа') {
        scorePlayer += 1
        }
    if (localStorage.getItem('PC'+i) == 'Победа') {
        scorePC += 1
        }
    }

    if (scorePlayer > scorePC) {
        return 'Игрок'
    } else if (scorePlayer < scorePC) {
        return 'Компьютер'
    }else{
        return 'Ничья'
    }
}

function winKresticiOrNoliki() {
    
    let result = ''

    for (let combination of winCombinations) {
        const setId = new Set()

        combination.forEach( (id) => {
            const squer = document.getElementById(id).getAttribute('class')
            setId.add(squer)
        })

        if (setId.size == 1 && (setId.has('moveSquer krestik')  || setId.has('moveSquer nolik'))) {

            if (setId.has('moveSquer krestik')) {
                result = 'krestik'
                return result
            } else if (setId.has('moveSquer nolik')) {
                result = 'noliki' 
                return result
            } 
        }
         
    } 

    if (document.querySelectorAll('.moveEnabled').length == 0) {
        popUpWinner.style.display = 'block'
        document.querySelector('.text').innerText = 'Ничья'
        result = 'Ничья'
    }
    
    return result
    
}

function checkForDraw() {
    if (document.querySelectorAll('.moveEnabled').length == 0) {
        popUpWinner.style.display = 'block'
        document.querySelector('.text').innerText = 'Ничья'
    }
}

function checkThreats() {
    const arrayCheck = []

    winCombinations.forEach((combination => {
        const arrayId = []
        
        combination.forEach( (id) => {
            const squer = document.getElementById(id).getAttribute('class')
            arrayId.push(squer)
        })
        
        let checkKrestik = arrayId.reduce( (acc, curr) => {
            if (curr == 'moveSquer krestik') {
                acc++
            }
            return acc
        }, 0)

        let checkMoveEnabled = arrayId.reduce( (acc, curr) => {
            if (curr == 'moveSquer moveEnabled') {
                acc++
            }
            return acc
        }, 0)

        if (checkKrestik == 2 && checkMoveEnabled == 1) {
            arrayCheck.push(combination)
        }

    }))
    return arrayCheck
}

function moveThreat(combination) {
    
    combination[0].forEach( (id) => {
            if (!(document.getElementById(id).getAttribute('class') == 'moveSquer krestik')) {
                document.getElementById(id).classList.add('nolik')
                document.getElementById(id).classList.remove('moveEnabled')
                turnCounter += 1
                //console.log('Сходил и предотвратил')
            }   
    })
}

function compMoveRandom (stop) {

    if (!stop) {
        const arrayMove = playField.querySelectorAll('div')

        const arrayMovePC = []

        arrayMove.forEach( (element) => {
            if (element.className == 'moveSquer moveEnabled')
                arrayMovePC.push(element.id)      
        })

        if (arrayMovePC.length == 1) {
            document.getElementById(arrayMovePC[0]).classList.add(PcMove)
            document.getElementById(arrayMovePC[0]).classList.remove('moveEnabled')
        } else {
            let random = Math.floor(Math.random()*(arrayMovePC.length - 1) + 1)
            document.getElementById(arrayMovePC[random]).classList.add(PcMove)
            document.getElementById(arrayMovePC[random]).classList.remove('moveEnabled')
        }
    }
}

function stopGame(winner) {

    let stop = false

    if (winner == 'krestik') {
        popUpWinner.style.display = 'block'
        document.querySelector('.text').innerText = 'Победили крестики'
        stop = true

    } else if (winner == 'noliki') {
        popUpWinner.style.display = 'block'
        document.querySelector('.text').innerText = 'Победили нолики'
        stop = true

    } else if (winner == 'ничья') {
        popUpWinner.style.display = 'block'
        document.querySelector('.text').innerText = 'Ничья'
        stop = true
    } 

    return stop
}

function playFieldEvent(event) {
    if (event.target.classList.contains('moveEnabled')) {
        event.target.classList.remove('moveEnabled')
        event.target.classList.add(HumanMove)

        let stop = false

        stop = stopGame(winKresticiOrNoliki())

        console.log(stop)

        compMoveRandom(stop)
        stopGame(winKresticiOrNoliki())
    
    //const threats = checkThreats()
    // if (threats.length > 0) {
    //     //moveThreat(threats) 
    //     let win = whoWin()
    //     winFinal(win)
    //     let draw = checkForDraw()
    //     drawFinal(draw)
    // } else {
        
        //checkForDraw()
    // } 
    }
}

function game() {

    resultStyle.forEach( (item) => {
        if (item.innerText == 'Победа') {
            item.classList.add('winna')
        } else if (item.innerText == 'Прогрыш') {
            item.classList.add('looser')
        }
    })

    if (!(localStorage.getItem('round'))) {
        localStorage.setItem('round', 1)
    } 
    
    roundText.innerText = localStorage.getItem('round')
    
    if ( +(localStorage.getItem('round')) >= 6) {
        roundText.innerText = 5
        let winner = countingWinScores()
        document.querySelector('.resultTotal > .result > span').innerText = winner
    
        document.querySelector('.round').innerText = 'Игра закончилась'
        roundText.innerText = ''
        textForHuman.innerText = ''
        textForPc.innerText = ''
        document.querySelector('.turn1').innerText = ''
        document.querySelector('.turn2').innerText = ''
    
        document.querySelector('.restart').style.marginTop = '0px'
    
        buttonNewGame.addEventListener ('click', () => {
            localStorage.setItem('round', 1)
            
            localStorage.player1 = ''
            localStorage.PC1 = ''
            localStorage.player2 = ''
            localStorage.PC2 = ''
            localStorage.player3 = ''
            localStorage.PC3 = ''
            localStorage.player4 = ''
            localStorage.PC4 = ''
            localStorage.player5 = ''
            localStorage.PC5 = ''
    
            window.location.reload()
            })
    
        playField.removeEventListener('click', playFieldEvent)
    }
    
    
    if ( !(+(localStorage.getItem('round')) % 2 == 0)) {
    
        HumanMove = 'krestik'
        PcMove = 'nolik'
    
        textForHuman.innerText = 'крестиками'
        textForPc.innerText = 'ноликами'
    
    } else {
    
        HumanMove = 'nolik'
        PcMove = 'krestik'
    
        textForHuman.innerText = 'ноликами'
        textForPc.innerText = 'крестиками'
    
        compMoveRandom()
    }

    buttonEndRound.addEventListener('click', e => {
        popUpWinner.style.display = 'none'
        window.location.reload()
    
        let roundCouter = localStorage.getItem('round') 
        let round = +roundCouter + 1
        localStorage.round = round
        let roundForStorage = round - 1
    
        if (document.querySelector('.text').innerText === 'Победили крестики') {
            HumanMove == 'krestik' ? localStorage.setItem('player'+roundForStorage, 'Победа') : localStorage.setItem('player'+roundForStorage, 'Прогрыш')
            PcMove == 'krestik' ? localStorage.setItem('PC'+roundForStorage, 'Победа') : localStorage.setItem('PC'+roundForStorage, 'Прогрыш')
    
        } else if (document.querySelector('.text').innerText === 'Победили нолики') {
            HumanMove == 'nolik' ? localStorage.setItem('player'+roundForStorage, 'Победа') : localStorage.setItem('player'+roundForStorage, 'Прогрыш')
            PcMove == 'nolik' ? localStorage.setItem('PC'+roundForStorage, 'Победа') : localStorage.setItem('PC'+roundForStorage, 'Прогрыш')
        
        } else if (document.querySelector('.text').innerText === 'Ничья') {
            localStorage.setItem('player'+roundForStorage, 'Ничья') 
            localStorage.setItem('PC'+roundForStorage, 'Ничья') 
        }
       
    })

    playField.addEventListener('click', e => {
        playFieldEvent(e)
    })
}























