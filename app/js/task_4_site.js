// Необхідні змінні
let index = 0;
let paintings;

// Обробка бокового меню
function click_on_menu (object) {

   // Видаляємо клас "active" з усіх елементів меню
   $("li.nav-item").removeClass("active");

   // Отримуємо елемент, на який натиснули
   let item = $(object);

   // Задаємо активному елементу клас "active"
   item.addClass("active");

   // Отримуємо id активного елемента
   let id = item.attr('id');

   // Виконуємо необхідну дію
   switch (id) {

      // Перехід на головну сторінку
      case "menu_home": 
         setTimeout(() => {
            document.location.href = "../index.html";
         }, 500);
      break;

      // Відобразити список картин
      case "menu_painting":
         $("#div_task").attr("hidden", "");
         $("#div_galery").removeAttr("hidden");   
      break;

      // Відобразити завдання
      case "menu_task":
         $("#div_task").removeAttr("hidden");
         $("#div_galery").attr("hidden", "");   
      break;

      // Відобразити випадкову картину
      case "menu_random":
         click_on_painting(-1);
      break;
   }
}

// Обробка вибору картини
function click_on_painting (object) {

   let element;

   if (object === -1)
      { element = paintings[Math.floor(Math.random() * paintings.length)]; }
   else
      { element = $(object).attr("data"); }
   
   $.get(`../data/text/${element}.txt`, (data) => {

      let item_data = data.split("\n");

      let block =
        `<div class="modal-header border-secondary">
            <div class="d-flex flex-column ms-3">
               <h3 class="m-0">${item_data[0]}</h3>
               <span>Автор: ${item_data[1]}</span>
            </div>
            <button type="button" class="btn-close bg-primary me-3" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         
         <div class="modal-body">
            <img src="../data/img/${item_data[2]}.jpeg" class="w-100" alt="painting">
         </div>
         
         <div class="modal-footer border-secondary">
            <h5>${item_data[3]}</h5>
         </div>`;

      $("#modal_content").html(block);
      $('#modal').modal('show');
      
   });
}

// Підвантаження нових даних
function load_more_paintings (count) {

   let id = 0;
   while (id < count) {

      if (index >= paintings.length) { disable_load_button();
                                       return; }

      $.get(`../data/text/${paintings[index]}.txt`, (data) => {

         let item_data = data.split("\n");

         let block =
            `<div class="col-md-6 col-lg-4">
               <div class="p-2 painting" onclick="click_on_painting(this)" data="${item_data[2]}">
                  <img src="../data/img/${item_data[2]}.jpeg" class="w-100" alt="painting">
                  <div class="bg-primary text-center">${item_data[0]}</div>
               </div>
            </div>`;
   
         $("#paintings").append(block);
         
      });

      id++;
      index++;
   }
}

// Вимкнення кнопки "показати більше картин"
function disable_load_button() {
   $("#load").addClass("disabled");
}

// Реагуємо на закривання модального вікна
$("#modal").on("hidden.bs.modal", () => {
   $("li.nav-item").removeClass("active");
   $("#menu_painting").addClass("active");
   $("#div_task").attr("hidden", "");
   $("#div_galery").removeAttr("hidden");
});

// Завантаження початкових даних
$(document).ready(() => {    
   setTimeout(() => {
      $.get("../data/data.txt", (data) => {
         paintings = data.split("\n");
         paintings.splice(paintings.length - 1, 1);
         load_more_paintings(6);
      });
   }, 300);
});