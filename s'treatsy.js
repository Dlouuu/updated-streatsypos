window.onload = function() {

const menuCategories = [
    {
        name: "SILOG MEALS",
        items: [
            { name: "Tapsilog", price: 89 },
            { name: "Tocilog", price: 69 },
            { name: "Chicksilog", price: 89 },
            { name: "Lumpia Silog", price: 69 },
            { name: "HotSilog", price: 69 },
            { name: "PorkSilog", price: 89 },
            { name: "LongSilog", price: 69 },
            { name: "Hunggarian", price: 79 }
        ]
    },
    {
        name: "SNACK AND DRINKS - Non Coffee",
        items: [
            { name: "Strawberry Milk", sizes: { "S": 69, "L": 119 } },
            { name: "Match Latte", sizes: { "S": 69, "L": 119 } },
            { name: "Oreo Latte", sizes: { "S": 69, "L": 119 } },
            { name: "Ube Latte", sizes: { "S": 69, "L": 119 } },
            { name: "Berry Matcha", sizes: { "S": 89, "L": 119 } },
            { name: "Oreo Matcha", sizes: { "S": 89, "L": 119 } }
        ]
    },
    {
        name: "FRUIT SODA",
        items: [
            { name: "Strawberry Soda", sizes: { "S": 39, "L": 59 } },
            { name: "Blueberry Soda", sizes: { "S": 39, "L": 59 } },
            { name: "Lychee Soda", sizes: { "S": 39, "L": 59 } },
            { name: "Greenapple Soda", sizes: { "S": 39, "L": 59 } },
            { name: "Blue Lemonade", sizes: { "S": 39, "L": 59 } }
        ]
    },
    {
        name: "SNACKS",
        items: [
            { name: "Fries", sizes: { "S": 69, "L": 99 } },
            { name: "Nachos", price: 89 },
            { name: "Burger", price: 49 },
            { name: "Clubhouse", price: 69 },
            { name: "Loglog", sizes:{ "with egg": 28, "special": 38} }
        ]
    },
    {
        name: "ADD ONS",
        items: [
            { name: "Extra Rice", price: 20 },
            { name: "Egg", price: 15 },
            { name: "Nata", price: 10 },
            { name: "Yakult", price: 15 }
        ]
    }
];

let currentOrder = JSON.parse(localStorage.getItem("currentOrder")) || [];
let allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];

const menuDiv = document.getElementById("menu");
const orderDiv = document.getElementById("order");
const totalSpan = document.getElementById("total");

const resetBtn = document.getElementById("resetOrder");
const viewBtn = document.getElementById("viewOrders");
const dailySalesBtn = document.getElementById("dailySales");
const completeBtn = document.getElementById("completeOrder");


function saveCurrentOrder() { localStorage.setItem("currentOrder", JSON.stringify(currentOrder)); }
function saveAllOrders() { localStorage.setItem("allOrders", JSON.stringify(allOrders)); }

function displayMenu() {
    menuDiv.innerHTML = "";
    menuCategories.forEach(category => {
        const catTitle = document.createElement("h3");
        catTitle.innerText = category.name;
        menuDiv.appendChild(catTitle);

        const itemsDiv = document.createElement("div");
        itemsDiv.classList.add("items-container");

        category.items.forEach(item => {
            const btn = document.createElement("div");
            btn.classList.add("menu-item");

            if(item.sizes){
                btn.innerHTML = `${item.name}<br>`;
                for(const [size, price] of Object.entries(item.sizes)){
                    const sizeBtn = document.createElement("button");
                    sizeBtn.innerText = `${size}: ₱${price}`;
                    sizeBtn.style.margin = "2px";
                    sizeBtn.onclick = (e)=>{
                        e.stopPropagation();
                        addToOrder({ name: `${item.name} (${size})`, price: price });
                    };
                    btn.appendChild(sizeBtn);
                }
            } else {
                btn.innerHTML = `${item.name}<br>₱${item.price}`;
                btn.onclick = () => addToOrder(item);
            }

            itemsDiv.appendChild(btn);
        });

        menuDiv.appendChild(itemsDiv);
    });
}

function addToOrder(item) {
    currentOrder.push(item);
    updateOrder();
    saveCurrentOrder();
}

function updateOrder() {
    if(currentOrder.length === 0){
        orderDiv.innerHTML = "<p>No items yet.</p>";
        totalSpan.innerText = "0.00";
        return;
    }

    orderDiv.innerHTML = "";
    let total = 0;
    const orderCount = {};

    currentOrder.forEach(item => {
        if(orderCount[item.name]){
            orderCount[item.name].qty += 1;
        } else {
            orderCount[item.name] = { price: item.price, qty: 1 };
        }
        total += item.price;
    });

    for(const [name, info] of Object.entries(orderCount)){
        const p = document.createElement("p");
        p.innerText = `${name} x${info.qty} - ₱${info.price * info.qty}`;
        orderDiv.appendChild(p);
    }

    totalSpan.innerText = total.toFixed(2);
}

completeBtn.addEventListener("click", () => {
    if(currentOrder.length === 0){
        alert("No items in the order.");
        return;
    }
    allOrders.push({
        items: currentOrder,
        total: currentOrder.reduce((sum, i) => sum + i.price, 0),
        date: new Date().toLocaleString()
    });
    saveAllOrders();
    currentOrder = [];
    saveCurrentOrder();
    updateOrder();
    alert("Order saved!");
});


resetBtn.addEventListener("click", () => {
    currentOrder = [];
    saveCurrentOrder();
    updateOrder();
});


viewBtn.addEventListener("click", () => {
    if(allOrders.length === 0){ alert("No orders yet."); return; }

    let summary = "";
    allOrders.forEach((order, idx) => {
        summary += `Order ${idx+1} - ${order.date}\n`;
        const counts = {};
        order.items.forEach(item => { counts[item.name]=(counts[item.name]||0)+1; });
        for(const [name, qty] of Object.entries(counts)){
            summary +=   `${name} x${qty}\n`;
        }
        summary += `\n`;  
    });

    alert(summary);
});


dailySalesBtn.addEventListener("click", ()=>{
    if(allOrders.length === 0){ alert("No orders yet."); return; }

    const salesByDate = {};
    allOrders.forEach(order=>{
        const dateOnly = new Date(order.date).toLocaleDateString();
        salesByDate[dateOnly] = (salesByDate[dateOnly]||0) + order.total;
    });

    let summary = "Daily Sales Summary:\n\n";
    for(const [date,total] of Object.entries(salesByDate)){
        summary += `${date}: ₱${total.toFixed(2)}\n`;
    }

    alert(summary);
});

document.getElementById('resetDaily').addEventListener("click", () => {
    if(confirm("Are you sure you want to reset all orders for today?")){
        allOrders = [];
        saveAllOrders();
        saveCurrentOrder();

        updateOrder();
        alert("Daily sales have been reset.");
    }
});

displayMenu();
updateOrder();
};