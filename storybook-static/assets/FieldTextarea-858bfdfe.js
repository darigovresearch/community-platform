import{j as d,F as c,a as i}from"./jsx-runtime-913be41c.js";import{b as p,T as u}from"./theme-ui-components.esm-a8d58c50.js";const f=e=>e.charAt(0).toUpperCase()+e.slice(1),x=(e,r={})=>(typeof e!="string"||r.capitalize&&(e=f(e)),e),n=({input:e,meta:r,disabled:s,modifiers:t,customOnBlur:o,...l})=>d(c,{children:[i(p,{disabled:s,variant:r!=null&&r.error&&(r!=null&&r.touched)?"textareaError":"textarea",...e,...l,onBlur:a=>{t&&(a.target.value=x(a.target.value,t),e.onChange(a)),o&&o(a),e.onBlur()}}),r.error&&r.touched&&i(u,{sx:{fontSize:0,margin:1,color:"error"},children:r.error})]});try{n.displayName="FieldTextarea",n.__docgenInfo={description:"",displayName:"FieldTextarea",props:{disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},"data-cy":{defaultValue:null,description:"",name:"data-cy",required:!1,type:{name:"string"}},customOnBlur:{defaultValue:null,description:"",name:"customOnBlur",required:!1,type:{name:"((event: any) => void)"}}}}}catch{}export{n as F};
//# sourceMappingURL=FieldTextarea-858bfdfe.js.map