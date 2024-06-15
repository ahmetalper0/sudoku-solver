function get_sudoku() {

    const cells = document.querySelectorAll('.cell');

    let sudoku = [];

    for (let i = 0; i < 9; i++) {

        sudoku[i] = [];

        for (let j = 0; j < 9; j++) {

            const cellValue = cells[i * 9 + j].textContent;

            sudoku[i][j] = cellValue ? parseInt(cellValue, 10) : 0;

        }
    }

    console.log('Initial Sudoku:', sudoku);

    return sudoku;
}

function update_sudoku(steps, cells) {

    let step_index = 0;

    function update_cells(step) {

        step.forEach((row, i) => {

            row.forEach((value, j) => {

                const cell = cells[i * 9 + j];

                cell.innerText = value === 0 ? '' : value.toString();

            });

        });

    }

    function showNextStep() {

        if (step_index < steps.length) {

            console.log(`Step ${step_index + 1}:`, steps[step_index]);

            update_cells(steps[step_index]);

            step_index++;

            setTimeout(showNextStep, 5);

        }

    }

    showNextStep();

}

function solve_sudoku() {

    var sudoku = get_sudoku();

    fetch('https://ahmetalper-sudoku.hf.space/solver', {method : 'POST', body : JSON.stringify({sudoku : sudoku})})

        .then(response => response.json())

        .then(data => {

            console.log('API Response:', data);

            if (data.steps && Array.isArray(data.steps)) {

                const steps = data.steps;

                console.log('Steps:', steps);
                
                update_sudoku(steps, cells);

            } else {

                console.error('Invalid steps data:', data.steps);

            }

        })

        .catch(error => {

            console.error(`Error --> ${error}`);

        });
}

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {

    cell.setAttribute('contenteditable', 'true');

    cell.addEventListener('keydown', (event) => {

        const key = event.key;

        if (key === 'Backspace' || key === 'Delete') {

            return true;

        }

        if (key >= '1' && key <= '9') {

            cell.innerText = key;

            event.preventDefault();

            let currentCell = cell;
            let nextCell = null;

            while (!nextCell) {

                nextCell = currentCell.nextElementSibling;

                if (!nextCell) {

                    const currentRow = currentCell.parentElement;
                    const nextRow = currentRow.nextElementSibling;

                    if (nextRow) {

                        nextCell = nextRow.querySelector('.cell');

                    } else {

                        break;

                    }
                }

                currentCell = nextCell;

                if (nextCell && nextCell.getAttribute('contenteditable') !== 'true') {

                    nextCell = null;

                }

            }

            if (nextCell) nextCell.focus();

            return;
        }

        event.preventDefault();

    });

});

const solve_button = document.querySelector('.solve-button');

solve_button.addEventListener('click', solve_sudoku);
