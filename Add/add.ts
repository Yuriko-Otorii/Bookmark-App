interface Article {
    article: {
        // id: number,
        url: string,
        title: string,
        category: string,
        cover: string,
        date: string
    }
}

// interface Category {
//     category: string,
// }

// const colorArr: object = [
const colorArr = [
    {"default-select": "rgb(255, 255, 255)"}, //white
    {"Orange": "rgb(250, 130, 49)"},
    {"Yellow": "rgb(255, 250, 101)"},
    {"Blue": "rgb(61, 193, 211)"},
    {"Purple": "#rgb(205, 132, 241)"},
    {"Red": "rgb(255, 56, 56)"},
    {"Pink": "rgb(255, 184, 184)"},
    {"Green": "rgb(46, 213, 115)"},
    {"Gray": "rgb(165, 177, 194)"}
]

function changeColor(){
    const selectedColor = document.getElementById('changeSelect') as HTMLSelectElement;
    let displayArea = document.querySelector('.color-display') as HTMLElement; 
    if(selectedColor){
        const value = selectedColor.value;
        colorArr.forEach(e => {
            value === Object.keys(e)[0] && (displayArea.style.backgroundColor = `${Object.values(e)}`);
        })   
    }
}

function createArticle(){
    const urlHTMLElem = document.getElementById("url") as HTMLInputElement;
    const titleHTMLElem = document.getElementById("title") as HTMLInputElement;
    const categoryHTMLElem = document.getElementById("category") as HTMLInputElement;
    const urlValue = urlHTMLElem.value;
    const titleValue = titleHTMLElem.value;
    const categoryValue = categoryHTMLElem.value;

    const registeredDate = new Date();
    const registerMonth = (registeredDate.getMonth()+1);
    const registerDate = registeredDate.getDate();
    const registerYear = registeredDate.getFullYear();
    const formattedDate = `${registerMonth}/${registerDate}/${registerYear}`

    const selectedColorElem = document.querySelector('.color-display') as HTMLElement;
    const cover = window.getComputedStyle(selectedColorElem).getPropertyValue('background-color');

    
    const article: Article = {
        article: {
            url: urlValue,
            title: titleValue,
            category: categoryValue,
            cover: cover,
            date: formattedDate
        }
    }
    
    return article;   
}

//Post 
async function postArticle() {
    const articleContent = createArticle();

    //Post article
    fetch("http://localhost:3000/articles",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleContent)
    })
    .then(response => {
        return response.json();
    })

    //Post category
    const categoryHTMLElem = document.getElementById("category") as HTMLInputElement;
    const categoryValue = categoryHTMLElem.value;
    const categoryList: string[] = [];
    const lowerCaseList: string[] = [];
    
    //Get categorie to chack dupulication
    fetch("http://localhost:3000/categories", {
        method: "GET"
    }).then(response => response.json())
    .then(data => {
    const dataArray = Array.from(data);
    
    // dataArray.forEach(e => {
    //     categoryList.push(e.category);
    // })

    for (const [key, value] of Object.entries(dataArray)) {
        if (value) {
            categoryList.push(`${value}`);
        }
    }
        categoryList.forEach(e => lowerCaseList.push(e.toLowerCase()));
        const isExist = lowerCaseList.indexOf(categoryValue.toLowerCase());
        checkCategoryDuplication(isExist, categoryValue)
    });
}

//Check category duplication
function checkCategoryDuplication(checkIndex: number, categoryValue: string){
    if(checkIndex === -1){
        const data = {
            "category": categoryValue
            }
        fetch("http://localhost:3000/categories",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
    }
}


const addBtn = document.querySelector('.add-btn') as HTMLButtonElement;
addBtn.addEventListener('click', () => {
    postArticle();
});











