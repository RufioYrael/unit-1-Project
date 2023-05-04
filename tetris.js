//defining global variables here

let currentScore = 0;

//catching the board elements into javascript by using an eventlistener that does not wait for all elements to be loaded and parsed in the html document
document.addEventListener('DOMContentLoaded', () => {

//SETTING VARIABLES

    //timer for shape movement animation
    let speedOfMovement = 1000
    let timer

    //this seeds the shape grid, allowing to create the 5 different tetris shapes
    const width = 10
    let nextRandom = 0

//CALLING DOM
    //accessing the DOM and connecting all elements to variables for JS processing
    const gameBoard = document.querySelector('.board')

    //capturing all the html divs and placng them into an array
    let squares = Array.from(document.querySelectorAll('.board div'))
    const score = document.querySelector('#score')
    const playBtn = document.querySelector('#play')


    console.log(squares)
    //shapes are declared here, each shape has an array and each shape has 4 different positions
    /* 
    note that the grid position is starting at 0, so for example the blocks that need to be colored for the first L position would correspond to the grid position of 

    0 1  2
    0 11 0
    0 21 0

    also note that the tetris shape MUST by definition be comprised of 4 blacks
    */

//NOTE TO SELF, TURN THESE INTO A CLASS OBJECT
    const lShape = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const oShape = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const zShape = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tShape = [
        [1, width,  width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1,width, width+1, width*2+1]
    ]

    const iShape = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    //placing all shapes in an array
    const shapeArray = [lShape, oShape, zShape, tShape, iShape]

    //random function
    const randFunc = () => Math.floor(Math.random()*shapeArray.length)

    //shape starting position on the board and setting initial shape rotation position
    let position = 4
    let rotationPosition = 0

    //selecting shapes for initial shape on load
    let rand = randFunc()
    let currentShape = shapeArray[rand][rotationPosition]

    // THE SHAPE WILL BE SET TO ZERO ON FIRST ROTATION, FIX THIS
    let trackingShape = 0

    console.log(currentShape[rand])

//SETTING FUNCTIONS

    //render shape function
    function draw() {
        currentShape.forEach(i  => {
            squares[position + i].classList.add('shape')
        })
        displayShape()
}

    //removing shape from view
    function undraw() {
        currentShape.forEach(i => {
            squares[position + i].classList.remove('shape')
        }) 
    }

  //keycodes for the movement of shapes
    //NOTE TO SELF change functionality for button press and hold
  function control(e) {
        if(e.code === 'ArrowLeft') {
            timer ? moveLeft() : alert('game paused')
        } else if (e.code === 'ArrowRight') {
            timer ? moveRight() : alert('Game is paused')
        } else if (e.code === 'ArrowUp') {
            timer ? rotate() : alert('Game is paused')
        } else if (e.code === 'ArrowDown') {
            timer ? shapeDownBoard() : alert('Game is paused')
        }
  }

  document.addEventListener('keyup', control)

  //moving the shape down the board
    function shapeDownBoard() {
        undraw()
        //console.log(currentShape)
        position += width
        draw()
        collisionDetection()
    } 

    //stopping the shape
    function collisionDetection() {
        if (currentShape.some(i => squares[position + i + width].classList.contains('endOfBoard'))) {
            //changing the inner div of the shape to endOfBoard to create the barrier for collision detection
            currentShape.forEach(i => squares[position + i].classList.add('endOfBoard'))

            //creating new shape to continue game (NOTE TO SELF MAYBE MAKE THIS WHOLE THING A SEPERATE FUNCTION)
            rand = nextRandom
            nextRandom = randFunc()
            currentShape = shapeArray[rand][rotationPosition]
            trackingShape = shapeArray.indexOf(shapeArray[rand])
            position = rand
            draw()
            displayShape()
            scoring()
            endOfGame()
        } 
    }

    //moving the shapes, move left right and down, up to rotate
    function moveLeft() {
        undraw()
        //collision detection of side of board, looking ahead if any of the returning value is = 0 than do nothing otherwise if "leftedge is not true" then move the shape -1 position to left
        const leftEdge = currentShape.some(i => (position + i) % width === 0)
        if(!leftEdge) position -= 1
        if(currentShape.some(i => squares[position + i].classList.contains('endOfBoard'))) {
            position += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const rightEdge = currentShape.some(i => (position + i) % width === width - 1)
        if(!rightEdge) position += 1
        if(currentShape.some(i => squares[position + i].classList.contains('endOfBoard'))) {
            position -= 1
        }
        draw()
    }

    function rotate() {
        undraw()
        rotationPosition ++
        if(rotationPosition === currentShape.length) { 
          rotationPosition = 0
        }
        currentShape = shapeArray[trackingShape][rotationPosition]
        draw()
      }

//display next shape

    //targeting the minigrid only to display next coming shape
    const miniGrid = document.querySelectorAll('.upNextGrid div')
    const displayWidth = 4
    const displayIndex = 0

    //storing first rotation of shape in seperate array
    const nextComing = [
        [1, displayWidth+1, displayWidth*2+1, 2], 
        [0, 1, displayWidth, displayWidth+1], 
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] 
    ]

    // function passingShapeFirstPosition() {
    //     for (i = 0; i < shapeArray.length; i++) {
    //         nextComing.push(shapeArray[i][0])
    //     }
    // }

    // shapeArray.forEach(passingShapeFirstPosition)

    function displayShape() {
        miniGrid.forEach(grid => {
          grid.classList.remove('shape')
        })
 
        //draws the next shape calling
        nextComing[nextRandom].forEach( index => {
          miniGrid[displayIndex + index].classList.add('shape')
        })
    }


    //scoring
    function scoring() {
        //for loop makes a fake board row thats going to store a copy from a row of the actual board
        for (let i = 0; i < 199; i += width) {
            tempRow = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            
            if (tempRow.every(i => squares[i].classList.contains('endOfBoard'))) {
                currentScore += 100
                score.innerHTML = currentScore
                //removing the 'endOfBoard' class on squares so that they act as if nothing is inside
                tempRow.forEach(i => {
                    squares[i].classList.remove('endOfBoard')
                    squares[i].classList.remove('shape')
                })
                //storing the removed pieces in a sep array
                let piecesRem = squares.splice(i, width)
                //taking that sep array and placeing them ontop of the original grid
                squares = piecesRem.concat(squares)
                squares.forEach(cell => gameBoard.appendChild(cell))


            }
        }

    }

    //end of game
    function endOfGame() {
        if(currentShape.some(i => squares[position + i].classList.contains('endOfBoard'))) {
            clearInterval(timer)
            alert('Game Over!')
            playBtn.innerHTML = 'Play Again?'
        }
    }



    //clear the board for a new game

    //play button functioning
    playBtn.addEventListener('click', () => {
        //using falsy value here to check if timer === null
        if (timer) {
            clearInterval(timer)
            timer = null
        } else {
            draw()
            timer = setInterval(shapeDownBoard, speedOfMovement)
            displayShape()
        }
    })
    
    

})
 
//set function for play again after the board has filled, track grid for filled position above a certain point


//Logic starts here

    //function to check for the top of the grid and making player loose

    //function clear solid line positions and add points to the score
        //2x points for clearing a full tetris

