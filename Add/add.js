var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// interface Category {
//     category: string,
// }
// const colorArr: object = [
var colorArr = [
    { "default-select": "rgb(255, 255, 255)" },
    { "Orange": "rgb(250, 130, 49)" },
    { "Yellow": "rgb(255, 250, 101)" },
    { "Blue": "rgb(61, 193, 211)" },
    { "Purple": "#rgb(205, 132, 241)" },
    { "Red": "rgb(255, 56, 56)" },
    { "Pink": "rgb(255, 184, 184)" },
    { "Green": "rgb(46, 213, 115)" },
    { "Gray": "rgb(165, 177, 194)" }
];
function changeColor() {
    var selectedColor = document.getElementById('changeSelect');
    var displayArea = document.querySelector('.color-display');
    if (selectedColor) {
        var value_1 = selectedColor.value;
        colorArr.forEach(function (e) {
            value_1 === Object.keys(e)[0] && (displayArea.style.backgroundColor = "".concat(Object.values(e)));
        });
    }
}
function createArticle() {
    var urlHTMLElem = document.getElementById("url");
    var titleHTMLElem = document.getElementById("title");
    var categoryHTMLElem = document.getElementById("category");
    var urlValue = urlHTMLElem.value;
    var titleValue = titleHTMLElem.value;
    var categoryValue = categoryHTMLElem.value;
    var registeredDate = new Date();
    var registerMonth = (registeredDate.getMonth() + 1);
    var registerDate = registeredDate.getDate();
    var registerYear = registeredDate.getFullYear();
    var formattedDate = "".concat(registerMonth, "/").concat(registerDate, "/").concat(registerYear);
    var selectedColorElem = document.querySelector('.color-display');
    var cover = window.getComputedStyle(selectedColorElem).getPropertyValue('background-color');
    var article = {
        article: {
            // id: idCount,
            url: urlValue,
            title: titleValue,
            category: categoryValue,
            cover: cover,
            date: formattedDate
        }
    };
    return article;
}
//Post 
function postArticle() {
    return __awaiter(this, void 0, void 0, function () {
        var articleContent, categoryHTMLElem, categoryValue, categoryList, lowerCaseList;
        return __generator(this, function (_a) {
            articleContent = createArticle();
            //Post article
            fetch("http://localhost:3000/articles", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleContent)
            })
                .then(function (response) {
                return response.json();
            });
            categoryHTMLElem = document.getElementById("category");
            categoryValue = categoryHTMLElem.value;
            categoryList = [];
            lowerCaseList = [];
            //Get categorie to chack dupulication
            fetch("http://localhost:3000/categories", {
                method: "GET"
            }).then(function (response) { return response.json(); })
                .then(function (data) {
                var dataArray = Array.from(data);
                // dataArray.forEach(e => {
                //     categoryList.push(e.category);
                // })
                for (var _i = 0, _a = Object.entries(dataArray); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    if (value) {
                        categoryList.push("&{value}");
                    }
                }
                categoryList.forEach(function (e) { return lowerCaseList.push(e.toLowerCase()); });
                var isExist = lowerCaseList.indexOf(categoryValue.toLowerCase());
                checkCategoryDuplication(isExist, categoryValue);
            });
            return [2 /*return*/];
        });
    });
}
//Check category duplication
function checkCategoryDuplication(checkIndex, categoryValue) {
    if (checkIndex === -1) {
        var data = {
            "category": categoryValue
        };
        fetch("http://localhost:3000/categories", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
            return response.json();
        });
    }
}
var addBtn = document.querySelector('.add-btn');
addBtn.addEventListener('click', function () {
    postArticle();
});
