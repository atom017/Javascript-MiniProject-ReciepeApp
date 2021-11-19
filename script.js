const searchBtn = document.getElementById('search-btn');
const mealList = document.querySelector('.meals');
const mealsContent = document.querySelector('.reciepe-content');
const closeBtn = document.getElementById('close-btn');
const randomBtn = document.getElementById('random-btn');
const overlay = document.getElementById("overlay");
const title = document.getElementById("search-title");

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
randomBtn.addEventListener('click',getRandomMeal);
closeBtn.addEventListener('click', () => {
    
    mealsContent.parentElement.classList.remove('show-reciepe');
    overlay.style.display='none';
});


// get meal list that matches with the ingredients
function getMealList(){
    
    let searchInputTxt = document.getElementById('search-box').value.trim();
    title.innerText = 'Search Result: '+searchInputTxt;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "img-container">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "reciepe-btn btn">Get Recipe</a>
                            <a href = "#" class = "ingredient-btn btn">Ingredients</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry,No meal found with this ingredient!";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    });
}


function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('reciepe-btn')){
        console.log(e.target);
        
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => {
            mealRecipeModal(data.meals);
            
        });
        
    }
    if(e.target.classList.contains('ingredient-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => {
            getIngredients(data.meals);
            
        });
    }
}


function mealRecipeModal(meal){
    mealsContent.innerHTML='';
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "reciepe-category">${meal.strCategory}</p>
        <div class = "reciepe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "reciepe-img-container">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
   
    overlay.style.display='block';
    mealsContent.innerHTML = html;
    mealsContent.parentElement.classList.add('show-reciepe');
    
}

function getIngredients(meal){
    mealsContent.innerHTML='';
    
    meal=meal[0];
    let ul = document.createElement('ul');
    let h3 = document.createElement('h3');
    h3.innerText=meal['strMeal'];
    ul.classList.add('ingredients');
    mealsContent.appendChild(h3);
    for(let i=1; i<21;i++){
        let str = 'strIngredient'+i;
        
        if(meal[str] !== '' && meal[str] !== null){
           
            let node = document.createElement("LI");   
            let textnode = document.createTextNode(meal[str]);         
            node.appendChild(textnode);                              
            ul.appendChild(node);
        }
    }
    
    overlay.style.display='block';
    mealsContent.appendChild(ul);
    mealsContent.parentElement.classList.add('show-reciepe');

}

function getRandomMeal(){
    title.innerText='Random Meal'
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data =>{
        if(data.meals){
            let meal = data.meals[0];
            let html = `
            <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "img-container">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "reciepe-btn btn">Get Recipe</a>
                            <a href = "#" class = "ingredient-btn btn">Ingredients</a>
                        </div>
                    </div>`;
                    mealList.innerHTML = html;
        }
        else{
            mealList.innerHTML = 'Not found';
        }
    });
}