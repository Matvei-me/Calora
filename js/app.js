const pages=[...document.querySelectorAll('.page')];const nav=document.getElementById('bottomNav');const toast=document.getElementById('toast');let products=[{id:1,name:'Стейк лосося с брокколи и авокадо',emoji:'🐟',description:'Лосось, брокколи, авокадо, киноа',calories:620,weight:320,protein:39,fat:29,status:'meal'},{id:2,name:'Авокадо-тост',emoji:'🥑',description:'Авокадо, цельнозерновой хлеб',calories:320,weight:180,protein:9,fat:16,status:'meal'},{id:3,name:'Салат с киноа',emoji:'🥗',description:'Киноа, зелень, овощи',calories:480,weight:250,protein:14,fat:18,status:'meal'},{id:4,name:'Яблоко',emoji:'🍎',description:'Свежий фрукт',calories:95,weight:180,protein:0.5,fat:0.3,status:'saved'}];let nextId=5;function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>{toast.classList.remove('show')},2600)}
function showPage(id){pages.forEach((page)=>{page.classList.toggle('active',page.id===id)});nav.style.display=['loginPage','registerPage'].includes(id)?'none':'';document.querySelectorAll('[data-page]').forEach((button)=>{button.classList.toggle('active',button.dataset.page===id)});window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-page]').forEach((button)=>{button.addEventListener('click',()=>showPage(button.dataset.page))});document.getElementById('loginForm').addEventListener('submit',(event)=>{event.preventDefault();const email=event.target.querySelector('input[type="email"]').value;document.getElementById('helloText').textContent=`Привет, ${email.split('@')[0]}!`;showPage('dashboardPage');showToast('Ты успешно вошёл в Calora')});document.getElementById('registerForm').addEventListener('submit',(event)=>{event.preventDefault();const name=event.target.querySelector('input[type="text"]').value.trim();document.getElementById('helloText').textContent=`Привет, ${name}!`;showPage('dashboardPage');showToast('Аккаунт создан. Добро пожаловать!')});function logout(){showPage('loginPage');showToast('Ты вышел из аккаунта')}
document.getElementById('logoutBtn').addEventListener('click',logout);document.getElementById('logoutBtn2').addEventListener('click',logout);document.getElementById('profileBtn').addEventListener('click',()=>{showToast('Профиль: настройки будут доступны позже')});const modal=document.getElementById('productModal');function openModal(){modal.classList.add('show');document.getElementById('newName').focus()}
function closeModal(){modal.classList.remove('show')}['addProductBtn','scanAdd','navAdd','quickAdd'].forEach((id)=>{document.getElementById(id).addEventListener('click',openModal)});document.getElementById('closeModal').addEventListener('click',closeModal);modal.addEventListener('click',(event)=>{if(event.target===modal){closeModal()}});document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){closeModal()}});function escapeHtml(value){const replacements={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};return String(value).replace(/[&<>"']/g,(character)=>replacements[character])}
function renderProducts(){const list=document.getElementById('productsList');const query=document.getElementById('productSearch').value.toLowerCase().trim();const filter=document.getElementById('productFilter').value;const visibleProducts=products.filter((product)=>{const matchesName=product.name.toLowerCase().includes(query);const matchesStatus=filter==='all'||product.status===filter;return matchesName&&matchesStatus});if(!visibleProducts.length){list.innerHTML=`
            <div class="empty-state">
                <div>🥬</div>
                <strong>Продукты не найдены</strong>
                <p style="margin-top: 8px">
                    Попробуй изменить запрос или добавь новый продукт.
                </p>
            </div>
        `;return}
list.innerHTML=visibleProducts.map((product)=>`
        <article class="product">
            <div class="product-emoji">${product.emoji || '🍏'}</div>
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <p>${escapeHtml(product.description || 'Добавленный продукт')} · ${product.weight} г</p>
                <div class="product-macros">
                    <span class="macro">Белки ${product.protein} г</span>
                    <span class="macro">Жиры ${product.fat} г</span>
                    <span class="macro">${product.status === 'meal' ? 'В дневнике' : 'Сохранён'}</span>
                </div>
            </div>
            <div class="product-right">
                <div>
                    <strong>${product.calories} ккал</strong>
                    <span>на порцию</span>
                </div>
                <div class="product-actions">
                    <button class="mini-btn" data-toggle="${product.id}">
                        ${product.status === 'meal' ? 'Сохранить' : 'В дневник'}
                    </button>
                    <button class="mini-btn delete" data-delete="${product.id}">Удалить</button>
                </div>
            </div>
        </article>
    `).join('');list.querySelectorAll('[data-delete]').forEach((button)=>{button.addEventListener('click',()=>{products=products.filter((product)=>product.id!==Number(button.dataset.delete));renderProducts();updateStats();showToast('Продукт удалён')})});list.querySelectorAll('[data-toggle]').forEach((button)=>{button.addEventListener('click',()=>{const product=products.find((item)=>item.id===Number(button.dataset.toggle));product.status=product.status==='meal'?'saved':'meal';renderProducts();updateStats();showToast(product.status==='meal'?'Продукт добавлен в дневник':'Продукт сохранён')})})}
document.getElementById('productSearch').addEventListener('input',renderProducts);document.getElementById('productFilter').addEventListener('change',renderProducts);document.getElementById('productForm').addEventListener('submit',(event)=>{event.preventDefault();const name=document.getElementById('newName').value.trim();let emoji='🍏';if(/яблок/i.test(name)){emoji='🍎'}else if(/авокад/i.test(name)){emoji='🥑'}else if(/рыб|лосос/i.test(name)){emoji='🐟'}else if(/салат|овощ/i.test(name)){emoji='🥗'}
products.unshift({id:nextId++,name,emoji,description:'Добавлен вручную',calories:Number(document.getElementById('newCalories').value),weight:Number(document.getElementById('newWeight').value),protein:Number(document.getElementById('newProtein').value||0),fat:Number(document.getElementById('newFat').value||0),status:document.getElementById('newStatus').value});renderProducts();updateStats();closeModal();event.target.reset();document.getElementById('newWeight').value=100;document.getElementById('newProtein').value=1;document.getElementById('newFat').value=0;showPage('productsPage');showToast('Продукт добавлен')});function updateStats(){const totalCalories=products.filter((product)=>product.status==='meal').reduce((total,product)=>total+product.calories,0);const dailyGoal=2100;const remainingCalories=Math.max(0,dailyGoal-totalCalories);const progress=Math.min(100,Math.round(totalCalories/dailyGoal*100));document.getElementById('remainingCalories').textContent=`${remainingCalories} ккал`;document.getElementById('calorieStat').textContent=`${totalCalories} ккал`;document.getElementById('goalText').textContent=dailyGoal;document.getElementById('calorieTag').textContent=`${progress}% цели выполнено`;document.getElementById('calorieRing').style.background=`conic-gradient(var(--green-dark) 0 ${progress}%, #e6e5d8 ${progress}% 100%)`}
renderProducts();updateStats()