import{a as t,j as n}from"./jsx-runtime-913be41c.js";import{I as i}from"./Icon-3a85d23f.js";import{d as s}from"./theme-ui-css.esm-b19fe7ec.js";import{F as a,a as c}from"./theme-ui-components.esm-a8d58c50.js";function d(e){return["howto_useful","research_useful"].includes(e)?"useful":["howto_approved","map_pin_approved","research_approved"].includes(e)?"check":["howto_needs_updates","map_pin_needs_updates","research_needs_updates"].includes(e)?"edit":e==="research_update"?"thunderbolt":"comment"}const r=e=>{const{type:o}=e;return t(a,{bg:"white","data-cy":"notification",sx:{flexDirection:"column",width:"100%",fontSize:"12px",marginBottom:"10px",paddingBottom:"10px",borderBottom:"1px solid #c7c7c7",fontFamily:"Inter, sans-serif"},children:t(s,{theme:{styles:{a:{textDecoration:"underline",padding:"0 .25em",color:"#61646b",display:"inline"}}},children:n(a,{style:{textAlign:"left",color:"black"},children:[t(c,{sx:{opacity:.6},children:t(i,{glyph:d(o),size:15,mr:3})}),e.children]})})})};try{r.displayName="NotificationItem",r.__docgenInfo={description:"",displayName:"NotificationItem",props:{type:{defaultValue:null,description:"",name:"type",required:!0,type:{name:"enum",value:[{value:'"new_comment"'},{value:'"howto_useful"'},{value:'"howto_mention"'},{value:'"howto_approved"'},{value:'"howto_needs_updates"'},{value:'"map_pin_approved"'},{value:'"map_pin_needs_updates"'},{value:'"new_comment_research"'},{value:'"research_useful"'},{value:'"research_mention"'},{value:'"research_update"'},{value:'"research_approved"'},{value:'"research_needs_updates"'}]}}}}}catch{}export{r as N};
//# sourceMappingURL=NotificationItem-238a2565.js.map
