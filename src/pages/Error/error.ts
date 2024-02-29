import Block from "../../services/Block";
import tpl from "../../partials/formField/input.hbs?raw";


export default class Error extends Block{
    render() {
       return this.compile(tpl, {})
    }  
}
