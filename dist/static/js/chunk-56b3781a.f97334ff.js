(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-56b3781a"],{"65a7":function(t,e,i){"use strict";var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("mavon-editor",{attrs:{editable:t.editorOptions.editable,subfield:t.editorOptions.subfield,defaultOpen:t.editorOptions.defaultOpen,placeholder:t.editorOptions.placeholder,toolbarsFlag:t.editorOptions.toolbarsFlag,shortCut:t.editorOptions.shortCut,toolbars:t.toolbars},model:{value:t.mdText,callback:function(e){t.mdText=e},expression:"mdText"}})],1)},o=[],r=i("403a"),n={name:"MarkDownArea",props:{filePath:{type:String,default:""},editorOptions:{type:Object,default:function(){return{editable:!1,subfield:!1,defaultOpen:"preview",placeholder:"",toolbarsFlag:!1,shortCut:!1}}}},data:function(){return{mdText:"",toolbars:{bold:!0,italic:!0,header:!0,underline:!0,strikethrough:!0,mark:!0,superscript:!0,subscript:!0,quote:!0,ol:!0,ul:!0,link:!0,imagelink:!0,code:!0,table:!0,fullscreen:!0,readmodel:!0,htmlcode:!0,help:!0,undo:!0,redo:!0,trash:!0,navigation:!0,alignleft:!0,aligncenter:!0,alignright:!0}}},created:function(){var t=this,e=new XMLHttpRequest;e.open("GET",r["a"].GITHUB_API_HOST+"/repos/"+r["a"].USER+"/"+r["a"].REPOSITORY+this.filePath),e.send(),e.onreadystatechange=function(){4===e.readyState&&200===e.status&&(t.mdText=e.responseText)}},methods:{switchEdit:function(){this.editorOptions.editable=!this.editorOptions.editable,this.editorOptions.shortCut=!this.editorOptions.shortCut,this.editorOptions.toolbarsFlag=!this.editorOptions.toolbarsFlag,this.editorOptions.subfield=!this.editorOptions.subfield}}},s=n,l=i("2877"),d=Object(l["a"])(s,a,o,!1,null,"ef63f0be",null);e["a"]=d.exports},d7f2:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{margin:"10px 10%"}},[t.isShowTree?i("div",[i("el-tree",{attrs:{data:t.treeData,"default-expand-all":"","node-key":"id",props:t.defaultProps},on:{"node-click":t.handleNodeClick}})],1):i("div",{staticStyle:{"text-align":"center"}},[i("el-button",{staticStyle:{color:"#555",cursor:"default"},attrs:{type:"info",disabled:"",size:"mini",plain:""},on:{click:function(e){t.isShowTree=!0}}},[t._v("当前文档："+t._s(t.filePath))]),i("el-button",{attrs:{type:"primary",size:"mini",plain:""},on:{click:function(e){t.isShowTree=!0}}},[t._v("返回")]),i("el-button",{attrs:{type:"primary",size:"mini",plain:""},on:{click:t.switchEdit}},[t._v("编辑/预览")]),i("mark-down-area",{ref:"md",attrs:{"file-path":t.filePath}})],1)])},o=[],r=(i("7f7f"),i("ac6a"),i("65a7")),n=i("b775"),s=i("403a"),l={getFileFromGithub:function(t){return Object(n["a"])({method:"get",url:t.url})}},d={name:"MarkdownDoc",components:{MarkDownArea:r["a"]},data:function(){return{isShowTree:!0,filePath:"/text.md",defaultProps:{children:"children",label:"name"},treeData:[]}},created:function(){this.requestTreeData(s["a"].GITHUB_API_HOST+"/repos/"+s["a"].USER+"/"+s["a"].REPOSITORY+"/contents"+s["a"].DOC_ROOT,this.treeData),console.log("treeData!!",this.treeData)},methods:{requestTreeData:function(t,e){var i=this;l.getFileFromGithub({url:void 0===t?"":t}).then((function(t){var a=t.data;console.log("请求结果",a),a.forEach((function(t){var a=t;"dir"===t.type&&(a.children=[],i.requestTreeData(t.url,a.children)),e.push(a)}))}))},handleNodeClick:function(t){t.children||".md"===t.name.substring(t.name.lastIndexOf("."))&&(this.isShowTree=!1,this.filePath="/"+t.path)},switchEdit:function(){this.$refs.md.switchEdit()}}},c=d,u=i("2877"),h=Object(u["a"])(c,a,o,!1,null,"a16929b6",null);e["default"]=h.exports}}]);