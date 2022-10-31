const articleListContainer = document.querySelector('.card-container');
const cardContainerTemplate = document.querySelector('.temp-card');

//Create current cards category list
const otherCategories = [];
window.addEventListener('load', () => {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(e => {
        otherCategories.push(e.getAttribute('name').toLowerCase()) 
    });
})

function createNode(cover, id, url, title, category){
    const itemClone = document.importNode(cardContainerTemplate.content, true);
    let containerclone = itemClone.querySelector('div');
    let cardTitleClone = itemClone.querySelector('p');
    let cardAtagClone = itemClone.querySelector('a');

    containerclone.setAttribute('style', 'background-color');
    containerclone.setAttribute('name', category);
    containerclone.style.backgroundColor = cover;
    containerclone.setAttribute('id', id);
    cardAtagClone.setAttribute('href', url);
    cardTitleClone.innerHTML = title;

    articleListContainer.appendChild(itemClone); 
}

//Get articles
const articleArr = [];
fetch("http://localhost:3000/articles", {
    method: "GET"
}).then(response => response.json())
.then(data => {
    const dataArray = Array.from(data);
    dataArray.forEach(e => {   
        createNode(e.article.cover, e.id, e.article.url, e.article.title, e.article.category);
        articleArr.push(e);
    })
});

//Get target Category id in db.json
const dblowerCaseList = [];
const dbCaseList = [];
const categoryArr = [];
const filterContainer = document.querySelector('#categorySelect');
fetch("http://localhost:3000/categories", {
method: "GET"
}).then(response => response.json())
.then(data => {
    const dataArray = Array.from(data);
    dataArray.forEach(e => {
        dblowerCaseList.push(e.category.toLowerCase());
        dbCaseList.push(e);

        //Filter Setting
        categoryArr.push(e.category);
        const optionTemplate = document.querySelector('.temp-option');
        const optionClone = document.importNode(optionTemplate.content, true);
        let optionCloneElem = optionClone.querySelector('.option-elem');
        
        optionCloneElem.setAttribute('value', e.category);
        optionCloneElem.textContent = e.category;
        filterContainer.appendChild(optionCloneElem);
    })
});

const visitLinkBtn = document.querySelector('.go-link');
const editBtn = document.querySelector('.edit');
const deleteBtn = document.querySelector('.delete');
const comfirmBtn = document.querySelector('.comfirm-btn');
const editDisplay = document.querySelector('.edit-display');
//Edit
editBtn.addEventListener('click', e => {
    const parentNode = e.target.parentNode.parentNode.parentNode;
    const titleElem = parentNode.querySelector('.modal-title');
    const titleInput = parentNode.querySelector('.modal-title-input');
    const categoryElem = parentNode.querySelector('.modal-category');
    const categorySpanElem = parentNode.querySelector('.modal-category span');
    const categoryInput = parentNode.querySelector('.modal-category-input');
    const url = parentNode.querySelector('.go-link').getAttribute('href');
    const coverElem = parentNode.querySelector('.modal-header');
    const date = parentNode.querySelector('.added-date');    

    visitLinkBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    editBtn.style.display = 'none';
    editDisplay.style.display = 'block';
    
    titleElem.style.display = 'none';
    titleInput.style.display = 'block';
    titleInput.value = titleElem.textContent;
    categoryElem.style.display = 'none';
    categoryInput.style.display = 'block';
    categoryInput.value = categorySpanElem.textContent;
    comfirmBtn.style.display = 'block';
    
    //Set drop down height
    const selectElem = document.querySelector("#editChangeSelect");
    selectElem.addEventListener("focus", e => {
        if(e.currentTarget.options.length > 4){
            e.currentTarget.size = "4";
            comfirmBtn.style.marginTop = '1rem';
        }
    });
    selectElem.addEventListener("blur", e => {
        e.currentTarget.size = "1";
        comfirmBtn.style.marginTop = '2rem';
    });

    const prevCategory = categorySpanElem.textContent.toLowerCase();
    comfirmBtn.addEventListener('click', e => {
        const changedCover = window.getComputedStyle(coverElem).getPropertyValue('background-color');
        titleElem.textContent = titleInput.value;
        categorySpanElem.textContent = categoryInput.value;
        const newCategory = categoryInput.value.toLowerCase();
        const targeId = parentNode.querySelector('.modal-header').getAttribute('id');
        const edittedData = {
            "article": {
                url: url,
                title: titleInput.value,
                category: categoryInput.value,
                cover: changedCover,
                date: date.textContent
            }
        }       
       
        categoryHttpRequests(prevCategory, newCategory, otherCategories, dblowerCaseList, dbCaseList, edittedData, targeId);

        titleElem.style.display = 'block';
        titleInput.style.display = 'none';
        categoryElem.style.display = 'block';
        categoryInput.style.display = 'none';

        comfirmBtn.style.display = 'none';
        visitLinkBtn.style.display = 'block';
        deleteBtn.style.display = 'block';
        editBtn.style.display = 'block';
        editDisplay.style.display = 'none';
    })
})

