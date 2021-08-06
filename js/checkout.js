let totalPrice = 0;
$(document).ready(function () {
    $("#contentDiv").fadeIn("slow");
    cartOrders = JSON.parse(localStorage.getItem('userShopList'));
    
    let orderList = "";
    
    cartOrders.forEach(element => {
        let dish = getDish(element);
        orderList += "<li class=\"list-group-item d-flex justify-content-between lh-sm\">";
        orderList += "<div>";
            orderList += "<h6 class=\"my-0\">"+dish.name+"</h6>";
        orderList += "</div>";
        if (localStorage.getItem('loggedUserId') === null) {
            orderList += "<span class=\"text-muted\">"+dish.price+"₪</span>";
            totalPrice += dish.price;
        }
        else {
            orderList += "<span class=\"text-muted\">"+dish.price_member+"₪</span>";
            totalPrice += dish.price_member;
        }
            
        orderList += "</li>";
        
    });
    orderList += "<li class=\"list-group-item d-flex justify-content-between\">";
        orderList += "<span>סה\"כ (שקל)</span>";
        orderList += "<strong>"+totalPrice+"₪</strong>";
    orderList += "</li>";
    $("#dishesList").append(orderList);
});

function getDish(dishId){
    let dish = null;
    let menu = JSON.parse(localStorage.getItem('menu'));
    menu.forEach(element => {
        if (element.id == dishId){
            dish = element;
        }
    });
    return dish;
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

function commitOrder(){
    if (totalPrice > 0){

        let firstName = document.forms["orderForm"]["firstName"].value;
        let lastName = document.forms["orderForm"]["lastName"].value;
        let clientName = firstName + " " + lastName;

        let clientAddress = document.forms["orderForm"]["address"].value;
        let dishes = localStorage.getItem('userShopList');
        
        orders = JSON.parse(localStorage.getItem('orders'))
        let order_id = orders.length + 1;

        let newOrder = {
            "order_id" : order_id,
            "client_name": clientName,
            "client_address": clientAddress,
            "totalPrice": totalPrice,
            "dishes": dishes,
            "status": "בהכנה"
        }
        orders.push(newOrder);

        localStorage.setItem('orders', JSON.stringify(orders));
        $("#successAlert").show();
        sleep(1000)
        localStorage.removeItem('userShopList');
        location.href = "index.html";
    }
    

    return false;
}


$('input:radio[name="paymentMethod"]').change(
    function(){
        if ($(this).is(':checked') && $(this).attr('id') == 'credit') {
            $("#creditCardDiv").show("slow");
        }
        else{
            $("#creditCardDiv").hide("slow");
        }
    });