import{a as t,j as r}from"./jsx-runtime-913be41c.js";import{I as i}from"./Icon-0e0ff6c0.js";import{I as s}from"./InternalLink-902afeab.js";import{E as c}from"./ExternalLink-443ce632.js";import{E as a}from"./ElWithBeforeIcon-73c64692.js";import{s as d}from"./icon-star-active-9fadbee7.js";import{C as m,F as n,a as o}from"./theme-ui-components.esm-a8d58c50.js";const f=""+new URL("icon-research-0f5ddf32.svg",import.meta.url).href,h=""+new URL("icon-how-to-593766e4.svg",import.meta.url).href,l=e=>{const u=e.country!==void 0&&e.userName!==void 0;return y(e)&&!u?null:t(m,{sx:{p:2,backgroundColor:"background"},children:r(n,{sx:{gap:2,flexDirection:"column"},children:[e.isVerified&&r(n,{"data-testid":"verified-stat",children:[t(i,{glyph:"verified",size:22}),t(o,{ml:1,children:"Verified"})]}),u?t(s,{to:"/map/#"+e.userName,sx:{color:"black"},"data-testid":"location-link",children:r(n,{children:[t(i,{glyph:"location-on",size:22}),t(o,{ml:1,children:e.country||"View on Map"})]})}):null,e!=null&&e.isSupporter?r(n,{"data-testid":"supporter-stat",children:[t(i,{glyph:"supporter",size:22}),t(o,{ml:1,children:t(c,{href:"https://www.patreon.com/one_army",target:"_blank",sx:{color:"black"},children:"Supporter"})})]}):null,e.usefulCount?r(n,{"data-testid":"useful-stat",children:[t(a,{icon:d}),"Useful: ",e.usefulCount]}):null,e.howtoCount?r(n,{"data-testid":"howto-stat",children:[t(a,{icon:h}),"How‑to: ",e.howtoCount]}):null,e.researchCount?r(n,{"data-testid":"research-stat",children:[t(a,{icon:f}),"Research: ",e.researchCount]}):null]})})},y=e=>!e.isVerified&&!e.isSupporter&&!e.usefulCount&&!e.howtoCount;try{l.displayName="UserStatistics",l.__docgenInfo={description:"",displayName:"UserStatistics",props:{userName:{defaultValue:null,description:"",name:"userName",required:!0,type:{name:"string"}},country:{defaultValue:null,description:"",name:"country",required:!1,type:{name:"string"}},isVerified:{defaultValue:null,description:"",name:"isVerified",required:!0,type:{name:"boolean"}},isSupporter:{defaultValue:null,description:"",name:"isSupporter",required:!0,type:{name:"boolean"}},howtoCount:{defaultValue:null,description:"",name:"howtoCount",required:!0,type:{name:"number"}},usefulCount:{defaultValue:null,description:"",name:"usefulCount",required:!0,type:{name:"number"}},researchCount:{defaultValue:null,description:"",name:"researchCount",required:!0,type:{name:"number"}}}}}catch{}export{l as U};
//# sourceMappingURL=UserStatistics-c3250719.js.map
