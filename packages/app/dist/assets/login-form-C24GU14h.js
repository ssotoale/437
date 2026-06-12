import{i as e,l as t,n,s as r,t as i,u as a}from"./reset.css-VO8Yb4OM.js";var o=class o extends HTMLElement{constructor(){super(),this.viewModel=n({username:``,password:``}).with(e(this),`username`,`password`),this.view=t`<form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`,a(this).styles(i.styles,o.styles).replace(this.viewModel.render(this.view)).listen({submit:e=>this.submitLogin(e,this.getAttribute(`api`)||`#`)})}submitLogin(e,t){e.preventDefault();let n=this.viewModel.toObject(),r={"Content-Type":`application/json`},i=JSON.stringify(n);fetch(t,{method:`POST`,headers:r,body:i}).then(e=>{if(!e.ok)throw`Form submission failed: Status ${e.status}`;return e.json()}).then(e=>{let{token:t}=e,n=new CustomEvent(`auth:message`,{bubbles:!0,composed:!0,detail:[`auth/signin`,{token:t,redirect:`/app`}]});this.dispatchEvent(n)})}static{this.styles=r``}};export{o as t};