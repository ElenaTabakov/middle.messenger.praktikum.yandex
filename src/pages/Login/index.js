import Handlebars from "handlebars";
import tmpl from './tmpl.hbs?raw';
import './style.css'

export default  (title) =>{
    return Handlebars.compile(tmpl)({title: 'Login form '});
}