function updateDish(dishId){
  let menu = JSON.parse(localStorage.getItem('menu'));
  if (dishId > 0){
    let name = $("#dish_name").val();
    let description = $("#dish_description").val();
    let price = $("#dish_cost").val();
    let price_member = $("#dish_member_cost").val();
    let picture = $("#dish_picture").val();
    let category = $("#dish_category").val();
    let tag = $("#dish_tag").val();

    menu.forEach(element => {
      if (element.id == dishId) {
        element.name = name;
        element.description = description;
        element.price = price;
        element.price_member = price_member;
        element.picture = picture;
        element.category = category;
        element.tag = tag;
      }
    });
  }
  else{
    let id = menu.length + 1;
    let name = $("#dish_name").val();
    let description = $("#dish_description").val();
    let price = $("#dish_cost").val();
    let price_member = $("#dish_member_cost").val();
    let picture = $("#dish_picture").val();
    let category = $("#dish_category").val();
    let tag = $("#dish_tag").val();
    let dish = {
      "id": id,
      "name": name,
      "description": description,
      "price": price,
      "price_member": price_member,
      "picture": picture,
      "category": category,
      "tag": tag
    };
    menu.push(dish);
  }
  
  localStorage.setItem('menu', JSON.stringify(menu));
}

function showDishModal(dishId){

  $('form[name="updateDishForm"]').attr("onsubmit", "return updateDish("+dishId+")");
  if (dishId > 0) {

    let menu = JSON.parse(localStorage.getItem('menu'));

    menu.forEach(element => {
      if (element.id == dishId) {
        $("#dish_name").val(element.name);
        $("#dish_description").val(element.description);
        $("#dish_cost").val(element.price);
        $("#dish_member_cost").val(element.price_member);
        $("#dish_picture").val(element.picture);
        $("#dish_category").val(element.category);
        $("#dish_tag").val(element.tag);
      }
    });
    

  }
  else{
    $("#dish_name").val("");
        $("#dish_description").val("");
        $("#dish_cost").val("");
        $("#dish_member_cost").val("");
        $("#dish_picture").val("");
        $("#dish_category").val("");
        $("#dish_tag").val("");
    $("#submitDishBtn").text("הוסף");
  }

  $('#updateDishModal').modal('toggle');
  
}


function addToCart(dishId){
  
  let quantity = $("#quantityTxt").val();
  let cartOrders = [];
  if (localStorage.getItem('userShopList') !== null){
    cartOrders = JSON.parse(localStorage.getItem('userShopList'));
  }
  for (let i = 0; i < quantity; i++){
    cartOrders.push(dishId);
  }
  localStorage.setItem('userShopList', JSON.stringify(cartOrders));
  $('#addToCartModal').modal('toggle');
  $('.back-to-top').fadeIn('slow');
  return false;
}

function showAddToCartModal(dishId){
  $('form[name="updateShopCartForm"]').attr("onsubmit", "return addToCart("+dishId+")");
  let menu = JSON.parse(localStorage.getItem('menu'));
  menu.forEach(element => {
    if (element.id == dishId) {
      $("#dishNameHeader").text("הנך מוסיף להזמנה " + element.name);
    }
  });
  $("input[name='quant[1]']").val("1");
  $('#addToCartModal').modal('toggle');
}


function isUserAdmin(userId){
  let users = JSON.parse(localStorage.getItem('members'));
  let isUserAdmin = false;
    users.forEach(element => {
        if (element.isAdmin == 1 && element.id == userId){
          isUserAdmin = true;
        }
    });
    return isUserAdmin;
}


function logOut(){
  localStorage.removeItem("loggedUserId");
  location.reload();
}

function getUserFullName(userId){
  let users = JSON.parse(localStorage.getItem('members'));
  let userFullName = "";
    users.forEach(element => {
        if (element.id == userId){
          userFullName = element.first_name + " " + element.last_name;
        }
    });
    return userFullName;
}

function loadMenu(memberFlag){
  let menu = JSON.parse(localStorage.getItem('menu'));

    let menuDiv = ""

    menu.forEach(element => {
    let categoryName = "";
    if (element.category == "Lunch"){
    categoryName = "filter-starters";
    }
    else if (element.category == "Salad"){
    categoryName = "filter-salads";
    }
    else{
    categoryName = "filter-specialty";
    }
    menuDiv += "<div class=\"col-lg-6 menu-item " + categoryName + "\">";
      menuDiv += "<img src=\"assets/img/menu/"+element.picture+"\" class=\"menu-img\">";
      menuDiv += "<div class=\"menu-content\">";
      if (memberFlag){//"<a href=\"javascript:showDishModal("+element.id+");\"><img src=\"assets/img/edit.png\" width=\"5%\"></a><span>"
          userAdminFlag = isUserAdmin(localStorage.getItem("loggedUserId"));
          menuDiv += "<a href=\"javascript:showAddToCartModal("+element.id+");\">"  + element.name + "</a>"+ (userAdminFlag ? "<a href=\"javascript:showDishModal("+element.id+");\"><img src=\"assets/img/edit.png\" width=\"5%\"></a>" : "") + "<span>" + element.price_member+"₪</span>";
          if (userAdminFlag){
            $("#addDish").show();
          }
      }
      else
          menuDiv += "<a href=\"javascript:showAddToCartModal("+element.id+");\">"  + element.name+"</a><span>"+element.price+"₪</span>";
      menuDiv += "</div>";
      menuDiv += "<div class=\"menu-ingredients\">";
            menuDiv += element.description
      menuDiv += "</div>";
    menuDiv += "</div>";
    });


    $("#menu-items").html(menuDiv);
}


function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

$(document).ready(function () {
  
  
  if (localStorage.getItem('userShopList') !== null) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }

    //window.localStorage.clear();
if (localStorage.getItem("menu") === null) {
    $.getJSON('https://raw.githubusercontent.com/ofeksadlo/resturantSite/main/db.json').always({ get_param: 'value' }, function(data) {
    localStorage.setItem('menu', JSON.stringify(data['menu']))
    localStorage.setItem('orders', JSON.stringify(data['orders']))
    localStorage.setItem('members', JSON.stringify(data['members'])) 
    sleep(500);
    loadMenu(false);
    });
}
else {
  if (localStorage.getItem("loggedUserId") !== null) {
    $("#welcome-header").html("ברוך הבא, " + getUserFullName(localStorage.getItem("loggedUserId")) + ".<br> למסעדה הפרסית <span>האותנטית.</span>");
    loadMenu(true);
    $("#logoutLink").html("<a href=\"javascript:logOut();\">התנתק</a>");
    $("#logInLink").hide("slow");
  }
  else{
    loadMenu(false);
  }
}




});