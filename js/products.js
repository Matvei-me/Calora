document.addEventListener("DOMContentLoaded",()=>{if(!Calora.getUser()){window.location.replace("index.html");return}
const list=document.getElementById("productsList");const search=document.getElementById("productSearch");const filter=document.getElementById("productFilter");const modal=document.getElementById("productModal");let products=Calora.products();let nextId=Math.max(0,...products.map(product=>Number(product.id)||0))+1;function escapeHtml(value){return String(value).replace(/[&<>"']/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character])}
function updateStats(){Calora.saveProducts(products)}
function renderProducts(){const query=search.value.toLocaleLowerCase("ru").trim();const visible=products.filter(product=>product.name.toLocaleLowerCase("ru").includes(query)&&(filter.value==="all"||product.status===filter.value));if(!visible.length){list.innerHTML='<div class="empty-state"><strong>Продукты не найдены</strong><p>Попробуй изменить запрос или добавь новый продукт.</p></div>';return}
list.innerHTML=visible.map(product=>`
      <article class="product">
        <div class="product-info">
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description || "Добавленный продукт")} · ${Number(product.weight)} г</p>
          <div class="product-macros">
            <span class="macro">Белки ${Number(product.protein)} г</span>
            <span class="macro">Жиры ${Number(product.fat)} г</span>
            <span class="macro">${product.status === "meal" ? "В дневнике" : "Сохранён"}</span>
          </div>
        </div>
        <div class="product-right">
          <div><strong>${Number(product.calories)} ккал</strong><span>на порцию</span></div>
          <div class="product-actions">
            <button class="mini-btn" type="button" data-toggle="${product.id}">${product.status === "meal" ? "Сохранить" : "В дневник"}</button>
            <button class="mini-btn delete" type="button" data-delete="${product.id}">Удалить</button>
          </div>
        </div>
      </article>
    `).join("");list.querySelectorAll("[data-delete]").forEach(button=>{button.addEventListener("click",()=>{products=products.filter(product=>product.id!==Number(button.dataset.delete));updateStats();renderProducts();Calora.toast("Продукт удалён")})});list.querySelectorAll("[data-toggle]").forEach(button=>{button.addEventListener("click",()=>{const product=products.find(item=>item.id===Number(button.dataset.toggle));if(!product)return;product.status=product.status==="meal"?"saved":"meal";updateStats();renderProducts();Calora.toast(product.status==="meal"?"Продукт добавлен в дневник":"Продукт сохранён")})})}
function openModal(){modal.classList.add("show");document.getElementById("newName").focus()}
function closeModal(){modal.classList.remove("show")}
document.getElementById("addProductBtn").addEventListener("click",openModal);document.getElementById("scanAdd").addEventListener("click",openModal);document.getElementById("closeModal").addEventListener("click",closeModal);modal.addEventListener("click",event=>{if(event.target===modal)closeModal();});document.addEventListener("keydown",event=>{if(event.key==="Escape")closeModal();});search.addEventListener("input",renderProducts);filter.addEventListener("change",renderProducts);document.getElementById("productForm").addEventListener("submit",event=>{event.preventDefault();const name=document.getElementById("newName").value.trim();products.unshift({id:nextId++,name,description:"Добавлен вручную",calories:Number(document.getElementById("newCalories").value),weight:Number(document.getElementById("newWeight").value),protein:Number(document.getElementById("newProtein").value||0),fat:Number(document.getElementById("newFat").value||0),status:document.getElementById("newStatus").value});updateStats();renderProducts();closeModal();event.currentTarget.reset();document.getElementById("newWeight").value=100;document.getElementById("newProtein").value=1;document.getElementById("newFat").value=0;Calora.toast("Продукт добавлен")});if(new URLSearchParams(window.location.search).get("add")==="1")openModal();renderProducts()})