//Check category diff
async function categoryHttpRequests(prevCategory, newCategory, otherCategories, dblowerCaseList, dbCaseList, edittedData, targeId){
    if(prevCategory !== newCategory){
        //Check if $prevCategory is the last one category in current cards category list 
        const prevCategoryFirstIndex = otherCategories.indexOf(prevCategory);
        const prevCategoryLastIndex = otherCategories.lastIndexOf(prevCategory);
        if(prevCategoryFirstIndex === prevCategoryLastIndex){
            const arrIndex = dblowerCaseList.findIndex(e => e === prevCategory);
            const dbId = dbCaseList[arrIndex].id;
            // Delete prevCategor from db.json
            fetch('http://localhost:3000/categories/' + dbId, 
            {
                method: 'DELETE'
            })
        }

        // Check if other card have the same value of newCategory 
        const newCategoryFirstIndex = otherCategories.indexOf(newCategory);
        if(newCategoryFirstIndex === -1){
            //Post newCategory to db.json
            const data = {
                "category": newCategory
            }
            fetch('http://localhost:3000/categories/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
        }
    }

    await fetch('http://localhost:3000/articles/' + targeId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(edittedData)
      })    
}


//Edit color pick function
function editChangeColor(){
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
    const selectedColor = document.getElementById('editChangeSelect');
    const displayArea = document.querySelector('.modal-header'); 
    if(selectedColor){
        const value = selectedColor.value;
        colorArr.forEach(e => {
            value === Object.keys(e)[0] && (displayArea.style.backgroundColor = Object.values(e));
        })
    }
}


//Delete
deleteBtn.addEventListener('click', e => {
    articleCategoryDelete(e.target)
    // const msg = "Are you sure to delete this article?"
    // const confirmWindow = window.confirm(msg);    
    // if(confirmWindow){
    //     const parentElem = e.target.parentNode.parentNode.parentNode;
    //     const targeId = parentElem.querySelector('.modal-header').getAttribute('id');
    //     fetch('http://localhost:3000/articles/' + targeId, {
    //         method: 'DELETE'
    //     })
    // }
})

async function articleCategoryDelete(e){
    const msg = "Are you sure to delete this article?"
    const confirmWindow = window.confirm(msg);    
    const parentElem = e.parentNode.parentNode.parentNode;
    if(confirmWindow){
        const targeId = parentElem.querySelector('.modal-header').getAttribute('id');
        await fetch('http://localhost:3000/articles/' + targeId, {
            method: 'DELETE'
        })
    }
    //Check if same value of targetCategory exist in current cards' category
    const targetCategoryName = parentElem.querySelector('.modal-category-info').getAttribute('name').toLowerCase(   );
    const categoryFirstIndex = otherCategories.indexOf(targetCategoryName);
    const CategoryLastIndex = otherCategories.lastIndexOf(targetCategoryName);
    if(categoryFirstIndex === CategoryLastIndex){
        const arrIndex = dblowerCaseList.findIndex(e => e === targetCategoryName.toLowerCase());
        const dbId = dbCaseList[arrIndex].id;
        // Delete prevCategor from db.json
        await fetch('http://localhost:3000/categories/' + dbId, 
        {
            method: 'DELETE'
        })
    }     
}


