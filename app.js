// Simple client-side state using localStorage
const KEY = 'um_users';

function loadUsers(){
  try{ return JSON.parse(localStorage.getItem(KEY)) || [] }catch(e){ return [] }
}
function saveUsers(list){ localStorage.setItem(KEY, JSON.stringify(list)); refreshKpis() }

function seedUsers(){
  const sample = [
    {name:'Alex Doe', email:'alex@example.com', role:'Admin', status:'Active'},
    {name:'Priya N', email:'priya@example.com', role:'User', status:'Active'},
    {name:'Rahul S', email:'rahul@example.com', role:'Moderator', status:'Pending'},
    {name:'Mira K', email:'mira@example.com', role:'User', status:'Suspended'},
    {name:'John Wick', email:'john@example.com', role:'User', status:'Active'}
  ];
  const existing = loadUsers();
  saveUsers([...existing, ...sample]);
  renderTable();
}

function clearUsers(){
  localStorage.removeItem(KEY);
  renderTable();
}

function addUserPrompt(){
  const name = prompt('Full name:');
  if(!name) return;
  const email = prompt('Email:');
  const role = prompt('Role (User/Admin/Moderator):','User') || 'User';
  const status = prompt('Status (Active/Pending/Suspended):','Active') || 'Active';
  const users = loadUsers();
  users.push({name,email,role,status});
  saveUsers(users); renderTable();
}

function deleteUser(email){
  const users = loadUsers().filter(u => u.email !== email);
  saveUsers(users); renderTable();
}

function renderTable(){
  const q = (document.getElementById('tableSearch')?.value || '').toLowerCase();
  const users = loadUsers().filter(u => (u.name+u.email+u.role+u.status).toLowerCase().includes(q));
  const tbody = document.getElementById('userRows');
  if(!tbody) return;
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.status}</td>
      <td>
        <button class="btn" onclick="editUser('${u.email}')">Edit</button>
        <button class="btn danger" onclick="deleteUser('${u.email}')">Delete</button>
      </td>
    </tr>
  `).join('');
  refreshKpis();
}

function editUser(email){
  const users = loadUsers();
  const idx = users.findIndex(u => u.email === email);
  if(idx === -1) return;
  const u = users[idx];
  const name = prompt('Full name:', u.name) || u.name;
  const role = prompt('Role:', u.role) || u.role;
  const status = prompt('Status:', u.status) || u.status;
  users[idx] = {...u, name, role, status};
  saveUsers(users); renderTable();
}

function refreshKpis(){
  const users = loadUsers();
  const total = users.length;
  const active = users.filter(u=>u.status==='Active').length;
  const admins = users.filter(u=>u.role==='Admin').length;
  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent = val }
  set('kpiTotal', total);
  set('kpiActive', active);
  set('kpiAdmins', admins);
}

function toggleSidebar(){
  const sb = document.getElementById('sidebar');
  if(!sb) return;
  sb.style.display = (sb.style.display==='none' ? 'block' : 'none');
}

// Auth demo
function login(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pwd = document.getElementById('loginPassword').value;
  if(!email || !pwd) return false;
  localStorage.setItem('um_current', email);
  window.location.href = 'admin-dashboard.html';
  return false;
}
function register(e){
  e.preventDefault();
  const first = document.getElementById('firstName').value;
  const last = document.getElementById('lastName').value;
  const email = document.getElementById('regEmail').value;
  const users = loadUsers();
  users.push({name: first+' '+last, email, role:'User', status:'Active'});
  saveUsers(users);
  localStorage.setItem('um_current', email);
  window.location.href = 'profile.html';
  return false;
}
function logout(){
  localStorage.removeItem('um_current');
  window.location.href = 'index.html';
}

// Profile
function saveProfile(){
  const email = document.getElementById('profileEmail').value;
  const name = document.getElementById('profileName').value;
  const role = document.getElementById('profileRole').value;
  const status = document.getElementById('profileStatus').value;
  const users = loadUsers();
  const idx = users.findIndex(u=>u.email===email);
  if(idx>-1){ users[idx] = {name, email, role, status}; }
  else { users.push({name, email, role, status}); }
  saveUsers(users);
  alert('Profile saved');
}
function resetProfile(){
  document.getElementById('profileName').value='';
  document.getElementById('profileEmail').value='';
  document.getElementById('profileRole').value='User';
  document.getElementById('profileStatus').value='Active';
}

function searchUsers(){
  const v = (document.getElementById('globalSearch')?.value || '');
  const ts = document.getElementById('tableSearch');
  if(ts){ ts.value = v; renderTable(); }
}

// Boot
window.addEventListener('DOMContentLoaded', ()=>{
  renderTable();
});
