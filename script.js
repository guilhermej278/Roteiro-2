const CHAVE_USUARIOS = 'pp-users';
const CHAVE_SESSAO = 'pp-session';

const $ = (id) => document.getElementById(id);

function lerUsuarios() {
  try { return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || {}; }
  catch (e) { return {}; }
}

function salvarUsuarios(usuarios) {
  try { localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios)); } catch (e) {}
}

function entrar(email) {
  try { localStorage.setItem(CHAVE_SESSAO, email); } catch (e) {}
}

function sair() {
  try { localStorage.removeItem(CHAVE_SESSAO); } catch (e) {}
  location.href = 'index.html';
}
function usuarioLogado() {
  try {
    const email = localStorage.getItem(CHAVE_SESSAO);
    return email ? lerUsuarios()[email] || null : null;
  } catch (e) { return null; }
}

function mostrar(id, texto) {
  const el = $(id);
  el.textContent = texto;
  el.style.display = 'block';
}

function irParaInicio(ms) {
  setTimeout(() => { location.href = 'index.html'; }, ms);
}
function iniciarMenu(usuario) {
  if (!usuario) return;

  document.querySelectorAll('[data-guest]').forEach((link) => link.remove());

  const nome = document.createElement('span');
  nome.className = 'hello';
  nome.textContent = usuario.nome;

  const botaoSair = document.createElement('button');
  botaoSair.className = 'out';
  botaoSair.textContent = 'Sair';
  botaoSair.onclick = sair;

  document.querySelector('nav').append(nome, botaoSair);
  if (document.body.dataset.guestOnly) location.replace('index.html');
}
function iniciarCadastro() {
  const form = $('cad');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = $('nome').value.trim();
    const email = $('email').value.trim().toLowerCase();
    const senha = $('s1').value;
    const usuarios = lerUsuarios();

    if (senha !== $('s2').value) return mostrar('err', 'As senhas não são iguais. Digite novamente.');
    if (usuarios[email]) return mostrar('err', 'Este e-mail já tem conta. Use a página de login.');

    usuarios[email] = { nome, email, senha };
    salvarUsuarios(usuarios);
    entrar(email);

    $('err').style.display = 'none';
    mostrar('ok', 'Conta criada! Entrando...');
    irParaInicio(1000);
  });
}
function iniciarLogin() {
  const form = $('log');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('email').value.trim().toLowerCase();
    const usuario = lerUsuarios()[email];

    if (!usuario || usuario.senha !== $('senha').value) {
      return mostrar('err', 'E-mail ou senha incorretos. Confira os dados ou crie uma conta.');
    }

    entrar(email);
    $('err').style.display = 'none';
    mostrar('ok', 'Bem-vindo, ' + usuario.nome.split(' ')[0] + '!');
    irParaInicio(900);
  });
}
function iniciarPedido(usuario) {
  const form = $('f');
  if (!form) return;
  if (usuario) {
    $('n').value = usuario.nome;
  } else {
    form.style.display = 'none';
    $('aviso').style.display = 'block';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    mostrar('ok', `Pedido enviado, ${$('n').value}! ${$('q').value}x ${$('s').value} a caminho.`);
  });
}
const usuario = usuarioLogado();
iniciarMenu(usuario);
iniciarCadastro();
iniciarLogin();
iniciarPedido(usuario);
