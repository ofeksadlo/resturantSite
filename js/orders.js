
function updateOrder(orderId){
    let order = null;
    order = getOrderById(orderId);
    if (order != null){
        let client_name = $("#client_name").val();
        let client_address = $("#client_address").val();
        let totalPrice = $("#totalPrice").val();
        let status = $("#status").val();

        let orders = JSON.parse(localStorage.getItem('orders'));
        orders.forEach(element => {
            if (element.order_id == orderId) {
                element.client_name = client_name;
                element.client_address = client_address;
                element.totalPrice = totalPrice;
                element.status = status;
            }
        });

        localStorage.setItem('orders', JSON.stringify(orders));

        
    }
    
    return true;

}

function showEditModal(orderId){
    $('form[name="updateOrderForm"]').attr("onsubmit", "return updateOrder("+orderId+")");

    let order = getOrderById(orderId);
    $("#client_name").val(order.client_name);
    $("#client_address").val(order.client_address);
    $("#totalPrice").val(order.totalPrice);
    $("#status").val(order.status);


    $('#updateOrderModal').modal('toggle');
}

function getOrderById(orderId){
    let orders = JSON.parse(localStorage.getItem('orders'));
    let order = null;
    orders.forEach(element => {
        if (element.order_id == orderId)
            order = element;
    });
    return order;
}

$(document).ready(function() {
    let orders = JSON.parse(localStorage.getItem('orders'));
    orders.forEach(element => {
        let statusColor = "bg-warning";
        if (element.status != "בהכנה")
            statusColor = "bg-success";
        let strToAppend = "<tr><td>"+element.client_name+"</td><td>"+element.client_address+"</td>";
        strToAppend += "<td>"+element.totalPrice+"</td><td class=\""+statusColor+"\">"+element.status+"</td><td><a href=\"javascript:showEditModal("+element.order_id+")\"><img src=\"assets/img/edit.png\"></a></td></tr>";
        $("#tbody").append(strToAppend);
    });
    
});