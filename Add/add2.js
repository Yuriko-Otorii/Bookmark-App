const colorArr = [
    {"default-select": "rgb(255, 255, 255)"}, //white
    {"Orange": "rgb(252, 161, 100)"},
    {"Yellow": "rgb(252, 248, 128)"},
    {"Blue": "rgb(117, 221, 221)"},
    {"Purple": "rgb(212, 161, 238)"},
    {"Red": "rgb(255, 120, 131)"},
    {"Pink": "rgb(255, 184, 184)"},
    {"Green": "rgb(169, 229, 187)"},
    {"Gray": "rgb(165, 177, 194)"}
]
function changeColor(){
    const selectedColor = document.getElementById('changeSelect');
    const displayArea = document.querySelector('.color-display'); 
    if(selectedColor){
        const value = selectedColor.value;
        colorArr.forEach(e => {
            value === Object.keys(e)[0] && (displayArea.style.backgroundColor = Object.values(e));
        })
    }
}

const categoryList = [];  
fetch("http://localhost:3000/categories", {
        method: "GET"
    }).then(response => response.json())
    .then(data => {
        const dataArray = Array.from(data);
        dataArray.forEach(e => {
            categoryList.push(e.category.toLowerCase());
        })
    })

function createArticle(){
    const urlHTMLElem = document.getElementById("url");
    const titleHTMLElem = document.getElementById("title");
    const categoryHTMLElem = document.getElementById("category");
    const urlValue = urlHTMLElem.value;
    const titleValue = titleHTMLElem.value;
    const categoryValue = categoryHTMLElem.value;

    const registeredDate = new Date();
    const registerMonth = (registeredDate.getMonth()+1);
    const registerDate = registeredDate.getDate();
    const registerYear = registeredDate.getFullYear();
    const formattedDate = `${registerMonth}/${registerDate}/${registerYear}`

    const selectedColorElem = document.querySelector('.color-display');
    const cover = window.getComputedStyle(selectedColorElem).getPropertyValue('background-color');
    
    const article = {
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

async function httpRequests(){
    //Post article
    const articleContent = createArticle();
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

    const categoryHTMLElem = document.getElementById("category");
    const categoryValue = categoryHTMLElem.value;
      
    //Post category
    // fetch("http://localhost:3000/categories", {
    //     method: "GET"
    // }).then(response => response.json())
    // .then(data => {
    //     const dataArray = Array.from(data);
    //     dataArray.forEach(e => {
    //         categoryList.push(e.category.toLowerCase());
    // })
        
    //     checkCategoryDuplication(isExist, categoryValue.toLowerCase())
    // });
    const isExist = categoryList.indexOf(categoryValue.toLowerCase())
    if(isExist === -1){
        const data = {
            "category": categoryValue.toLowerCase()
            }
        await fetch("http://localhost:3000/categories",
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



//Check category duplication
function checkCategoryDuplication(checkIndex, categoryValue){
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



const addBtn = document.querySelector('.add-btn');
addBtn.addEventListener('click', () => {
    const urlInput = document.querySelector('#url').value;
    const titleInput = document.querySelector('#title').value;
    const categoryInput = document.querySelector('#category').value;
    if(!(urlInput) || !(titleInput) || !(categoryInput)){
        alert('All inputs are required.')
    }else{
        httpRequests();
    }
});

//Set drop down height
const selectElem = document.querySelector("#changeSelect");
selectElem.addEventListener("focus", e => {
    if(e.currentTarget.options.length > 6){
        e.currentTarget.size = "7";
        selectElem.style.position = '';
    }
});
selectElem.addEventListener("blur", e => {
    e.currentTarget.size = "1";
});




// https://rightcode.co.jp/blog/information-technology/json-server-rest-api-mock-server-syain
//Open server
//https://www.xlsoft.com/jp/blog/blog/2019/08/20/post-7139/

