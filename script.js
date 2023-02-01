const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

const parseJson = (response) =>  {
    return response.json()
}

const createHeaders = (items, table) => {
    const header = table.createTHead();
    const headerRow = header.insertRow();

    Object.keys(items).forEach((title, index) => {
        const headerCell = document.createElement("th");
        headerRow.appendChild(headerCell);
        headerCell.innerHTML = title;
    });
}


const fetchWord = (word) => {
    const resultsDisplay = document.querySelector(".results")

    const url = `https://chroniclingamerica.loc.gov/search/titles/results/?terms=${word}&format=json`

    fetch(`${url}`)
        .then(checkStatus)
        .then(parseJson)
        .then(function(data) {
            const items = Object.entries(data).filter((array) => { return array[0] === "items"})[0][1] ;
            if(items.length > 0) {
                resultsDisplay.classList.remove('not-exists')
                resultsDisplay.textContent = ""
                const itemsToDisplay = items.slice(0, 10);
                const table = document.createElement("table");
                createHeaders(itemsToDisplay[0], table)
                //itemsToDisplay.forEach((item, index) => createDomElement(item, index, table))
                resultsDisplay.appendChild(table)
            } else {
                resultsDisplay.classList.add('not-exists')
                resultsDisplay.textContent = "No results, try again"
            }

        }).catch(function(error) {
        console.log('Request failed', error);
    });
}

function formSubmitHandler (e) {
    e.preventDefault();

    const inputValue = document.getElementById('word').value;

    if(inputValue.length > 0) {
        fetchWord(inputValue);
    }

}


document.addEventListener("DOMContentLoaded", () => {
    const form =  document.querySelector("form");

    form.addEventListener('submit',(e) => {
        formSubmitHandler(e)
    })
})
