(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const Te={X:"X",O:"O"};function Yn(t){return t==="X"?Te.X:t==="O"?Te.O:null}const D={WAITING:"WAITING",ACTIVE:"ACTIVE",FINISHED:"FINISHED"},te={NONE:"NONE",NORMAL:"NORMAL",FORFEIT:"FORFEIT",DRAW:"DRAW"},B={EMPTY:".",TIE:"T",EMPTY_CELLS:".".repeat(81),EMPTY_MINI_WINNERS:".".repeat(9)};function _t(t={}){const e={cells:B.EMPTY_CELLS,miniWinners:B.EMPTY_MINI_WINNERS,nextMiniGrid:-1,moveCount:0,...t};if(e.cells.length!==81)throw new Error("cells must contain 81 characters");if(e.miniWinners.length!==9)throw new Error("miniWinners must contain 9 characters");return e}const Xo=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];function Nt(t){const e=t.nextMiniGrid;if(e>=0&&e<=8&&Kn(t,e))return new Set([e]);const n=new Set;for(let i=0;i<=8;i+=1)Kn(t,i)&&n.add(i);return n}function Kn(t,e){return e<0||e>8||t.miniWinners[e]!==B.EMPTY?!1:!rr(t.cells,e)}function rr(t,e){for(let n=0;n<=8;n+=1)if(t[gn(e,n)]===B.EMPTY)return!1;return!0}function gn(t,e){if(t<0||t>8)throw new Error("miniGridIndex out of bounds");if(e<0||e>8)throw new Error("cellIndex out of bounds");const n=Math.floor(t/3),i=t%3,s=Math.floor(e/3),r=e%3,o=n*3+s,a=i*3+r;return o*9+a}function Jo(t,e,n,i){if(e<0||e>8||n<0||n>8)return it(t,null,!1,"Move indices out of bounds");const s=Nt(t);if(s.size===0)return it(t,null,!1,"No playable mini-grids left");if(!s.has(e))return it(t,null,!1,"Move must be played in the highlighted mini-grid");const r=gn(e,n);if(t.cells[r]!==B.EMPTY)return it(t,null,!1,"Cell is already occupied");const o=t.cells.split(""),a=t.miniWinners.split("");o[r]=i;const l=Zo(o,e);l!==null?a[e]=l:rr(o.join(""),e)&&(a[e]=B.TIE);const c=ea(a),d=Yn(c),u=d===null&&a.every(w=>w!==B.EMPTY),h=n,p=_t({cells:o.join(""),miniWinners:a.join(""),nextMiniGrid:h,moveCount:t.moveCount+1}),m=h>=0&&h<=8&&Kn(p,h)?h:-1,y=_t({cells:o.join(""),miniWinners:a.join(""),nextMiniGrid:m,moveCount:t.moveCount+1});return it(y,d,u,null)}function it(t,e,n,i){return{board:t,globalWinner:e,isDraw:n,error:i,isValid:i===null}}function Zo(t,e){const n=Array.from({length:9},(i,s)=>t[gn(e,s)]);return or(n)}function ea(t){return or(t)}function or(t){for(const e of Xo){const n=t[e[0]],i=t[e[1]],s=t[e[2]];if(n!==B.EMPTY&&n!==B.TIE&&n===i&&i===s)return n}return null}const yn=45e3;function ta(t,e,n,i){const s={uid:e,nickname:n,symbol:Te.X,joinedAt:i};return{code:t,hostUid:e,players:{[e]:s},status:D.WAITING,board:_t(),currentTurnUid:e,winnerUid:null,winnerSymbol:null,winReason:te.NONE,startedAt:i,updatedAt:i,version:0,presence:{[e]:{uid:e,connected:!0,lastSeen:i,disconnectedAt:null}},rematchHostReady:!1,rematchGuestReady:!1,rematchNonce:0}}function na(t,e,n,i){if(t.players[e])return $e(t);if(Object.keys(t.players).length>=2)return H("Room is already full");const r=new Set(Object.values(t.players).map(l=>l.symbol)).has(Te.X)?Te.O:Te.X,o={...t.players,[e]:{uid:e,nickname:n,symbol:r,joinedAt:i}},a={...t.presence,[e]:{uid:e,connected:!0,lastSeen:i,disconnectedAt:null}};return $e({...t,players:o,presence:a,status:D.ACTIVE,updatedAt:i,version:t.version+1})}function ia(t,e,n){if(t.status!==D.ACTIVE)return H("Match is not active");const i=t.players[e.playerUid];if(!i)return H("Player is not part of this room");if(t.currentTurnUid!==e.playerUid)return H("It is not your turn");const s=Jo(t.board,e.miniGridIndex,e.cellIndex,i.symbol);if(!s.isValid)return H(s.error||"Invalid move");const r=s.globalWinner,o=s.isDraw,a=r!==null||o,l=a?t.currentTurnUid:vn(t,e.playerUid)||t.currentTurnUid;return $e({...t,board:s.board,status:a?D.FINISHED:D.ACTIVE,currentTurnUid:l,winnerUid:r!==null?e.playerUid:null,winnerSymbol:r,winReason:r!==null?te.NORMAL:o?te.DRAW:te.NONE,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1})}function sa(t,e,n){if(t.status!==D.FINISHED)return H("Rematch is only available after a finished game");if(!t.players[e])return H("Only participants can request rematch");if(Object.keys(t.players).length<2)return H("Need two players for a rematch");let i=t.rematchHostReady,s=t.rematchGuestReady;return e===t.hostUid?i=!0:s=!0,$e(i&&s?{...t,board:_t(),status:D.ACTIVE,currentTurnUid:t.hostUid,winnerUid:null,winnerSymbol:null,winReason:te.NONE,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1,rematchNonce:t.rematchNonce+1}:{...t,rematchHostReady:i,rematchGuestReady:s,updatedAt:n,version:t.version+1})}function ra(t,e,n,i=yn){if(t.status!==D.ACTIVE)return H("Forfeit can only be claimed during an active match");if(!t.players[e])return H("Only participants can claim forfeit");const s=vn(t,e);if(!s)return H("Opponent is missing");const r=t.presence[s];if(!r)return H("Opponent presence not found");if(r.connected)return H("Opponent is still connected");if(!r.disconnectedAt)return H("No disconnect timestamp found");if(n-r.disconnectedAt<i)return H("Grace period has not elapsed yet");const o=oa(t,e);return o?$e({...t,status:D.FINISHED,winnerUid:e,winnerSymbol:o,winReason:te.FORFEIT,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1}):H("Could not determine winner symbol")}function oa(t,e){var n;return((n=t.players[e])==null?void 0:n.symbol)||null}function vn(t,e){return Object.keys(t.players).find(n=>n!==e)||null}function aa(t,e,n){return{miniGridIndex:t,cellIndex:e,playerUid:n,timestamp:Date.now()}}function $e(t){return{ok:!0,roomState:t}}function H(t){return{ok:!1,reason:t}}const la=()=>{};var ss={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ar={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _=function(t,e){if(!t)throw Ke(e)},Ke=function(t){return new Error("Firebase Database ("+ar.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lr=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let s=t.charCodeAt(i);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},ca=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const s=t[n++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=t[n++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=t[n++],o=t[n++],a=t[n++],l=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[i++]=String.fromCharCode(55296+(l>>10)),e[i++]=String.fromCharCode(56320+(l&1023))}else{const r=t[n++],o=t[n++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},yi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<t.length;s+=3){const r=t[s],o=s+1<t.length,a=o?t[s+1]:0,l=s+2<t.length,c=l?t[s+2]:0,d=r>>2,u=(r&3)<<4|a>>4;let h=(a&15)<<2|c>>6,p=c&63;l||(p=64,o||(h=64)),i.push(n[d],n[u],n[h],n[p])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(lr(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ca(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<t.length;){const r=n[t.charAt(s++)],a=s<t.length?n[t.charAt(s)]:0;++s;const c=s<t.length?n[t.charAt(s)]:64;++s;const u=s<t.length?n[t.charAt(s)]:64;if(++s,r==null||a==null||c==null||u==null)throw new ua;const h=r<<2|a>>4;if(i.push(h),c!==64){const p=a<<4&240|c>>2;if(i.push(p),u!==64){const m=c<<6&192|u;i.push(m)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class ua extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const cr=function(t){const e=lr(t);return yi.encodeByteArray(e,!0)},Kt=function(t){return cr(t).replace(/\./g,"")},Qn=function(t){try{return yi.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ha(t){return ur(void 0,t)}function ur(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!da(n)||(t[n]=ur(t[n],e[n]));return t}function da(t){return t!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fa(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pa=()=>fa().__FIREBASE_DEFAULTS__,_a=()=>{if(typeof process>"u"||typeof ss>"u")return;const t=ss.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ma=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Qn(t[1]);return e&&JSON.parse(e)},hr=()=>{try{return la()||pa()||_a()||ma()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},ga=t=>{var e,n;return(n=(e=hr())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},ya=t=>{const e=ga(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),i]:[e.substring(0,n),i]},dr=()=>{var t;return(t=hr())===null||t===void 0?void 0:t.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vi(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function va(t){return(await fetch(t,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ca(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},i=e||"demo-project",s=t.iat||0,r=t.sub||t.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Kt(JSON.stringify(n)),Kt(JSON.stringify(o)),""].join(".")}const ct={};function Ea(){const t={prod:[],emulator:[]};for(const e of Object.keys(ct))ct[e]?t.emulator.push(e):t.prod.push(e);return t}function ba(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let rs=!1;function wa(t,e){if(typeof window>"u"||typeof document>"u"||!vi(window.location.host)||ct[t]===e||ct[t]||rs)return;ct[t]=e;function n(h){return`__firebase__banner__${h}`}const i="__firebase__banner",r=Ea().prod.length>0;function o(){const h=document.getElementById(i);h&&h.remove()}function a(h){h.style.display="flex",h.style.background="#7faaf0",h.style.position="fixed",h.style.bottom="5px",h.style.left="5px",h.style.padding=".5em",h.style.borderRadius="5px",h.style.alignItems="center"}function l(h,p){h.setAttribute("width","24"),h.setAttribute("id",p),h.setAttribute("height","24"),h.setAttribute("viewBox","0 0 24 24"),h.setAttribute("fill","none"),h.style.marginLeft="-6px"}function c(){const h=document.createElement("span");return h.style.cursor="pointer",h.style.marginLeft="16px",h.style.fontSize="24px",h.innerHTML=" &times;",h.onclick=()=>{rs=!0,o()},h}function d(h,p){h.setAttribute("id",p),h.innerText="Learn more",h.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",h.setAttribute("target","__blank"),h.style.paddingLeft="5px",h.style.textDecoration="underline"}function u(){const h=ba(i),p=n("text"),m=document.getElementById(p)||document.createElement("span"),y=n("learnmore"),w=document.getElementById(y)||document.createElement("a"),k=n("preprendIcon"),L=document.getElementById(k)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(h.created){const T=h.element;a(T),d(w,y);const M=c();l(L,k),T.append(L,m,w,M),document.body.appendChild(T)}r?(m.innerText="Preview backend disconnected.",L.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(L.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,m.innerText="Preview backend running in this workspace."),m.setAttribute("id",p)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",u):u()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ia(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function fr(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ia())}function Ta(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Sa(){return ar.NODE_ADMIN===!0}function Ra(){try{return typeof indexedDB=="object"}catch{return!1}}function Na(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var r;e(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Aa="FirebaseError";class At extends Error{constructor(e,n,i){super(n),this.code=e,this.customData=i,this.name=Aa,Object.setPrototypeOf(this,At.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,pr.prototype.create)}}class pr{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?ka(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new At(s,a,i)}}function ka(t,e){return t.replace(Da,(n,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const Da=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(t){return JSON.parse(t)}function O(t){return JSON.stringify(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _r=function(t){let e={},n={},i={},s="";try{const r=t.split(".");e=mt(Qn(r[0])||""),n=mt(Qn(r[1])||""),s=r[2],i=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:i,signature:s}},Pa=function(t){const e=_r(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},xa=function(t){const e=_r(t).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Se(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function Xn(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Qt(t,e,n){const i={};for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(i[s]=e.call(n,t[s],s,t));return i}function Xt(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const s of n){if(!i.includes(s))return!1;const r=t[s],o=e[s];if(os(r)&&os(o)){if(!Xt(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!n.includes(s))return!1;return!0}function os(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(t){const e=[];for(const[n,i]of Object.entries(t))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oa{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const i=this.W_;if(typeof e=="string")for(let u=0;u<16;u++)i[u]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let u=0;u<16;u++)i[u]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let u=16;u<80;u++){const h=i[u-3]^i[u-8]^i[u-14]^i[u-16];i[u]=(h<<1|h>>>31)&4294967295}let s=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,d;for(let u=0;u<80;u++){u<40?u<20?(c=a^r&(o^a),d=1518500249):(c=r^o^a,d=1859775393):u<60?(c=r&o|a&(r|o),d=2400959708):(c=r^o^a,d=3395469782);const h=(s<<5|s>>>27)+c+l+d+i[u]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=s,s=h}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const i=n-this.blockSize;let s=0;const r=this.buf_;let o=this.inbuf_;for(;s<n;){if(o===0)for(;s<=i;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<n;)if(r[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}else for(;s<n;)if(r[o]=e[s],++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=n&255,n/=256;this.compress_(this.buf_);let i=0;for(let s=0;s<5;s++)for(let r=24;r>=0;r-=8)e[i]=this.chain_[s]>>r&255,++i;return e}}function Ve(t,e){return`${t} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const La=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let s=t.charCodeAt(i);if(s>=55296&&s<=56319){const r=s-55296;i++,_(i<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(i)-56320;s=65536+(r<<10)+o}s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):s<65536?(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},Cn=function(t){let e=0;for(let n=0;n<t.length;n++){const i=t.charCodeAt(n);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,n++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(t){return t&&t._delegate?t._delegate:t}class gt{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ee="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new ee;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ba(e))try{this.getOrInitializeService({instanceIdentifier:Ee})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=Ee){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ee){return this.instances.has(e)}getOptions(e=Ee){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(e,n){var i;const s=this.normalizeInstanceIdentifier(n),r=(i=this.onInitCallbacks.get(s))!==null&&i!==void 0?i:new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(i)for(const s of i)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:Wa(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=Ee){return this.component?this.component.multipleInstances?e:Ee:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wa(t){return t===Ee?void 0:t}function Ba(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ua{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Fa(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var R;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(R||(R={}));const Ha={debug:R.DEBUG,verbose:R.VERBOSE,info:R.INFO,warn:R.WARN,error:R.ERROR,silent:R.SILENT},$a=R.INFO,Va={[R.DEBUG]:"log",[R.VERBOSE]:"log",[R.INFO]:"info",[R.WARN]:"warn",[R.ERROR]:"error"},ja=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),s=Va[e];if(s)console[s](`[${i}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class mr{constructor(e){this.name=e,this._logLevel=$a,this._logHandler=ja,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in R))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ha[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,R.DEBUG,...e),this._logHandler(this,R.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,R.VERBOSE,...e),this._logHandler(this,R.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,R.INFO,...e),this._logHandler(this,R.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,R.WARN,...e),this._logHandler(this,R.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,R.ERROR,...e),this._logHandler(this,R.ERROR,...e)}}const Ga=(t,e)=>e.some(n=>t instanceof n);let as,ls;function qa(){return as||(as=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function za(){return ls||(ls=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const gr=new WeakMap,Jn=new WeakMap,yr=new WeakMap,On=new WeakMap,Ci=new WeakMap;function Ya(t){const e=new Promise((n,i)=>{const s=()=>{t.removeEventListener("success",r),t.removeEventListener("error",o)},r=()=>{n(fe(t.result)),s()},o=()=>{i(t.error),s()};t.addEventListener("success",r),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&gr.set(n,t)}).catch(()=>{}),Ci.set(e,t),e}function Ka(t){if(Jn.has(t))return;const e=new Promise((n,i)=>{const s=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",o),t.removeEventListener("abort",o)},r=()=>{n(),s()},o=()=>{i(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",r),t.addEventListener("error",o),t.addEventListener("abort",o)});Jn.set(t,e)}let Zn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Jn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||yr.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return fe(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Qa(t){Zn=t(Zn)}function Xa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const i=t.call(Ln(this),e,...n);return yr.set(i,e.sort?e.sort():[e]),fe(i)}:za().includes(t)?function(...e){return t.apply(Ln(this),e),fe(gr.get(this))}:function(...e){return fe(t.apply(Ln(this),e))}}function Ja(t){return typeof t=="function"?Xa(t):(t instanceof IDBTransaction&&Ka(t),Ga(t,qa())?new Proxy(t,Zn):t)}function fe(t){if(t instanceof IDBRequest)return Ya(t);if(On.has(t))return On.get(t);const e=Ja(t);return e!==t&&(On.set(t,e),Ci.set(e,t)),e}const Ln=t=>Ci.get(t);function Za(t,e,{blocked:n,upgrade:i,blocking:s,terminated:r}={}){const o=indexedDB.open(t,e),a=fe(o);return i&&o.addEventListener("upgradeneeded",l=>{i(fe(o.result),l.oldVersion,l.newVersion,fe(o.transaction),l)}),n&&o.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),s&&l.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const el=["get","getKey","getAll","getAllKeys","count"],tl=["put","add","delete","clear"],Fn=new Map;function cs(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Fn.get(e))return Fn.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,s=tl.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(s||el.includes(n)))return;const r=async function(o,...a){const l=this.transaction(o,s?"readwrite":"readonly");let c=l.store;return i&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),s&&l.done]))[0]};return Fn.set(e,r),r}Qa(t=>({...t,get:(e,n,i)=>cs(e,n)||t.get(e,n,i),has:(e,n)=>!!cs(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nl{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(il(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function il(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ei="@firebase/app",us="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae=new mr("@firebase/app"),sl="@firebase/app-compat",rl="@firebase/analytics-compat",ol="@firebase/analytics",al="@firebase/app-check-compat",ll="@firebase/app-check",cl="@firebase/auth",ul="@firebase/auth-compat",hl="@firebase/database",dl="@firebase/data-connect",fl="@firebase/database-compat",pl="@firebase/functions",_l="@firebase/functions-compat",ml="@firebase/installations",gl="@firebase/installations-compat",yl="@firebase/messaging",vl="@firebase/messaging-compat",Cl="@firebase/performance",El="@firebase/performance-compat",bl="@firebase/remote-config",wl="@firebase/remote-config-compat",Il="@firebase/storage",Tl="@firebase/storage-compat",Sl="@firebase/firestore",Rl="@firebase/ai",Nl="@firebase/firestore-compat",Al="firebase",kl="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ti="[DEFAULT]",Dl={[ei]:"fire-core",[sl]:"fire-core-compat",[ol]:"fire-analytics",[rl]:"fire-analytics-compat",[ll]:"fire-app-check",[al]:"fire-app-check-compat",[cl]:"fire-auth",[ul]:"fire-auth-compat",[hl]:"fire-rtdb",[dl]:"fire-data-connect",[fl]:"fire-rtdb-compat",[pl]:"fire-fn",[_l]:"fire-fn-compat",[ml]:"fire-iid",[gl]:"fire-iid-compat",[yl]:"fire-fcm",[vl]:"fire-fcm-compat",[Cl]:"fire-perf",[El]:"fire-perf-compat",[bl]:"fire-rc",[wl]:"fire-rc-compat",[Il]:"fire-gcs",[Tl]:"fire-gcs-compat",[Sl]:"fire-fst",[Nl]:"fire-fst-compat",[Rl]:"fire-vertex","fire-js":"fire-js",[Al]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jt=new Map,Pl=new Map,ni=new Map;function hs(t,e){try{t.container.addComponent(e)}catch(n){ae.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Zt(t){const e=t.name;if(ni.has(e))return ae.debug(`There were multiple attempts to register component ${e}.`),!1;ni.set(e,t);for(const n of Jt.values())hs(n,t);for(const n of Pl.values())hs(n,t);return!0}function xl(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Ml(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ol={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},pe=new pr("app","Firebase",Ol);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ll{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw pe.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fl=kl;function vr(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const i=Object.assign({name:ti,automaticDataCollectionEnabled:!0},e),s=i.name;if(typeof s!="string"||!s)throw pe.create("bad-app-name",{appName:String(s)});if(n||(n=dr()),!n)throw pe.create("no-options");const r=Jt.get(s);if(r){if(Xt(n,r.options)&&Xt(i,r.config))return r;throw pe.create("duplicate-app",{appName:s})}const o=new Ua(s);for(const l of ni.values())o.addComponent(l);const a=new Ll(n,i,o);return Jt.set(s,a),a}function Wl(t=ti){const e=Jt.get(t);if(!e&&t===ti&&dr())return vr();if(!e)throw pe.create("no-app",{appName:t});return e}function Be(t,e,n){var i;let s=(i=Dl[t])!==null&&i!==void 0?i:t;n&&(s+=`-${n}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ae.warn(a.join(" "));return}Zt(new gt(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl="firebase-heartbeat-database",Ul=1,yt="firebase-heartbeat-store";let Wn=null;function Cr(){return Wn||(Wn=Za(Bl,Ul,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(yt)}catch(n){console.warn(n)}}}}).catch(t=>{throw pe.create("idb-open",{originalErrorMessage:t.message})})),Wn}async function Hl(t){try{const n=(await Cr()).transaction(yt),i=await n.objectStore(yt).get(Er(t));return await n.done,i}catch(e){if(e instanceof At)ae.warn(e.message);else{const n=pe.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});ae.warn(n.message)}}}async function ds(t,e){try{const i=(await Cr()).transaction(yt,"readwrite");await i.objectStore(yt).put(e,Er(t)),await i.done}catch(n){if(n instanceof At)ae.warn(n.message);else{const i=pe.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});ae.warn(i.message)}}}function Er(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $l=1024,Vl=30;class jl{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ql(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=fs();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>Vl){const o=zl(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){ae.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=fs(),{heartbeatsToSend:i,unsentEntries:s}=Gl(this._heartbeatsCache.heartbeats),r=Kt(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return ae.warn(n),""}}}function fs(){return new Date().toISOString().substring(0,10)}function Gl(t,e=$l){const n=[];let i=t.slice();for(const s of t){const r=n.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),ps(n)>e){r.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),ps(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class ql{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ra()?Na().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Hl(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return ds(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return ds(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function ps(t){return Kt(JSON.stringify({version:2,heartbeats:t})).length}function zl(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let i=1;i<t.length;i++)t[i].date<n&&(n=t[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yl(t){Zt(new gt("platform-logger",e=>new nl(e),"PRIVATE")),Zt(new gt("heartbeat",e=>new jl(e),"PRIVATE")),Be(ei,us,t),Be(ei,us,"esm2017"),Be("fire-js","")}Yl("");var Kl="firebase",Ql="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Be(Kl,Ql,"app");var _s={};const ms="@firebase/database",gs="1.0.20";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let br="";function Xl(t){br=t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),O(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:mt(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zl{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return Z(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wr=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Jl(e)}}catch{}return new Zl},we=wr("localStorage"),ec=wr("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ue=new mr("@firebase/database"),Ir=function(){let t=1;return function(){return t++}}(),Tr=function(t){const e=La(t),n=new Oa;n.update(e);const i=n.digest();return yi.encodeByteArray(i)},kt=function(...t){let e="";for(let n=0;n<t.length;n++){const i=t[n];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=kt.apply(null,i):typeof i=="object"?e+=O(i):e+=i,e+=" "}return e};let ut=null,ys=!0;const tc=function(t,e){_(!0,"Can't turn on custom loggers persistently."),Ue.logLevel=R.VERBOSE,ut=Ue.log.bind(Ue)},U=function(...t){if(ys===!0&&(ys=!1,ut===null&&ec.get("logging_enabled")===!0&&tc()),ut){const e=kt.apply(null,t);ut(e)}},Dt=function(t){return function(...e){U(t,...e)}},ii=function(...t){const e="FIREBASE INTERNAL ERROR: "+kt(...t);Ue.error(e)},le=function(...t){const e=`FIREBASE FATAL ERROR: ${kt(...t)}`;throw Ue.error(e),new Error(e)},G=function(...t){const e="FIREBASE WARNING: "+kt(...t);Ue.warn(e)},nc=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&G("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},En=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},ic=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},je="[MIN_NAME]",Re="[MAX_NAME]",ke=function(t,e){if(t===e)return 0;if(t===je||e===Re)return-1;if(e===je||t===Re)return 1;{const n=vs(t),i=vs(e);return n!==null?i!==null?n-i===0?t.length-e.length:n-i:-1:i!==null?1:t<e?-1:1}},sc=function(t,e){return t===e?0:t<e?-1:1},st=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+O(e))},Ei=function(t){if(typeof t!="object"||t===null)return O(t);const e=[];for(const i in t)e.push(i);e.sort();let n="{";for(let i=0;i<e.length;i++)i!==0&&(n+=","),n+=O(e[i]),n+=":",n+=Ei(t[e[i]]);return n+="}",n},Sr=function(t,e){const n=t.length;if(n<=e)return[t];const i=[];for(let s=0;s<n;s+=e)s+e>n?i.push(t.substring(s,n)):i.push(t.substring(s,s+e));return i};function $(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const Rr=function(t){_(!En(t),"Invalid JSON number");const e=11,n=52,i=(1<<e-1)-1;let s,r,o,a,l;t===0?(r=0,o=0,s=1/t===-1/0?1:0):(s=t<0,t=Math.abs(t),t>=Math.pow(2,1-i)?(a=Math.min(Math.floor(Math.log(t)/Math.LN2),i),r=a+i,o=Math.round(t*Math.pow(2,n-a)-Math.pow(2,n))):(r=0,o=Math.round(t/Math.pow(2,1-i-n))));const c=[];for(l=n;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(s?1:0),c.reverse();const d=c.join("");let u="";for(l=0;l<64;l+=8){let h=parseInt(d.substr(l,8),2).toString(16);h.length===1&&(h="0"+h),u=u+h}return u.toLowerCase()},rc=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},oc=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function ac(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const i=new Error(t+" at "+e._path.toString()+": "+n);return i.code=t.toUpperCase(),i}const lc=new RegExp("^-?(0*)\\d{1,10}$"),cc=-2147483648,uc=2147483647,vs=function(t){if(lc.test(t)){const e=Number(t);if(e>=cc&&e<=uc)return e}return null},Qe=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw G("Exception was thrown by user callback.",n),e},Math.floor(0))}},hc=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},ht=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dc{constructor(e,n){this.appCheckProvider=n,this.appName=e.name,Ml(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((n,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,i):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)===null||n===void 0||n.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){G(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(e,n,i){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(U("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,i):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',G(e)}}class Gt{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Gt.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bi="5",Nr="v",Ar="s",kr="r",Dr="f",Pr=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,xr="ls",Mr="p",si="ac",Or="websocket",Lr="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e,n,i,s,r=!1,o="",a=!1,l=!1,c=null){this.secure=n,this.namespace=i,this.webSocketOnly=s,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=we.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&we.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function pc(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function Wr(t,e,n){_(typeof e=="string","typeof type must == string"),_(typeof n=="object","typeof params must == object");let i;if(e===Or)i=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===Lr)i=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);pc(t)&&(n.ns=t.namespace);const s=[];return $(n,(r,o)=>{s.push(r+"="+o)}),i+s.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _c{constructor(){this.counters_={}}incrementCounter(e,n=1){Z(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return ha(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn={},Un={};function wi(t){const e=t.toString();return Bn[e]||(Bn[e]=new _c),Bn[e]}function mc(t,e){const n=t.toString();return Un[n]||(Un[n]=e()),Un[n]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<i.length;++s)i[s]&&Qe(()=>{this.onMessage_(i[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cs="start",yc="close",vc="pLPCommand",Cc="pRTLPCB",Br="id",Ur="pw",Hr="ser",Ec="cb",bc="seg",wc="ts",Ic="d",Tc="dframe",$r=1870,Vr=30,Sc=$r-Vr,Rc=25e3,Nc=3e4;class Le{constructor(e,n,i,s,r,o,a){this.connId=e,this.repoInfo=n,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Dt(e),this.stats_=wi(n),this.urlFn=l=>(this.appCheckToken&&(l[si]=this.appCheckToken),Wr(n,Lr,l))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new gc(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(Nc)),ic(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Ii((...r)=>{const[o,a,l,c,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===Cs)this.id=a,this.password=l;else if(o===yc)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const i={};i[Cs]="t",i[Hr]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[Ec]=this.scriptTagHolder.uniqueCallbackIdentifier),i[Nr]=bi,this.transportSessionId&&(i[Ar]=this.transportSessionId),this.lastSessionId&&(i[xr]=this.lastSessionId),this.applicationId&&(i[Mr]=this.applicationId),this.appCheckToken&&(i[si]=this.appCheckToken),typeof location<"u"&&location.hostname&&Pr.test(location.hostname)&&(i[kr]=Dr);const s=this.urlFn(i);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Le.forceAllow_=!0}static forceDisallow(){Le.forceDisallow_=!0}static isAvailable(){return Le.forceAllow_?!0:!Le.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!rc()&&!oc()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=O(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const i=cr(n),s=Sr(i,Sc);for(let r=0;r<s.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[r]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const i={};i[Tc]="t",i[Br]=e,i[Ur]=n,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=O(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class Ii{constructor(e,n,i,s){this.onDisconnect=i,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=Ir(),window[vc+this.uniqueCallbackIdentifier]=e,window[Cc+this.uniqueCallbackIdentifier]=n,this.myIFrame=Ii.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){U("frame writing exception"),a.stack&&U(a.stack),U(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||U("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Br]=this.myID,e[Ur]=this.myPW,e[Hr]=this.currentSerial;let n=this.urlFn(e),i="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Vr+i.length<=$r;){const o=this.pendingSegs.shift();i=i+"&"+bc+s+"="+o.seg+"&"+wc+s+"="+o.ts+"&"+Ic+s+"="+o.d,s++}return n=n+i,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,i){this.pendingSegs.push({seg:e,ts:n,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const i=()=>{this.outstandingRequests.delete(n),this.newRequest_()},s=setTimeout(i,Math.floor(Rc)),r=()=>{clearTimeout(s),i()};this.addTag(e,r)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const s=i.readyState;(!s||s==="loaded"||s==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),n())},i.onerror=()=>{U("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ac=16384,kc=45e3;let en=null;typeof MozWebSocket<"u"?en=MozWebSocket:typeof WebSocket<"u"&&(en=WebSocket);class K{constructor(e,n,i,s,r,o,a){this.connId=e,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Dt(this.connId),this.stats_=wi(n),this.connURL=K.connectionURL_(n,o,a,s,i),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,i,s,r){const o={};return o[Nr]=bi,typeof location<"u"&&location.hostname&&Pr.test(location.hostname)&&(o[kr]=Dr),n&&(o[Ar]=n),i&&(o[xr]=i),s&&(o[si]=s),r&&(o[Mr]=r),Wr(e,Or,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,we.set("previous_websocket_failure",!0);try{let i;Sa(),this.mySock=new en(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){K.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(n);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&en!==null&&!K.forceDisallow_}static previouslyFailed(){return we.isInMemoryStorage||we.get("previous_websocket_failure")===!0}markConnectionHealthy(){we.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const i=mt(n);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(_(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const i=this.extractFrameCount_(n);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const n=O(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const i=Sr(n,Ac);i.length>1&&this.sendString_(String(i.length));for(let s=0;s<i.length;s++)this.sendString_(i[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(kc))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}K.responsesRequiredToBeHealthy=2;K.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{static get ALL_TRANSPORTS(){return[Le,K]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const n=K&&K.isAvailable();let i=n&&!K.previouslyFailed();if(e.webSocketOnly&&(n||G("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[K];else{const s=this.transports_=[];for(const r of vt.ALL_TRANSPORTS)r&&r.isAvailable()&&s.push(r);vt.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}vt.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dc=6e4,Pc=5e3,xc=10*1024,Mc=100*1024,Hn="t",Es="d",Oc="s",bs="r",Lc="e",ws="o",Is="a",Ts="n",Ss="p",Fc="h";class Wc{constructor(e,n,i,s,r,o,a,l,c,d){this.id=e,this.repoInfo_=n,this.applicationId_=i,this.appCheckToken_=s,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Dt("c:"+this.id+":"),this.transportManager_=new vt(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,i)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=ht(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Mc?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>xc?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Hn in e){const n=e[Hn];n===Is?this.upgradeIfSecondaryHealthy_():n===bs?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===ws&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=st("t",e),i=st("d",e);if(n==="c")this.onSecondaryControl_(i);else if(n==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Ss,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Is,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Ts,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=st("t",e),i=st("d",e);n==="c"?this.onControl_(i):n==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=st(Hn,e);if(Es in e){const i=e[Es];if(n===Fc){const s=Object.assign({},i);this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(n===Ts){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===Oc?this.onConnectionShutdown_(i):n===bs?this.onReset_(i):n===Lc?ii("Server Error: "+i):n===ws?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):ii("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,i=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),bi!==i&&G("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,i),ht(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Dc))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):ht(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Pc))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Ss,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(we.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{put(e,n,i,s){}merge(e,n,i,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,i){}onDisconnectMerge(e,n,i){}onDisconnectCancel(e,n){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gr{constructor(e){this.allowedEvents_=e,this.listeners_={},_(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let s=0;s<i.length;s++)i[s].callback.apply(i[s].context,n)}}on(e,n,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:i});const s=this.getInitialEvent(e);s&&n.apply(i,s)}off(e,n,i){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let r=0;r<s.length;r++)if(s[r].callback===n&&(!i||i===s[r].context)){s.splice(r,1);return}}validateEventType_(e){_(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn extends Gr{static getInstance(){return new tn}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!fr()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return _(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rs=32,Ns=768;class I{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let i=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[i]=this.pieces_[s],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function b(){return new I("")}function v(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function ge(t){return t.pieces_.length-t.pieceNum_}function S(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new I(t.pieces_,e)}function Ti(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function Bc(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function Ct(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function qr(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new I(e,0)}function x(t,e){const n=[];for(let i=t.pieceNum_;i<t.pieces_.length;i++)n.push(t.pieces_[i]);if(e instanceof I)for(let i=e.pieceNum_;i<e.pieces_.length;i++)n.push(e.pieces_[i]);else{const i=e.split("/");for(let s=0;s<i.length;s++)i[s].length>0&&n.push(i[s])}return new I(n,0)}function C(t){return t.pieceNum_>=t.pieces_.length}function V(t,e){const n=v(t),i=v(e);if(n===null)return e;if(n===i)return V(S(t),S(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function Uc(t,e){const n=Ct(t,0),i=Ct(e,0);for(let s=0;s<n.length&&s<i.length;s++){const r=ke(n[s],i[s]);if(r!==0)return r}return n.length===i.length?0:n.length<i.length?-1:1}function Si(t,e){if(ge(t)!==ge(e))return!1;for(let n=t.pieceNum_,i=e.pieceNum_;n<=t.pieces_.length;n++,i++)if(t.pieces_[n]!==e.pieces_[i])return!1;return!0}function z(t,e){let n=t.pieceNum_,i=e.pieceNum_;if(ge(t)>ge(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[i])return!1;++n,++i}return!0}class Hc{constructor(e,n){this.errorPrefix_=n,this.parts_=Ct(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=Cn(this.parts_[i]);zr(this)}}function $c(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=Cn(e),zr(t)}function Vc(t){const e=t.parts_.pop();t.byteLength_-=Cn(e),t.parts_.length>0&&(t.byteLength_-=1)}function zr(t){if(t.byteLength_>Ns)throw new Error(t.errorPrefix_+"has a key path longer than "+Ns+" bytes ("+t.byteLength_+").");if(t.parts_.length>Rs)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Rs+") or object contains a cycle "+be(t))}function be(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ri extends Gr{static getInstance(){return new Ri}constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return _(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rt=1e3,jc=60*5*1e3,As=30*1e3,Gc=1.3,qc=3e4,zc="server_kill",ks=3;class oe extends jr{constructor(e,n,i,s,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=i,this.onConnectStatus_=s,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=oe.nextPersistentConnectionId_++,this.log_=Dt("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=rt,this.maxReconnectDelay_=jc,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Ri.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&tn.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,i){const s=++this.requestNumber_,r={r:s,a:e,b:n};this.log_(O(r)),_(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),i&&(this.requestCBHash_[s]=i)}get(e){this.initConnection_();const n=new ee,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?n.resolve(a):n.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),n.promise}listen(e,n,i,s){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),_(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),_(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:s,hashFn:n,query:e,tag:i};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(i)})}sendListen_(e){const n=e.query,i=n._path.toString(),s=n._queryIdentifier;this.log_("Listen on "+i+" for "+s);const r={p:i},o="q";e.tag&&(r.q=n._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;oe.warnOnListenWarnings_(l,n),(this.listens.get(i)&&this.listens.get(i).get(s))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(i,s),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&Z(e,"w")){const i=Se(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const s='".indexOn": "'+n._queryParams.getIndex().toString()+'"',r=n._path.toString();G(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||xa(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=As)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=Pa(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(n,i,s=>{const r=s.s,o=s.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,i=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,i)})}unlisten(e,n){const i=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+s),_(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,s)&&this.connected_&&this.sendUnlisten_(i,s,e._queryObject,n)}sendUnlisten_(e,n,i,s){this.log_("Unlisten on "+e+" for "+n);const r={p:e},o="n";s&&(r.q=i,r.t=s),this.sendRequest(o,r)}onDisconnectPut(e,n,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:i})}onDisconnectMerge(e,n,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:i})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,i,s){const r={p:n,d:i};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,n,i,s){this.putInternal("p",e,n,i,s)}merge(e,n,i,s){this.putInternal("m",e,n,i,s)}putInternal(e,n,i,s,r){this.initConnection_();const o={p:n,d:i};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,i,r=>{this.log_(n+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(r.s,r.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,i=>{if(i.s!=="ok"){const r=i.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+O(e));const n=e.r,i=this.requestCBHash_[n];i&&(delete this.requestCBHash_[n],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):ii("Unrecognized action received from server: "+O(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){_(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=rt,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=rt,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>qc&&(this.reconnectDelay_=rt),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Gc)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+oe.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,i())},c=function(u){_(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(u)};this.realtime_={close:l,sendRequest:c};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[u,h]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?U("getToken() completed but was canceled"):(U("getToken() completed. Creating connection."),this.authToken_=u&&u.accessToken,this.appCheckToken_=h&&h.token,a=new Wc(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,i,p=>{G(p+" ("+this.repoInfo_.toString()+")"),this.interrupt(zc)},r))}catch(u){this.log_("Failed to get token: "+u),o||(this.repoInfo_.nodeAdmin&&G(u),l())}}}interrupt(e){U("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){U("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Xn(this.interruptReasons_)&&(this.reconnectDelay_=rt,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let i;n?i=n.map(r=>Ei(r)).join("$"):i="default";const s=this.removeListen_(e,i);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,n){const i=new I(e).toString();let s;if(this.listens.has(i)){const r=this.listens.get(i);s=r.get(n),r.delete(n),r.size===0&&this.listens.delete(i)}else s=void 0;return s}onAuthRevoked_(e,n){U("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=ks&&(this.reconnectDelay_=As,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){U("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=ks&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+br.replace(/\./g,"-")]=1,fr()?e["framework.cordova"]=1:Ta()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=tn.getInstance().currentlyOnline();return Xn(this.interruptReasons_)&&e}}oe.nextPersistentConnectionId_=0;oe.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E{constructor(e,n){this.name=e,this.node=n}static Wrap(e,n){return new E(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const i=new E(je,e),s=new E(je,n);return this.compare(i,s)!==0}minPost(){return E.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ut;class Yr extends bn{static get __EMPTY_NODE(){return Ut}static set __EMPTY_NODE(e){Ut=e}compare(e,n){return ke(e.name,n.name)}isDefinedOn(e){throw Ke("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return E.MIN}maxPost(){return new E(Re,Ut)}makePost(e,n){return _(typeof e=="string","KeyIndex indexValue must always be a string."),new E(e,Ut)}toString(){return".key"}}const He=new Yr;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e,n,i,s,r=null){this.isReverse_=s,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?i(e.key,n):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class W{constructor(e,n,i,s,r){this.key=e,this.value=n,this.color=i??W.RED,this.left=s??j.EMPTY_NODE,this.right=r??j.EMPTY_NODE}copy(e,n,i,s,r){return new W(e??this.key,n??this.value,i??this.color,s??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,i){let s=this;const r=i(e,s.key);return r<0?s=s.copy(null,null,null,s.left.insert(e,n,i),null):r===0?s=s.copy(null,n,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,n,i)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return j.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let i,s;if(i=this,n(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),n(e,i.key)===0){if(i.right.isEmpty())return j.EMPTY_NODE;s=i.right.min_(),i=i.copy(s.key,s.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,W.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,W.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}W.RED=!0;W.BLACK=!1;class Yc{copy(e,n,i,s,r){return this}insert(e,n,i){return new W(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class j{constructor(e,n=j.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new j(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,W.BLACK,null,null))}remove(e){return new j(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,W.BLACK,null,null))}get(e){let n,i=this.root_;for(;!i.isEmpty();){if(n=this.comparator_(e,i.key),n===0)return i.value;n<0?i=i.left:n>0&&(i=i.right)}return null}getPredecessorKey(e){let n,i=this.root_,s=null;for(;!i.isEmpty();)if(n=this.comparator_(e,i.key),n===0){if(i.left.isEmpty())return s?s.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else n<0?i=i.left:n>0&&(s=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Ht(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new Ht(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new Ht(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new Ht(this.root_,null,this.comparator_,!0,e)}}j.EMPTY_NODE=new Yc;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kc(t,e){return ke(t.name,e.name)}function Ni(t,e){return ke(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ri;function Qc(t){ri=t}const Kr=function(t){return typeof t=="number"?"number:"+Rr(t):"string:"+t},Qr=function(t){if(t.isLeafNode()){const e=t.val();_(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Z(e,".sv"),"Priority must be a string or number.")}else _(t===ri||t.isEmpty(),"priority of unexpected type.");_(t===ri||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ds;class F{static set __childrenNodeConstructor(e){Ds=e}static get __childrenNodeConstructor(){return Ds}constructor(e,n=F.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,_(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),Qr(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new F(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:F.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return C(e)?this:v(e)===".priority"?this.priorityNode_:F.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:F.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const i=v(e);return i===null?n:n.isEmpty()&&i!==".priority"?this:(_(i!==".priority"||ge(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,F.__childrenNodeConstructor.EMPTY_NODE.updateChild(S(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Kr(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=Rr(this.value_):e+=this.value_,this.lazyHash_=Tr(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===F.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof F.__childrenNodeConstructor?-1:(_(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,i=typeof this.value_,s=F.VALUE_TYPE_ORDER.indexOf(n),r=F.VALUE_TYPE_ORDER.indexOf(i);return _(s>=0,"Unknown leaf type: "+n),_(r>=0,"Unknown leaf type: "+i),s===r?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}F.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xr,Jr;function Xc(t){Xr=t}function Jc(t){Jr=t}class Zc extends bn{compare(e,n){const i=e.node.getPriority(),s=n.node.getPriority(),r=i.compareTo(s);return r===0?ke(e.name,n.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return E.MIN}maxPost(){return new E(Re,new F("[PRIORITY-POST]",Jr))}makePost(e,n){const i=Xr(e);return new E(n,new F("[PRIORITY-POST]",i))}toString(){return".priority"}}const A=new Zc;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eu=Math.log(2);class tu{constructor(e){const n=r=>parseInt(Math.log(r)/eu,10),i=r=>parseInt(Array(r+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const s=i(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const nn=function(t,e,n,i){t.sort(e);const s=function(l,c){const d=c-l;let u,h;if(d===0)return null;if(d===1)return u=t[l],h=n?n(u):u,new W(h,u.node,W.BLACK,null,null);{const p=parseInt(d/2,10)+l,m=s(l,p),y=s(p+1,c);return u=t[p],h=n?n(u):u,new W(h,u.node,W.BLACK,m,y)}},r=function(l){let c=null,d=null,u=t.length;const h=function(m,y){const w=u-m,k=u;u-=m;const L=s(w+1,k),T=t[w],M=n?n(T):T;p(new W(M,T.node,y,null,L))},p=function(m){c?(c.left=m,c=m):(d=m,c=m)};for(let m=0;m<l.count;++m){const y=l.nextBitIsOne(),w=Math.pow(2,l.count-(m+1));y?h(w,W.BLACK):(h(w,W.BLACK),h(w,W.RED))}return d},o=new tu(t.length),a=r(o);return new j(i||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $n;const xe={};class re{static get Default(){return _(xe&&A,"ChildrenNode.ts has not been loaded"),$n=$n||new re({".priority":xe},{".priority":A}),$n}constructor(e,n){this.indexes_=e,this.indexSet_=n}get(e){const n=Se(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof j?n:null}hasIndex(e){return Z(this.indexSet_,e.toString())}addIndex(e,n){_(e!==He,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let s=!1;const r=n.getIterator(E.Wrap);let o=r.getNext();for(;o;)s=s||e.isDefinedOn(o.node),i.push(o),o=r.getNext();let a;s?a=nn(i,e.getCompare()):a=xe;const l=e.toString(),c=Object.assign({},this.indexSet_);c[l]=e;const d=Object.assign({},this.indexes_);return d[l]=a,new re(d,c)}addToIndexes(e,n){const i=Qt(this.indexes_,(s,r)=>{const o=Se(this.indexSet_,r);if(_(o,"Missing index implementation for "+r),s===xe)if(o.isDefinedOn(e.node)){const a=[],l=n.getIterator(E.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),nn(a,o.getCompare())}else return xe;else{const a=n.get(e.name);let l=s;return a&&(l=l.remove(new E(e.name,a))),l.insert(e,e.node)}});return new re(i,this.indexSet_)}removeFromIndexes(e,n){const i=Qt(this.indexes_,s=>{if(s===xe)return s;{const r=n.get(e.name);return r?s.remove(new E(e.name,r)):s}});return new re(i,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ot;class g{static get EMPTY_NODE(){return ot||(ot=new g(new j(Ni),null,re.Default))}constructor(e,n,i){this.children_=e,this.priorityNode_=n,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&Qr(this.priorityNode_),this.children_.isEmpty()&&_(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||ot}updatePriority(e){return this.children_.isEmpty()?this:new g(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?ot:n}}getChild(e){const n=v(e);return n===null?this:this.getImmediateChild(n).getChild(S(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(_(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const i=new E(e,n);let s,r;n.isEmpty()?(s=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(i,this.children_)):(s=this.children_.insert(e,n),r=this.indexMap_.addToIndexes(i,this.children_));const o=s.isEmpty()?ot:this.priorityNode_;return new g(s,o,r)}}updateChild(e,n){const i=v(e);if(i===null)return n;{_(v(e)!==".priority"||ge(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(i).updateChild(S(e),n);return this.updateImmediateChild(i,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let i=0,s=0,r=!0;if(this.forEachChild(A,(o,a)=>{n[o]=a.val(e),i++,r&&g.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):r=!1}),!e&&r&&s<2*i){const o=[];for(const a in n)o[a]=n[a];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+Kr(this.getPriority().val())+":"),this.forEachChild(A,(n,i)=>{const s=i.hash();s!==""&&(e+=":"+n+":"+s)}),this.lazyHash_=e===""?"":Tr(e)}return this.lazyHash_}getPredecessorChildName(e,n,i){const s=this.resolveIndex_(i);if(s){const r=s.getPredecessorKey(new E(e,n));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const i=n.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new E(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const i=n.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new E(n,this.children_.get(n)):null}forEachChild(e,n){const i=this.resolveIndex_(e);return i?i.inorderTraversal(s=>n(s.name,s.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const i=this.resolveIndex_(n);if(i)return i.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,E.Wrap);let r=s.peek();for(;r!=null&&n.compare(r,e)<0;)s.getNext(),r=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const i=this.resolveIndex_(n);if(i)return i.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,E.Wrap);let r=s.peek();for(;r!=null&&n.compare(r,e)>0;)s.getNext(),r=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Pt?-1:0}withIndex(e){if(e===He||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new g(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===He||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const i=this.getIterator(A),s=n.getIterator(A);let r=i.getNext(),o=s.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=i.getNext(),o=s.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===He?null:this.indexMap_.get(e.toString())}}g.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class nu extends g{constructor(){super(new j(Ni),g.EMPTY_NODE,re.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return g.EMPTY_NODE}isEmpty(){return!1}}const Pt=new nu;Object.defineProperties(E,{MIN:{value:new E(je,g.EMPTY_NODE)},MAX:{value:new E(Re,Pt)}});Yr.__EMPTY_NODE=g.EMPTY_NODE;F.__childrenNodeConstructor=g;Qc(Pt);Jc(Pt);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iu=!0;function P(t,e=null){if(t===null)return g.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),_(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new F(n,P(e))}if(!(t instanceof Array)&&iu){const n=[];let i=!1;if($(t,(o,a)=>{if(o.substring(0,1)!=="."){const l=P(a);l.isEmpty()||(i=i||!l.getPriority().isEmpty(),n.push(new E(o,l)))}}),n.length===0)return g.EMPTY_NODE;const r=nn(n,Kc,o=>o.name,Ni);if(i){const o=nn(n,A.getCompare());return new g(r,P(e),new re({".priority":o},{".priority":A}))}else return new g(r,P(e),re.Default)}else{let n=g.EMPTY_NODE;return $(t,(i,s)=>{if(Z(t,i)&&i.substring(0,1)!=="."){const r=P(s);(r.isLeafNode()||!r.isEmpty())&&(n=n.updateImmediateChild(i,r))}}),n.updatePriority(P(e))}}Xc(P);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class su extends bn{constructor(e){super(),this.indexPath_=e,_(!C(e)&&v(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const i=this.extractChild(e.node),s=this.extractChild(n.node),r=i.compareTo(s);return r===0?ke(e.name,n.name):r}makePost(e,n){const i=P(e),s=g.EMPTY_NODE.updateChild(this.indexPath_,i);return new E(n,s)}maxPost(){const e=g.EMPTY_NODE.updateChild(this.indexPath_,Pt);return new E(Re,e)}toString(){return Ct(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru extends bn{compare(e,n){const i=e.node.compareTo(n.node);return i===0?ke(e.name,n.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return E.MIN}maxPost(){return E.MAX}makePost(e,n){const i=P(e);return new E(n,i)}toString(){return".value"}}const ou=new ru;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zr(t){return{type:"value",snapshotNode:t}}function Ge(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function Et(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function bt(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function au(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai{constructor(e){this.index_=e}updateChild(e,n,i,s,r,o){_(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(n);return a.getChild(s).equals(i.getChild(s))&&a.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(n)?o.trackChildChange(Et(n,a)):_(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Ge(n,i)):o.trackChildChange(bt(n,i,a))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(n,i).withIndex(this.index_)}updateFullNode(e,n,i){return i!=null&&(e.isLeafNode()||e.forEachChild(A,(s,r)=>{n.hasChild(s)||i.trackChildChange(Et(s,r))}),n.isLeafNode()||n.forEachChild(A,(s,r)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(r)||i.trackChildChange(bt(s,r,o))}else i.trackChildChange(Ge(s,r))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?g.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e){this.indexedFilter_=new Ai(e.getIndex()),this.index_=e.getIndex(),this.startPost_=wt.getStartPost_(e),this.endPost_=wt.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&i}updateChild(e,n,i,s,r,o){return this.matches(new E(n,i))||(i=g.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,i,s,r,o)}updateFullNode(e,n,i){n.isLeafNode()&&(n=g.EMPTY_NODE);let s=n.withIndex(this.index_);s=s.updatePriority(g.EMPTY_NODE);const r=this;return n.forEachChild(A,(o,a)=>{r.matches(new E(o,a))||(s=s.updateImmediateChild(o,g.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,i)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=n=>{const i=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new wt(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,i,s,r,o){return this.rangedFilter_.matches(new E(n,i))||(i=g.EMPTY_NODE),e.getImmediateChild(n).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,i,s,r,o):this.fullLimitUpdateChild_(e,n,i,r,o)}updateFullNode(e,n,i){let s;if(n.isLeafNode()||n.isEmpty())s=g.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){s=g.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=n.withIndex(this.index_),s=s.updatePriority(g.EMPTY_NODE);let r;this.reverse_?r=s.getReverseIterator(this.index_):r=s.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,g.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,i)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,i,s,r){let o;if(this.reverse_){const u=this.index_.getCompare();o=(h,p)=>u(p,h)}else o=this.index_.getCompare();const a=e;_(a.numChildren()===this.limit_,"");const l=new E(n,i),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),d=this.rangedFilter_.matches(l);if(a.hasChild(n)){const u=a.getImmediateChild(n);let h=s.getChildAfterChild(this.index_,c,this.reverse_);for(;h!=null&&(h.name===n||a.hasChild(h.name));)h=s.getChildAfterChild(this.index_,h,this.reverse_);const p=h==null?1:o(h,l);if(d&&!i.isEmpty()&&p>=0)return r!=null&&r.trackChildChange(bt(n,i,u)),a.updateImmediateChild(n,i);{r!=null&&r.trackChildChange(Et(n,u));const y=a.updateImmediateChild(n,g.EMPTY_NODE);return h!=null&&this.rangedFilter_.matches(h)?(r!=null&&r.trackChildChange(Ge(h.name,h.node)),y.updateImmediateChild(h.name,h.node)):y}}else return i.isEmpty()?e:d&&o(c,l)>=0?(r!=null&&(r.trackChildChange(Et(c.name,c.node)),r.trackChildChange(Ge(n,i))),a.updateImmediateChild(n,i).updateImmediateChild(c.name,g.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=A}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return _(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return _(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:je}hasEnd(){return this.endSet_}getIndexEndValue(){return _(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return _(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Re}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return _(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===A}copy(){const e=new ki;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function cu(t){return t.loadsAllData()?new Ai(t.getIndex()):t.hasLimit()?new lu(t):new wt(t)}function Ps(t){const e={};if(t.isDefault())return e;let n;if(t.index_===A?n="$priority":t.index_===ou?n="$value":t.index_===He?n="$key":(_(t.index_ instanceof su,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=O(n),t.startSet_){const i=t.startAfterSet_?"startAfter":"startAt";e[i]=O(t.indexStartValue_),t.startNameSet_&&(e[i]+=","+O(t.indexStartName_))}if(t.endSet_){const i=t.endBeforeSet_?"endBefore":"endAt";e[i]=O(t.indexEndValue_),t.endNameSet_&&(e[i]+=","+O(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function xs(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==A&&(e.i=t.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn extends jr{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(_(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,n,i,s){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=i,this.appCheckTokenProvider_=s,this.log_=Dt("p:rest:"),this.listens_={}}listen(e,n,i,s){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=sn.getListenId_(e,i),a={};this.listens_[o]=a;const l=Ps(e._queryParams);this.restRequest_(r+".json",l,(c,d)=>{let u=d;if(c===404&&(u=null,c=null),c===null&&this.onDataUpdate_(r,u,!1,i),Se(this.listens_,o)===a){let h;c?c===401?h="permission_denied":h="rest_error:"+c:h="ok",s(h,null)}})}unlisten(e,n){const i=sn.getListenId_(e,n);delete this.listens_[i]}get(e){const n=Ps(e._queryParams),i=e._path.toString(),s=new ee;return this.restRequest_(i+".json",n,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(i,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,n={},i){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,r])=>{s&&s.accessToken&&(n.auth=s.accessToken),r&&r.token&&(n.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Ma(n);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(i&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=mt(a.responseText)}catch{G("Failed to parse JSON response for "+o+": "+a.responseText)}i(null,l)}else a.status!==401&&a.status!==404&&G("Got unsuccessful REST response for "+o+" Status: "+a.status),i(a.status);i=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uu{constructor(){this.rootNode_=g.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rn(){return{value:null,children:new Map}}function Xe(t,e,n){if(C(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const i=v(e);t.children.has(i)||t.children.set(i,rn());const s=t.children.get(i);e=S(e),Xe(s,e,n)}}function oi(t,e){if(C(e))return t.value=null,t.children.clear(),!0;if(t.value!==null){if(t.value.isLeafNode())return!1;{const n=t.value;return t.value=null,n.forEachChild(A,(i,s)=>{Xe(t,new I(i),s)}),oi(t,e)}}else if(t.children.size>0){const n=v(e);return e=S(e),t.children.has(n)&&oi(t.children.get(n),e)&&t.children.delete(n),t.children.size===0}else return!0}function ai(t,e,n){t.value!==null?n(e,t.value):hu(t,(i,s)=>{const r=new I(e.toString()+"/"+i);ai(s,r,n)})}function hu(t,e){t.children.forEach((n,i)=>{e(i,n)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class du{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n=Object.assign({},e);return this.last_&&$(this.last_,(i,s)=>{n[i]=n[i]-s}),this.last_=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ms=10*1e3,fu=30*1e3,pu=5*60*1e3;class _u{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new du(e);const i=Ms+(fu-Ms)*Math.random();ht(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),n={};let i=!1;$(e,(s,r)=>{r>0&&Z(this.statsToReport_,s)&&(n[s]=r,i=!0)}),i&&this.server_.reportStats(n),ht(this.reportStats_.bind(this),Math.floor(Math.random()*2*pu))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Q||(Q={}));function eo(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Di(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Pi(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(e,n,i){this.path=e,this.affectedTree=n,this.revert=i,this.type=Q.ACK_USER_WRITE,this.source=eo()}operationForChild(e){if(C(this.path)){if(this.affectedTree.value!=null)return _(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new I(e));return new on(b(),n,this.revert)}}else return _(v(this.path)===e,"operationForChild called for unrelated child."),new on(S(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(e,n){this.source=e,this.path=n,this.type=Q.LISTEN_COMPLETE}operationForChild(e){return C(this.path)?new It(this.source,b()):new It(this.source,S(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e,n,i){this.source=e,this.path=n,this.snap=i,this.type=Q.OVERWRITE}operationForChild(e){return C(this.path)?new Ne(this.source,b(),this.snap.getImmediateChild(e)):new Ne(this.source,S(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e,n,i){this.source=e,this.path=n,this.children=i,this.type=Q.MERGE}operationForChild(e){if(C(this.path)){const n=this.children.subtree(new I(e));return n.isEmpty()?null:n.value?new Ne(this.source,b(),n.value):new Tt(this.source,b(),n)}else return _(v(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Tt(this.source,S(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e,n,i){this.node_=e,this.fullyInitialized_=n,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(C(e))return this.isFullyInitialized()&&!this.filtered_;const n=v(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mu{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function gu(t,e,n,i){const s=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(au(o.childName,o.snapshotNode))}),at(t,s,"child_removed",e,i,n),at(t,s,"child_added",e,i,n),at(t,s,"child_moved",r,i,n),at(t,s,"child_changed",e,i,n),at(t,s,"value",e,i,n),s}function at(t,e,n,i,s,r){const o=i.filter(a=>a.type===n);o.sort((a,l)=>vu(t,a,l)),o.forEach(a=>{const l=yu(t,a,r);s.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,t.query_))})})}function yu(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function vu(t,e,n){if(e.childName==null||n.childName==null)throw Ke("Should only compare child_ events.");const i=new E(e.childName,e.snapshotNode),s=new E(n.childName,n.snapshotNode);return t.index_.compare(i,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(t,e){return{eventCache:t,serverCache:e}}function dt(t,e,n,i){return wn(new ye(e,n,i),t.serverCache)}function to(t,e,n,i){return wn(t.eventCache,new ye(e,n,i))}function an(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function Ae(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vn;const Cu=()=>(Vn||(Vn=new j(sc)),Vn);class N{static fromObject(e){let n=new N(null);return $(e,(i,s)=>{n=n.set(new I(i),s)}),n}constructor(e,n=Cu()){this.value=e,this.children=n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:b(),value:this.value};if(C(e))return null;{const i=v(e),s=this.children.get(i);if(s!==null){const r=s.findRootMostMatchingPathAndValue(S(e),n);return r!=null?{path:x(new I(i),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(C(e))return this;{const n=v(e),i=this.children.get(n);return i!==null?i.subtree(S(e)):new N(null)}}set(e,n){if(C(e))return new N(n,this.children);{const i=v(e),r=(this.children.get(i)||new N(null)).set(S(e),n),o=this.children.insert(i,r);return new N(this.value,o)}}remove(e){if(C(e))return this.children.isEmpty()?new N(null):new N(null,this.children);{const n=v(e),i=this.children.get(n);if(i){const s=i.remove(S(e));let r;return s.isEmpty()?r=this.children.remove(n):r=this.children.insert(n,s),this.value===null&&r.isEmpty()?new N(null):new N(this.value,r)}else return this}}get(e){if(C(e))return this.value;{const n=v(e),i=this.children.get(n);return i?i.get(S(e)):null}}setTree(e,n){if(C(e))return n;{const i=v(e),r=(this.children.get(i)||new N(null)).setTree(S(e),n);let o;return r.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,r),new N(this.value,o)}}fold(e){return this.fold_(b(),e)}fold_(e,n){const i={};return this.children.inorderTraversal((s,r)=>{i[s]=r.fold_(x(e,s),n)}),n(e,this.value,i)}findOnPath(e,n){return this.findOnPath_(e,b(),n)}findOnPath_(e,n,i){const s=this.value?i(n,this.value):!1;if(s)return s;if(C(e))return null;{const r=v(e),o=this.children.get(r);return o?o.findOnPath_(S(e),x(n,r),i):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,b(),n)}foreachOnPath_(e,n,i){if(C(e))return this;{this.value&&i(n,this.value);const s=v(e),r=this.children.get(s);return r?r.foreachOnPath_(S(e),x(n,s),i):new N(null)}}foreach(e){this.foreach_(b(),e)}foreach_(e,n){this.children.inorderTraversal((i,s)=>{s.foreach_(x(e,i),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,i)=>{i.value&&e(n,i.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e){this.writeTree_=e}static empty(){return new X(new N(null))}}function ft(t,e,n){if(C(e))return new X(new N(n));{const i=t.writeTree_.findRootMostValueAndPath(e);if(i!=null){const s=i.path;let r=i.value;const o=V(s,e);return r=r.updateChild(o,n),new X(t.writeTree_.set(s,r))}else{const s=new N(n),r=t.writeTree_.setTree(e,s);return new X(r)}}}function Os(t,e,n){let i=t;return $(n,(s,r)=>{i=ft(i,x(e,s),r)}),i}function Ls(t,e){if(C(e))return X.empty();{const n=t.writeTree_.setTree(e,new N(null));return new X(n)}}function li(t,e){return De(t,e)!=null}function De(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild(V(n.path,e)):null}function Fs(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(A,(i,s)=>{e.push(new E(i,s))}):t.writeTree_.children.inorderTraversal((i,s)=>{s.value!=null&&e.push(new E(i,s.value))}),e}function _e(t,e){if(C(e))return t;{const n=De(t,e);return n!=null?new X(new N(n)):new X(t.writeTree_.subtree(e))}}function ci(t){return t.writeTree_.isEmpty()}function qe(t,e){return no(b(),t.writeTree_,e)}function no(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let i=null;return e.children.inorderTraversal((s,r)=>{s===".priority"?(_(r.value!==null,"Priority writes must always be leaf nodes"),i=r.value):n=no(x(t,s),r,n)}),!n.getChild(t).isEmpty()&&i!==null&&(n=n.updateChild(x(t,".priority"),i)),n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function In(t,e){return oo(e,t)}function Eu(t,e,n,i,s){_(i>t.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),t.allWrites.push({path:e,snap:n,writeId:i,visible:s}),s&&(t.visibleWrites=ft(t.visibleWrites,e,n)),t.lastWriteId=i}function bu(t,e){for(let n=0;n<t.allWrites.length;n++){const i=t.allWrites[n];if(i.writeId===e)return i}return null}function wu(t,e){const n=t.allWrites.findIndex(a=>a.writeId===e);_(n>=0,"removeWrite called with nonexistent writeId.");const i=t.allWrites[n];t.allWrites.splice(n,1);let s=i.visible,r=!1,o=t.allWrites.length-1;for(;s&&o>=0;){const a=t.allWrites[o];a.visible&&(o>=n&&Iu(a,i.path)?s=!1:z(i.path,a.path)&&(r=!0)),o--}if(s){if(r)return Tu(t),!0;if(i.snap)t.visibleWrites=Ls(t.visibleWrites,i.path);else{const a=i.children;$(a,l=>{t.visibleWrites=Ls(t.visibleWrites,x(i.path,l))})}return!0}else return!1}function Iu(t,e){if(t.snap)return z(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&z(x(t.path,n),e))return!0;return!1}function Tu(t){t.visibleWrites=io(t.allWrites,Su,b()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function Su(t){return t.visible}function io(t,e,n){let i=X.empty();for(let s=0;s<t.length;++s){const r=t[s];if(e(r)){const o=r.path;let a;if(r.snap)z(n,o)?(a=V(n,o),i=ft(i,a,r.snap)):z(o,n)&&(a=V(o,n),i=ft(i,b(),r.snap.getChild(a)));else if(r.children){if(z(n,o))a=V(n,o),i=Os(i,a,r.children);else if(z(o,n))if(a=V(o,n),C(a))i=Os(i,b(),r.children);else{const l=Se(r.children,v(a));if(l){const c=l.getChild(S(a));i=ft(i,b(),c)}}}else throw Ke("WriteRecord should have .snap or .children")}}return i}function so(t,e,n,i,s){if(!i&&!s){const r=De(t.visibleWrites,e);if(r!=null)return r;{const o=_e(t.visibleWrites,e);if(ci(o))return n;if(n==null&&!li(o,b()))return null;{const a=n||g.EMPTY_NODE;return qe(o,a)}}}else{const r=_e(t.visibleWrites,e);if(!s&&ci(r))return n;if(!s&&n==null&&!li(r,b()))return null;{const o=function(c){return(c.visible||s)&&(!i||!~i.indexOf(c.writeId))&&(z(c.path,e)||z(e,c.path))},a=io(t.allWrites,o,e),l=n||g.EMPTY_NODE;return qe(a,l)}}}function Ru(t,e,n){let i=g.EMPTY_NODE;const s=De(t.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(A,(r,o)=>{i=i.updateImmediateChild(r,o)}),i;if(n){const r=_e(t.visibleWrites,e);return n.forEachChild(A,(o,a)=>{const l=qe(_e(r,new I(o)),a);i=i.updateImmediateChild(o,l)}),Fs(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const r=_e(t.visibleWrites,e);return Fs(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function Nu(t,e,n,i,s){_(i||s,"Either existingEventSnap or existingServerSnap must exist");const r=x(e,n);if(li(t.visibleWrites,r))return null;{const o=_e(t.visibleWrites,r);return ci(o)?s.getChild(n):qe(o,s.getChild(n))}}function Au(t,e,n,i){const s=x(e,n),r=De(t.visibleWrites,s);if(r!=null)return r;if(i.isCompleteForChild(n)){const o=_e(t.visibleWrites,s);return qe(o,i.getNode().getImmediateChild(n))}else return null}function ku(t,e){return De(t.visibleWrites,e)}function Du(t,e,n,i,s,r,o){let a;const l=_e(t.visibleWrites,e),c=De(l,b());if(c!=null)a=c;else if(n!=null)a=qe(l,n);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const d=[],u=o.getCompare(),h=r?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o);let p=h.getNext();for(;p&&d.length<s;)u(p,i)!==0&&d.push(p),p=h.getNext();return d}else return[]}function Pu(){return{visibleWrites:X.empty(),allWrites:[],lastWriteId:-1}}function ln(t,e,n,i){return so(t.writeTree,t.treePath,e,n,i)}function xi(t,e){return Ru(t.writeTree,t.treePath,e)}function Ws(t,e,n,i){return Nu(t.writeTree,t.treePath,e,n,i)}function cn(t,e){return ku(t.writeTree,x(t.treePath,e))}function xu(t,e,n,i,s,r){return Du(t.writeTree,t.treePath,e,n,i,s,r)}function Mi(t,e,n){return Au(t.writeTree,t.treePath,e,n)}function ro(t,e){return oo(x(t.treePath,e),t.writeTree)}function oo(t,e){return{treePath:t,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mu{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,i=e.childName;_(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),_(i!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(i);if(s){const r=s.type;if(n==="child_added"&&r==="child_removed")this.changeMap.set(i,bt(i,e.snapshotNode,s.snapshotNode));else if(n==="child_removed"&&r==="child_added")this.changeMap.delete(i);else if(n==="child_removed"&&r==="child_changed")this.changeMap.set(i,Et(i,s.oldSnap));else if(n==="child_changed"&&r==="child_added")this.changeMap.set(i,Ge(i,e.snapshotNode));else if(n==="child_changed"&&r==="child_changed")this.changeMap.set(i,bt(i,e.snapshotNode,s.oldSnap));else throw Ke("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ou{getCompleteChild(e){return null}getChildAfterChild(e,n,i){return null}}const ao=new Ou;class Oi{constructor(e,n,i=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=i}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new ye(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Mi(this.writes_,e,i)}}getChildAfterChild(e,n,i){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Ae(this.viewCache_),r=xu(this.writes_,s,n,1,i,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lu(t){return{filter:t}}function Fu(t,e){_(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),_(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function Wu(t,e,n,i,s){const r=new Mu;let o,a;if(n.type===Q.OVERWRITE){const c=n;c.source.fromUser?o=ui(t,e,c.path,c.snap,i,s,r):(_(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!C(c.path),o=un(t,e,c.path,c.snap,i,s,a,r))}else if(n.type===Q.MERGE){const c=n;c.source.fromUser?o=Uu(t,e,c.path,c.children,i,s,r):(_(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=hi(t,e,c.path,c.children,i,s,a,r))}else if(n.type===Q.ACK_USER_WRITE){const c=n;c.revert?o=Vu(t,e,c.path,i,s,r):o=Hu(t,e,c.path,c.affectedTree,i,s,r)}else if(n.type===Q.LISTEN_COMPLETE)o=$u(t,e,n.path,i,r);else throw Ke("Unknown operation type: "+n.type);const l=r.getChanges();return Bu(e,o,l),{viewCache:o,changes:l}}function Bu(t,e,n){const i=e.eventCache;if(i.isFullyInitialized()){const s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=an(t);(n.length>0||!t.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&n.push(Zr(an(e)))}}function lo(t,e,n,i,s,r){const o=e.eventCache;if(cn(i,n)!=null)return e;{let a,l;if(C(n))if(_(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=Ae(e),d=c instanceof g?c:g.EMPTY_NODE,u=xi(i,d);a=t.filter.updateFullNode(e.eventCache.getNode(),u,r)}else{const c=ln(i,Ae(e));a=t.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=v(n);if(c===".priority"){_(ge(n)===1,"Can't have a priority with additional path components");const d=o.getNode();l=e.serverCache.getNode();const u=Ws(i,n,d,l);u!=null?a=t.filter.updatePriority(d,u):a=o.getNode()}else{const d=S(n);let u;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const h=Ws(i,n,o.getNode(),l);h!=null?u=o.getNode().getImmediateChild(c).updateChild(d,h):u=o.getNode().getImmediateChild(c)}else u=Mi(i,c,e.serverCache);u!=null?a=t.filter.updateChild(o.getNode(),c,u,d,s,r):a=o.getNode()}}return dt(e,a,o.isFullyInitialized()||C(n),t.filter.filtersNodes())}}function un(t,e,n,i,s,r,o,a){const l=e.serverCache;let c;const d=o?t.filter:t.filter.getIndexedFilter();if(C(n))c=d.updateFullNode(l.getNode(),i,null);else if(d.filtersNodes()&&!l.isFiltered()){const p=l.getNode().updateChild(n,i);c=d.updateFullNode(l.getNode(),p,null)}else{const p=v(n);if(!l.isCompleteForPath(n)&&ge(n)>1)return e;const m=S(n),w=l.getNode().getImmediateChild(p).updateChild(m,i);p===".priority"?c=d.updatePriority(l.getNode(),w):c=d.updateChild(l.getNode(),p,w,m,ao,null)}const u=to(e,c,l.isFullyInitialized()||C(n),d.filtersNodes()),h=new Oi(s,u,r);return lo(t,u,n,s,h,a)}function ui(t,e,n,i,s,r,o){const a=e.eventCache;let l,c;const d=new Oi(s,e,r);if(C(n))c=t.filter.updateFullNode(e.eventCache.getNode(),i,o),l=dt(e,c,!0,t.filter.filtersNodes());else{const u=v(n);if(u===".priority")c=t.filter.updatePriority(e.eventCache.getNode(),i),l=dt(e,c,a.isFullyInitialized(),a.isFiltered());else{const h=S(n),p=a.getNode().getImmediateChild(u);let m;if(C(h))m=i;else{const y=d.getCompleteChild(u);y!=null?Ti(h)===".priority"&&y.getChild(qr(h)).isEmpty()?m=y:m=y.updateChild(h,i):m=g.EMPTY_NODE}if(p.equals(m))l=e;else{const y=t.filter.updateChild(a.getNode(),u,m,h,d,o);l=dt(e,y,a.isFullyInitialized(),t.filter.filtersNodes())}}}return l}function Bs(t,e){return t.eventCache.isCompleteForChild(e)}function Uu(t,e,n,i,s,r,o){let a=e;return i.foreach((l,c)=>{const d=x(n,l);Bs(e,v(d))&&(a=ui(t,a,d,c,s,r,o))}),i.foreach((l,c)=>{const d=x(n,l);Bs(e,v(d))||(a=ui(t,a,d,c,s,r,o))}),a}function Us(t,e,n){return n.foreach((i,s)=>{e=e.updateChild(i,s)}),e}function hi(t,e,n,i,s,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;C(n)?c=i:c=new N(null).setTree(n,i);const d=e.serverCache.getNode();return c.children.inorderTraversal((u,h)=>{if(d.hasChild(u)){const p=e.serverCache.getNode().getImmediateChild(u),m=Us(t,p,h);l=un(t,l,new I(u),m,s,r,o,a)}}),c.children.inorderTraversal((u,h)=>{const p=!e.serverCache.isCompleteForChild(u)&&h.value===null;if(!d.hasChild(u)&&!p){const m=e.serverCache.getNode().getImmediateChild(u),y=Us(t,m,h);l=un(t,l,new I(u),y,s,r,o,a)}}),l}function Hu(t,e,n,i,s,r,o){if(cn(s,n)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(i.value!=null){if(C(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return un(t,e,n,l.getNode().getChild(n),s,r,a,o);if(C(n)){let c=new N(null);return l.getNode().forEachChild(He,(d,u)=>{c=c.set(new I(d),u)}),hi(t,e,n,c,s,r,a,o)}else return e}else{let c=new N(null);return i.foreach((d,u)=>{const h=x(n,d);l.isCompleteForPath(h)&&(c=c.set(d,l.getNode().getChild(h)))}),hi(t,e,n,c,s,r,a,o)}}function $u(t,e,n,i,s){const r=e.serverCache,o=to(e,r.getNode(),r.isFullyInitialized()||C(n),r.isFiltered());return lo(t,o,n,i,ao,s)}function Vu(t,e,n,i,s,r){let o;if(cn(i,n)!=null)return e;{const a=new Oi(i,e,s),l=e.eventCache.getNode();let c;if(C(n)||v(n)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=ln(i,Ae(e));else{const u=e.serverCache.getNode();_(u instanceof g,"serverChildren would be complete if leaf node"),d=xi(i,u)}d=d,c=t.filter.updateFullNode(l,d,r)}else{const d=v(n);let u=Mi(i,d,e.serverCache);u==null&&e.serverCache.isCompleteForChild(d)&&(u=l.getImmediateChild(d)),u!=null?c=t.filter.updateChild(l,d,u,S(n),a,r):e.eventCache.getNode().hasChild(d)?c=t.filter.updateChild(l,d,g.EMPTY_NODE,S(n),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=ln(i,Ae(e)),o.isLeafNode()&&(c=t.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||cn(i,b())!=null,dt(e,c,o,t.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ju{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,s=new Ai(i.getIndex()),r=cu(i);this.processor_=Lu(r);const o=n.serverCache,a=n.eventCache,l=s.updateFullNode(g.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(g.EMPTY_NODE,a.getNode(),null),d=new ye(l,o.isFullyInitialized(),s.filtersNodes()),u=new ye(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=wn(u,d),this.eventGenerator_=new mu(this.query_)}get query(){return this.query_}}function Gu(t){return t.viewCache_.serverCache.getNode()}function qu(t){return an(t.viewCache_)}function zu(t,e){const n=Ae(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!C(e)&&!n.getImmediateChild(v(e)).isEmpty())?n.getChild(e):null}function Hs(t){return t.eventRegistrations_.length===0}function Yu(t,e){t.eventRegistrations_.push(e)}function $s(t,e,n){const i=[];if(n){_(e==null,"A cancel should cancel all event registrations.");const s=t.query._path;t.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(n,s);o&&i.push(o)})}if(e){let s=[];for(let r=0;r<t.eventRegistrations_.length;++r){const o=t.eventRegistrations_[r];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(t.eventRegistrations_.slice(r+1));break}}t.eventRegistrations_=s}else t.eventRegistrations_=[];return i}function Vs(t,e,n,i){e.type===Q.MERGE&&e.source.queryId!==null&&(_(Ae(t.viewCache_),"We should always have a full cache before handling merges"),_(an(t.viewCache_),"Missing event cache, even though we have a server cache"));const s=t.viewCache_,r=Wu(t.processor_,s,e,n,i);return Fu(t.processor_,r.viewCache),_(r.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=r.viewCache,co(t,r.changes,r.viewCache.eventCache.getNode(),null)}function Ku(t,e){const n=t.viewCache_.eventCache,i=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(A,(r,o)=>{i.push(Ge(r,o))}),n.isFullyInitialized()&&i.push(Zr(n.getNode())),co(t,i,n.getNode(),e)}function co(t,e,n,i){const s=i?[i]:t.eventRegistrations_;return gu(t.eventGenerator_,e,n,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hn;class uo{constructor(){this.views=new Map}}function Qu(t){_(!hn,"__referenceConstructor has already been defined"),hn=t}function Xu(){return _(hn,"Reference.ts has not been loaded"),hn}function Ju(t){return t.views.size===0}function Li(t,e,n,i){const s=e.source.queryId;if(s!==null){const r=t.views.get(s);return _(r!=null,"SyncTree gave us an op for an invalid query."),Vs(r,e,n,i)}else{let r=[];for(const o of t.views.values())r=r.concat(Vs(o,e,n,i));return r}}function ho(t,e,n,i,s){const r=e._queryIdentifier,o=t.views.get(r);if(!o){let a=ln(n,s?i:null),l=!1;a?l=!0:i instanceof g?(a=xi(n,i),l=!1):(a=g.EMPTY_NODE,l=!1);const c=wn(new ye(a,l,!1),new ye(i,s,!1));return new ju(e,c)}return o}function Zu(t,e,n,i,s,r){const o=ho(t,e,i,s,r);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),Yu(o,n),Ku(o,n)}function eh(t,e,n,i){const s=e._queryIdentifier,r=[];let o=[];const a=ve(t);if(s==="default")for(const[l,c]of t.views.entries())o=o.concat($s(c,n,i)),Hs(c)&&(t.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=t.views.get(s);l&&(o=o.concat($s(l,n,i)),Hs(l)&&(t.views.delete(s),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!ve(t)&&r.push(new(Xu())(e._repo,e._path)),{removed:r,events:o}}function fo(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function me(t,e){let n=null;for(const i of t.views.values())n=n||zu(i,e);return n}function po(t,e){if(e._queryParams.loadsAllData())return Tn(t);{const i=e._queryIdentifier;return t.views.get(i)}}function _o(t,e){return po(t,e)!=null}function ve(t){return Tn(t)!=null}function Tn(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dn;function th(t){_(!dn,"__referenceConstructor has already been defined"),dn=t}function nh(){return _(dn,"Reference.ts has not been loaded"),dn}let ih=1;class js{constructor(e){this.listenProvider_=e,this.syncPointTree_=new N(null),this.pendingWriteTree_=Pu(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Fi(t,e,n,i,s){return Eu(t.pendingWriteTree_,e,n,i,s),s?Mt(t,new Ne(eo(),e,n)):[]}function Ie(t,e,n=!1){const i=bu(t.pendingWriteTree_,e);if(wu(t.pendingWriteTree_,e)){let r=new N(null);return i.snap!=null?r=r.set(b(),!0):$(i.children,o=>{r=r.set(new I(o),!0)}),Mt(t,new on(i.path,r,n))}else return[]}function xt(t,e,n){return Mt(t,new Ne(Di(),e,n))}function sh(t,e,n){const i=N.fromObject(n);return Mt(t,new Tt(Di(),e,i))}function rh(t,e){return Mt(t,new It(Di(),e))}function oh(t,e,n){const i=Wi(t,n);if(i){const s=Bi(i),r=s.path,o=s.queryId,a=V(r,e),l=new It(Pi(o),a);return Ui(t,r,l)}else return[]}function fn(t,e,n,i,s=!1){const r=e._path,o=t.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||_o(o,e))){const l=eh(o,e,n,i);Ju(o)&&(t.syncPointTree_=t.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!s){const d=c.findIndex(h=>h._queryParams.loadsAllData())!==-1,u=t.syncPointTree_.findOnPath(r,(h,p)=>ve(p));if(d&&!u){const h=t.syncPointTree_.subtree(r);if(!h.isEmpty()){const p=ch(h);for(let m=0;m<p.length;++m){const y=p[m],w=y.query,k=vo(t,y);t.listenProvider_.startListening(pt(w),St(t,w),k.hashFn,k.onComplete)}}}!u&&c.length>0&&!i&&(d?t.listenProvider_.stopListening(pt(e),null):c.forEach(h=>{const p=t.queryToTagMap.get(Rn(h));t.listenProvider_.stopListening(pt(h),p)}))}uh(t,c)}return a}function mo(t,e,n,i){const s=Wi(t,i);if(s!=null){const r=Bi(s),o=r.path,a=r.queryId,l=V(o,e),c=new Ne(Pi(a),l,n);return Ui(t,o,c)}else return[]}function ah(t,e,n,i){const s=Wi(t,i);if(s){const r=Bi(s),o=r.path,a=r.queryId,l=V(o,e),c=N.fromObject(n),d=new Tt(Pi(a),l,c);return Ui(t,o,d)}else return[]}function di(t,e,n,i=!1){const s=e._path;let r=null,o=!1;t.syncPointTree_.foreachOnPath(s,(h,p)=>{const m=V(h,s);r=r||me(p,m),o=o||ve(p)});let a=t.syncPointTree_.get(s);a?(o=o||ve(a),r=r||me(a,b())):(a=new uo,t.syncPointTree_=t.syncPointTree_.set(s,a));let l;r!=null?l=!0:(l=!1,r=g.EMPTY_NODE,t.syncPointTree_.subtree(s).foreachChild((p,m)=>{const y=me(m,b());y&&(r=r.updateImmediateChild(p,y))}));const c=_o(a,e);if(!c&&!e._queryParams.loadsAllData()){const h=Rn(e);_(!t.queryToTagMap.has(h),"View does not exist, but we have a tag");const p=hh();t.queryToTagMap.set(h,p),t.tagToQueryMap.set(p,h)}const d=In(t.pendingWriteTree_,s);let u=Zu(a,e,n,d,r,l);if(!c&&!o&&!i){const h=po(a,e);u=u.concat(dh(t,e,h))}return u}function Sn(t,e,n){const s=t.pendingWriteTree_,r=t.syncPointTree_.findOnPath(e,(o,a)=>{const l=V(o,e),c=me(a,l);if(c)return c});return so(s,e,r,n,!0)}function lh(t,e){const n=e._path;let i=null;t.syncPointTree_.foreachOnPath(n,(c,d)=>{const u=V(c,n);i=i||me(d,u)});let s=t.syncPointTree_.get(n);s?i=i||me(s,b()):(s=new uo,t.syncPointTree_=t.syncPointTree_.set(n,s));const r=i!=null,o=r?new ye(i,!0,!1):null,a=In(t.pendingWriteTree_,e._path),l=ho(s,e,a,r?o.getNode():g.EMPTY_NODE,r);return qu(l)}function Mt(t,e){return go(e,t.syncPointTree_,null,In(t.pendingWriteTree_,b()))}function go(t,e,n,i){if(C(t.path))return yo(t,e,n,i);{const s=e.get(b());n==null&&s!=null&&(n=me(s,b()));let r=[];const o=v(t.path),a=t.operationForChild(o),l=e.children.get(o);if(l&&a){const c=n?n.getImmediateChild(o):null,d=ro(i,o);r=r.concat(go(a,l,c,d))}return s&&(r=r.concat(Li(s,t,i,n))),r}}function yo(t,e,n,i){const s=e.get(b());n==null&&s!=null&&(n=me(s,b()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=n?n.getImmediateChild(o):null,c=ro(i,o),d=t.operationForChild(o);d&&(r=r.concat(yo(d,a,l,c)))}),s&&(r=r.concat(Li(s,t,i,n))),r}function vo(t,e){const n=e.query,i=St(t,n);return{hashFn:()=>(Gu(e)||g.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return i?oh(t,n._path,i):rh(t,n._path);{const r=ac(s,n);return fn(t,n,null,r)}}}}function St(t,e){const n=Rn(e);return t.queryToTagMap.get(n)}function Rn(t){return t._path.toString()+"$"+t._queryIdentifier}function Wi(t,e){return t.tagToQueryMap.get(e)}function Bi(t){const e=t.indexOf("$");return _(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new I(t.substr(0,e))}}function Ui(t,e,n){const i=t.syncPointTree_.get(e);_(i,"Missing sync point for query tag that we're tracking");const s=In(t.pendingWriteTree_,e);return Li(i,n,s,null)}function ch(t){return t.fold((e,n,i)=>{if(n&&ve(n))return[Tn(n)];{let s=[];return n&&(s=fo(n)),$(i,(r,o)=>{s=s.concat(o)}),s}})}function pt(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new(nh())(t._repo,t._path):t}function uh(t,e){for(let n=0;n<e.length;++n){const i=e[n];if(!i._queryParams.loadsAllData()){const s=Rn(i),r=t.queryToTagMap.get(s);t.queryToTagMap.delete(s),t.tagToQueryMap.delete(r)}}}function hh(){return ih++}function dh(t,e,n){const i=e._path,s=St(t,e),r=vo(t,n),o=t.listenProvider_.startListening(pt(e),s,r.hashFn,r.onComplete),a=t.syncPointTree_.subtree(i);if(s)_(!ve(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,d,u)=>{if(!C(c)&&d&&ve(d))return[Tn(d).query];{let h=[];return d&&(h=h.concat(fo(d).map(p=>p.query))),$(u,(p,m)=>{h=h.concat(m)}),h}});for(let c=0;c<l.length;++c){const d=l[c];t.listenProvider_.stopListening(pt(d),St(t,d))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hi{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new Hi(n)}node(){return this.node_}}class $i{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=x(this.path_,e);return new $i(this.syncTree_,n)}node(){return Sn(this.syncTree_,this.path_)}}const fh=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},Gs=function(t,e,n){if(!t||typeof t!="object")return t;if(_(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return ph(t[".sv"],e,n);if(typeof t[".sv"]=="object")return _h(t[".sv"],e);_(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},ph=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:_(!1,"Unexpected server value: "+t)}},_h=function(t,e,n){t.hasOwnProperty("increment")||_(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const i=t.increment;typeof i!="number"&&_(!1,"Unexpected increment value: "+i);const s=e.node();if(_(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;const o=s.getValue();return typeof o!="number"?i:o+i},mh=function(t,e,n,i){return ji(e,new $i(n,t),i)},Vi=function(t,e,n){return ji(t,new Hi(e),n)};function ji(t,e,n){const i=t.getPriority().val(),s=Gs(i,e.getImmediateChild(".priority"),n);let r;if(t.isLeafNode()){const o=t,a=Gs(o.getValue(),e,n);return a!==o.getValue()||s!==o.getPriority().val()?new F(a,P(s)):t}else{const o=t;return r=o,s!==o.getPriority().val()&&(r=r.updatePriority(new F(s))),o.forEachChild(A,(a,l)=>{const c=ji(l,e.getImmediateChild(a),n);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gi{constructor(e="",n=null,i={children:{},childCount:0}){this.name=e,this.parent=n,this.node=i}}function Nn(t,e){let n=e instanceof I?e:new I(e),i=t,s=v(n);for(;s!==null;){const r=Se(i.node.children,s)||{children:{},childCount:0};i=new Gi(s,i,r),n=S(n),s=v(n)}return i}function Pe(t){return t.node.value}function qi(t,e){t.node.value=e,fi(t)}function Co(t){return t.node.childCount>0}function gh(t){return Pe(t)===void 0&&!Co(t)}function An(t,e){$(t.node.children,(n,i)=>{e(new Gi(n,t,i))})}function Eo(t,e,n,i){n&&e(t),An(t,s=>{Eo(s,e,!0)})}function yh(t,e,n){let i=t.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function Ot(t){return new I(t.parent===null?t.name:Ot(t.parent)+"/"+t.name)}function fi(t){t.parent!==null&&vh(t.parent,t.name,t)}function vh(t,e,n){const i=gh(n),s=Z(t.node.children,e);i&&s?(delete t.node.children[e],t.node.childCount--,fi(t)):!i&&!s&&(t.node.children[e]=n.node,t.node.childCount++,fi(t))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ch=/[\[\].#$\/\u0000-\u001F\u007F]/,Eh=/[\[\].#$\u0000-\u001F\u007F]/,jn=10*1024*1024,zi=function(t){return typeof t=="string"&&t.length!==0&&!Ch.test(t)},bo=function(t){return typeof t=="string"&&t.length!==0&&!Eh.test(t)},bh=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),bo(t)},Yi=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!En(t)||t&&typeof t=="object"&&Z(t,".sv")},pi=function(t,e,n,i){Lt(Ve(t,"value"),e,n)},Lt=function(t,e,n){const i=n instanceof I?new Hc(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+be(i));if(typeof e=="function")throw new Error(t+"contains a function "+be(i)+" with contents = "+e.toString());if(En(e))throw new Error(t+"contains "+e.toString()+" "+be(i));if(typeof e=="string"&&e.length>jn/3&&Cn(e)>jn)throw new Error(t+"contains a string greater than "+jn+" utf8 bytes "+be(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,r=!1;if($(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!zi(o)))throw new Error(t+" contains an invalid key ("+o+") "+be(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);$c(i,o),Lt(t,a,i),Vc(i)}),s&&r)throw new Error(t+' contains ".value" child '+be(i)+" in addition to actual children.")}},wh=function(t,e){let n,i;for(n=0;n<e.length;n++){i=e[n];const r=Ct(i);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!zi(r[o]))throw new Error(t+"contains an invalid key ("+r[o]+") in path "+i.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(Uc);let s=null;for(n=0;n<e.length;n++){if(i=e[n],s!==null&&z(s,i))throw new Error(t+"contains a path "+s.toString()+" that is ancestor of another path "+i.toString());s=i}},Ih=function(t,e,n,i){const s=Ve(t,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(s+" must be an object containing the children to replace.");const r=[];$(e,(o,a)=>{const l=new I(o);if(Lt(s,a,x(n,l)),Ti(l)===".priority"&&!Yi(a))throw new Error(s+"contains an invalid value for '"+l.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(l)}),wh(s,r)},Th=function(t,e,n){if(En(e))throw new Error(Ve(t,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Yi(e))throw new Error(Ve(t,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},wo=function(t,e,n,i){if(!bo(n))throw new Error(Ve(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Sh=function(t,e,n,i){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),wo(t,e,n)},Fe=function(t,e){if(v(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},Rh=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!zi(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!bh(n))throw new Error(Ve(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Ki(t,e){let n=null;for(let i=0;i<e.length;i++){const s=e[i],r=s.getPath();n!==null&&!Si(r,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:r}),n.events.push(s)}n&&t.eventLists_.push(n)}function Io(t,e,n){Ki(t,n),To(t,i=>Si(i,e))}function J(t,e,n){Ki(t,n),To(t,i=>z(i,e)||z(e,i))}function To(t,e){t.recursionDepth_++;let n=!0;for(let i=0;i<t.eventLists_.length;i++){const s=t.eventLists_[i];if(s){const r=s.path;e(r)?(Ah(t.eventLists_[i]),t.eventLists_[i]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function Ah(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const i=n.getEventRunner();ut&&U("event: "+n.toString()),Qe(i)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kh="repo_interrupt",Dh=25;class Ph{constructor(e,n,i,s){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=i,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new Nh,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=rn(),this.transactionQueueTree_=new Gi,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function xh(t,e,n){if(t.stats_=wi(t.repoInfo_),t.forceRestClient_||hc())t.server_=new sn(t.repoInfo_,(i,s,r,o)=>{qs(t,i,s,r,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>zs(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{O(n)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}t.persistentConnection_=new oe(t.repoInfo_,e,(i,s,r,o)=>{qs(t,i,s,r,o)},i=>{zs(t,i)},i=>{Oh(t,i)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(i=>{t.server_.refreshAuthToken(i)}),t.appCheckProvider_.addTokenChangeListener(i=>{t.server_.refreshAppCheckToken(i.token)}),t.statsReporter_=mc(t.repoInfo_,()=>new _u(t.stats_,t.server_)),t.infoData_=new uu,t.infoSyncTree_=new js({startListening:(i,s,r,o)=>{let a=[];const l=t.infoData_.getNode(i._path);return l.isEmpty()||(a=xt(t.infoSyncTree_,i._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),Qi(t,"connected",!1),t.serverSyncTree_=new js({startListening:(i,s,r,o)=>(t.server_.listen(i,r,s,(a,l)=>{const c=o(a,l);J(t.eventQueue_,i._path,c)}),[]),stopListening:(i,s)=>{t.server_.unlisten(i,s)}})}function Mh(t){const n=t.infoData_.getNode(new I(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function kn(t){return fh({timestamp:Mh(t)})}function qs(t,e,n,i,s){t.dataUpdateCount++;const r=new I(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(s)if(i){const l=Qt(n,c=>P(c));o=ah(t.serverSyncTree_,r,l,s)}else{const l=P(n);o=mo(t.serverSyncTree_,r,l,s)}else if(i){const l=Qt(n,c=>P(c));o=sh(t.serverSyncTree_,r,l)}else{const l=P(n);o=xt(t.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=Pn(t,r)),J(t.eventQueue_,a,o)}function zs(t,e){Qi(t,"connected",e),e===!1&&Wh(t)}function Oh(t,e){$(e,(n,i)=>{Qi(t,n,i)})}function Qi(t,e,n){const i=new I("/.info/"+e),s=P(n);t.infoData_.updateSnapshot(i,s);const r=xt(t.infoSyncTree_,i,s);J(t.eventQueue_,i,r)}function Xi(t){return t.nextWriteId_++}function Lh(t,e,n){const i=lh(t.serverSyncTree_,e);return i!=null?Promise.resolve(i):t.server_.get(e).then(s=>{const r=P(s).withIndex(e._queryParams.getIndex());di(t.serverSyncTree_,e,n,!0);let o;if(e._queryParams.loadsAllData())o=xt(t.serverSyncTree_,e._path,r);else{const a=St(t.serverSyncTree_,e);o=mo(t.serverSyncTree_,e._path,r,a)}return J(t.eventQueue_,e._path,o),fn(t.serverSyncTree_,e,n,null,!0),r},s=>(Ft(t,"get for query "+O(e)+" failed: "+s),Promise.reject(new Error(s))))}function Fh(t,e,n,i,s){Ft(t,"set",{path:e.toString(),value:n,priority:i});const r=kn(t),o=P(n,i),a=Sn(t.serverSyncTree_,e),l=Vi(o,a,r),c=Xi(t),d=Fi(t.serverSyncTree_,e,l,c,!0);Ki(t.eventQueue_,d),t.server_.put(e.toString(),o.val(!0),(h,p)=>{const m=h==="ok";m||G("set at "+e+" failed: "+h);const y=Ie(t.serverSyncTree_,c,!m);J(t.eventQueue_,e,y),ze(t,s,h,p)});const u=Ao(t,e);Pn(t,u),J(t.eventQueue_,u,[])}function Wh(t){Ft(t,"onDisconnectEvents");const e=kn(t),n=rn();ai(t.onDisconnect_,b(),(s,r)=>{const o=mh(s,r,t.serverSyncTree_,e);Xe(n,s,o)});let i=[];ai(n,b(),(s,r)=>{i=i.concat(xt(t.serverSyncTree_,s,r));const o=Ao(t,s);Pn(t,o)}),t.onDisconnect_=rn(),J(t.eventQueue_,b(),i)}function Bh(t,e,n){t.server_.onDisconnectCancel(e.toString(),(i,s)=>{i==="ok"&&oi(t.onDisconnect_,e),ze(t,n,i,s)})}function Ys(t,e,n,i){const s=P(n);t.server_.onDisconnectPut(e.toString(),s.val(!0),(r,o)=>{r==="ok"&&Xe(t.onDisconnect_,e,s),ze(t,i,r,o)})}function Uh(t,e,n,i,s){const r=P(n,i);t.server_.onDisconnectPut(e.toString(),r.val(!0),(o,a)=>{o==="ok"&&Xe(t.onDisconnect_,e,r),ze(t,s,o,a)})}function Hh(t,e,n,i){if(Xn(n)){U("onDisconnect().update() called with empty data.  Don't do anything."),ze(t,i,"ok",void 0);return}t.server_.onDisconnectMerge(e.toString(),n,(s,r)=>{s==="ok"&&$(n,(o,a)=>{const l=P(a);Xe(t.onDisconnect_,x(e,o),l)}),ze(t,i,s,r)})}function $h(t,e,n){let i;v(e._path)===".info"?i=di(t.infoSyncTree_,e,n):i=di(t.serverSyncTree_,e,n),Io(t.eventQueue_,e._path,i)}function Ks(t,e,n){let i;v(e._path)===".info"?i=fn(t.infoSyncTree_,e,n):i=fn(t.serverSyncTree_,e,n),Io(t.eventQueue_,e._path,i)}function Vh(t){t.persistentConnection_&&t.persistentConnection_.interrupt(kh)}function Ft(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),U(n,...e)}function ze(t,e,n,i){e&&Qe(()=>{if(n==="ok")e(null);else{const s=(n||"error").toUpperCase();let r=s;i&&(r+=": "+i);const o=new Error(r);o.code=s,e(o)}})}function jh(t,e,n,i,s,r){Ft(t,"transaction on "+e);const o={path:e,update:n,onComplete:i,status:null,order:Ir(),applyLocally:r,retryCount:0,unwatcher:s,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=Ji(t,e,void 0);o.currentInputSnapshot=a;const l=o.update(a.val());if(l===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{Lt("transaction failed: Data returned ",l,o.path),o.status=0;const c=Nn(t.transactionQueueTree_,e),d=Pe(c)||[];d.push(o),qi(c,d);let u;typeof l=="object"&&l!==null&&Z(l,".priority")?(u=Se(l,".priority"),_(Yi(u),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):u=(Sn(t.serverSyncTree_,e)||g.EMPTY_NODE).getPriority().val();const h=kn(t),p=P(l,u),m=Vi(p,a,h);o.currentOutputSnapshotRaw=p,o.currentOutputSnapshotResolved=m,o.currentWriteId=Xi(t);const y=Fi(t.serverSyncTree_,e,m,o.currentWriteId,o.applyLocally);J(t.eventQueue_,e,y),Dn(t,t.transactionQueueTree_)}}function Ji(t,e,n){return Sn(t.serverSyncTree_,e,n)||g.EMPTY_NODE}function Dn(t,e=t.transactionQueueTree_){if(e||xn(t,e),Pe(e)){const n=Ro(t,e);_(n.length>0,"Sending zero length transaction queue"),n.every(s=>s.status===0)&&Gh(t,Ot(e),n)}else Co(e)&&An(e,n=>{Dn(t,n)})}function Gh(t,e,n){const i=n.map(c=>c.currentWriteId),s=Ji(t,e,i);let r=s;const o=s.hash();for(let c=0;c<n.length;c++){const d=n[c];_(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const u=V(e,d.path);r=r.updateChild(u,d.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;t.server_.put(l.toString(),a,c=>{Ft(t,"transaction put response",{path:l.toString(),status:c});let d=[];if(c==="ok"){const u=[];for(let h=0;h<n.length;h++)n[h].status=2,d=d.concat(Ie(t.serverSyncTree_,n[h].currentWriteId)),n[h].onComplete&&u.push(()=>n[h].onComplete(null,!0,n[h].currentOutputSnapshotResolved)),n[h].unwatcher();xn(t,Nn(t.transactionQueueTree_,e)),Dn(t,t.transactionQueueTree_),J(t.eventQueue_,e,d);for(let h=0;h<u.length;h++)Qe(u[h])}else{if(c==="datastale")for(let u=0;u<n.length;u++)n[u].status===3?n[u].status=4:n[u].status=0;else{G("transaction at "+l.toString()+" failed: "+c);for(let u=0;u<n.length;u++)n[u].status=4,n[u].abortReason=c}Pn(t,e)}},o)}function Pn(t,e){const n=So(t,e),i=Ot(n),s=Ro(t,n);return qh(t,s,i),i}function qh(t,e,n){if(e.length===0)return;const i=[];let s=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=V(n,l.path);let d=!1,u;if(_(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)d=!0,u=l.abortReason,s=s.concat(Ie(t.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=Dh)d=!0,u="maxretry",s=s.concat(Ie(t.serverSyncTree_,l.currentWriteId,!0));else{const h=Ji(t,l.path,o);l.currentInputSnapshot=h;const p=e[a].update(h.val());if(p!==void 0){Lt("transaction failed: Data returned ",p,l.path);let m=P(p);typeof p=="object"&&p!=null&&Z(p,".priority")||(m=m.updatePriority(h.getPriority()));const w=l.currentWriteId,k=kn(t),L=Vi(m,h,k);l.currentOutputSnapshotRaw=m,l.currentOutputSnapshotResolved=L,l.currentWriteId=Xi(t),o.splice(o.indexOf(w),1),s=s.concat(Fi(t.serverSyncTree_,l.path,L,l.currentWriteId,l.applyLocally)),s=s.concat(Ie(t.serverSyncTree_,w,!0))}else d=!0,u="nodata",s=s.concat(Ie(t.serverSyncTree_,l.currentWriteId,!0))}J(t.eventQueue_,n,s),s=[],d&&(e[a].status=2,function(h){setTimeout(h,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(u==="nodata"?i.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):i.push(()=>e[a].onComplete(new Error(u),!1,null))))}xn(t,t.transactionQueueTree_);for(let a=0;a<i.length;a++)Qe(i[a]);Dn(t,t.transactionQueueTree_)}function So(t,e){let n,i=t.transactionQueueTree_;for(n=v(e);n!==null&&Pe(i)===void 0;)i=Nn(i,n),e=S(e),n=v(e);return i}function Ro(t,e){const n=[];return No(t,e,n),n.sort((i,s)=>i.order-s.order),n}function No(t,e,n){const i=Pe(e);if(i)for(let s=0;s<i.length;s++)n.push(i[s]);An(e,s=>{No(t,s,n)})}function xn(t,e){const n=Pe(e);if(n){let i=0;for(let s=0;s<n.length;s++)n[s].status!==2&&(n[i]=n[s],i++);n.length=i,qi(e,n.length>0?n:void 0)}An(e,i=>{xn(t,i)})}function Ao(t,e){const n=Ot(So(t,e)),i=Nn(t.transactionQueueTree_,e);return yh(i,s=>{Gn(t,s)}),Gn(t,i),Eo(i,s=>{Gn(t,s)}),n}function Gn(t,e){const n=Pe(e);if(n){const i=[];let s=[],r=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(_(r===o-1,"All SENT items should be at beginning of queue."),r=o,n[o].status=3,n[o].abortReason="set"):(_(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),s=s.concat(Ie(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&i.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?qi(e,void 0):n.length=r+1,J(t.eventQueue_,Ot(e),s);for(let o=0;o<i.length;o++)Qe(i[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zh(t){let e="";const n=t.split("/");for(let i=0;i<n.length;i++)if(n[i].length>0){let s=n[i];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function Yh(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const i=n.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):G(`Invalid query segment '${n}' in query '${t}'`)}return e}const Qs=function(t,e){const n=Kh(t),i=n.namespace;n.domain==="firebase.com"&&le(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&n.domain!=="localhost"&&le("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||nc();const s=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new Fr(n.host,n.secure,i,s,e,"",i!==n.subdomain),path:new I(n.pathString)}},Kh=function(t){let e="",n="",i="",s="",r="",o=!0,a="https",l=443;if(typeof t=="string"){let c=t.indexOf("//");c>=0&&(a=t.substring(0,c-1),t=t.substring(c+2));let d=t.indexOf("/");d===-1&&(d=t.length);let u=t.indexOf("?");u===-1&&(u=t.length),e=t.substring(0,Math.min(d,u)),d<u&&(s=zh(t.substring(d,u)));const h=Yh(t.substring(Math.min(t.length,u)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const p=e.slice(0,c);if(p.toLowerCase()==="localhost")n="localhost";else if(p.split(".").length<=2)n=p;else{const m=e.indexOf(".");i=e.substring(0,m).toLowerCase(),n=e.substring(m+1),r=i}"ns"in h&&(r=h.ns)}return{host:e,port:l,domain:n,subdomain:i,secure:o,scheme:a,pathString:s,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qh{constructor(e,n,i,s){this.eventType=e,this.eventRegistration=n,this.snapshot=i,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+O(this.snapshot.exportVal())}}class Xh{constructor(e,n,i){this.eventRegistration=e,this.error=n,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return _(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jh{constructor(e,n){this._repo=e,this._path=n}cancel(){const e=new ee;return Bh(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){Fe("OnDisconnect.remove",this._path);const e=new ee;return Ys(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){Fe("OnDisconnect.set",this._path),pi("OnDisconnect.set",e,this._path);const n=new ee;return Ys(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}setWithPriority(e,n){Fe("OnDisconnect.setWithPriority",this._path),pi("OnDisconnect.setWithPriority",e,this._path),Th("OnDisconnect.setWithPriority",n);const i=new ee;return Uh(this._repo,this._path,e,n,i.wrapCallback(()=>{})),i.promise}update(e){Fe("OnDisconnect.update",this._path),Ih("OnDisconnect.update",e,this._path);const n=new ee;return Hh(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e,n,i,s){this._repo=e,this._path=n,this._queryParams=i,this._orderByCalled=s}get key(){return C(this._path)?null:Ti(this._path)}get ref(){return new ie(this._repo,this._path)}get _queryIdentifier(){const e=xs(this._queryParams),n=Ei(e);return n==="{}"?"default":n}get _queryObject(){return xs(this._queryParams)}isEqual(e){if(e=Ce(e),!(e instanceof Zi))return!1;const n=this._repo===e._repo,i=Si(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return n&&i&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+Bc(this._path)}}class ie extends Zi{constructor(e,n){super(e,n,new ki,!1)}get parent(){const e=qr(this._path);return e===null?null:new ie(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Ye{constructor(e,n,i){this._node=e,this.ref=n,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new I(e),i=_i(this.ref,e);return new Ye(this._node.getChild(n),i,A)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,s)=>e(new Ye(s,_i(this.ref,i),A)))}hasChild(e){const n=new I(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function qt(t,e){return t=Ce(t),t._checkNotDeleted("ref"),e!==void 0?_i(t._root,e):t._root}function _i(t,e){return t=Ce(t),v(t._path)===null?Sh("child","path",e):wo("child","path",e),new ie(t._repo,x(t._path,e))}function Zh(t){return t=Ce(t),new Jh(t._repo,t._path)}function Xs(t,e){t=Ce(t),Fe("set",t._path),pi("set",e,t._path);const n=new ee;return Fh(t._repo,t._path,e,null,n.wrapCallback(()=>{})),n.promise}function ed(t){t=Ce(t);const e=new ko(()=>{}),n=new Mn(e);return Lh(t._repo,t,n).then(i=>new Ye(i,new ie(t._repo,t._path),t._queryParams.getIndex()))}class Mn{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const i=n._queryParams.getIndex();return new Qh("value",this,new Ye(e.snapshotNode,new ie(n._repo,n._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new Xh(this,e,n):null}matches(e){return e instanceof Mn?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function td(t,e,n,i,s){let r;if(typeof i=="object"&&(r=void 0,s=i),typeof i=="function"&&(r=i),s&&s.onlyOnce){const l=n,c=(d,u)=>{Ks(t._repo,t,a),l(d,u)};c.userCallback=n.userCallback,c.context=n.context,n=c}const o=new ko(n,r||void 0),a=new Mn(o);return $h(t._repo,t,a),()=>Ks(t._repo,t,a)}function Do(t,e,n,i){return td(t,"value",e,n,i)}Qu(ie);th(ie);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nd="FIREBASE_DATABASE_EMULATOR_HOST",mi={};let id=!1;function sd(t,e,n,i){const s=e.lastIndexOf(":"),r=e.substring(0,s),o=vi(r);t.repoInfo_=new Fr(e,o,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0,n),i&&(t.authTokenProvider_=i)}function rd(t,e,n,i,s){let r=i||t.options.databaseURL;r===void 0&&(t.options.projectId||le("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),U("Using default host for project ",t.options.projectId),r=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=Qs(r,s),a=o.repoInfo,l;typeof process<"u"&&_s&&(l=_s[nd]),l?(r=`http://${l}?ns=${a.namespace}`,o=Qs(r,s),a=o.repoInfo):o.repoInfo.secure;const c=new fc(t.name,t.options,e);Rh("Invalid Firebase Database URL",o),C(o.path)||le("Database URL must point to the root of a Firebase Database (not including a child path).");const d=ad(a,t,c,new dc(t,n));return new ld(d,t)}function od(t,e){const n=mi[e];(!n||n[t.key]!==t)&&le(`Database ${e}(${t.repoInfo_}) has already been deleted.`),Vh(t),delete n[t.key]}function ad(t,e,n,i){let s=mi[e.name];s||(s={},mi[e.name]=s);let r=s[t.toURLString()];return r&&le("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new Ph(t,id,n,i),s[t.toURLString()]=r,r}class ld{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(xh(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new ie(this._repo,b())),this._rootInternal}_delete(){return this._rootInternal!==null&&(od(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&le("Cannot call "+e+" on a deleted database.")}}function cd(t=Wl(),e){const n=xl(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const i=ya("database");i&&ud(n,...i)}return n}function ud(t,e,n,i={}){t=Ce(t),t._checkNotDeleted("useEmulator");const s=`${e}:${n}`,r=t._repoInternal;if(t._instanceStarted){if(s===t._repoInternal.repoInfo_.host&&Xt(i,r.repoInfo_.emulatorOptions))return;le("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&le('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Gt(Gt.OWNER);else if(i.mockUserToken){const a=typeof i.mockUserToken=="string"?i.mockUserToken:Ca(i.mockUserToken,t.app.options.projectId);o=new Gt(a)}vi(e)&&(va(e),wa("Database",!0)),sd(r,s,i,o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hd(t){Xl(Fl),Zt(new gt("database",(e,{instanceIdentifier:n})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return rd(i,s,r,n)},"PUBLIC").setMultipleInstances(!0)),Be(ms,gs,t),Be(ms,gs,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dd={".sv":"timestamp"};function qn(){return dd}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e,n){this.committed=e,this.snapshot=n}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function Po(t,e,n){var i;if(t=Ce(t),Fe("Reference.transaction",t._path),t.key===".length"||t.key===".keys")throw"Reference.transaction failed: "+t.key+" is a read-only object.";const s=(i=n==null?void 0:n.applyLocally)!==null&&i!==void 0?i:!0,r=new ee,o=(l,c,d)=>{let u=null;l?r.reject(l):(u=new Ye(d,new ie(t._repo,t._path),A),r.resolve(new fd(c,u)))},a=Do(t,()=>{});return jh(t._repo,t._path,e,o,a,s),r.promise}oe.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};oe.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};hd();function zt(t,e){const n=he(e);if(Object.keys(n).length===0)return null;const i=se(n.code)||t,s=he(n.players),r={};for(const[k,L]of Object.entries(s)){const T=he(L),M=Yn(se(T.symbol));M&&(r[k]={uid:k,nickname:se(T.nickname)||"Player",symbol:M,joinedAt:Oe(T.joinedAt)})}if(Object.keys(r).length===0)return null;const o=he(n.meta),a=Object.values(r).find(k=>k.symbol===Te.X),l=se(o.hostUid)||(a==null?void 0:a.uid)||Object.keys(r)[0],c=he(n.state),d=se(c.cells),u=se(c.miniWinners),h=_t({cells:d.length===81?d:B.EMPTY_CELLS,miniWinners:u.length===9?u:B.EMPTY_MINI_WINNERS,nextMiniGrid:$t(c.nextMiniGrid,-1),moveCount:$t(c.moveCount,0)}),p=Yn(se(c.winnerSymbol)),m=he(n.presence),y={};for(const[k,L]of Object.entries(m)){const T=he(L),M=Oe(T.disconnectedAt);y[k]={uid:k,connected:zn(T.connected,!1),lastSeen:Oe(T.lastSeen),disconnectedAt:M>0?M:null}}const w=he(n.rematch);return{code:i,hostUid:l,players:r,status:Js(c.status,D,D.WAITING),board:h,currentTurnUid:se(c.currentTurnUid)||l,winnerUid:se(c.winnerUid)||null,winnerSymbol:p,winReason:Js(c.winReason,te,te.NONE),startedAt:Oe(c.startedAt),updatedAt:Oe(c.updatedAt),version:$t(c.version,0),presence:y,rematchHostReady:zn(w.hostReady,!1),rematchGuestReady:zn(w.guestReady,!1),rematchNonce:$t(w.nonce,0)}}function xo(t){const e={};for(const[i,s]of Object.entries(t.players))e[i]={uid:s.uid,nickname:s.nickname,symbol:s.symbol,joinedAt:s.joinedAt};const n={};for(const[i,s]of Object.entries(t.presence))n[i]={uid:s.uid,connected:s.connected,lastSeen:s.lastSeen,disconnectedAt:s.disconnectedAt??0};return{code:t.code,meta:{hostUid:t.hostUid,createdAt:t.startedAt},players:e,state:{cells:t.board.cells,miniWinners:t.board.miniWinners,nextMiniGrid:t.board.nextMiniGrid,moveCount:t.board.moveCount,currentTurnUid:t.currentTurnUid,status:t.status,winnerUid:t.winnerUid||"",winnerSymbol:t.winnerSymbol||"",winReason:t.winReason,startedAt:t.startedAt,updatedAt:t.updatedAt,version:t.version},presence:n,rematch:{hostReady:t.rematchHostReady,guestReady:t.rematchGuestReady,nonce:t.rematchNonce}}}function he(t){return!t||typeof t!="object"?{}:Object.fromEntries(Object.entries(t))}function se(t){return typeof t=="string"?t:""}function Oe(t,e=0){if(typeof t=="number"&&Number.isFinite(t))return Math.trunc(t);if(typeof t=="string"){const n=Number.parseInt(t,10);return Number.isNaN(n)?e:n}return e}function $t(t,e=0){return Oe(t,e)}function zn(t,e=!1){if(typeof t=="boolean")return t;if(typeof t=="string"){if(t==="true")return!0;if(t==="false")return!1}return e}function Js(t,e,n){return typeof t!="string"?n:Object.values(e).includes(t)?t:n}const Yt="webRooms",We={apiKey:"AIzaSyAqbxi4okk2sVSBYhmXzCIoDWEtl8nVCzE",authDomain:"uttt-android-260218-sak.firebaseapp.com",databaseURL:"https://uttt-android-260218-sak-default-rtdb.firebaseio.com",projectId:"uttt-android-260218-sak",storageBucket:"uttt-android-260218-sak.firebasestorage.app",appId:"1:827829215799:android:c11ca1f9f2bbc2b91095b2"};!We.authDomain&&We.projectId&&(We.authDomain=`${We.projectId}.firebaseapp.com`);const pd=["apiKey","appId","databaseURL","projectId","storageBucket"],Mo=pd.filter(t=>!We[t]).map(t=>t),ue=Mo.length===0,Oo=ue?"":`Missing Firebase config: ${Mo.join(", ")}`,Zs=ue?vr(We):null,q=Zs?cd(Zs):null,de=()=>{throw new Error(Oo||"Firebase is not configured")},ne={async createRoom(t,e){q||de();const n=er(e);for(let i=0;i<20;i+=1){const s=_d(),r=qt(q,`${Yt}/${s}`),o=Date.now();if((await Po(r,l=>{if(l!=null)return;const c=ta(s,t,n,o);return xo(c)},{applyLocally:!1})).committed)return await this.markPresence(s,t,!0),s}throw new Error("Unable to allocate a unique room code")},async joinRoom(t,e,n){q||de();const i=Me(t,{pad:!0}),s=er(n);let r=null;for(let o=0;o<5;o+=1){try{return await Vt(i,a=>a?na(a,e,s,Date.now()):jt("Room not found"),{requireExisting:!0}),await this.markPresence(i,e,!0),i}catch(a){if(r=a,(a==null?void 0:a.message)!=="Room not found")throw a}await md(250)}throw r||new Error("Room not found")},observeRoom(t,e,n){q||de();const i=Me(t),s=qt(q,`${Yt}/${i}`);return Do(s,o=>{if(!o.exists()){n(new Error("Room was deleted"));return}const a=zt(i,o.val());if(!a){n(new Error("Failed to parse room state"));return}e(a)},o=>{n(o)})},async submitMove(t,e,n,i){return q||de(),Vt(Me(t),s=>s?ia(s,aa(n,i,e),Date.now()):jt("Room not found"),{requireExisting:!0})},async requestRematch(t,e){return q||de(),Vt(Me(t),n=>n?sa(n,e,Date.now()):jt("Room not found"),{requireExisting:!0})},async claimForfeit(t,e){return q||de(),Vt(Me(t),n=>n?ra(n,e,Date.now(),yn):jt("Room not found"),{requireExisting:!0})},async markPresence(t,e,n){q||de();const i=Me(t),s=qt(q,`${Yt}/${i}/presence/${e}`);if(n){await Xs(s,{uid:e,connected:!0,lastSeen:qn(),disconnectedAt:0}),await Zh(s).update({connected:!1,lastSeen:qn(),disconnectedAt:qn()});return}const r=Date.now();await Xs(s,{uid:e,connected:!1,lastSeen:r,disconnectedAt:r})}};async function Vt(t,e,n={}){q||de();const i=qt(q,`${Yt}/${t}`);let s=null;if(n.requireExisting){const c=await ed(i);if(s=zt(t,c.val()),!s)throw new Error("Room not found")}let r=!1,o=null;const a=await Po(i,c=>{let d=zt(t,c);!d&&s&&!r&&(d=s,r=!0);const u=e(d);if(!u.ok){o=u.reason;return}return xo(u.roomState)},{applyLocally:!1});if(!a.committed)throw new Error(o||"Operation aborted");const l=zt(t,a.snapshot.val());if(!l)throw new Error("Failed to parse room after transaction");return l}function Me(t,e={}){const n=String(t||"").trim().replace(/\D/g,"").slice(0,4);return e.pad&&n.length>0?n.padStart(4,"0"):n}function er(t){return String(t||"").trim().slice(0,22)||"Player"}function _d(){const t=Math.floor(Math.random()*9e3)+1e3;return String(t)}function jt(t){return{ok:!1,reason:t}}function md(t){return new Promise(e=>{setTimeout(e,t)})}function gd(){let t=null,e=null,n=null,i=0,s=0,r=!1;const o=75,a=.2,c=60/92/4,d=[[261.63,329.63,392],[220,277.18,329.63],[196,246.94,392],[233.08,293.66,349.23]],u=[523.25,587.33,659.25,587.33,523.25,659.25,783.99,659.25];function h(){if(t)return;const T=window.AudioContext||window.webkitAudioContext;t=new T,e=t.createGain(),e.gain.value=.18,e.connect(t.destination)}function p(T){const M=Math.floor(s/16)%d.length,Ze=d[M];if(s%4===0)for(const et of Ze)m(et,T,c*3.2,"triangle",.05,.03);if(s%2===0){const et=u[s/2%u.length];m(et,T,c*1.2,"sine",.03,.01)}s%4===0&&m(Ze[0]/2,T,c*.9,"sine",.04,.01),s=(s+1)%64}function m(T,M,Ze,et,Ko,Qo){const tt=t.createOscillator(),nt=t.createGain();tt.type=et,tt.frequency.setValueAtTime(T,M),nt.gain.setValueAtTime(1e-4,M),nt.gain.linearRampToValueAtTime(Ko,M+Qo),nt.gain.exponentialRampToValueAtTime(1e-4,M+Ze),tt.connect(nt),nt.connect(e),tt.start(M),tt.stop(M+Ze+.05)}function y(){for(;i<t.currentTime+a;)p(i),i+=c}async function w(){if(h(),r)return!0;try{await t.resume()}catch{return!1}return i=t.currentTime+.05,n=window.setInterval(y,o),r=!0,!0}function k(){n&&(window.clearInterval(n),n=null),r=!1}async function L(T){return T?w():(k(),!0)}return{isRunning:()=>r,start:w,stop:k,setEnabled:L}}const pn=gd(),f={playerId:Od(),nickname:localStorage.getItem("uttt.nickname")||"",roomCodeInput:"",roomCode:null,room:null,unsubscribeRoom:null,busy:!1,notice:"",lastForfeitAttemptVersion:-1,lastMoveKey:null,lastMoveTimeoutId:null,musicEnabled:localStorage.getItem("uttt.musicEnabled")!=="false",timeOffsetMs:0},yd=document.querySelector("#app");yd.innerHTML=`
  <main class="shell">
    <section class="panel hero">
      <div class="hero-top">
        <p class="eyebrow">Ultimate Tic-Tac-Toe</p>
        <button id="music-toggle" class="btn btn-ghost"></button>
      </div>
      <h1>Neon Room Clash</h1>
      <p class="sub">Fast 2-player matches. No login, just a 4-digit room key.</p>
    </section>

    <section class="panel setup" id="setup-panel">
      <label class="label" for="nickname">Nickname</label>
      <input id="nickname" class="input" maxlength="22" placeholder="Player" />

      <div class="actions-grid">
        <button id="create-room" class="btn btn-primary">Create 4-digit room</button>
      </div>

      <label class="label" for="room-code">Join existing room</label>
      <div class="join-row">
        <input id="room-code" class="input" inputmode="numeric" maxlength="4" placeholder="0000" />
        <button id="join-room" class="btn">Join</button>
      </div>
      <p id="firebase-warning" class="warning hidden"></p>
    </section>

    <section class="panel room hidden" id="room-panel">
      <div class="room-meta">
        <div>
          <p class="label">Room code</p>
          <p class="room-code" id="room-code-active">----</p>
        </div>
        <div class="room-actions">
          <button id="copy-code" class="btn btn-ghost">Copy code</button>
          <button id="copy-link" class="btn btn-ghost">Copy link</button>
        </div>
      </div>

      <div id="hud-chips" class="hud-chips"></div>

      <p id="status-text" class="status">Waiting for room updates...</p>
      <p id="direction-text" class="direction"></p>
      <p id="forfeit-text" class="forfeit"></p>

      <div id="players" class="players"></div>

      <div id="board" class="board" aria-label="Ultimate board"></div>

      <div class="actions-grid actions-room" id="room-actions-bar">
        <button id="rematch" class="btn hidden">Rematch</button>
        <button id="leave" class="btn btn-danger">Leave room</button>
      </div>
    </section>

    <p id="notice" class="notice"></p>
  </main>
`;const Lo=document.querySelector("#nickname"),Rt=document.querySelector("#room-code"),vd=document.querySelector("#setup-panel"),Cd=document.querySelector("#room-panel"),Ed=document.querySelector("#room-code-active"),tr=document.querySelector("#status-text"),nr=document.querySelector("#direction-text"),ir=document.querySelector("#forfeit-text"),Fo=document.querySelector("#hud-chips"),Wo=document.querySelector("#players"),_n=document.querySelector("#board"),mn=document.querySelector("#rematch"),Bo=document.querySelector("#leave"),bd=document.querySelector("#notice"),sr=document.querySelector("#firebase-warning"),Uo=document.querySelector("#music-toggle"),Ho=document.querySelector("#create-room"),$o=document.querySelector("#join-room"),Vo=document.querySelector("#copy-code"),jo=document.querySelector("#copy-link");Lo.value=f.nickname;Rt.value=f.roomCodeInput;ue||(sr.classList.remove("hidden"),sr.textContent=Oo);const lt=ts(new URLSearchParams(window.location.search).get("room"));lt&&(f.roomCodeInput=lt,Rt.value=lt,Y(`Invite code ${lt} loaded.`));ns();Lo.addEventListener("input",t=>{f.nickname=t.target.value.slice(0,22),localStorage.setItem("uttt.nickname",f.nickname)});Rt.addEventListener("input",t=>{f.roomCodeInput=ts(t.target.value),Rt.value=f.roomCodeInput});Ho.addEventListener("click",async()=>{!ue||f.busy||await Wt(async()=>{await Bt();const t=await ne.createRoom(f.playerId,es());await qo(t),Y(`Room ${t} created. Share this key or invite link.`),Je([12,20,12])})});$o.addEventListener("click",async()=>{!ue||f.busy||await Go()});Vo.addEventListener("click",async()=>{if(f.roomCode)try{await navigator.clipboard.writeText(f.roomCode),Y("Room code copied."),Je(10)}catch{Y("Copy failed. Share the code manually.")}});jo.addEventListener("click",async()=>{if(!f.roomCode)return;const t=`${window.location.origin}/?room=${f.roomCode}`;try{await navigator.clipboard.writeText(t),Y("Invite link copied."),Je(10)}catch{Y(`Share this link: ${t}`)}});Bo.addEventListener("click",async()=>{await wd(),Y("Left room.")});mn.addEventListener("click",async()=>{!f.roomCode||!f.room||f.busy||await Wt(async()=>{await Bt(),await ne.requestRematch(f.roomCode,f.playerId),Je([10,40,10])})});_n.addEventListener("click",async t=>{const e=t.target.closest("button[data-mini][data-cell]");if(!e||!f.roomCode||!f.room||f.busy)return;const n=Number(e.dataset.mini),i=Number(e.dataset.cell);await Wt(async()=>{await Bt(),await ne.submitMove(f.roomCode,f.playerId,n,i),Je(9)})});Uo.addEventListener("click",async()=>{f.musicEnabled=!f.musicEnabled,localStorage.setItem("uttt.musicEnabled",String(f.musicEnabled)),f.musicEnabled?await pn.start()||(Y("Tap again to enable soundtrack."),f.musicEnabled=!1,localStorage.setItem("uttt.musicEnabled","false")):pn.stop(),ns()});window.addEventListener("pagehide",()=>{zo()});document.addEventListener("visibilitychange",()=>{f.roomCode&&(document.visibilityState==="hidden"?zo():ne.markPresence(f.roomCode,f.playerId,!0))});document.addEventListener("pointerdown",()=>{Bt()},{once:!0});setInterval(()=>{kd()},1e3);Md();ce();lt&&ue&&Go();async function Go(){const t=ts(f.roomCodeInput);if(!t){Y("Enter the room code.");return}await Wt(async()=>{await Bt();const e=await ne.joinRoom(t,f.playerId,es());await qo(e),Y(`Joined room ${e}.`),Je([10,16,10])})}async function qo(t){f.unsubscribeRoom&&(f.unsubscribeRoom(),f.unsubscribeRoom=null),f.roomCode=t,f.roomCodeInput=t,Rt.value=t;const e=new URL(window.location.href);e.searchParams.set("room",t),window.history.replaceState({},"",e),f.unsubscribeRoom=ne.observeRoom(t,n=>{Dd(f.room,n),f.room=n,ce()},n=>{Y(n.message||"Lost room updates.")}),await ne.markPresence(t,f.playerId,!0),ce()}async function wd(){if(f.unsubscribeRoom&&(f.unsubscribeRoom(),f.unsubscribeRoom=null),f.roomCode&&ue)try{await ne.markPresence(f.roomCode,f.playerId,!1)}catch{}f.room=null,f.roomCode=null,f.lastForfeitAttemptVersion=-1,f.lastMoveKey=null;const t=new URL(window.location.href);t.searchParams.delete("room"),window.history.replaceState({},"",t),ce()}function ce(){const t=!!f.roomCode;if(vd.classList.toggle("hidden",t),Cd.classList.toggle("hidden",!t),document.body.classList.toggle("in-room",t),bd.textContent=f.notice,gi(),!t)return;if(Ed.textContent=f.roomCode||"----",!f.room){tr.textContent="Connecting to room...",nr.textContent="",ir.textContent="",Fo.innerHTML="",Wo.innerHTML="",_n.innerHTML="",mn.classList.add("hidden");return}Id(),Td(),Sd(),tr.textContent=Rd(),nr.textContent=Nd(),ir.textContent=Ad();const e=f.room.status===D.FINISHED&&Object.keys(f.room.players).length===2;mn.classList.toggle("hidden",!e)}function Id(){const t=f.room;if(!t)return;const e=t.status===D.ACTIVE?t.currentTurnUid===f.playerId?"Your turn":"Opponent turn":t.status===D.WAITING?"Waiting":"Match complete",n=t.board.nextMiniGrid>=0&&Nt(t.board).has(t.board.nextMiniGrid)?`Grid ${is(t.board.nextMiniGrid)}`:"Any open grid",i=[{label:"Phase",value:t.status},{label:"Turn",value:e},{label:"Next",value:n},{label:"Moves",value:String(t.board.moveCount)}];Fo.innerHTML=i.map(s=>`
    <article class="chip">
      <p class="chip-label">${s.label}</p>
      <p class="chip-value">${s.value}</p>
    </article>
  `).join("")}function Td(){const t=f.room,e=Object.values(t.players).slice().sort((n,i)=>n.symbol.localeCompare(i.symbol));Wo.innerHTML=e.map(n=>{const i=t.presence[n.uid],s=n.uid===f.playerId,r=(i==null?void 0:i.connected)??!1,o=t.currentTurnUid===n.uid&&t.status===D.ACTIVE;return`
        <article class="player-card ${s?"mine":""} ${o?"is-turn":""}">
          <div>
            <p class="player-name">${Ld(n.nickname)} ${s?"(You)":""}</p>
            <p class="player-meta ${n.symbol==="X"?"mark-x":"mark-o"}">${n.symbol} ${n.uid===t.hostUid?"• Host":""}</p>
          </div>
          <span class="presence ${r?"online":"offline"}">${r?"Online":"Offline"}</span>
        </article>
      `}).join("")}function Sd(){const t=f.room;if(t.status===D.WAITING){_n.innerHTML=`
      <article class="waiting-placeholder">
        <p class="waiting-title">Room ready. Waiting for player two.</p>
        <p class="waiting-copy">Send the 4-digit code or invite link to start instantly.</p>
      </article>
    `;return}const n=!!t.players[f.playerId],i=t.status===D.ACTIVE&&t.currentTurnUid===f.playerId,s=Nt(t.board);_n.innerHTML=Array.from({length:9},(r,o)=>{const a=t.board.miniWinners[o],l=a!==B.EMPTY,c=s.has(o),d=Array.from({length:9},(h,p)=>{const m=gn(o,p),y=t.board.cells[m],w=y===B.EMPTY,k=`${o}-${p}`,L=n&&i&&t.status===D.ACTIVE&&w&&!l&&c,T=y==="X"?"mark-x":y==="O"?"mark-o":"",M=f.lastMoveKey===k?"just-played":"";return`
        <button
          class="cell ${L?"playable":""} ${y!==B.EMPTY?"filled":""} ${T} ${M}"
          data-mini="${o}"
          data-cell="${p}"
          data-cell-key="${k}"
          aria-label="Grid ${is(o)} cell ${p+1}"
          ${L?"":"disabled"}
        >
          ${y===B.EMPTY?"":y}
        </button>
      `}).join("");return`
      <section class="mini-grid ${c?"allowed":""} ${l?"resolved":""}">
        <div class="mini-cells">${d}</div>
        ${l?`<div class="mini-winner ${a==="X"?"mark-x":a==="O"?"mark-o":""}">${a===B.TIE?"T":a}</div>`:""}
      </section>
    `}).join("")}function Rd(){var n,i;const t=f.room;if(t.status===D.WAITING)return"Waiting for a second player to join this room.";if(t.status===D.ACTIVE){if(t.currentTurnUid===f.playerId)return`Your turn (${((n=t.players[f.playerId])==null?void 0:n.symbol)||"?"}).`;const r=t.players[t.currentTurnUid];return`${(r==null?void 0:r.nickname)||"Opponent"}'s turn.`}if(t.winReason===te.DRAW)return"Match ended in a draw.";const e=t.winnerUid===f.playerId?"You":((i=t.players[t.winnerUid])==null?void 0:i.nickname)||"Opponent";return t.winReason===te.FORFEIT?`${e} won by forfeit.`:`${e} won the match.`}function Nd(){const t=f.room;if(!t||t.status!==D.ACTIVE)return"";const e=Nt(t.board);if(e.size===1){const[n]=[...e];return`Play inside mini-grid ${is(n)}.`}return"Play in any highlighted mini-grid."}function Ad(){const t=f.room;if(!t||t.status!==D.ACTIVE)return"";const e=vn(t,f.playerId);if(!e)return"";const n=t.presence[e];if(!n||n.connected||!n.disconnectedAt)return"";const i=yn-(Yo()-n.disconnectedAt);return i<=0?"Opponent disconnected. Claiming forfeit...":`Opponent disconnected. Forfeit in ${Math.ceil(i/1e3)}s.`}async function kd(){const t=f.room;if(!t||!f.roomCode||t.status!==D.ACTIVE)return;const e=vn(t,f.playerId);if(!e)return;const n=t.presence[e];if(!n||n.connected||!n.disconnectedAt)return;if(Yo()-n.disconnectedAt<yn){ce();return}f.lastForfeitAttemptVersion===t.version||f.busy||(f.lastForfeitAttemptVersion=t.version,await Wt(async()=>{await ne.claimForfeit(f.roomCode,f.playerId)}))}async function zo(){if(!(!f.roomCode||!ue))try{await ne.markPresence(f.roomCode,f.playerId,!1)}catch{}}async function Wt(t){f.busy=!0,gi();try{await t()}catch(e){Y((e==null?void 0:e.message)||"Operation failed.")}finally{f.busy=!1,gi(),ce()}}function gi(){const t=f.busy||!ue;Ho.disabled=t,$o.disabled=t;const e=f.busy||!f.roomCode;Vo.disabled=e,jo.disabled=e,Bo.disabled=f.busy,mn.disabled=f.busy}function es(){return f.nickname.trim().slice(0,22)||"Player"}function Y(t){f.notice=t,ce()}function ts(t){return String(t||"").replace(/\D/g,"").slice(0,4)}async function Bt(){if(!f.musicEnabled||pn.isRunning())return;await pn.start()||(f.musicEnabled=!1,localStorage.setItem("uttt.musicEnabled","false"),ns())}function ns(){Uo.textContent=f.musicEnabled?"Sound: On":"Sound: Off"}function Dd(t,e){if(!t||!e)return;const n=t.board.cells,i=e.board.cells;if(!(!n||!i||n.length!==i.length)){for(let s=0;s<i.length;s+=1)if(n[s]===B.EMPTY&&i[s]!==B.EMPTY){const r=Pd(s);f.lastMoveKey=r,f.lastMoveTimeoutId&&window.clearTimeout(f.lastMoveTimeoutId),f.lastMoveTimeoutId=window.setTimeout(()=>{f.lastMoveKey=null,ce()},700);return}}}function Pd(t){const e=Math.floor(t/9),n=t%9,i=Math.floor(e/3),s=Math.floor(n/3),r=e%3,o=n%3,a=i*3+s,l=r*3+o;return`${a}-${l}`}function is(t){const e=Math.floor(t/3)+1,n=t%3+1;return`R${e}C${n}`}function Je(t){navigator.vibrate&&navigator.vibrate(t)}function Yo(){return Date.now()+f.timeOffsetMs}function xd(){const t=f.room;return{mode:f.roomCode?"room":"lobby",coordinate_system:"miniGridIndex 0-8 and cellIndex 0-8, row-major",self:{player_id:f.playerId,nickname:es(),in_room:!!f.roomCode},room:t?{code:t.code,status:t.status,current_turn_uid:t.currentTurnUid,next_mini_grid:t.board.nextMiniGrid,allowed_mini_grids:[...Nt(t.board)],move_count:t.board.moveCount,players:Object.values(t.players).map(e=>({uid:e.uid,nickname:e.nickname,symbol:e.symbol})),board_cells:t.board.cells,mini_winners:t.board.miniWinners,win_reason:t.winReason,winner_uid:t.winnerUid}:null,ui:{busy:f.busy,message:f.notice,music_enabled:f.musicEnabled}}}function Md(){window.render_game_to_text=()=>JSON.stringify(xd()),window.advanceTime=async(t=16)=>{const e=Math.max(0,Number(t)||0);f.timeOffsetMs+=e,ce()}}function Od(){const t="uttt.playerId",e=localStorage.getItem(t);if(e)return e;const n=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`player-${Date.now()}-${Math.random().toString(16).slice(2)}`;return localStorage.setItem(t,n),n}function Ld(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