//Modal window setting
function modalContentsSet(targetNode){
    const targetColor = window.getComputedStyle(targetNode).getPropertyValue('background-color');
    const modalHeader = document.querySelector('.modal-header');
    const modalCategoryInfo = document.querySelector('.modal-category-info');
    let modalTitle = document.querySelector('.modal-title');
    let modalDate = document.querySelector('.added-date');
    let modalLink = document.querySelector('.go-link');
    let modalCategory = document.querySelector('.modal-category span');
    let modalAtag = document.querySelector('.go-link');

    //Set category info
    const categoryName = targetNode.getAttribute('name').toLowerCase();
    modalCategoryInfo.setAttribute('name', categoryName);
    //Set color
    modalHeader.style.background = `linear-gradient(180deg, ${targetColor} 50%);`;
    modalHeader.style.backgroundColor = targetColor;
    //Set title
    const targetTitle = targetNode.querySelector('.card-title');
    modalTitle.textContent = targetTitle.textContent;
    //Set url
    const targetUrl = targetNode.querySelector('a').getAttribute('href');
    modalLink.setAttribute('href', targetUrl);
    //set category
    modalCategory.textContent = targetNode.getAttribute('name');
    //Set date
    const targetId = targetNode.getAttribute('id');
    const targetArticle = articleArr.filter((e) => {
        return e.id == targetId;
    })
    modalDate.textContent = targetArticle[0].article.date;
    //Set id
    modalHeader.setAttribute('id', targetId);
    //Set visit link
    const targetAtag = targetNode.querySelector('.card a');
    modalAtag.setAttribute('href', targetAtag.getAttribute('href'));
    }

//Modal window open
const modalWindow = document.querySelector('.modal-window-wrapper');
window.addEventListener('click', e => {
    if(e.target.className === 'card' || e.target.className === 'card-title'){        
        if(e.target.className === 'card'){
            modalContentsSet(e.target);
        }else{
            const parentNode = e.target.parentNode;
            modalContentsSet(parentNode);
        }
        modalWindow.style.visibility = 'visible';
        modalWindow.style.opacity = '1';
    }
})

//Modal close
const closeBtn = document.querySelector('.fa-xmark');
function resetEditStyle(elem){
    modalWindow.style.visibility = 'hidden';
    modalWindow.style.opacity = '0';
    const parentNode = elem.target.parentNode.parentNode.parentNode;
    const titleElem = parentNode.querySelector('.modal-title');
    const titleInput = parentNode.querySelector('.modal-title-input');
    const categoryElem = parentNode.querySelector('.modal-category');
    const categoryInput = parentNode.querySelector('.modal-category-input');

    titleInput.value && (titleElem.textContent = titleInput.value);
    categoryInput.value && (categoryInput.textContent = categoryInput.value);

    titleElem.style.display = 'block';
    titleInput.style.display = 'none';
    categoryElem.style.display = 'block';
    categoryInput.style.display = 'none';
    comfirmBtn.style.display = 'none';

    visitLinkBtn.style.display = 'block';
    deleteBtn.style.display = 'block';
    editBtn.style.display = 'block';
    editDisplay.style.display = 'none';
}
closeBtn.addEventListener('click', e => {
    resetEditStyle(e);
})
const outsideModal = document.querySelector('.article-modal');
addEventListener('click', e => {
    if(e.target == outsideModal){
        resetEditStyle(e);
    }
})


//Filter function
function filterCategory(){
    const selectElem = document.querySelector('#categorySelect');
    const allCardList = Array.from(document.querySelectorAll('.card'));

    if(selectElem){
        const selectedValue = selectElem.value;
        for(let i = 0; i < allCardList.length; i++){            
            if(allCardList[i].getAttribute('name').toLowerCase() == selectedValue.toLowerCase()){
                allCardList[i].style.display = 'flex';
                
            }else if(!(allCardList[i].getAttribute('name').toLowerCase() == selectedValue.toLowerCase())){
                allCardList[i].style.display = 'none';
            }
            if(selectedValue === 'All'){
                allCardList[i].style.display = 'flex';
            }
        }
    }
}



