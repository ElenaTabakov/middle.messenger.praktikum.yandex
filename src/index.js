import './style.css'
import login from './pages/Login';
import register from './pages/Register';
import userProfile from './pages/UserProfile';
import chat from './pages/Chat';
import Handlebars from 'handlebars';
import { Router } from './router';


const routes = {
  '/login': login,
  '/register': register,
  '/user': userProfile,
  '/chat': chat,
};

let contentDiv = document.getElementById('app');
contentDiv.innerHTML = routes[window.location.pathname]();


window.addEventListener('DOMContentLoaded', (event) => {
  // const app = document.querySelector('#app');

  // if(!app){
  //   return;
  // } 

  // app.innerHTML = login();

  // const router = new Router(app);

  // router
  // .add('/' , login)
  // .add('/register' , register)
  // .add('/chat' , chat)
  // .add('/user' , userProfile)

  // router.go(window.location.pathname);
});

// function navigate(page) {
//   const [source, context] = pages[page];
//   const container = document.getElementById('app');
//   container.innerHTML = Handlebars.compile(source)(context);
// }

// document.addEventListener('DOMContentLoaded', () => navigate('nav'));

// document.addEventListener('click', e => {
//   //@ts-ignore
//   const page = e.target.getAttribute('page');
//   if (page) {
//     navigate(page);
//     e.preventDefault();
//     e.stopImmediatePropagation();
//   }
// });

