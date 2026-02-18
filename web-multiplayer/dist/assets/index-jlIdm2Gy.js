(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const Ce={X:"X",O:"O"};function Pn(t){return t==="X"?Ce.X:t==="O"?Ce.O:null}const x={WAITING:"WAITING",ACTIVE:"ACTIVE",FINISHED:"FINISHED"},J={NONE:"NONE",NORMAL:"NORMAL",FORFEIT:"FORFEIT",DRAW:"DRAW"},W={EMPTY:".",TIE:"T",EMPTY_CELLS:".".repeat(81),EMPTY_MINI_WINNERS:".".repeat(9)};function lt(t={}){const e={cells:W.EMPTY_CELLS,miniWinners:W.EMPTY_MINI_WINNERS,nextMiniGrid:-1,moveCount:0,...t};if(e.cells.length!==81)throw new Error("cells must contain 81 characters");if(e.miniWinners.length!==9)throw new Error("miniWinners must contain 9 characters");return e}const bo=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];function js(t){const e=t.nextMiniGrid;if(e>=0&&e<=8&&On(t,e))return new Set([e]);const n=new Set;for(let i=0;i<=8;i+=1)On(t,i)&&n.add(i);return n}function On(t,e){return e<0||e>8||t.miniWinners[e]!==W.EMPTY?!1:!qs(t.cells,e)}function qs(t,e){for(let n=0;n<=8;n+=1)if(t[en(e,n)]===W.EMPTY)return!1;return!0}function en(t,e){if(t<0||t>8)throw new Error("miniGridIndex out of bounds");if(e<0||e>8)throw new Error("cellIndex out of bounds");const n=Math.floor(t/3),i=t%3,s=Math.floor(e/3),r=e%3,o=n*3+s,a=i*3+r;return o*9+a}function Io(t,e,n,i){if(e<0||e>8||n<0||n>8)return Xe(t,null,!1,"Move indices out of bounds");const s=js(t);if(s.size===0)return Xe(t,null,!1,"No playable mini-grids left");if(!s.has(e))return Xe(t,null,!1,"Move must be played in the highlighted mini-grid");const r=en(e,n);if(t.cells[r]!==W.EMPTY)return Xe(t,null,!1,"Cell is already occupied");const o=t.cells.split(""),a=t.miniWinners.split("");o[r]=i;const l=To(o,e);l!==null?a[e]=l:qs(o.join(""),e)&&(a[e]=W.TIE);const c=So(a),d=Pn(c),h=d===null&&a.every(b=>b!==W.EMPTY),u=n,p=lt({cells:o.join(""),miniWinners:a.join(""),nextMiniGrid:u,moveCount:t.moveCount+1}),m=u>=0&&u<=8&&On(p,u)?u:-1,y=lt({cells:o.join(""),miniWinners:a.join(""),nextMiniGrid:m,moveCount:t.moveCount+1});return Xe(y,d,h,null)}function Xe(t,e,n,i){return{board:t,globalWinner:e,isDraw:n,error:i,isValid:i===null}}function To(t,e){const n=Array.from({length:9},(i,s)=>t[en(e,s)]);return Gs(n)}function So(t){return Gs(t)}function Gs(t){for(const e of bo){const n=t[e[0]],i=t[e[1]],s=t[e[2]];if(n!==W.EMPTY&&n!==W.TIE&&n===i&&i===s)return n}return null}const tn=45e3;function Ro(t,e,n,i){const s={uid:e,nickname:n,symbol:Ce.X,joinedAt:i};return{code:t,hostUid:e,players:{[e]:s},status:x.WAITING,board:lt(),currentTurnUid:e,winnerUid:null,winnerSymbol:null,winReason:J.NONE,startedAt:i,updatedAt:i,version:0,presence:{[e]:{uid:e,connected:!0,lastSeen:i,disconnectedAt:null}},rematchHostReady:!1,rematchGuestReady:!1,rematchNonce:0}}function No(t,e,n,i){if(t.players[e])return Ve(t);if(Object.keys(t.players).length>=2)return F("Room is already full");const r=new Set(Object.values(t.players).map(l=>l.symbol)).has(Ce.X)?Ce.O:Ce.X,o={...t.players,[e]:{uid:e,nickname:n,symbol:r,joinedAt:i}},a={...t.presence,[e]:{uid:e,connected:!0,lastSeen:i,disconnectedAt:null}};return Ve({...t,players:o,presence:a,status:x.ACTIVE,updatedAt:i,version:t.version+1})}function Ao(t,e,n){if(t.status!==x.ACTIVE)return F("Match is not active");const i=t.players[e.playerUid];if(!i)return F("Player is not part of this room");if(t.currentTurnUid!==e.playerUid)return F("It is not your turn");const s=Io(t.board,e.miniGridIndex,e.cellIndex,i.symbol);if(!s.isValid)return F(s.error||"Invalid move");const r=s.globalWinner,o=s.isDraw,a=r!==null||o,l=a?t.currentTurnUid:nn(t,e.playerUid)||t.currentTurnUid;return Ve({...t,board:s.board,status:a?x.FINISHED:x.ACTIVE,currentTurnUid:l,winnerUid:r!==null?e.playerUid:null,winnerSymbol:r,winReason:r!==null?J.NORMAL:o?J.DRAW:J.NONE,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1})}function ko(t,e,n){if(t.status!==x.FINISHED)return F("Rematch is only available after a finished game");if(!t.players[e])return F("Only participants can request rematch");if(Object.keys(t.players).length<2)return F("Need two players for a rematch");let i=t.rematchHostReady,s=t.rematchGuestReady;return e===t.hostUid?i=!0:s=!0,Ve(i&&s?{...t,board:lt(),status:x.ACTIVE,currentTurnUid:t.hostUid,winnerUid:null,winnerSymbol:null,winReason:J.NONE,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1,rematchNonce:t.rematchNonce+1}:{...t,rematchHostReady:i,rematchGuestReady:s,updatedAt:n,version:t.version+1})}function Do(t,e,n,i=tn){if(t.status!==x.ACTIVE)return F("Forfeit can only be claimed during an active match");if(!t.players[e])return F("Only participants can claim forfeit");const s=nn(t,e);if(!s)return F("Opponent is missing");const r=t.presence[s];if(!r)return F("Opponent presence not found");if(r.connected)return F("Opponent is still connected");if(!r.disconnectedAt)return F("No disconnect timestamp found");if(n-r.disconnectedAt<i)return F("Grace period has not elapsed yet");const o=Po(t,e);return o?Ve({...t,status:x.FINISHED,winnerUid:e,winnerSymbol:o,winReason:J.FORFEIT,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1}):F("Could not determine winner symbol")}function Po(t,e){var n;return((n=t.players[e])==null?void 0:n.symbol)||null}function nn(t,e){return Object.keys(t.players).find(n=>n!==e)||null}function Oo(t,e,n){return{miniGridIndex:t,cellIndex:e,playerUid:n,timestamp:Date.now()}}function Ve(t){return{ok:!0,roomState:t}}function F(t){return{ok:!1,reason:t}}const xo=()=>{};var $i={};/**
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
 */const zs={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
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
 */const f=function(t,e){if(!t)throw Ye(e)},Ye=function(t){return new Error("Firebase Database ("+zs.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
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
 */const Ys=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let s=t.charCodeAt(i);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},Mo=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const s=t[n++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=t[n++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=t[n++],o=t[n++],a=t[n++],l=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[i++]=String.fromCharCode(55296+(l>>10)),e[i++]=String.fromCharCode(56320+(l&1023))}else{const r=t[n++],o=t[n++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},si={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<t.length;s+=3){const r=t[s],o=s+1<t.length,a=o?t[s+1]:0,l=s+2<t.length,c=l?t[s+2]:0,d=r>>2,h=(r&3)<<4|a>>4;let u=(a&15)<<2|c>>6,p=c&63;l||(p=64,o||(u=64)),i.push(n[d],n[h],n[u],n[p])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Ys(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Mo(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<t.length;){const r=n[t.charAt(s++)],a=s<t.length?n[t.charAt(s)]:0;++s;const c=s<t.length?n[t.charAt(s)]:64;++s;const h=s<t.length?n[t.charAt(s)]:64;if(++s,r==null||a==null||c==null||h==null)throw new Lo;const u=r<<2|a>>4;if(i.push(u),c!==64){const p=a<<4&240|c>>2;if(i.push(p),h!==64){const m=c<<6&192|h;i.push(m)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Lo extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ks=function(t){const e=Ys(t);return si.encodeByteArray(e,!0)},Lt=function(t){return Ks(t).replace(/\./g,"")},xn=function(t){try{return si.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Fo(t){return Qs(void 0,t)}function Qs(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!Wo(n)||(t[n]=Qs(t[n],e[n]));return t}function Wo(t){return t!=="__proto__"}/**
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
 */function Bo(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Uo=()=>Bo().__FIREBASE_DEFAULTS__,Ho=()=>{if(typeof process>"u"||typeof $i>"u")return;const t=$i.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Vo=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&xn(t[1]);return e&&JSON.parse(e)},Xs=()=>{try{return xo()||Uo()||Ho()||Vo()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},$o=t=>{var e,n;return(n=(e=Xs())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},jo=t=>{const e=$o(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),i]:[e.substring(0,n),i]},Js=()=>{var t;return(t=Xs())===null||t===void 0?void 0:t.config};/**
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
 */class X{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}/**
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
 */function ri(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function qo(t){return(await fetch(t,{credentials:"include"})).ok}/**
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
 */function Go(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},i=e||"demo-project",s=t.iat||0,r=t.sub||t.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Lt(JSON.stringify(n)),Lt(JSON.stringify(o)),""].join(".")}const nt={};function zo(){const t={prod:[],emulator:[]};for(const e of Object.keys(nt))nt[e]?t.emulator.push(e):t.prod.push(e);return t}function Yo(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let ji=!1;function Ko(t,e){if(typeof window>"u"||typeof document>"u"||!ri(window.location.host)||nt[t]===e||nt[t]||ji)return;nt[t]=e;function n(u){return`__firebase__banner__${u}`}const i="__firebase__banner",r=zo().prod.length>0;function o(){const u=document.getElementById(i);u&&u.remove()}function a(u){u.style.display="flex",u.style.background="#7faaf0",u.style.position="fixed",u.style.bottom="5px",u.style.left="5px",u.style.padding=".5em",u.style.borderRadius="5px",u.style.alignItems="center"}function l(u,p){u.setAttribute("width","24"),u.setAttribute("id",p),u.setAttribute("height","24"),u.setAttribute("viewBox","0 0 24 24"),u.setAttribute("fill","none"),u.style.marginLeft="-6px"}function c(){const u=document.createElement("span");return u.style.cursor="pointer",u.style.marginLeft="16px",u.style.fontSize="24px",u.innerHTML=" &times;",u.onclick=()=>{ji=!0,o()},u}function d(u,p){u.setAttribute("id",p),u.innerText="Learn more",u.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",u.setAttribute("target","__blank"),u.style.paddingLeft="5px",u.style.textDecoration="underline"}function h(){const u=Yo(i),p=n("text"),m=document.getElementById(p)||document.createElement("span"),y=n("learnmore"),b=document.getElementById(y)||document.createElement("a"),M=n("preprendIcon"),j=document.getElementById(M)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(u.created){const U=u.element;a(U),d(b,y);const te=c();l(j,M),U.append(j,m,b,te),document.body.appendChild(U)}r?(m.innerText="Preview backend disconnected.",j.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(j.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,m.innerText="Preview backend running in this workspace."),m.setAttribute("id",p)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",h):h()}/**
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
 */function Qo(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Zs(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Qo())}function Xo(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Jo(){return zs.NODE_ADMIN===!0}function Zo(){try{return typeof indexedDB=="object"}catch{return!1}}function ea(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var r;e(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(n){e(n)}})}/**
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
 */const ta="FirebaseError";class Ct extends Error{constructor(e,n,i){super(n),this.code=e,this.customData=i,this.name=ta,Object.setPrototypeOf(this,Ct.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,er.prototype.create)}}class er{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?na(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new Ct(s,a,i)}}function na(t,e){return t.replace(ia,(n,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const ia=/\{\$([^}]+)}/g;/**
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
 */function ct(t){return JSON.parse(t)}function O(t){return JSON.stringify(t)}/**
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
 */const tr=function(t){let e={},n={},i={},s="";try{const r=t.split(".");e=ct(xn(r[0])||""),n=ct(xn(r[1])||""),s=r[2],i=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:i,signature:s}},sa=function(t){const e=tr(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},ra=function(t){const e=tr(t).claims;return typeof e=="object"&&e.admin===!0};/**
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
 */function Q(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Ee(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function Mn(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Ft(t,e,n){const i={};for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(i[s]=e.call(n,t[s],s,t));return i}function Wt(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const s of n){if(!i.includes(s))return!1;const r=t[s],o=e[s];if(qi(r)&&qi(o)){if(!Wt(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!n.includes(s))return!1;return!0}function qi(t){return t!==null&&typeof t=="object"}/**
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
 */function oa(t){const e=[];for(const[n,i]of Object.entries(t))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}/**
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
 */class aa{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const i=this.W_;if(typeof e=="string")for(let h=0;h<16;h++)i[h]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let h=0;h<16;h++)i[h]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let h=16;h<80;h++){const u=i[h-3]^i[h-8]^i[h-14]^i[h-16];i[h]=(u<<1|u>>>31)&4294967295}let s=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,d;for(let h=0;h<80;h++){h<40?h<20?(c=a^r&(o^a),d=1518500249):(c=r^o^a,d=1859775393):h<60?(c=r&o|a&(r|o),d=2400959708):(c=r^o^a,d=3395469782);const u=(s<<5|s>>>27)+c+l+d+i[h]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=s,s=u}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const i=n-this.blockSize;let s=0;const r=this.buf_;let o=this.inbuf_;for(;s<n;){if(o===0)for(;s<=i;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<n;)if(r[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}else for(;s<n;)if(r[o]=e[s],++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=n&255,n/=256;this.compress_(this.buf_);let i=0;for(let s=0;s<5;s++)for(let r=24;r>=0;r-=8)e[i]=this.chain_[s]>>r&255,++i;return e}}function $e(t,e){return`${t} failed: ${e} argument `}/**
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
 */const la=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let s=t.charCodeAt(i);if(s>=55296&&s<=56319){const r=s-55296;i++,f(i<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(i)-56320;s=65536+(r<<10)+o}s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):s<65536?(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},sn=function(t){let e=0;for(let n=0;n<t.length;n++){const i=t.charCodeAt(n);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,n++):e+=3}return e};/**
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
 */function Re(t){return t&&t._delegate?t._delegate:t}class ut{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const me="[DEFAULT]";/**
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
 */class ca{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new X;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ha(e))try{this.getOrInitializeService({instanceIdentifier:me})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=me){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=me){return this.instances.has(e)}getOptions(e=me){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(e,n){var i;const s=this.normalizeInstanceIdentifier(n),r=(i=this.onInitCallbacks.get(s))!==null&&i!==void 0?i:new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(i)for(const s of i)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:ua(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=me){return this.component?this.component.multipleInstances?e:me:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ua(t){return t===me?void 0:t}function ha(t){return t.instantiationMode==="EAGER"}/**
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
 */class da{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new ca(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var S;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(S||(S={}));const fa={debug:S.DEBUG,verbose:S.VERBOSE,info:S.INFO,warn:S.WARN,error:S.ERROR,silent:S.SILENT},pa=S.INFO,_a={[S.DEBUG]:"log",[S.VERBOSE]:"log",[S.INFO]:"info",[S.WARN]:"warn",[S.ERROR]:"error"},ma=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),s=_a[e];if(s)console[s](`[${i}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class nr{constructor(e){this.name=e,this._logLevel=pa,this._logHandler=ma,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in S))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?fa[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,S.DEBUG,...e),this._logHandler(this,S.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,S.VERBOSE,...e),this._logHandler(this,S.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,S.INFO,...e),this._logHandler(this,S.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,S.WARN,...e),this._logHandler(this,S.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,S.ERROR,...e),this._logHandler(this,S.ERROR,...e)}}const ga=(t,e)=>e.some(n=>t instanceof n);let Gi,zi;function ya(){return Gi||(Gi=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function va(){return zi||(zi=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ir=new WeakMap,Ln=new WeakMap,sr=new WeakMap,vn=new WeakMap,oi=new WeakMap;function Ca(t){const e=new Promise((n,i)=>{const s=()=>{t.removeEventListener("success",r),t.removeEventListener("error",o)},r=()=>{n(ue(t.result)),s()},o=()=>{i(t.error),s()};t.addEventListener("success",r),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&ir.set(n,t)}).catch(()=>{}),oi.set(e,t),e}function Ea(t){if(Ln.has(t))return;const e=new Promise((n,i)=>{const s=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",o),t.removeEventListener("abort",o)},r=()=>{n(),s()},o=()=>{i(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",r),t.addEventListener("error",o),t.addEventListener("abort",o)});Ln.set(t,e)}let Fn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ln.get(t);if(e==="objectStoreNames")return t.objectStoreNames||sr.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ue(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function wa(t){Fn=t(Fn)}function ba(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const i=t.call(Cn(this),e,...n);return sr.set(i,e.sort?e.sort():[e]),ue(i)}:va().includes(t)?function(...e){return t.apply(Cn(this),e),ue(ir.get(this))}:function(...e){return ue(t.apply(Cn(this),e))}}function Ia(t){return typeof t=="function"?ba(t):(t instanceof IDBTransaction&&Ea(t),ga(t,ya())?new Proxy(t,Fn):t)}function ue(t){if(t instanceof IDBRequest)return Ca(t);if(vn.has(t))return vn.get(t);const e=Ia(t);return e!==t&&(vn.set(t,e),oi.set(e,t)),e}const Cn=t=>oi.get(t);function Ta(t,e,{blocked:n,upgrade:i,blocking:s,terminated:r}={}){const o=indexedDB.open(t,e),a=ue(o);return i&&o.addEventListener("upgradeneeded",l=>{i(ue(o.result),l.oldVersion,l.newVersion,ue(o.transaction),l)}),n&&o.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),s&&l.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Sa=["get","getKey","getAll","getAllKeys","count"],Ra=["put","add","delete","clear"],En=new Map;function Yi(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(En.get(e))return En.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,s=Ra.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(s||Sa.includes(n)))return;const r=async function(o,...a){const l=this.transaction(o,s?"readwrite":"readonly");let c=l.store;return i&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),s&&l.done]))[0]};return En.set(e,r),r}wa(t=>({...t,get:(e,n,i)=>Yi(e,n)||t.get(e,n,i),has:(e,n)=>!!Yi(e,n)||t.has(e,n)}));/**
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
 */class Na{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Aa(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function Aa(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Wn="@firebase/app",Ki="0.13.2";/**
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
 */const re=new nr("@firebase/app"),ka="@firebase/app-compat",Da="@firebase/analytics-compat",Pa="@firebase/analytics",Oa="@firebase/app-check-compat",xa="@firebase/app-check",Ma="@firebase/auth",La="@firebase/auth-compat",Fa="@firebase/database",Wa="@firebase/data-connect",Ba="@firebase/database-compat",Ua="@firebase/functions",Ha="@firebase/functions-compat",Va="@firebase/installations",$a="@firebase/installations-compat",ja="@firebase/messaging",qa="@firebase/messaging-compat",Ga="@firebase/performance",za="@firebase/performance-compat",Ya="@firebase/remote-config",Ka="@firebase/remote-config-compat",Qa="@firebase/storage",Xa="@firebase/storage-compat",Ja="@firebase/firestore",Za="@firebase/ai",el="@firebase/firestore-compat",tl="firebase",nl="11.10.0";/**
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
 */const Bn="[DEFAULT]",il={[Wn]:"fire-core",[ka]:"fire-core-compat",[Pa]:"fire-analytics",[Da]:"fire-analytics-compat",[xa]:"fire-app-check",[Oa]:"fire-app-check-compat",[Ma]:"fire-auth",[La]:"fire-auth-compat",[Fa]:"fire-rtdb",[Wa]:"fire-data-connect",[Ba]:"fire-rtdb-compat",[Ua]:"fire-fn",[Ha]:"fire-fn-compat",[Va]:"fire-iid",[$a]:"fire-iid-compat",[ja]:"fire-fcm",[qa]:"fire-fcm-compat",[Ga]:"fire-perf",[za]:"fire-perf-compat",[Ya]:"fire-rc",[Ka]:"fire-rc-compat",[Qa]:"fire-gcs",[Xa]:"fire-gcs-compat",[Ja]:"fire-fst",[el]:"fire-fst-compat",[Za]:"fire-vertex","fire-js":"fire-js",[tl]:"fire-js-all"};/**
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
 */const Bt=new Map,sl=new Map,Un=new Map;function Qi(t,e){try{t.container.addComponent(e)}catch(n){re.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ut(t){const e=t.name;if(Un.has(e))return re.debug(`There were multiple attempts to register component ${e}.`),!1;Un.set(e,t);for(const n of Bt.values())Qi(n,t);for(const n of sl.values())Qi(n,t);return!0}function rl(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function ol(t){return t==null?!1:t.settings!==void 0}/**
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
 */const al={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},he=new er("app","Firebase",al);/**
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
 */class ll{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new ut("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw he.create("app-deleted",{appName:this._name})}}/**
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
 */const cl=nl;function rr(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const i=Object.assign({name:Bn,automaticDataCollectionEnabled:!0},e),s=i.name;if(typeof s!="string"||!s)throw he.create("bad-app-name",{appName:String(s)});if(n||(n=Js()),!n)throw he.create("no-options");const r=Bt.get(s);if(r){if(Wt(n,r.options)&&Wt(i,r.config))return r;throw he.create("duplicate-app",{appName:s})}const o=new da(s);for(const l of Un.values())o.addComponent(l);const a=new ll(n,i,o);return Bt.set(s,a),a}function ul(t=Bn){const e=Bt.get(t);if(!e&&t===Bn&&Js())return rr();if(!e)throw he.create("no-app",{appName:t});return e}function We(t,e,n){var i;let s=(i=il[t])!==null&&i!==void 0?i:t;n&&(s+=`-${n}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),re.warn(a.join(" "));return}Ut(new ut(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const hl="firebase-heartbeat-database",dl=1,ht="firebase-heartbeat-store";let wn=null;function or(){return wn||(wn=Ta(hl,dl,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(ht)}catch(n){console.warn(n)}}}}).catch(t=>{throw he.create("idb-open",{originalErrorMessage:t.message})})),wn}async function fl(t){try{const n=(await or()).transaction(ht),i=await n.objectStore(ht).get(ar(t));return await n.done,i}catch(e){if(e instanceof Ct)re.warn(e.message);else{const n=he.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});re.warn(n.message)}}}async function Xi(t,e){try{const i=(await or()).transaction(ht,"readwrite");await i.objectStore(ht).put(e,ar(t)),await i.done}catch(n){if(n instanceof Ct)re.warn(n.message);else{const i=he.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});re.warn(i.message)}}}function ar(t){return`${t.name}!${t.options.appId}`}/**
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
 */const pl=1024,_l=30;class ml{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new yl(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Ji();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>_l){const o=vl(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){re.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Ji(),{heartbeatsToSend:i,unsentEntries:s}=gl(this._heartbeatsCache.heartbeats),r=Lt(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return re.warn(n),""}}}function Ji(){return new Date().toISOString().substring(0,10)}function gl(t,e=pl){const n=[];let i=t.slice();for(const s of t){const r=n.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),Zi(n)>e){r.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Zi(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class yl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Zo()?ea().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await fl(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Xi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Xi(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Zi(t){return Lt(JSON.stringify({version:2,heartbeats:t})).length}function vl(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let i=1;i<t.length;i++)t[i].date<n&&(n=t[i].date,e=i);return e}/**
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
 */function Cl(t){Ut(new ut("platform-logger",e=>new Na(e),"PRIVATE")),Ut(new ut("heartbeat",e=>new ml(e),"PRIVATE")),We(Wn,Ki,t),We(Wn,Ki,"esm2017"),We("fire-js","")}Cl("");var El="firebase",wl="11.10.0";/**
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
 */We(El,wl,"app");var es={};const ts="@firebase/database",ns="1.0.20";/**
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
 */let lr="";function bl(t){lr=t}/**
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
 */class Il{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),O(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:ct(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
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
 */class Tl{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return Q(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
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
 */const cr=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Il(e)}}catch{}return new Tl},ye=cr("localStorage"),Sl=cr("sessionStorage");/**
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
 */const Be=new nr("@firebase/database"),ur=function(){let t=1;return function(){return t++}}(),hr=function(t){const e=la(t),n=new aa;n.update(e);const i=n.digest();return si.encodeByteArray(i)},Et=function(...t){let e="";for(let n=0;n<t.length;n++){const i=t[n];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=Et.apply(null,i):typeof i=="object"?e+=O(i):e+=i,e+=" "}return e};let it=null,is=!0;const Rl=function(t,e){f(!0,"Can't turn on custom loggers persistently."),Be.logLevel=S.VERBOSE,it=Be.log.bind(Be)},L=function(...t){if(is===!0&&(is=!1,it===null&&Sl.get("logging_enabled")===!0&&Rl()),it){const e=Et.apply(null,t);it(e)}},wt=function(t){return function(...e){L(t,...e)}},Hn=function(...t){const e="FIREBASE INTERNAL ERROR: "+Et(...t);Be.error(e)},oe=function(...t){const e=`FIREBASE FATAL ERROR: ${Et(...t)}`;throw Be.error(e),new Error(e)},$=function(...t){const e="FIREBASE WARNING: "+Et(...t);Be.warn(e)},Nl=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&$("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},rn=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},Al=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},je="[MIN_NAME]",we="[MAX_NAME]",Ne=function(t,e){if(t===e)return 0;if(t===je||e===we)return-1;if(e===je||t===we)return 1;{const n=ss(t),i=ss(e);return n!==null?i!==null?n-i===0?t.length-e.length:n-i:-1:i!==null?1:t<e?-1:1}},kl=function(t,e){return t===e?0:t<e?-1:1},Je=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+O(e))},ai=function(t){if(typeof t!="object"||t===null)return O(t);const e=[];for(const i in t)e.push(i);e.sort();let n="{";for(let i=0;i<e.length;i++)i!==0&&(n+=","),n+=O(e[i]),n+=":",n+=ai(t[e[i]]);return n+="}",n},dr=function(t,e){const n=t.length;if(n<=e)return[t];const i=[];for(let s=0;s<n;s+=e)s+e>n?i.push(t.substring(s,n)):i.push(t.substring(s,s+e));return i};function B(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const fr=function(t){f(!rn(t),"Invalid JSON number");const e=11,n=52,i=(1<<e-1)-1;let s,r,o,a,l;t===0?(r=0,o=0,s=1/t===-1/0?1:0):(s=t<0,t=Math.abs(t),t>=Math.pow(2,1-i)?(a=Math.min(Math.floor(Math.log(t)/Math.LN2),i),r=a+i,o=Math.round(t*Math.pow(2,n-a)-Math.pow(2,n))):(r=0,o=Math.round(t/Math.pow(2,1-i-n))));const c=[];for(l=n;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(s?1:0),c.reverse();const d=c.join("");let h="";for(l=0;l<64;l+=8){let u=parseInt(d.substr(l,8),2).toString(16);u.length===1&&(u="0"+u),h=h+u}return h.toLowerCase()},Dl=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},Pl=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function Ol(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const i=new Error(t+" at "+e._path.toString()+": "+n);return i.code=t.toUpperCase(),i}const xl=new RegExp("^-?(0*)\\d{1,10}$"),Ml=-2147483648,Ll=2147483647,ss=function(t){if(xl.test(t)){const e=Number(t);if(e>=Ml&&e<=Ll)return e}return null},Ke=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw $("Exception was thrown by user callback.",n),e},Math.floor(0))}},Fl=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},st=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
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
 */class Wl{constructor(e,n){this.appCheckProvider=n,this.appName=e.name,ol(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((n,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,i):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)===null||n===void 0||n.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){$(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
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
 */class Bl{constructor(e,n,i){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(L("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,i):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',$(e)}}class Ot{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Ot.OWNER="owner";/**
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
 */const li="5",pr="v",_r="s",mr="r",gr="f",yr=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,vr="ls",Cr="p",Vn="ac",Er="websocket",wr="long_polling";/**
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
 */class br{constructor(e,n,i,s,r=!1,o="",a=!1,l=!1,c=null){this.secure=n,this.namespace=i,this.webSocketOnly=s,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=ye.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&ye.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function Ul(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function Ir(t,e,n){f(typeof e=="string","typeof type must == string"),f(typeof n=="object","typeof params must == object");let i;if(e===Er)i=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===wr)i=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);Ul(t)&&(n.ns=t.namespace);const s=[];return B(n,(r,o)=>{s.push(r+"="+o)}),i+s.join("&")}/**
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
 */class Hl{constructor(){this.counters_={}}incrementCounter(e,n=1){Q(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return Fo(this.counters_)}}/**
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
 */const bn={},In={};function ci(t){const e=t.toString();return bn[e]||(bn[e]=new Hl),bn[e]}function Vl(t,e){const n=t.toString();return In[n]||(In[n]=e()),In[n]}/**
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
 */class $l{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<i.length;++s)i[s]&&Ke(()=>{this.onMessage_(i[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
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
 */const rs="start",jl="close",ql="pLPCommand",Gl="pRTLPCB",Tr="id",Sr="pw",Rr="ser",zl="cb",Yl="seg",Kl="ts",Ql="d",Xl="dframe",Nr=1870,Ar=30,Jl=Nr-Ar,Zl=25e3,ec=3e4;class Me{constructor(e,n,i,s,r,o,a){this.connId=e,this.repoInfo=n,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=wt(e),this.stats_=ci(n),this.urlFn=l=>(this.appCheckToken&&(l[Vn]=this.appCheckToken),Ir(n,wr,l))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new $l(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(ec)),Al(()=>{if(this.isClosed_)return;this.scriptTagHolder=new ui((...r)=>{const[o,a,l,c,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===rs)this.id=a,this.password=l;else if(o===jl)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const i={};i[rs]="t",i[Rr]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[zl]=this.scriptTagHolder.uniqueCallbackIdentifier),i[pr]=li,this.transportSessionId&&(i[_r]=this.transportSessionId),this.lastSessionId&&(i[vr]=this.lastSessionId),this.applicationId&&(i[Cr]=this.applicationId),this.appCheckToken&&(i[Vn]=this.appCheckToken),typeof location<"u"&&location.hostname&&yr.test(location.hostname)&&(i[mr]=gr);const s=this.urlFn(i);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Me.forceAllow_=!0}static forceDisallow(){Me.forceDisallow_=!0}static isAvailable(){return Me.forceAllow_?!0:!Me.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!Dl()&&!Pl()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=O(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const i=Ks(n),s=dr(i,Jl);for(let r=0;r<s.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[r]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const i={};i[Xl]="t",i[Tr]=e,i[Sr]=n,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=O(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class ui{constructor(e,n,i,s){this.onDisconnect=i,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=ur(),window[ql+this.uniqueCallbackIdentifier]=e,window[Gl+this.uniqueCallbackIdentifier]=n,this.myIFrame=ui.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){L("frame writing exception"),a.stack&&L(a.stack),L(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||L("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Tr]=this.myID,e[Sr]=this.myPW,e[Rr]=this.currentSerial;let n=this.urlFn(e),i="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Ar+i.length<=Nr;){const o=this.pendingSegs.shift();i=i+"&"+Yl+s+"="+o.seg+"&"+Kl+s+"="+o.ts+"&"+Ql+s+"="+o.d,s++}return n=n+i,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,i){this.pendingSegs.push({seg:e,ts:n,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const i=()=>{this.outstandingRequests.delete(n),this.newRequest_()},s=setTimeout(i,Math.floor(Zl)),r=()=>{clearTimeout(s),i()};this.addTag(e,r)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const s=i.readyState;(!s||s==="loaded"||s==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),n())},i.onerror=()=>{L("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
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
 */const tc=16384,nc=45e3;let Ht=null;typeof MozWebSocket<"u"?Ht=MozWebSocket:typeof WebSocket<"u"&&(Ht=WebSocket);class z{constructor(e,n,i,s,r,o,a){this.connId=e,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=wt(this.connId),this.stats_=ci(n),this.connURL=z.connectionURL_(n,o,a,s,i),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,i,s,r){const o={};return o[pr]=li,typeof location<"u"&&location.hostname&&yr.test(location.hostname)&&(o[mr]=gr),n&&(o[_r]=n),i&&(o[vr]=i),s&&(o[Vn]=s),r&&(o[Cr]=r),Ir(e,Er,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,ye.set("previous_websocket_failure",!0);try{let i;Jo(),this.mySock=new Ht(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){z.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(n);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&Ht!==null&&!z.forceDisallow_}static previouslyFailed(){return ye.isInMemoryStorage||ye.get("previous_websocket_failure")===!0}markConnectionHealthy(){ye.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const i=ct(n);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(f(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const i=this.extractFrameCount_(n);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const n=O(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const i=dr(n,tc);i.length>1&&this.sendString_(String(i.length));for(let s=0;s<i.length;s++)this.sendString_(i[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(nc))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}z.responsesRequiredToBeHealthy=2;z.healthyTimeout=3e4;/**
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
 */class dt{static get ALL_TRANSPORTS(){return[Me,z]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const n=z&&z.isAvailable();let i=n&&!z.previouslyFailed();if(e.webSocketOnly&&(n||$("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[z];else{const s=this.transports_=[];for(const r of dt.ALL_TRANSPORTS)r&&r.isAvailable()&&s.push(r);dt.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}dt.globalTransportInitialized_=!1;/**
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
 */const ic=6e4,sc=5e3,rc=10*1024,oc=100*1024,Tn="t",os="d",ac="s",as="r",lc="e",ls="o",cs="a",us="n",hs="p",cc="h";class uc{constructor(e,n,i,s,r,o,a,l,c,d){this.id=e,this.repoInfo_=n,this.applicationId_=i,this.appCheckToken_=s,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=wt("c:"+this.id+":"),this.transportManager_=new dt(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,i)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=st(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>oc?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>rc?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Tn in e){const n=e[Tn];n===cs?this.upgradeIfSecondaryHealthy_():n===as?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===ls&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=Je("t",e),i=Je("d",e);if(n==="c")this.onSecondaryControl_(i);else if(n==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:hs,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:cs,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:us,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=Je("t",e),i=Je("d",e);n==="c"?this.onControl_(i):n==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=Je(Tn,e);if(os in e){const i=e[os];if(n===cc){const s=Object.assign({},i);this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(n===us){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===ac?this.onConnectionShutdown_(i):n===as?this.onReset_(i):n===lc?Hn("Server Error: "+i):n===ls?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Hn("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,i=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),li!==i&&$("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,i),st(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(ic))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):st(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(sc))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:hs,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(ye.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
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
 */class kr{put(e,n,i,s){}merge(e,n,i,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,i){}onDisconnectMerge(e,n,i){}onDisconnectCancel(e,n){}reportStats(e){}}/**
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
 */class Dr{constructor(e){this.allowedEvents_=e,this.listeners_={},f(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let s=0;s<i.length;s++)i[s].callback.apply(i[s].context,n)}}on(e,n,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:i});const s=this.getInitialEvent(e);s&&n.apply(i,s)}off(e,n,i){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let r=0;r<s.length;r++)if(s[r].callback===n&&(!i||i===s[r].context)){s.splice(r,1);return}}validateEventType_(e){f(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
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
 */class Vt extends Dr{static getInstance(){return new Vt}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Zs()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return f(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
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
 */const ds=32,fs=768;class I{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let i=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[i]=this.pieces_[s],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function w(){return new I("")}function v(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function fe(t){return t.pieces_.length-t.pieceNum_}function T(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new I(t.pieces_,e)}function hi(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function hc(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function ft(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function Pr(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new I(e,0)}function k(t,e){const n=[];for(let i=t.pieceNum_;i<t.pieces_.length;i++)n.push(t.pieces_[i]);if(e instanceof I)for(let i=e.pieceNum_;i<e.pieces_.length;i++)n.push(e.pieces_[i]);else{const i=e.split("/");for(let s=0;s<i.length;s++)i[s].length>0&&n.push(i[s])}return new I(n,0)}function C(t){return t.pieceNum_>=t.pieces_.length}function H(t,e){const n=v(t),i=v(e);if(n===null)return e;if(n===i)return H(T(t),T(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function dc(t,e){const n=ft(t,0),i=ft(e,0);for(let s=0;s<n.length&&s<i.length;s++){const r=Ne(n[s],i[s]);if(r!==0)return r}return n.length===i.length?0:n.length<i.length?-1:1}function di(t,e){if(fe(t)!==fe(e))return!1;for(let n=t.pieceNum_,i=e.pieceNum_;n<=t.pieces_.length;n++,i++)if(t.pieces_[n]!==e.pieces_[i])return!1;return!0}function G(t,e){let n=t.pieceNum_,i=e.pieceNum_;if(fe(t)>fe(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[i])return!1;++n,++i}return!0}class fc{constructor(e,n){this.errorPrefix_=n,this.parts_=ft(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=sn(this.parts_[i]);Or(this)}}function pc(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=sn(e),Or(t)}function _c(t){const e=t.parts_.pop();t.byteLength_-=sn(e),t.parts_.length>0&&(t.byteLength_-=1)}function Or(t){if(t.byteLength_>fs)throw new Error(t.errorPrefix_+"has a key path longer than "+fs+" bytes ("+t.byteLength_+").");if(t.parts_.length>ds)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+ds+") or object contains a cycle "+ge(t))}function ge(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
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
 */class fi extends Dr{static getInstance(){return new fi}constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return f(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
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
 */const Ze=1e3,mc=60*5*1e3,ps=30*1e3,gc=1.3,yc=3e4,vc="server_kill",_s=3;class se extends kr{constructor(e,n,i,s,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=i,this.onConnectStatus_=s,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=se.nextPersistentConnectionId_++,this.log_=wt("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=Ze,this.maxReconnectDelay_=mc,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");fi.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Vt.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,i){const s=++this.requestNumber_,r={r:s,a:e,b:n};this.log_(O(r)),f(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),i&&(this.requestCBHash_[s]=i)}get(e){this.initConnection_();const n=new X,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?n.resolve(a):n.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),n.promise}listen(e,n,i,s){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),f(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),f(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:s,hashFn:n,query:e,tag:i};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(i)})}sendListen_(e){const n=e.query,i=n._path.toString(),s=n._queryIdentifier;this.log_("Listen on "+i+" for "+s);const r={p:i},o="q";e.tag&&(r.q=n._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;se.warnOnListenWarnings_(l,n),(this.listens.get(i)&&this.listens.get(i).get(s))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(i,s),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&Q(e,"w")){const i=Ee(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const s='".indexOn": "'+n._queryParams.getIndex().toString()+'"',r=n._path.toString();$(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||ra(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=ps)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=sa(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(n,i,s=>{const r=s.s,o=s.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,i=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,i)})}unlisten(e,n){const i=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+s),f(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,s)&&this.connected_&&this.sendUnlisten_(i,s,e._queryObject,n)}sendUnlisten_(e,n,i,s){this.log_("Unlisten on "+e+" for "+n);const r={p:e},o="n";s&&(r.q=i,r.t=s),this.sendRequest(o,r)}onDisconnectPut(e,n,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:i})}onDisconnectMerge(e,n,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:i})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,i,s){const r={p:n,d:i};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,n,i,s){this.putInternal("p",e,n,i,s)}merge(e,n,i,s){this.putInternal("m",e,n,i,s)}putInternal(e,n,i,s,r){this.initConnection_();const o={p:n,d:i};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,i,r=>{this.log_(n+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(r.s,r.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,i=>{if(i.s!=="ok"){const r=i.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+O(e));const n=e.r,i=this.requestCBHash_[n];i&&(delete this.requestCBHash_[n],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):Hn("Unrecognized action received from server: "+O(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){f(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=Ze,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=Ze,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>yc&&(this.reconnectDelay_=Ze),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*gc)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+se.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,i())},c=function(h){f(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(h)};this.realtime_={close:l,sendRequest:c};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[h,u]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?L("getToken() completed but was canceled"):(L("getToken() completed. Creating connection."),this.authToken_=h&&h.accessToken,this.appCheckToken_=u&&u.token,a=new uc(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,i,p=>{$(p+" ("+this.repoInfo_.toString()+")"),this.interrupt(vc)},r))}catch(h){this.log_("Failed to get token: "+h),o||(this.repoInfo_.nodeAdmin&&$(h),l())}}}interrupt(e){L("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){L("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Mn(this.interruptReasons_)&&(this.reconnectDelay_=Ze,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let i;n?i=n.map(r=>ai(r)).join("$"):i="default";const s=this.removeListen_(e,i);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,n){const i=new I(e).toString();let s;if(this.listens.has(i)){const r=this.listens.get(i);s=r.get(n),r.delete(n),r.size===0&&this.listens.delete(i)}else s=void 0;return s}onAuthRevoked_(e,n){L("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=_s&&(this.reconnectDelay_=ps,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){L("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=_s&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+lr.replace(/\./g,"-")]=1,Zs()?e["framework.cordova"]=1:Xo()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Vt.getInstance().currentlyOnline();return Mn(this.interruptReasons_)&&e}}se.nextPersistentConnectionId_=0;se.nextConnectionId_=0;/**
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
 */class on{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const i=new E(je,e),s=new E(je,n);return this.compare(i,s)!==0}minPost(){return E.MIN}}/**
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
 */let Nt;class xr extends on{static get __EMPTY_NODE(){return Nt}static set __EMPTY_NODE(e){Nt=e}compare(e,n){return Ne(e.name,n.name)}isDefinedOn(e){throw Ye("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return E.MIN}maxPost(){return new E(we,Nt)}makePost(e,n){return f(typeof e=="string","KeyIndex indexValue must always be a string."),new E(e,Nt)}toString(){return".key"}}const Ue=new xr;/**
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
 */class At{constructor(e,n,i,s,r=null){this.isReverse_=s,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?i(e.key,n):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class P{constructor(e,n,i,s,r){this.key=e,this.value=n,this.color=i??P.RED,this.left=s??V.EMPTY_NODE,this.right=r??V.EMPTY_NODE}copy(e,n,i,s,r){return new P(e??this.key,n??this.value,i??this.color,s??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,i){let s=this;const r=i(e,s.key);return r<0?s=s.copy(null,null,null,s.left.insert(e,n,i),null):r===0?s=s.copy(null,n,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,n,i)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return V.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let i,s;if(i=this,n(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),n(e,i.key)===0){if(i.right.isEmpty())return V.EMPTY_NODE;s=i.right.min_(),i=i.copy(s.key,s.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,P.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,P.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}P.RED=!0;P.BLACK=!1;class Cc{copy(e,n,i,s,r){return this}insert(e,n,i){return new P(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class V{constructor(e,n=V.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new V(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,P.BLACK,null,null))}remove(e){return new V(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,P.BLACK,null,null))}get(e){let n,i=this.root_;for(;!i.isEmpty();){if(n=this.comparator_(e,i.key),n===0)return i.value;n<0?i=i.left:n>0&&(i=i.right)}return null}getPredecessorKey(e){let n,i=this.root_,s=null;for(;!i.isEmpty();)if(n=this.comparator_(e,i.key),n===0){if(i.left.isEmpty())return s?s.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else n<0?i=i.left:n>0&&(s=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new At(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new At(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new At(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new At(this.root_,null,this.comparator_,!0,e)}}V.EMPTY_NODE=new Cc;/**
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
 */function Ec(t,e){return Ne(t.name,e.name)}function pi(t,e){return Ne(t,e)}/**
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
 */let $n;function wc(t){$n=t}const Mr=function(t){return typeof t=="number"?"number:"+fr(t):"string:"+t},Lr=function(t){if(t.isLeafNode()){const e=t.val();f(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Q(e,".sv"),"Priority must be a string or number.")}else f(t===$n||t.isEmpty(),"priority of unexpected type.");f(t===$n||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
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
 */let ms;class D{static set __childrenNodeConstructor(e){ms=e}static get __childrenNodeConstructor(){return ms}constructor(e,n=D.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,f(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),Lr(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new D(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:D.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return C(e)?this:v(e)===".priority"?this.priorityNode_:D.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:D.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const i=v(e);return i===null?n:n.isEmpty()&&i!==".priority"?this:(f(i!==".priority"||fe(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,D.__childrenNodeConstructor.EMPTY_NODE.updateChild(T(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Mr(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=fr(this.value_):e+=this.value_,this.lazyHash_=hr(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===D.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof D.__childrenNodeConstructor?-1:(f(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,i=typeof this.value_,s=D.VALUE_TYPE_ORDER.indexOf(n),r=D.VALUE_TYPE_ORDER.indexOf(i);return f(s>=0,"Unknown leaf type: "+n),f(r>=0,"Unknown leaf type: "+i),s===r?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}D.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
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
 */let Fr,Wr;function bc(t){Fr=t}function Ic(t){Wr=t}class Tc extends on{compare(e,n){const i=e.node.getPriority(),s=n.node.getPriority(),r=i.compareTo(s);return r===0?Ne(e.name,n.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return E.MIN}maxPost(){return new E(we,new D("[PRIORITY-POST]",Wr))}makePost(e,n){const i=Fr(e);return new E(n,new D("[PRIORITY-POST]",i))}toString(){return".priority"}}const N=new Tc;/**
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
 */const Sc=Math.log(2);class Rc{constructor(e){const n=r=>parseInt(Math.log(r)/Sc,10),i=r=>parseInt(Array(r+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const s=i(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const $t=function(t,e,n,i){t.sort(e);const s=function(l,c){const d=c-l;let h,u;if(d===0)return null;if(d===1)return h=t[l],u=n?n(h):h,new P(u,h.node,P.BLACK,null,null);{const p=parseInt(d/2,10)+l,m=s(l,p),y=s(p+1,c);return h=t[p],u=n?n(h):h,new P(u,h.node,P.BLACK,m,y)}},r=function(l){let c=null,d=null,h=t.length;const u=function(m,y){const b=h-m,M=h;h-=m;const j=s(b+1,M),U=t[b],te=n?n(U):U;p(new P(te,U.node,y,null,j))},p=function(m){c?(c.left=m,c=m):(d=m,c=m)};for(let m=0;m<l.count;++m){const y=l.nextBitIsOne(),b=Math.pow(2,l.count-(m+1));y?u(b,P.BLACK):(u(b,P.BLACK),u(b,P.RED))}return d},o=new Rc(t.length),a=r(o);return new V(i||e,a)};/**
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
 */let Sn;const Pe={};class ie{static get Default(){return f(Pe&&N,"ChildrenNode.ts has not been loaded"),Sn=Sn||new ie({".priority":Pe},{".priority":N}),Sn}constructor(e,n){this.indexes_=e,this.indexSet_=n}get(e){const n=Ee(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof V?n:null}hasIndex(e){return Q(this.indexSet_,e.toString())}addIndex(e,n){f(e!==Ue,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let s=!1;const r=n.getIterator(E.Wrap);let o=r.getNext();for(;o;)s=s||e.isDefinedOn(o.node),i.push(o),o=r.getNext();let a;s?a=$t(i,e.getCompare()):a=Pe;const l=e.toString(),c=Object.assign({},this.indexSet_);c[l]=e;const d=Object.assign({},this.indexes_);return d[l]=a,new ie(d,c)}addToIndexes(e,n){const i=Ft(this.indexes_,(s,r)=>{const o=Ee(this.indexSet_,r);if(f(o,"Missing index implementation for "+r),s===Pe)if(o.isDefinedOn(e.node)){const a=[],l=n.getIterator(E.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),$t(a,o.getCompare())}else return Pe;else{const a=n.get(e.name);let l=s;return a&&(l=l.remove(new E(e.name,a))),l.insert(e,e.node)}});return new ie(i,this.indexSet_)}removeFromIndexes(e,n){const i=Ft(this.indexes_,s=>{if(s===Pe)return s;{const r=n.get(e.name);return r?s.remove(new E(e.name,r)):s}});return new ie(i,this.indexSet_)}}/**
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
 */let et;class g{static get EMPTY_NODE(){return et||(et=new g(new V(pi),null,ie.Default))}constructor(e,n,i){this.children_=e,this.priorityNode_=n,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&Lr(this.priorityNode_),this.children_.isEmpty()&&f(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||et}updatePriority(e){return this.children_.isEmpty()?this:new g(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?et:n}}getChild(e){const n=v(e);return n===null?this:this.getImmediateChild(n).getChild(T(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(f(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const i=new E(e,n);let s,r;n.isEmpty()?(s=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(i,this.children_)):(s=this.children_.insert(e,n),r=this.indexMap_.addToIndexes(i,this.children_));const o=s.isEmpty()?et:this.priorityNode_;return new g(s,o,r)}}updateChild(e,n){const i=v(e);if(i===null)return n;{f(v(e)!==".priority"||fe(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(i).updateChild(T(e),n);return this.updateImmediateChild(i,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let i=0,s=0,r=!0;if(this.forEachChild(N,(o,a)=>{n[o]=a.val(e),i++,r&&g.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):r=!1}),!e&&r&&s<2*i){const o=[];for(const a in n)o[a]=n[a];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+Mr(this.getPriority().val())+":"),this.forEachChild(N,(n,i)=>{const s=i.hash();s!==""&&(e+=":"+n+":"+s)}),this.lazyHash_=e===""?"":hr(e)}return this.lazyHash_}getPredecessorChildName(e,n,i){const s=this.resolveIndex_(i);if(s){const r=s.getPredecessorKey(new E(e,n));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const i=n.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new E(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const i=n.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new E(n,this.children_.get(n)):null}forEachChild(e,n){const i=this.resolveIndex_(e);return i?i.inorderTraversal(s=>n(s.name,s.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const i=this.resolveIndex_(n);if(i)return i.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,E.Wrap);let r=s.peek();for(;r!=null&&n.compare(r,e)<0;)s.getNext(),r=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const i=this.resolveIndex_(n);if(i)return i.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,E.Wrap);let r=s.peek();for(;r!=null&&n.compare(r,e)>0;)s.getNext(),r=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===bt?-1:0}withIndex(e){if(e===Ue||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new g(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===Ue||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const i=this.getIterator(N),s=n.getIterator(N);let r=i.getNext(),o=s.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=i.getNext(),o=s.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Ue?null:this.indexMap_.get(e.toString())}}g.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Nc extends g{constructor(){super(new V(pi),g.EMPTY_NODE,ie.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return g.EMPTY_NODE}isEmpty(){return!1}}const bt=new Nc;Object.defineProperties(E,{MIN:{value:new E(je,g.EMPTY_NODE)},MAX:{value:new E(we,bt)}});xr.__EMPTY_NODE=g.EMPTY_NODE;D.__childrenNodeConstructor=g;wc(bt);Ic(bt);/**
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
 */const Ac=!0;function A(t,e=null){if(t===null)return g.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),f(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new D(n,A(e))}if(!(t instanceof Array)&&Ac){const n=[];let i=!1;if(B(t,(o,a)=>{if(o.substring(0,1)!=="."){const l=A(a);l.isEmpty()||(i=i||!l.getPriority().isEmpty(),n.push(new E(o,l)))}}),n.length===0)return g.EMPTY_NODE;const r=$t(n,Ec,o=>o.name,pi);if(i){const o=$t(n,N.getCompare());return new g(r,A(e),new ie({".priority":o},{".priority":N}))}else return new g(r,A(e),ie.Default)}else{let n=g.EMPTY_NODE;return B(t,(i,s)=>{if(Q(t,i)&&i.substring(0,1)!=="."){const r=A(s);(r.isLeafNode()||!r.isEmpty())&&(n=n.updateImmediateChild(i,r))}}),n.updatePriority(A(e))}}bc(A);/**
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
 */class kc extends on{constructor(e){super(),this.indexPath_=e,f(!C(e)&&v(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const i=this.extractChild(e.node),s=this.extractChild(n.node),r=i.compareTo(s);return r===0?Ne(e.name,n.name):r}makePost(e,n){const i=A(e),s=g.EMPTY_NODE.updateChild(this.indexPath_,i);return new E(n,s)}maxPost(){const e=g.EMPTY_NODE.updateChild(this.indexPath_,bt);return new E(we,e)}toString(){return ft(this.indexPath_,0).join("/")}}/**
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
 */class Dc extends on{compare(e,n){const i=e.node.compareTo(n.node);return i===0?Ne(e.name,n.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return E.MIN}maxPost(){return E.MAX}makePost(e,n){const i=A(e);return new E(n,i)}toString(){return".value"}}const Pc=new Dc;/**
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
 */function Br(t){return{type:"value",snapshotNode:t}}function qe(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function pt(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function _t(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function Oc(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
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
 */class _i{constructor(e){this.index_=e}updateChild(e,n,i,s,r,o){f(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(n);return a.getChild(s).equals(i.getChild(s))&&a.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(n)?o.trackChildChange(pt(n,a)):f(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(qe(n,i)):o.trackChildChange(_t(n,i,a))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(n,i).withIndex(this.index_)}updateFullNode(e,n,i){return i!=null&&(e.isLeafNode()||e.forEachChild(N,(s,r)=>{n.hasChild(s)||i.trackChildChange(pt(s,r))}),n.isLeafNode()||n.forEachChild(N,(s,r)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(r)||i.trackChildChange(_t(s,r,o))}else i.trackChildChange(qe(s,r))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?g.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
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
 */class mt{constructor(e){this.indexedFilter_=new _i(e.getIndex()),this.index_=e.getIndex(),this.startPost_=mt.getStartPost_(e),this.endPost_=mt.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&i}updateChild(e,n,i,s,r,o){return this.matches(new E(n,i))||(i=g.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,i,s,r,o)}updateFullNode(e,n,i){n.isLeafNode()&&(n=g.EMPTY_NODE);let s=n.withIndex(this.index_);s=s.updatePriority(g.EMPTY_NODE);const r=this;return n.forEachChild(N,(o,a)=>{r.matches(new E(o,a))||(s=s.updateImmediateChild(o,g.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,i)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
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
 */class xc{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=n=>{const i=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new mt(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,i,s,r,o){return this.rangedFilter_.matches(new E(n,i))||(i=g.EMPTY_NODE),e.getImmediateChild(n).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,i,s,r,o):this.fullLimitUpdateChild_(e,n,i,r,o)}updateFullNode(e,n,i){let s;if(n.isLeafNode()||n.isEmpty())s=g.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){s=g.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=n.withIndex(this.index_),s=s.updatePriority(g.EMPTY_NODE);let r;this.reverse_?r=s.getReverseIterator(this.index_):r=s.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,g.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,i)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,i,s,r){let o;if(this.reverse_){const h=this.index_.getCompare();o=(u,p)=>h(p,u)}else o=this.index_.getCompare();const a=e;f(a.numChildren()===this.limit_,"");const l=new E(n,i),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),d=this.rangedFilter_.matches(l);if(a.hasChild(n)){const h=a.getImmediateChild(n);let u=s.getChildAfterChild(this.index_,c,this.reverse_);for(;u!=null&&(u.name===n||a.hasChild(u.name));)u=s.getChildAfterChild(this.index_,u,this.reverse_);const p=u==null?1:o(u,l);if(d&&!i.isEmpty()&&p>=0)return r!=null&&r.trackChildChange(_t(n,i,h)),a.updateImmediateChild(n,i);{r!=null&&r.trackChildChange(pt(n,h));const y=a.updateImmediateChild(n,g.EMPTY_NODE);return u!=null&&this.rangedFilter_.matches(u)?(r!=null&&r.trackChildChange(qe(u.name,u.node)),y.updateImmediateChild(u.name,u.node)):y}}else return i.isEmpty()?e:d&&o(c,l)>=0?(r!=null&&(r.trackChildChange(pt(c.name,c.node)),r.trackChildChange(qe(n,i))),a.updateImmediateChild(n,i).updateImmediateChild(c.name,g.EMPTY_NODE)):e}}/**
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
 */class mi{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=N}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return f(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return f(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:je}hasEnd(){return this.endSet_}getIndexEndValue(){return f(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return f(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:we}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return f(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===N}copy(){const e=new mi;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Mc(t){return t.loadsAllData()?new _i(t.getIndex()):t.hasLimit()?new xc(t):new mt(t)}function gs(t){const e={};if(t.isDefault())return e;let n;if(t.index_===N?n="$priority":t.index_===Pc?n="$value":t.index_===Ue?n="$key":(f(t.index_ instanceof kc,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=O(n),t.startSet_){const i=t.startAfterSet_?"startAfter":"startAt";e[i]=O(t.indexStartValue_),t.startNameSet_&&(e[i]+=","+O(t.indexStartName_))}if(t.endSet_){const i=t.endBeforeSet_?"endBefore":"endAt";e[i]=O(t.indexEndValue_),t.endNameSet_&&(e[i]+=","+O(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function ys(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==N&&(e.i=t.index_.toString()),e}/**
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
 */class jt extends kr{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(f(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,n,i,s){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=i,this.appCheckTokenProvider_=s,this.log_=wt("p:rest:"),this.listens_={}}listen(e,n,i,s){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=jt.getListenId_(e,i),a={};this.listens_[o]=a;const l=gs(e._queryParams);this.restRequest_(r+".json",l,(c,d)=>{let h=d;if(c===404&&(h=null,c=null),c===null&&this.onDataUpdate_(r,h,!1,i),Ee(this.listens_,o)===a){let u;c?c===401?u="permission_denied":u="rest_error:"+c:u="ok",s(u,null)}})}unlisten(e,n){const i=jt.getListenId_(e,n);delete this.listens_[i]}get(e){const n=gs(e._queryParams),i=e._path.toString(),s=new X;return this.restRequest_(i+".json",n,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(i,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,n={},i){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,r])=>{s&&s.accessToken&&(n.auth=s.accessToken),r&&r.token&&(n.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+oa(n);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(i&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=ct(a.responseText)}catch{$("Failed to parse JSON response for "+o+": "+a.responseText)}i(null,l)}else a.status!==401&&a.status!==404&&$("Got unsuccessful REST response for "+o+" Status: "+a.status),i(a.status);i=null}},a.open("GET",o,!0),a.send()})}}/**
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
 */class Lc{constructor(){this.rootNode_=g.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
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
 */function qt(){return{value:null,children:new Map}}function Qe(t,e,n){if(C(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const i=v(e);t.children.has(i)||t.children.set(i,qt());const s=t.children.get(i);e=T(e),Qe(s,e,n)}}function jn(t,e){if(C(e))return t.value=null,t.children.clear(),!0;if(t.value!==null){if(t.value.isLeafNode())return!1;{const n=t.value;return t.value=null,n.forEachChild(N,(i,s)=>{Qe(t,new I(i),s)}),jn(t,e)}}else if(t.children.size>0){const n=v(e);return e=T(e),t.children.has(n)&&jn(t.children.get(n),e)&&t.children.delete(n),t.children.size===0}else return!0}function qn(t,e,n){t.value!==null?n(e,t.value):Fc(t,(i,s)=>{const r=new I(e.toString()+"/"+i);qn(s,r,n)})}function Fc(t,e){t.children.forEach((n,i)=>{e(i,n)})}/**
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
 */class Wc{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n=Object.assign({},e);return this.last_&&B(this.last_,(i,s)=>{n[i]=n[i]-s}),this.last_=e,n}}/**
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
 */const vs=10*1e3,Bc=30*1e3,Uc=5*60*1e3;class Hc{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new Wc(e);const i=vs+(Bc-vs)*Math.random();st(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),n={};let i=!1;B(e,(s,r)=>{r>0&&Q(this.statsToReport_,s)&&(n[s]=r,i=!0)}),i&&this.server_.reportStats(n),st(this.reportStats_.bind(this),Math.floor(Math.random()*2*Uc))}}/**
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
 */var Y;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Y||(Y={}));function Ur(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function gi(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function yi(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
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
 */class Gt{constructor(e,n,i){this.path=e,this.affectedTree=n,this.revert=i,this.type=Y.ACK_USER_WRITE,this.source=Ur()}operationForChild(e){if(C(this.path)){if(this.affectedTree.value!=null)return f(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new I(e));return new Gt(w(),n,this.revert)}}else return f(v(this.path)===e,"operationForChild called for unrelated child."),new Gt(T(this.path),this.affectedTree,this.revert)}}/**
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
 */class gt{constructor(e,n){this.source=e,this.path=n,this.type=Y.LISTEN_COMPLETE}operationForChild(e){return C(this.path)?new gt(this.source,w()):new gt(this.source,T(this.path))}}/**
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
 */class be{constructor(e,n,i){this.source=e,this.path=n,this.snap=i,this.type=Y.OVERWRITE}operationForChild(e){return C(this.path)?new be(this.source,w(),this.snap.getImmediateChild(e)):new be(this.source,T(this.path),this.snap)}}/**
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
 */class yt{constructor(e,n,i){this.source=e,this.path=n,this.children=i,this.type=Y.MERGE}operationForChild(e){if(C(this.path)){const n=this.children.subtree(new I(e));return n.isEmpty()?null:n.value?new be(this.source,w(),n.value):new yt(this.source,w(),n)}else return f(v(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new yt(this.source,T(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
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
 */class Ie{constructor(e,n,i){this.node_=e,this.fullyInitialized_=n,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(C(e))return this.isFullyInitialized()&&!this.filtered_;const n=v(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
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
 */class Vc{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function $c(t,e,n,i){const s=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(Oc(o.childName,o.snapshotNode))}),tt(t,s,"child_removed",e,i,n),tt(t,s,"child_added",e,i,n),tt(t,s,"child_moved",r,i,n),tt(t,s,"child_changed",e,i,n),tt(t,s,"value",e,i,n),s}function tt(t,e,n,i,s,r){const o=i.filter(a=>a.type===n);o.sort((a,l)=>qc(t,a,l)),o.forEach(a=>{const l=jc(t,a,r);s.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,t.query_))})})}function jc(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function qc(t,e,n){if(e.childName==null||n.childName==null)throw Ye("Should only compare child_ events.");const i=new E(e.childName,e.snapshotNode),s=new E(n.childName,n.snapshotNode);return t.index_.compare(i,s)}/**
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
 */function an(t,e){return{eventCache:t,serverCache:e}}function rt(t,e,n,i){return an(new Ie(e,n,i),t.serverCache)}function Hr(t,e,n,i){return an(t.eventCache,new Ie(e,n,i))}function Gn(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function Te(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
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
 */let Rn;const Gc=()=>(Rn||(Rn=new V(kl)),Rn);class R{static fromObject(e){let n=new R(null);return B(e,(i,s)=>{n=n.set(new I(i),s)}),n}constructor(e,n=Gc()){this.value=e,this.children=n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:w(),value:this.value};if(C(e))return null;{const i=v(e),s=this.children.get(i);if(s!==null){const r=s.findRootMostMatchingPathAndValue(T(e),n);return r!=null?{path:k(new I(i),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(C(e))return this;{const n=v(e),i=this.children.get(n);return i!==null?i.subtree(T(e)):new R(null)}}set(e,n){if(C(e))return new R(n,this.children);{const i=v(e),r=(this.children.get(i)||new R(null)).set(T(e),n),o=this.children.insert(i,r);return new R(this.value,o)}}remove(e){if(C(e))return this.children.isEmpty()?new R(null):new R(null,this.children);{const n=v(e),i=this.children.get(n);if(i){const s=i.remove(T(e));let r;return s.isEmpty()?r=this.children.remove(n):r=this.children.insert(n,s),this.value===null&&r.isEmpty()?new R(null):new R(this.value,r)}else return this}}get(e){if(C(e))return this.value;{const n=v(e),i=this.children.get(n);return i?i.get(T(e)):null}}setTree(e,n){if(C(e))return n;{const i=v(e),r=(this.children.get(i)||new R(null)).setTree(T(e),n);let o;return r.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,r),new R(this.value,o)}}fold(e){return this.fold_(w(),e)}fold_(e,n){const i={};return this.children.inorderTraversal((s,r)=>{i[s]=r.fold_(k(e,s),n)}),n(e,this.value,i)}findOnPath(e,n){return this.findOnPath_(e,w(),n)}findOnPath_(e,n,i){const s=this.value?i(n,this.value):!1;if(s)return s;if(C(e))return null;{const r=v(e),o=this.children.get(r);return o?o.findOnPath_(T(e),k(n,r),i):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,w(),n)}foreachOnPath_(e,n,i){if(C(e))return this;{this.value&&i(n,this.value);const s=v(e),r=this.children.get(s);return r?r.foreachOnPath_(T(e),k(n,s),i):new R(null)}}foreach(e){this.foreach_(w(),e)}foreach_(e,n){this.children.inorderTraversal((i,s)=>{s.foreach_(k(e,i),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,i)=>{i.value&&e(n,i.value)})}}/**
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
 */class K{constructor(e){this.writeTree_=e}static empty(){return new K(new R(null))}}function ot(t,e,n){if(C(e))return new K(new R(n));{const i=t.writeTree_.findRootMostValueAndPath(e);if(i!=null){const s=i.path;let r=i.value;const o=H(s,e);return r=r.updateChild(o,n),new K(t.writeTree_.set(s,r))}else{const s=new R(n),r=t.writeTree_.setTree(e,s);return new K(r)}}}function Cs(t,e,n){let i=t;return B(n,(s,r)=>{i=ot(i,k(e,s),r)}),i}function Es(t,e){if(C(e))return K.empty();{const n=t.writeTree_.setTree(e,new R(null));return new K(n)}}function zn(t,e){return Ae(t,e)!=null}function Ae(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild(H(n.path,e)):null}function ws(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(N,(i,s)=>{e.push(new E(i,s))}):t.writeTree_.children.inorderTraversal((i,s)=>{s.value!=null&&e.push(new E(i,s.value))}),e}function de(t,e){if(C(e))return t;{const n=Ae(t,e);return n!=null?new K(new R(n)):new K(t.writeTree_.subtree(e))}}function Yn(t){return t.writeTree_.isEmpty()}function Ge(t,e){return Vr(w(),t.writeTree_,e)}function Vr(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let i=null;return e.children.inorderTraversal((s,r)=>{s===".priority"?(f(r.value!==null,"Priority writes must always be leaf nodes"),i=r.value):n=Vr(k(t,s),r,n)}),!n.getChild(t).isEmpty()&&i!==null&&(n=n.updateChild(k(t,".priority"),i)),n}}/**
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
 */function vi(t,e){return Gr(e,t)}function zc(t,e,n,i,s){f(i>t.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),t.allWrites.push({path:e,snap:n,writeId:i,visible:s}),s&&(t.visibleWrites=ot(t.visibleWrites,e,n)),t.lastWriteId=i}function Yc(t,e){for(let n=0;n<t.allWrites.length;n++){const i=t.allWrites[n];if(i.writeId===e)return i}return null}function Kc(t,e){const n=t.allWrites.findIndex(a=>a.writeId===e);f(n>=0,"removeWrite called with nonexistent writeId.");const i=t.allWrites[n];t.allWrites.splice(n,1);let s=i.visible,r=!1,o=t.allWrites.length-1;for(;s&&o>=0;){const a=t.allWrites[o];a.visible&&(o>=n&&Qc(a,i.path)?s=!1:G(i.path,a.path)&&(r=!0)),o--}if(s){if(r)return Xc(t),!0;if(i.snap)t.visibleWrites=Es(t.visibleWrites,i.path);else{const a=i.children;B(a,l=>{t.visibleWrites=Es(t.visibleWrites,k(i.path,l))})}return!0}else return!1}function Qc(t,e){if(t.snap)return G(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&G(k(t.path,n),e))return!0;return!1}function Xc(t){t.visibleWrites=$r(t.allWrites,Jc,w()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function Jc(t){return t.visible}function $r(t,e,n){let i=K.empty();for(let s=0;s<t.length;++s){const r=t[s];if(e(r)){const o=r.path;let a;if(r.snap)G(n,o)?(a=H(n,o),i=ot(i,a,r.snap)):G(o,n)&&(a=H(o,n),i=ot(i,w(),r.snap.getChild(a)));else if(r.children){if(G(n,o))a=H(n,o),i=Cs(i,a,r.children);else if(G(o,n))if(a=H(o,n),C(a))i=Cs(i,w(),r.children);else{const l=Ee(r.children,v(a));if(l){const c=l.getChild(T(a));i=ot(i,w(),c)}}}else throw Ye("WriteRecord should have .snap or .children")}}return i}function jr(t,e,n,i,s){if(!i&&!s){const r=Ae(t.visibleWrites,e);if(r!=null)return r;{const o=de(t.visibleWrites,e);if(Yn(o))return n;if(n==null&&!zn(o,w()))return null;{const a=n||g.EMPTY_NODE;return Ge(o,a)}}}else{const r=de(t.visibleWrites,e);if(!s&&Yn(r))return n;if(!s&&n==null&&!zn(r,w()))return null;{const o=function(c){return(c.visible||s)&&(!i||!~i.indexOf(c.writeId))&&(G(c.path,e)||G(e,c.path))},a=$r(t.allWrites,o,e),l=n||g.EMPTY_NODE;return Ge(a,l)}}}function Zc(t,e,n){let i=g.EMPTY_NODE;const s=Ae(t.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(N,(r,o)=>{i=i.updateImmediateChild(r,o)}),i;if(n){const r=de(t.visibleWrites,e);return n.forEachChild(N,(o,a)=>{const l=Ge(de(r,new I(o)),a);i=i.updateImmediateChild(o,l)}),ws(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const r=de(t.visibleWrites,e);return ws(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function eu(t,e,n,i,s){f(i||s,"Either existingEventSnap or existingServerSnap must exist");const r=k(e,n);if(zn(t.visibleWrites,r))return null;{const o=de(t.visibleWrites,r);return Yn(o)?s.getChild(n):Ge(o,s.getChild(n))}}function tu(t,e,n,i){const s=k(e,n),r=Ae(t.visibleWrites,s);if(r!=null)return r;if(i.isCompleteForChild(n)){const o=de(t.visibleWrites,s);return Ge(o,i.getNode().getImmediateChild(n))}else return null}function nu(t,e){return Ae(t.visibleWrites,e)}function iu(t,e,n,i,s,r,o){let a;const l=de(t.visibleWrites,e),c=Ae(l,w());if(c!=null)a=c;else if(n!=null)a=Ge(l,n);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const d=[],h=o.getCompare(),u=r?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o);let p=u.getNext();for(;p&&d.length<s;)h(p,i)!==0&&d.push(p),p=u.getNext();return d}else return[]}function su(){return{visibleWrites:K.empty(),allWrites:[],lastWriteId:-1}}function zt(t,e,n,i){return jr(t.writeTree,t.treePath,e,n,i)}function Ci(t,e){return Zc(t.writeTree,t.treePath,e)}function bs(t,e,n,i){return eu(t.writeTree,t.treePath,e,n,i)}function Yt(t,e){return nu(t.writeTree,k(t.treePath,e))}function ru(t,e,n,i,s,r){return iu(t.writeTree,t.treePath,e,n,i,s,r)}function Ei(t,e,n){return tu(t.writeTree,t.treePath,e,n)}function qr(t,e){return Gr(k(t.treePath,e),t.writeTree)}function Gr(t,e){return{treePath:t,writeTree:e}}/**
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
 */class ou{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,i=e.childName;f(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),f(i!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(i);if(s){const r=s.type;if(n==="child_added"&&r==="child_removed")this.changeMap.set(i,_t(i,e.snapshotNode,s.snapshotNode));else if(n==="child_removed"&&r==="child_added")this.changeMap.delete(i);else if(n==="child_removed"&&r==="child_changed")this.changeMap.set(i,pt(i,s.oldSnap));else if(n==="child_changed"&&r==="child_added")this.changeMap.set(i,qe(i,e.snapshotNode));else if(n==="child_changed"&&r==="child_changed")this.changeMap.set(i,_t(i,e.snapshotNode,s.oldSnap));else throw Ye("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
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
 */class au{getCompleteChild(e){return null}getChildAfterChild(e,n,i){return null}}const zr=new au;class wi{constructor(e,n,i=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=i}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new Ie(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Ei(this.writes_,e,i)}}getChildAfterChild(e,n,i){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Te(this.viewCache_),r=ru(this.writes_,s,n,1,i,e);return r.length===0?null:r[0]}}/**
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
 */function lu(t){return{filter:t}}function cu(t,e){f(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),f(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function uu(t,e,n,i,s){const r=new ou;let o,a;if(n.type===Y.OVERWRITE){const c=n;c.source.fromUser?o=Kn(t,e,c.path,c.snap,i,s,r):(f(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!C(c.path),o=Kt(t,e,c.path,c.snap,i,s,a,r))}else if(n.type===Y.MERGE){const c=n;c.source.fromUser?o=du(t,e,c.path,c.children,i,s,r):(f(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=Qn(t,e,c.path,c.children,i,s,a,r))}else if(n.type===Y.ACK_USER_WRITE){const c=n;c.revert?o=_u(t,e,c.path,i,s,r):o=fu(t,e,c.path,c.affectedTree,i,s,r)}else if(n.type===Y.LISTEN_COMPLETE)o=pu(t,e,n.path,i,r);else throw Ye("Unknown operation type: "+n.type);const l=r.getChanges();return hu(e,o,l),{viewCache:o,changes:l}}function hu(t,e,n){const i=e.eventCache;if(i.isFullyInitialized()){const s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=Gn(t);(n.length>0||!t.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&n.push(Br(Gn(e)))}}function Yr(t,e,n,i,s,r){const o=e.eventCache;if(Yt(i,n)!=null)return e;{let a,l;if(C(n))if(f(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=Te(e),d=c instanceof g?c:g.EMPTY_NODE,h=Ci(i,d);a=t.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const c=zt(i,Te(e));a=t.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=v(n);if(c===".priority"){f(fe(n)===1,"Can't have a priority with additional path components");const d=o.getNode();l=e.serverCache.getNode();const h=bs(i,n,d,l);h!=null?a=t.filter.updatePriority(d,h):a=o.getNode()}else{const d=T(n);let h;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const u=bs(i,n,o.getNode(),l);u!=null?h=o.getNode().getImmediateChild(c).updateChild(d,u):h=o.getNode().getImmediateChild(c)}else h=Ei(i,c,e.serverCache);h!=null?a=t.filter.updateChild(o.getNode(),c,h,d,s,r):a=o.getNode()}}return rt(e,a,o.isFullyInitialized()||C(n),t.filter.filtersNodes())}}function Kt(t,e,n,i,s,r,o,a){const l=e.serverCache;let c;const d=o?t.filter:t.filter.getIndexedFilter();if(C(n))c=d.updateFullNode(l.getNode(),i,null);else if(d.filtersNodes()&&!l.isFiltered()){const p=l.getNode().updateChild(n,i);c=d.updateFullNode(l.getNode(),p,null)}else{const p=v(n);if(!l.isCompleteForPath(n)&&fe(n)>1)return e;const m=T(n),b=l.getNode().getImmediateChild(p).updateChild(m,i);p===".priority"?c=d.updatePriority(l.getNode(),b):c=d.updateChild(l.getNode(),p,b,m,zr,null)}const h=Hr(e,c,l.isFullyInitialized()||C(n),d.filtersNodes()),u=new wi(s,h,r);return Yr(t,h,n,s,u,a)}function Kn(t,e,n,i,s,r,o){const a=e.eventCache;let l,c;const d=new wi(s,e,r);if(C(n))c=t.filter.updateFullNode(e.eventCache.getNode(),i,o),l=rt(e,c,!0,t.filter.filtersNodes());else{const h=v(n);if(h===".priority")c=t.filter.updatePriority(e.eventCache.getNode(),i),l=rt(e,c,a.isFullyInitialized(),a.isFiltered());else{const u=T(n),p=a.getNode().getImmediateChild(h);let m;if(C(u))m=i;else{const y=d.getCompleteChild(h);y!=null?hi(u)===".priority"&&y.getChild(Pr(u)).isEmpty()?m=y:m=y.updateChild(u,i):m=g.EMPTY_NODE}if(p.equals(m))l=e;else{const y=t.filter.updateChild(a.getNode(),h,m,u,d,o);l=rt(e,y,a.isFullyInitialized(),t.filter.filtersNodes())}}}return l}function Is(t,e){return t.eventCache.isCompleteForChild(e)}function du(t,e,n,i,s,r,o){let a=e;return i.foreach((l,c)=>{const d=k(n,l);Is(e,v(d))&&(a=Kn(t,a,d,c,s,r,o))}),i.foreach((l,c)=>{const d=k(n,l);Is(e,v(d))||(a=Kn(t,a,d,c,s,r,o))}),a}function Ts(t,e,n){return n.foreach((i,s)=>{e=e.updateChild(i,s)}),e}function Qn(t,e,n,i,s,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;C(n)?c=i:c=new R(null).setTree(n,i);const d=e.serverCache.getNode();return c.children.inorderTraversal((h,u)=>{if(d.hasChild(h)){const p=e.serverCache.getNode().getImmediateChild(h),m=Ts(t,p,u);l=Kt(t,l,new I(h),m,s,r,o,a)}}),c.children.inorderTraversal((h,u)=>{const p=!e.serverCache.isCompleteForChild(h)&&u.value===null;if(!d.hasChild(h)&&!p){const m=e.serverCache.getNode().getImmediateChild(h),y=Ts(t,m,u);l=Kt(t,l,new I(h),y,s,r,o,a)}}),l}function fu(t,e,n,i,s,r,o){if(Yt(s,n)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(i.value!=null){if(C(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return Kt(t,e,n,l.getNode().getChild(n),s,r,a,o);if(C(n)){let c=new R(null);return l.getNode().forEachChild(Ue,(d,h)=>{c=c.set(new I(d),h)}),Qn(t,e,n,c,s,r,a,o)}else return e}else{let c=new R(null);return i.foreach((d,h)=>{const u=k(n,d);l.isCompleteForPath(u)&&(c=c.set(d,l.getNode().getChild(u)))}),Qn(t,e,n,c,s,r,a,o)}}function pu(t,e,n,i,s){const r=e.serverCache,o=Hr(e,r.getNode(),r.isFullyInitialized()||C(n),r.isFiltered());return Yr(t,o,n,i,zr,s)}function _u(t,e,n,i,s,r){let o;if(Yt(i,n)!=null)return e;{const a=new wi(i,e,s),l=e.eventCache.getNode();let c;if(C(n)||v(n)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=zt(i,Te(e));else{const h=e.serverCache.getNode();f(h instanceof g,"serverChildren would be complete if leaf node"),d=Ci(i,h)}d=d,c=t.filter.updateFullNode(l,d,r)}else{const d=v(n);let h=Ei(i,d,e.serverCache);h==null&&e.serverCache.isCompleteForChild(d)&&(h=l.getImmediateChild(d)),h!=null?c=t.filter.updateChild(l,d,h,T(n),a,r):e.eventCache.getNode().hasChild(d)?c=t.filter.updateChild(l,d,g.EMPTY_NODE,T(n),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=zt(i,Te(e)),o.isLeafNode()&&(c=t.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||Yt(i,w())!=null,rt(e,c,o,t.filter.filtersNodes())}}/**
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
 */class mu{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,s=new _i(i.getIndex()),r=Mc(i);this.processor_=lu(r);const o=n.serverCache,a=n.eventCache,l=s.updateFullNode(g.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(g.EMPTY_NODE,a.getNode(),null),d=new Ie(l,o.isFullyInitialized(),s.filtersNodes()),h=new Ie(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=an(h,d),this.eventGenerator_=new Vc(this.query_)}get query(){return this.query_}}function gu(t){return t.viewCache_.serverCache.getNode()}function yu(t,e){const n=Te(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!C(e)&&!n.getImmediateChild(v(e)).isEmpty())?n.getChild(e):null}function Ss(t){return t.eventRegistrations_.length===0}function vu(t,e){t.eventRegistrations_.push(e)}function Rs(t,e,n){const i=[];if(n){f(e==null,"A cancel should cancel all event registrations.");const s=t.query._path;t.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(n,s);o&&i.push(o)})}if(e){let s=[];for(let r=0;r<t.eventRegistrations_.length;++r){const o=t.eventRegistrations_[r];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(t.eventRegistrations_.slice(r+1));break}}t.eventRegistrations_=s}else t.eventRegistrations_=[];return i}function Ns(t,e,n,i){e.type===Y.MERGE&&e.source.queryId!==null&&(f(Te(t.viewCache_),"We should always have a full cache before handling merges"),f(Gn(t.viewCache_),"Missing event cache, even though we have a server cache"));const s=t.viewCache_,r=uu(t.processor_,s,e,n,i);return cu(t.processor_,r.viewCache),f(r.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=r.viewCache,Kr(t,r.changes,r.viewCache.eventCache.getNode(),null)}function Cu(t,e){const n=t.viewCache_.eventCache,i=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(N,(r,o)=>{i.push(qe(r,o))}),n.isFullyInitialized()&&i.push(Br(n.getNode())),Kr(t,i,n.getNode(),e)}function Kr(t,e,n,i){const s=i?[i]:t.eventRegistrations_;return $c(t.eventGenerator_,e,n,s)}/**
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
 */let Qt;class Eu{constructor(){this.views=new Map}}function wu(t){f(!Qt,"__referenceConstructor has already been defined"),Qt=t}function bu(){return f(Qt,"Reference.ts has not been loaded"),Qt}function Iu(t){return t.views.size===0}function bi(t,e,n,i){const s=e.source.queryId;if(s!==null){const r=t.views.get(s);return f(r!=null,"SyncTree gave us an op for an invalid query."),Ns(r,e,n,i)}else{let r=[];for(const o of t.views.values())r=r.concat(Ns(o,e,n,i));return r}}function Tu(t,e,n,i,s){const r=e._queryIdentifier,o=t.views.get(r);if(!o){let a=zt(n,s?i:null),l=!1;a?l=!0:i instanceof g?(a=Ci(n,i),l=!1):(a=g.EMPTY_NODE,l=!1);const c=an(new Ie(a,l,!1),new Ie(i,s,!1));return new mu(e,c)}return o}function Su(t,e,n,i,s,r){const o=Tu(t,e,i,s,r);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),vu(o,n),Cu(o,n)}function Ru(t,e,n,i){const s=e._queryIdentifier,r=[];let o=[];const a=pe(t);if(s==="default")for(const[l,c]of t.views.entries())o=o.concat(Rs(c,n,i)),Ss(c)&&(t.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=t.views.get(s);l&&(o=o.concat(Rs(l,n,i)),Ss(l)&&(t.views.delete(s),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!pe(t)&&r.push(new(bu())(e._repo,e._path)),{removed:r,events:o}}function Qr(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function He(t,e){let n=null;for(const i of t.views.values())n=n||yu(i,e);return n}function Xr(t,e){if(e._queryParams.loadsAllData())return ln(t);{const i=e._queryIdentifier;return t.views.get(i)}}function Jr(t,e){return Xr(t,e)!=null}function pe(t){return ln(t)!=null}function ln(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
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
 */let Xt;function Nu(t){f(!Xt,"__referenceConstructor has already been defined"),Xt=t}function Au(){return f(Xt,"Reference.ts has not been loaded"),Xt}let ku=1;class As{constructor(e){this.listenProvider_=e,this.syncPointTree_=new R(null),this.pendingWriteTree_=su(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Ii(t,e,n,i,s){return zc(t.pendingWriteTree_,e,n,i,s),s?It(t,new be(Ur(),e,n)):[]}function ve(t,e,n=!1){const i=Yc(t.pendingWriteTree_,e);if(Kc(t.pendingWriteTree_,e)){let r=new R(null);return i.snap!=null?r=r.set(w(),!0):B(i.children,o=>{r=r.set(new I(o),!0)}),It(t,new Gt(i.path,r,n))}else return[]}function cn(t,e,n){return It(t,new be(gi(),e,n))}function Du(t,e,n){const i=R.fromObject(n);return It(t,new yt(gi(),e,i))}function Pu(t,e){return It(t,new gt(gi(),e))}function Ou(t,e,n){const i=Ti(t,n);if(i){const s=Si(i),r=s.path,o=s.queryId,a=H(r,e),l=new gt(yi(o),a);return Ri(t,r,l)}else return[]}function Xn(t,e,n,i,s=!1){const r=e._path,o=t.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||Jr(o,e))){const l=Ru(o,e,n,i);Iu(o)&&(t.syncPointTree_=t.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!s){const d=c.findIndex(u=>u._queryParams.loadsAllData())!==-1,h=t.syncPointTree_.findOnPath(r,(u,p)=>pe(p));if(d&&!h){const u=t.syncPointTree_.subtree(r);if(!u.isEmpty()){const p=Lu(u);for(let m=0;m<p.length;++m){const y=p[m],b=y.query,M=to(t,y);t.listenProvider_.startListening(at(b),Jt(t,b),M.hashFn,M.onComplete)}}}!h&&c.length>0&&!i&&(d?t.listenProvider_.stopListening(at(e),null):c.forEach(u=>{const p=t.queryToTagMap.get(hn(u));t.listenProvider_.stopListening(at(u),p)}))}Fu(t,c)}return a}function xu(t,e,n,i){const s=Ti(t,i);if(s!=null){const r=Si(s),o=r.path,a=r.queryId,l=H(o,e),c=new be(yi(a),l,n);return Ri(t,o,c)}else return[]}function Mu(t,e,n,i){const s=Ti(t,i);if(s){const r=Si(s),o=r.path,a=r.queryId,l=H(o,e),c=R.fromObject(n),d=new yt(yi(a),l,c);return Ri(t,o,d)}else return[]}function ks(t,e,n,i=!1){const s=e._path;let r=null,o=!1;t.syncPointTree_.foreachOnPath(s,(u,p)=>{const m=H(u,s);r=r||He(p,m),o=o||pe(p)});let a=t.syncPointTree_.get(s);a?(o=o||pe(a),r=r||He(a,w())):(a=new Eu,t.syncPointTree_=t.syncPointTree_.set(s,a));let l;r!=null?l=!0:(l=!1,r=g.EMPTY_NODE,t.syncPointTree_.subtree(s).foreachChild((p,m)=>{const y=He(m,w());y&&(r=r.updateImmediateChild(p,y))}));const c=Jr(a,e);if(!c&&!e._queryParams.loadsAllData()){const u=hn(e);f(!t.queryToTagMap.has(u),"View does not exist, but we have a tag");const p=Wu();t.queryToTagMap.set(u,p),t.tagToQueryMap.set(p,u)}const d=vi(t.pendingWriteTree_,s);let h=Su(a,e,n,d,r,l);if(!c&&!o&&!i){const u=Xr(a,e);h=h.concat(Bu(t,e,u))}return h}function un(t,e,n){const s=t.pendingWriteTree_,r=t.syncPointTree_.findOnPath(e,(o,a)=>{const l=H(o,e),c=He(a,l);if(c)return c});return jr(s,e,r,n,!0)}function It(t,e){return Zr(e,t.syncPointTree_,null,vi(t.pendingWriteTree_,w()))}function Zr(t,e,n,i){if(C(t.path))return eo(t,e,n,i);{const s=e.get(w());n==null&&s!=null&&(n=He(s,w()));let r=[];const o=v(t.path),a=t.operationForChild(o),l=e.children.get(o);if(l&&a){const c=n?n.getImmediateChild(o):null,d=qr(i,o);r=r.concat(Zr(a,l,c,d))}return s&&(r=r.concat(bi(s,t,i,n))),r}}function eo(t,e,n,i){const s=e.get(w());n==null&&s!=null&&(n=He(s,w()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=n?n.getImmediateChild(o):null,c=qr(i,o),d=t.operationForChild(o);d&&(r=r.concat(eo(d,a,l,c)))}),s&&(r=r.concat(bi(s,t,i,n))),r}function to(t,e){const n=e.query,i=Jt(t,n);return{hashFn:()=>(gu(e)||g.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return i?Ou(t,n._path,i):Pu(t,n._path);{const r=Ol(s,n);return Xn(t,n,null,r)}}}}function Jt(t,e){const n=hn(e);return t.queryToTagMap.get(n)}function hn(t){return t._path.toString()+"$"+t._queryIdentifier}function Ti(t,e){return t.tagToQueryMap.get(e)}function Si(t){const e=t.indexOf("$");return f(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new I(t.substr(0,e))}}function Ri(t,e,n){const i=t.syncPointTree_.get(e);f(i,"Missing sync point for query tag that we're tracking");const s=vi(t.pendingWriteTree_,e);return bi(i,n,s,null)}function Lu(t){return t.fold((e,n,i)=>{if(n&&pe(n))return[ln(n)];{let s=[];return n&&(s=Qr(n)),B(i,(r,o)=>{s=s.concat(o)}),s}})}function at(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new(Au())(t._repo,t._path):t}function Fu(t,e){for(let n=0;n<e.length;++n){const i=e[n];if(!i._queryParams.loadsAllData()){const s=hn(i),r=t.queryToTagMap.get(s);t.queryToTagMap.delete(s),t.tagToQueryMap.delete(r)}}}function Wu(){return ku++}function Bu(t,e,n){const i=e._path,s=Jt(t,e),r=to(t,n),o=t.listenProvider_.startListening(at(e),s,r.hashFn,r.onComplete),a=t.syncPointTree_.subtree(i);if(s)f(!pe(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,d,h)=>{if(!C(c)&&d&&pe(d))return[ln(d).query];{let u=[];return d&&(u=u.concat(Qr(d).map(p=>p.query))),B(h,(p,m)=>{u=u.concat(m)}),u}});for(let c=0;c<l.length;++c){const d=l[c];t.listenProvider_.stopListening(at(d),Jt(t,d))}}return o}/**
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
 */class Ni{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new Ni(n)}node(){return this.node_}}class Ai{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=k(this.path_,e);return new Ai(this.syncTree_,n)}node(){return un(this.syncTree_,this.path_)}}const Uu=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},Ds=function(t,e,n){if(!t||typeof t!="object")return t;if(f(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return Hu(t[".sv"],e,n);if(typeof t[".sv"]=="object")return Vu(t[".sv"],e);f(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},Hu=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:f(!1,"Unexpected server value: "+t)}},Vu=function(t,e,n){t.hasOwnProperty("increment")||f(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const i=t.increment;typeof i!="number"&&f(!1,"Unexpected increment value: "+i);const s=e.node();if(f(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;const o=s.getValue();return typeof o!="number"?i:o+i},$u=function(t,e,n,i){return Di(e,new Ai(n,t),i)},ki=function(t,e,n){return Di(t,new Ni(e),n)};function Di(t,e,n){const i=t.getPriority().val(),s=Ds(i,e.getImmediateChild(".priority"),n);let r;if(t.isLeafNode()){const o=t,a=Ds(o.getValue(),e,n);return a!==o.getValue()||s!==o.getPriority().val()?new D(a,A(s)):t}else{const o=t;return r=o,s!==o.getPriority().val()&&(r=r.updatePriority(new D(s))),o.forEachChild(N,(a,l)=>{const c=Di(l,e.getImmediateChild(a),n);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
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
 */class Pi{constructor(e="",n=null,i={children:{},childCount:0}){this.name=e,this.parent=n,this.node=i}}function dn(t,e){let n=e instanceof I?e:new I(e),i=t,s=v(n);for(;s!==null;){const r=Ee(i.node.children,s)||{children:{},childCount:0};i=new Pi(s,i,r),n=T(n),s=v(n)}return i}function ke(t){return t.node.value}function Oi(t,e){t.node.value=e,Jn(t)}function no(t){return t.node.childCount>0}function ju(t){return ke(t)===void 0&&!no(t)}function fn(t,e){B(t.node.children,(n,i)=>{e(new Pi(n,t,i))})}function io(t,e,n,i){n&&e(t),fn(t,s=>{io(s,e,!0)})}function qu(t,e,n){let i=t.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function Tt(t){return new I(t.parent===null?t.name:Tt(t.parent)+"/"+t.name)}function Jn(t){t.parent!==null&&Gu(t.parent,t.name,t)}function Gu(t,e,n){const i=ju(n),s=Q(t.node.children,e);i&&s?(delete t.node.children[e],t.node.childCount--,Jn(t)):!i&&!s&&(t.node.children[e]=n.node,t.node.childCount++,Jn(t))}/**
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
 */const zu=/[\[\].#$\/\u0000-\u001F\u007F]/,Yu=/[\[\].#$\u0000-\u001F\u007F]/,Nn=10*1024*1024,xi=function(t){return typeof t=="string"&&t.length!==0&&!zu.test(t)},so=function(t){return typeof t=="string"&&t.length!==0&&!Yu.test(t)},Ku=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),so(t)},Mi=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!rn(t)||t&&typeof t=="object"&&Q(t,".sv")},Zn=function(t,e,n,i){St($e(t,"value"),e,n)},St=function(t,e,n){const i=n instanceof I?new fc(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+ge(i));if(typeof e=="function")throw new Error(t+"contains a function "+ge(i)+" with contents = "+e.toString());if(rn(e))throw new Error(t+"contains "+e.toString()+" "+ge(i));if(typeof e=="string"&&e.length>Nn/3&&sn(e)>Nn)throw new Error(t+"contains a string greater than "+Nn+" utf8 bytes "+ge(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,r=!1;if(B(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!xi(o)))throw new Error(t+" contains an invalid key ("+o+") "+ge(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);pc(i,o),St(t,a,i),_c(i)}),s&&r)throw new Error(t+' contains ".value" child '+ge(i)+" in addition to actual children.")}},Qu=function(t,e){let n,i;for(n=0;n<e.length;n++){i=e[n];const r=ft(i);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!xi(r[o]))throw new Error(t+"contains an invalid key ("+r[o]+") in path "+i.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(dc);let s=null;for(n=0;n<e.length;n++){if(i=e[n],s!==null&&G(s,i))throw new Error(t+"contains a path "+s.toString()+" that is ancestor of another path "+i.toString());s=i}},Xu=function(t,e,n,i){const s=$e(t,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(s+" must be an object containing the children to replace.");const r=[];B(e,(o,a)=>{const l=new I(o);if(St(s,a,k(n,l)),hi(l)===".priority"&&!Mi(a))throw new Error(s+"contains an invalid value for '"+l.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(l)}),Qu(s,r)},Ju=function(t,e,n){if(rn(e))throw new Error($e(t,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Mi(e))throw new Error($e(t,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},ro=function(t,e,n,i){if(!so(n))throw new Error($e(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Zu=function(t,e,n,i){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),ro(t,e,n)},Le=function(t,e){if(v(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},eh=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!xi(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!Ku(n))throw new Error($e(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
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
 */class th{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Li(t,e){let n=null;for(let i=0;i<e.length;i++){const s=e[i],r=s.getPath();n!==null&&!di(r,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:r}),n.events.push(s)}n&&t.eventLists_.push(n)}function oo(t,e,n){Li(t,n),ao(t,i=>di(i,e))}function Z(t,e,n){Li(t,n),ao(t,i=>G(i,e)||G(e,i))}function ao(t,e){t.recursionDepth_++;let n=!0;for(let i=0;i<t.eventLists_.length;i++){const s=t.eventLists_[i];if(s){const r=s.path;e(r)?(nh(t.eventLists_[i]),t.eventLists_[i]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function nh(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const i=n.getEventRunner();it&&L("event: "+n.toString()),Ke(i)}}}/**
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
 */const ih="repo_interrupt",sh=25;class rh{constructor(e,n,i,s){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=i,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new th,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=qt(),this.transactionQueueTree_=new Pi,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function oh(t,e,n){if(t.stats_=ci(t.repoInfo_),t.forceRestClient_||Fl())t.server_=new jt(t.repoInfo_,(i,s,r,o)=>{Ps(t,i,s,r,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>Os(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{O(n)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}t.persistentConnection_=new se(t.repoInfo_,e,(i,s,r,o)=>{Ps(t,i,s,r,o)},i=>{Os(t,i)},i=>{lh(t,i)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(i=>{t.server_.refreshAuthToken(i)}),t.appCheckProvider_.addTokenChangeListener(i=>{t.server_.refreshAppCheckToken(i.token)}),t.statsReporter_=Vl(t.repoInfo_,()=>new Hc(t.stats_,t.server_)),t.infoData_=new Lc,t.infoSyncTree_=new As({startListening:(i,s,r,o)=>{let a=[];const l=t.infoData_.getNode(i._path);return l.isEmpty()||(a=cn(t.infoSyncTree_,i._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),Fi(t,"connected",!1),t.serverSyncTree_=new As({startListening:(i,s,r,o)=>(t.server_.listen(i,r,s,(a,l)=>{const c=o(a,l);Z(t.eventQueue_,i._path,c)}),[]),stopListening:(i,s)=>{t.server_.unlisten(i,s)}})}function ah(t){const n=t.infoData_.getNode(new I(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function pn(t){return Uu({timestamp:ah(t)})}function Ps(t,e,n,i,s){t.dataUpdateCount++;const r=new I(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(s)if(i){const l=Ft(n,c=>A(c));o=Mu(t.serverSyncTree_,r,l,s)}else{const l=A(n);o=xu(t.serverSyncTree_,r,l,s)}else if(i){const l=Ft(n,c=>A(c));o=Du(t.serverSyncTree_,r,l)}else{const l=A(n);o=cn(t.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=gn(t,r)),Z(t.eventQueue_,a,o)}function Os(t,e){Fi(t,"connected",e),e===!1&&uh(t)}function lh(t,e){B(e,(n,i)=>{Fi(t,n,i)})}function Fi(t,e,n){const i=new I("/.info/"+e),s=A(n);t.infoData_.updateSnapshot(i,s);const r=cn(t.infoSyncTree_,i,s);Z(t.eventQueue_,i,r)}function Wi(t){return t.nextWriteId_++}function ch(t,e,n,i,s){_n(t,"set",{path:e.toString(),value:n,priority:i});const r=pn(t),o=A(n,i),a=un(t.serverSyncTree_,e),l=ki(o,a,r),c=Wi(t),d=Ii(t.serverSyncTree_,e,l,c,!0);Li(t.eventQueue_,d),t.server_.put(e.toString(),o.val(!0),(u,p)=>{const m=u==="ok";m||$("set at "+e+" failed: "+u);const y=ve(t.serverSyncTree_,c,!m);Z(t.eventQueue_,e,y),ze(t,s,u,p)});const h=ho(t,e);gn(t,h),Z(t.eventQueue_,h,[])}function uh(t){_n(t,"onDisconnectEvents");const e=pn(t),n=qt();qn(t.onDisconnect_,w(),(s,r)=>{const o=$u(s,r,t.serverSyncTree_,e);Qe(n,s,o)});let i=[];qn(n,w(),(s,r)=>{i=i.concat(cn(t.serverSyncTree_,s,r));const o=ho(t,s);gn(t,o)}),t.onDisconnect_=qt(),Z(t.eventQueue_,w(),i)}function hh(t,e,n){t.server_.onDisconnectCancel(e.toString(),(i,s)=>{i==="ok"&&jn(t.onDisconnect_,e),ze(t,n,i,s)})}function xs(t,e,n,i){const s=A(n);t.server_.onDisconnectPut(e.toString(),s.val(!0),(r,o)=>{r==="ok"&&Qe(t.onDisconnect_,e,s),ze(t,i,r,o)})}function dh(t,e,n,i,s){const r=A(n,i);t.server_.onDisconnectPut(e.toString(),r.val(!0),(o,a)=>{o==="ok"&&Qe(t.onDisconnect_,e,r),ze(t,s,o,a)})}function fh(t,e,n,i){if(Mn(n)){L("onDisconnect().update() called with empty data.  Don't do anything."),ze(t,i,"ok",void 0);return}t.server_.onDisconnectMerge(e.toString(),n,(s,r)=>{s==="ok"&&B(n,(o,a)=>{const l=A(a);Qe(t.onDisconnect_,k(e,o),l)}),ze(t,i,s,r)})}function ph(t,e,n){let i;v(e._path)===".info"?i=ks(t.infoSyncTree_,e,n):i=ks(t.serverSyncTree_,e,n),oo(t.eventQueue_,e._path,i)}function Ms(t,e,n){let i;v(e._path)===".info"?i=Xn(t.infoSyncTree_,e,n):i=Xn(t.serverSyncTree_,e,n),oo(t.eventQueue_,e._path,i)}function _h(t){t.persistentConnection_&&t.persistentConnection_.interrupt(ih)}function _n(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),L(n,...e)}function ze(t,e,n,i){e&&Ke(()=>{if(n==="ok")e(null);else{const s=(n||"error").toUpperCase();let r=s;i&&(r+=": "+i);const o=new Error(r);o.code=s,e(o)}})}function mh(t,e,n,i,s,r){_n(t,"transaction on "+e);const o={path:e,update:n,onComplete:i,status:null,order:ur(),applyLocally:r,retryCount:0,unwatcher:s,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=Bi(t,e,void 0);o.currentInputSnapshot=a;const l=o.update(a.val());if(l===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{St("transaction failed: Data returned ",l,o.path),o.status=0;const c=dn(t.transactionQueueTree_,e),d=ke(c)||[];d.push(o),Oi(c,d);let h;typeof l=="object"&&l!==null&&Q(l,".priority")?(h=Ee(l,".priority"),f(Mi(h),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):h=(un(t.serverSyncTree_,e)||g.EMPTY_NODE).getPriority().val();const u=pn(t),p=A(l,h),m=ki(p,a,u);o.currentOutputSnapshotRaw=p,o.currentOutputSnapshotResolved=m,o.currentWriteId=Wi(t);const y=Ii(t.serverSyncTree_,e,m,o.currentWriteId,o.applyLocally);Z(t.eventQueue_,e,y),mn(t,t.transactionQueueTree_)}}function Bi(t,e,n){return un(t.serverSyncTree_,e,n)||g.EMPTY_NODE}function mn(t,e=t.transactionQueueTree_){if(e||yn(t,e),ke(e)){const n=co(t,e);f(n.length>0,"Sending zero length transaction queue"),n.every(s=>s.status===0)&&gh(t,Tt(e),n)}else no(e)&&fn(e,n=>{mn(t,n)})}function gh(t,e,n){const i=n.map(c=>c.currentWriteId),s=Bi(t,e,i);let r=s;const o=s.hash();for(let c=0;c<n.length;c++){const d=n[c];f(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const h=H(e,d.path);r=r.updateChild(h,d.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;t.server_.put(l.toString(),a,c=>{_n(t,"transaction put response",{path:l.toString(),status:c});let d=[];if(c==="ok"){const h=[];for(let u=0;u<n.length;u++)n[u].status=2,d=d.concat(ve(t.serverSyncTree_,n[u].currentWriteId)),n[u].onComplete&&h.push(()=>n[u].onComplete(null,!0,n[u].currentOutputSnapshotResolved)),n[u].unwatcher();yn(t,dn(t.transactionQueueTree_,e)),mn(t,t.transactionQueueTree_),Z(t.eventQueue_,e,d);for(let u=0;u<h.length;u++)Ke(h[u])}else{if(c==="datastale")for(let h=0;h<n.length;h++)n[h].status===3?n[h].status=4:n[h].status=0;else{$("transaction at "+l.toString()+" failed: "+c);for(let h=0;h<n.length;h++)n[h].status=4,n[h].abortReason=c}gn(t,e)}},o)}function gn(t,e){const n=lo(t,e),i=Tt(n),s=co(t,n);return yh(t,s,i),i}function yh(t,e,n){if(e.length===0)return;const i=[];let s=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=H(n,l.path);let d=!1,h;if(f(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)d=!0,h=l.abortReason,s=s.concat(ve(t.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=sh)d=!0,h="maxretry",s=s.concat(ve(t.serverSyncTree_,l.currentWriteId,!0));else{const u=Bi(t,l.path,o);l.currentInputSnapshot=u;const p=e[a].update(u.val());if(p!==void 0){St("transaction failed: Data returned ",p,l.path);let m=A(p);typeof p=="object"&&p!=null&&Q(p,".priority")||(m=m.updatePriority(u.getPriority()));const b=l.currentWriteId,M=pn(t),j=ki(m,u,M);l.currentOutputSnapshotRaw=m,l.currentOutputSnapshotResolved=j,l.currentWriteId=Wi(t),o.splice(o.indexOf(b),1),s=s.concat(Ii(t.serverSyncTree_,l.path,j,l.currentWriteId,l.applyLocally)),s=s.concat(ve(t.serverSyncTree_,b,!0))}else d=!0,h="nodata",s=s.concat(ve(t.serverSyncTree_,l.currentWriteId,!0))}Z(t.eventQueue_,n,s),s=[],d&&(e[a].status=2,function(u){setTimeout(u,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(h==="nodata"?i.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):i.push(()=>e[a].onComplete(new Error(h),!1,null))))}yn(t,t.transactionQueueTree_);for(let a=0;a<i.length;a++)Ke(i[a]);mn(t,t.transactionQueueTree_)}function lo(t,e){let n,i=t.transactionQueueTree_;for(n=v(e);n!==null&&ke(i)===void 0;)i=dn(i,n),e=T(e),n=v(e);return i}function co(t,e){const n=[];return uo(t,e,n),n.sort((i,s)=>i.order-s.order),n}function uo(t,e,n){const i=ke(e);if(i)for(let s=0;s<i.length;s++)n.push(i[s]);fn(e,s=>{uo(t,s,n)})}function yn(t,e){const n=ke(e);if(n){let i=0;for(let s=0;s<n.length;s++)n[s].status!==2&&(n[i]=n[s],i++);n.length=i,Oi(e,n.length>0?n:void 0)}fn(e,i=>{yn(t,i)})}function ho(t,e){const n=Tt(lo(t,e)),i=dn(t.transactionQueueTree_,e);return qu(i,s=>{An(t,s)}),An(t,i),io(i,s=>{An(t,s)}),n}function An(t,e){const n=ke(e);if(n){const i=[];let s=[],r=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(f(r===o-1,"All SENT items should be at beginning of queue."),r=o,n[o].status=3,n[o].abortReason="set"):(f(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),s=s.concat(ve(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&i.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Oi(e,void 0):n.length=r+1,Z(t.eventQueue_,Tt(e),s);for(let o=0;o<i.length;o++)Ke(i[o])}}/**
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
 */function vh(t){let e="";const n=t.split("/");for(let i=0;i<n.length;i++)if(n[i].length>0){let s=n[i];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function Ch(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const i=n.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):$(`Invalid query segment '${n}' in query '${t}'`)}return e}const Ls=function(t,e){const n=Eh(t),i=n.namespace;n.domain==="firebase.com"&&oe(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&n.domain!=="localhost"&&oe("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||Nl();const s=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new br(n.host,n.secure,i,s,e,"",i!==n.subdomain),path:new I(n.pathString)}},Eh=function(t){let e="",n="",i="",s="",r="",o=!0,a="https",l=443;if(typeof t=="string"){let c=t.indexOf("//");c>=0&&(a=t.substring(0,c-1),t=t.substring(c+2));let d=t.indexOf("/");d===-1&&(d=t.length);let h=t.indexOf("?");h===-1&&(h=t.length),e=t.substring(0,Math.min(d,h)),d<h&&(s=vh(t.substring(d,h)));const u=Ch(t.substring(Math.min(t.length,h)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const p=e.slice(0,c);if(p.toLowerCase()==="localhost")n="localhost";else if(p.split(".").length<=2)n=p;else{const m=e.indexOf(".");i=e.substring(0,m).toLowerCase(),n=e.substring(m+1),r=i}"ns"in u&&(r=u.ns)}return{host:e,port:l,domain:n,subdomain:i,secure:o,scheme:a,pathString:s,namespace:r}};/**
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
 */class wh{constructor(e,n,i,s){this.eventType=e,this.eventRegistration=n,this.snapshot=i,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+O(this.snapshot.exportVal())}}class bh{constructor(e,n,i){this.eventRegistration=e,this.error=n,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
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
 */class Ih{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return f(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class Th{constructor(e,n){this._repo=e,this._path=n}cancel(){const e=new X;return hh(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){Le("OnDisconnect.remove",this._path);const e=new X;return xs(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){Le("OnDisconnect.set",this._path),Zn("OnDisconnect.set",e,this._path);const n=new X;return xs(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}setWithPriority(e,n){Le("OnDisconnect.setWithPriority",this._path),Zn("OnDisconnect.setWithPriority",e,this._path),Ju("OnDisconnect.setWithPriority",n);const i=new X;return dh(this._repo,this._path,e,n,i.wrapCallback(()=>{})),i.promise}update(e){Le("OnDisconnect.update",this._path),Xu("OnDisconnect.update",e,this._path);const n=new X;return fh(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}}/**
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
 */class Ui{constructor(e,n,i,s){this._repo=e,this._path=n,this._queryParams=i,this._orderByCalled=s}get key(){return C(this._path)?null:hi(this._path)}get ref(){return new ae(this._repo,this._path)}get _queryIdentifier(){const e=ys(this._queryParams),n=ai(e);return n==="{}"?"default":n}get _queryObject(){return ys(this._queryParams)}isEqual(e){if(e=Re(e),!(e instanceof Ui))return!1;const n=this._repo===e._repo,i=di(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return n&&i&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+hc(this._path)}}class ae extends Ui{constructor(e,n){super(e,n,new mi,!1)}get parent(){const e=Pr(this._path);return e===null?null:new ae(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class vt{constructor(e,n,i){this._node=e,this.ref=n,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new I(e),i=ei(this.ref,e);return new vt(this._node.getChild(n),i,N)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,s)=>e(new vt(s,ei(this.ref,i),N)))}hasChild(e){const n=new I(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function xt(t,e){return t=Re(t),t._checkNotDeleted("ref"),e!==void 0?ei(t._root,e):t._root}function ei(t,e){return t=Re(t),v(t._path)===null?Zu("child","path",e):ro("child","path",e),new ae(t._repo,k(t._path,e))}function Sh(t){return t=Re(t),new Th(t._repo,t._path)}function Fs(t,e){t=Re(t),Le("set",t._path),Zn("set",e,t._path);const n=new X;return ch(t._repo,t._path,e,null,n.wrapCallback(()=>{})),n.promise}class Hi{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const i=n._queryParams.getIndex();return new wh("value",this,new vt(e.snapshotNode,new ae(n._repo,n._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new bh(this,e,n):null}matches(e){return e instanceof Hi?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function Rh(t,e,n,i,s){let r;if(typeof i=="object"&&(r=void 0,s=i),typeof i=="function"&&(r=i),s&&s.onlyOnce){const l=n,c=(d,h)=>{Ms(t._repo,t,a),l(d,h)};c.userCallback=n.userCallback,c.context=n.context,n=c}const o=new Ih(n,r||void 0),a=new Hi(o);return ph(t._repo,t,a),()=>Ms(t._repo,t,a)}function fo(t,e,n,i){return Rh(t,"value",e,n,i)}wu(ae);Nu(ae);/**
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
 */const Nh="FIREBASE_DATABASE_EMULATOR_HOST",ti={};let Ah=!1;function kh(t,e,n,i){const s=e.lastIndexOf(":"),r=e.substring(0,s),o=ri(r);t.repoInfo_=new br(e,o,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0,n),i&&(t.authTokenProvider_=i)}function Dh(t,e,n,i,s){let r=i||t.options.databaseURL;r===void 0&&(t.options.projectId||oe("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),L("Using default host for project ",t.options.projectId),r=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=Ls(r,s),a=o.repoInfo,l;typeof process<"u"&&es&&(l=es[Nh]),l?(r=`http://${l}?ns=${a.namespace}`,o=Ls(r,s),a=o.repoInfo):o.repoInfo.secure;const c=new Bl(t.name,t.options,e);eh("Invalid Firebase Database URL",o),C(o.path)||oe("Database URL must point to the root of a Firebase Database (not including a child path).");const d=Oh(a,t,c,new Wl(t,n));return new xh(d,t)}function Ph(t,e){const n=ti[e];(!n||n[t.key]!==t)&&oe(`Database ${e}(${t.repoInfo_}) has already been deleted.`),_h(t),delete n[t.key]}function Oh(t,e,n,i){let s=ti[e.name];s||(s={},ti[e.name]=s);let r=s[t.toURLString()];return r&&oe("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new rh(t,Ah,n,i),s[t.toURLString()]=r,r}class xh{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(oh(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new ae(this._repo,w())),this._rootInternal}_delete(){return this._rootInternal!==null&&(Ph(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&oe("Cannot call "+e+" on a deleted database.")}}function Mh(t=ul(),e){const n=rl(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const i=jo("database");i&&Lh(n,...i)}return n}function Lh(t,e,n,i={}){t=Re(t),t._checkNotDeleted("useEmulator");const s=`${e}:${n}`,r=t._repoInternal;if(t._instanceStarted){if(s===t._repoInternal.repoInfo_.host&&Wt(i,r.repoInfo_.emulatorOptions))return;oe("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&oe('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Ot(Ot.OWNER);else if(i.mockUserToken){const a=typeof i.mockUserToken=="string"?i.mockUserToken:Go(i.mockUserToken,t.app.options.projectId);o=new Ot(a)}ri(e)&&(qo(e),Ko("Database",!0)),kh(r,s,i,o)}/**
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
 */function Fh(t){bl(cl),Ut(new ut("database",(e,{instanceIdentifier:n})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return Dh(i,s,r,n)},"PUBLIC").setMultipleInstances(!0)),We(ts,ns,t),We(ts,ns,"esm2017")}/**
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
 */const Wh={".sv":"timestamp"};function kn(){return Wh}/**
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
 */class Bh{constructor(e,n){this.committed=e,this.snapshot=n}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function po(t,e,n){var i;if(t=Re(t),Le("Reference.transaction",t._path),t.key===".length"||t.key===".keys")throw"Reference.transaction failed: "+t.key+" is a read-only object.";const s=(i=n==null?void 0:n.applyLocally)!==null&&i!==void 0?i:!0,r=new X,o=(l,c,d)=>{let h=null;l?r.reject(l):(h=new vt(d,new ae(t._repo,t._path),N),r.resolve(new Bh(c,h)))},a=fo(t,()=>{});return mh(t._repo,t._path,e,o,a,s),r.promise}se.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};se.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};Fh();function ni(t,e){const n=le(e);if(Object.keys(n).length===0)return null;const i=ne(n.code)||t,s=le(n.players),r={};for(const[M,j]of Object.entries(s)){const U=le(j),te=Pn(ne(U.symbol));te&&(r[M]={uid:M,nickname:ne(U.nickname)||"Player",symbol:te,joinedAt:xe(U.joinedAt)})}if(Object.keys(r).length===0)return null;const o=le(n.meta),a=Object.values(r).find(M=>M.symbol===Ce.X),l=ne(o.hostUid)||(a==null?void 0:a.uid)||Object.keys(r)[0],c=le(n.state),d=ne(c.cells),h=ne(c.miniWinners),u=lt({cells:d.length===81?d:W.EMPTY_CELLS,miniWinners:h.length===9?h:W.EMPTY_MINI_WINNERS,nextMiniGrid:kt(c.nextMiniGrid,-1),moveCount:kt(c.moveCount,0)}),p=Pn(ne(c.winnerSymbol)),m=le(n.presence),y={};for(const[M,j]of Object.entries(m)){const U=le(j),te=xe(U.disconnectedAt);y[M]={uid:M,connected:Dn(U.connected,!1),lastSeen:xe(U.lastSeen),disconnectedAt:te>0?te:null}}const b=le(n.rematch);return{code:i,hostUid:l,players:r,status:Ws(c.status,x,x.WAITING),board:u,currentTurnUid:ne(c.currentTurnUid)||l,winnerUid:ne(c.winnerUid)||null,winnerSymbol:p,winReason:Ws(c.winReason,J,J.NONE),startedAt:xe(c.startedAt),updatedAt:xe(c.updatedAt),version:kt(c.version,0),presence:y,rematchHostReady:Dn(b.hostReady,!1),rematchGuestReady:Dn(b.guestReady,!1),rematchNonce:kt(b.nonce,0)}}function _o(t){const e={};for(const[i,s]of Object.entries(t.players))e[i]={uid:s.uid,nickname:s.nickname,symbol:s.symbol,joinedAt:s.joinedAt};const n={};for(const[i,s]of Object.entries(t.presence))n[i]={uid:s.uid,connected:s.connected,lastSeen:s.lastSeen,disconnectedAt:s.disconnectedAt??0};return{code:t.code,meta:{hostUid:t.hostUid,createdAt:t.startedAt},players:e,state:{cells:t.board.cells,miniWinners:t.board.miniWinners,nextMiniGrid:t.board.nextMiniGrid,moveCount:t.board.moveCount,currentTurnUid:t.currentTurnUid,status:t.status,winnerUid:t.winnerUid||"",winnerSymbol:t.winnerSymbol||"",winReason:t.winReason,startedAt:t.startedAt,updatedAt:t.updatedAt,version:t.version},presence:n,rematch:{hostReady:t.rematchHostReady,guestReady:t.rematchGuestReady,nonce:t.rematchNonce}}}function le(t){return!t||typeof t!="object"?{}:Object.fromEntries(Object.entries(t))}function ne(t){return typeof t=="string"?t:""}function xe(t,e=0){if(typeof t=="number"&&Number.isFinite(t))return Math.trunc(t);if(typeof t=="string"){const n=Number.parseInt(t,10);return Number.isNaN(n)?e:n}return e}function kt(t,e=0){return xe(t,e)}function Dn(t,e=!1){if(typeof t=="boolean")return t;if(typeof t=="string"){if(t==="true")return!0;if(t==="false")return!1}return e}function Ws(t,e,n){return typeof t!="string"?n:Object.values(e).includes(t)?t:n}const Mt="webRooms",Fe={apiKey:void 0,authDomain:void 0,databaseURL:void 0,projectId:void 0,storageBucket:void 0,appId:void 0};!Fe.authDomain&&Fe.projectId&&(Fe.authDomain=`${Fe.projectId}.firebaseapp.com`);const Uh=["apiKey","appId","databaseURL","projectId","storageBucket"],mo=Uh.filter(t=>!Fe[t]).map(t=>t),De=mo.length===0,go=De?"":`Missing Firebase config: ${mo.join(", ")}`,Bs=De?rr(Fe):null,q=Bs?Mh(Bs):null,ce=()=>{throw new Error(go||"Firebase is not configured")},ee={async createRoom(t,e){q||ce();const n=Us(e);for(let i=0;i<20;i+=1){const s=Hh(),r=xt(q,`${Mt}/${s}`),o=Date.now();if((await po(r,l=>{if(l!=null)return;const c=Ro(s,t,n,o);return _o(c)},{applyLocally:!1})).committed)return await this.markPresence(s,t,!0),s}throw new Error("Unable to allocate a unique room code")},async joinRoom(t,e,n){q||ce();const i=Oe(t),s=Us(n);return await Dt(i,r=>r?No(r,e,s,Date.now()):Pt("Room not found")),await this.markPresence(i,e,!0),i},observeRoom(t,e,n){q||ce();const i=Oe(t),s=xt(q,`${Mt}/${i}`);return fo(s,o=>{if(!o.exists()){n(new Error("Room was deleted"));return}const a=ni(i,o.val());if(!a){n(new Error("Failed to parse room state"));return}e(a)},o=>{n(o)})},async submitMove(t,e,n,i){return q||ce(),Dt(Oe(t),s=>s?Ao(s,Oo(n,i,e),Date.now()):Pt("Room not found"))},async requestRematch(t,e){return q||ce(),Dt(Oe(t),n=>n?ko(n,e,Date.now()):Pt("Room not found"))},async claimForfeit(t,e){return q||ce(),Dt(Oe(t),n=>n?Do(n,e,Date.now(),tn):Pt("Room not found"))},async markPresence(t,e,n){q||ce();const i=Oe(t),s=xt(q,`${Mt}/${i}/presence/${e}`);if(n){await Fs(s,{uid:e,connected:!0,lastSeen:kn(),disconnectedAt:0}),await Sh(s).update({connected:!1,lastSeen:kn(),disconnectedAt:kn()});return}const r=Date.now();await Fs(s,{uid:e,connected:!1,lastSeen:r,disconnectedAt:r})}};async function Dt(t,e){q||ce();const n=xt(q,`${Mt}/${t}`);let i=null;const s=await po(n,o=>{const a=ni(t,o),l=e(a);if(!l.ok){i=l.reason;return}return _o(l.roomState)},{applyLocally:!1});if(!s.committed)throw new Error(i||"Operation aborted");const r=ni(t,s.snapshot.val());if(!r)throw new Error("Failed to parse room after transaction");return r}function Oe(t){return String(t||"").trim().replace(/\D/g,"").slice(0,4)}function Us(t){return String(t||"").trim().slice(0,22)||"Player"}function Hh(){const t=Math.floor(Math.random()*1e4);return String(t).padStart(4,"0")}function Pt(t){return{ok:!1,reason:t}}const _={playerId:ed(),nickname:localStorage.getItem("uttt.nickname")||"",roomCodeInput:"",roomCode:null,room:null,unsubscribeRoom:null,busy:!1,notice:"",lastForfeitAttemptVersion:-1},Vh=document.querySelector("#app");Vh.innerHTML=`
  <main class="shell">
    <section class="panel hero">
      <p class="eyebrow">Ultimate Tic-Tac-Toe</p>
      <h1>2-Player Web Match</h1>
      <p class="sub">No login. Create a 4-digit room key and share it.</p>
    </section>

    <section class="panel" id="setup-panel">
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

    <section class="panel hidden" id="room-panel">
      <div class="room-meta">
        <div>
          <p class="label">Room code</p>
          <p class="room-code" id="room-code-active">----</p>
        </div>
        <button id="copy-code" class="btn">Copy code</button>
      </div>

      <p id="status-text" class="status">Waiting for room updates...</p>
      <p id="forfeit-text" class="forfeit"></p>

      <div id="players" class="players"></div>

      <div id="board" class="board" aria-label="Ultimate board"></div>

      <div class="actions-grid actions-room">
        <button id="rematch" class="btn hidden">Rematch</button>
        <button id="leave" class="btn btn-danger">Leave room</button>
      </div>
    </section>

    <p id="notice" class="notice"></p>
  </main>
`;const yo=document.querySelector("#nickname"),Zt=document.querySelector("#room-code"),$h=document.querySelector("#setup-panel"),jh=document.querySelector("#room-panel"),qh=document.querySelector("#room-code-active"),Hs=document.querySelector("#status-text"),Vs=document.querySelector("#forfeit-text"),vo=document.querySelector("#players"),Vi=document.querySelector("#board"),ii=document.querySelector("#rematch"),Gh=document.querySelector("#leave"),zh=document.querySelector("#notice"),$s=document.querySelector("#firebase-warning");yo.value=_.nickname;Zt.value=_.roomCodeInput;De||($s.classList.remove("hidden"),$s.textContent=go);yo.addEventListener("input",t=>{_.nickname=t.target.value.slice(0,22),localStorage.setItem("uttt.nickname",_.nickname)});Zt.addEventListener("input",t=>{_.roomCodeInput=t.target.value.replace(/\D/g,"").slice(0,4),Zt.value=_.roomCodeInput});document.querySelector("#create-room").addEventListener("click",async()=>{!De||_.busy||await Rt(async()=>{const t=await ee.createRoom(_.playerId,wo());await Co(t),_e(`Room ${t} created. Share this 4-digit key.`)})});document.querySelector("#join-room").addEventListener("click",async()=>{if(!(!De||_.busy)){if(_.roomCodeInput.length!==4){_e("Enter a 4-digit room code.");return}await Rt(async()=>{const t=await ee.joinRoom(_.roomCodeInput,_.playerId,wo());await Co(t),_e(`Joined room ${t}.`)})}});document.querySelector("#copy-code").addEventListener("click",async()=>{if(_.roomCode)try{await navigator.clipboard.writeText(_.roomCode),_e("Room code copied.")}catch{_e("Copy failed. Share the code manually.")}});Gh.addEventListener("click",async()=>{await Yh(),_e("Left room.")});ii.addEventListener("click",async()=>{!_.roomCode||!_.room||_.busy||await Rt(async()=>{await ee.requestRematch(_.roomCode,_.playerId)})});Vi.addEventListener("click",async t=>{const e=t.target.closest("button[data-mini][data-cell]");if(!e||!_.roomCode||!_.room||_.busy)return;const n=Number(e.dataset.mini),i=Number(e.dataset.cell);await Rt(async()=>{await ee.submitMove(_.roomCode,_.playerId,n,i)})});window.addEventListener("pagehide",()=>{Eo()});document.addEventListener("visibilitychange",()=>{_.roomCode&&(document.visibilityState==="hidden"?Eo():ee.markPresence(_.roomCode,_.playerId,!0))});setInterval(()=>{Zh()},1e3);Se();async function Co(t){_.unsubscribeRoom&&(_.unsubscribeRoom(),_.unsubscribeRoom=null),_.roomCode=t,_.roomCodeInput=t,Zt.value=t,_.unsubscribeRoom=ee.observeRoom(t,e=>{_.room=e,Se()},e=>{_e(e.message||"Lost room updates.")}),await ee.markPresence(t,_.playerId,!0),Se()}async function Yh(){if(_.unsubscribeRoom&&(_.unsubscribeRoom(),_.unsubscribeRoom=null),_.roomCode&&De)try{await ee.markPresence(_.roomCode,_.playerId,!1)}catch{}_.room=null,_.roomCode=null,_.lastForfeitAttemptVersion=-1,Se()}function Se(){const t=!!_.roomCode;if($h.classList.toggle("hidden",t),jh.classList.toggle("hidden",!t),zh.textContent=_.notice,!t)return;if(qh.textContent=_.roomCode||"----",!_.room){Hs.textContent="Connecting to room...",vo.innerHTML="",Vi.innerHTML="",Vs.textContent="",ii.classList.add("hidden");return}Kh(),Qh(),Hs.textContent=Xh(),Vs.textContent=Jh();const e=_.room.status===x.FINISHED&&Object.keys(_.room.players).length===2;ii.classList.toggle("hidden",!e)}function Kh(){const t=_.room,e=Object.values(t.players).slice().sort((n,i)=>n.symbol.localeCompare(i.symbol));vo.innerHTML=e.map(n=>{const i=t.presence[n.uid],s=n.uid===_.playerId,r=(i==null?void 0:i.connected)??!1;return`
        <article class="player-card ${s?"mine":""}">
          <div>
            <p class="player-name">${td(n.nickname)} ${s?"(You)":""}</p>
            <p class="player-meta">${n.symbol} ${n.uid===t.hostUid?"• Host":""}</p>
          </div>
          <span class="presence ${r?"online":"offline"}">${r?"Online":"Offline"}</span>
        </article>
      `}).join("")}function Qh(){const t=_.room,n=!!t.players[_.playerId],i=t.status===x.ACTIVE&&t.currentTurnUid===_.playerId,s=js(t.board);Vi.innerHTML=Array.from({length:9},(r,o)=>{const a=t.board.miniWinners[o],l=a!==W.EMPTY,c=s.has(o),d=Array.from({length:9},(h,u)=>{const p=en(o,u),m=t.board.cells[p],y=m===W.EMPTY,b=n&&i&&t.status===x.ACTIVE&&y&&!l&&c;return`
        <button
          class="cell ${b?"playable":""} ${m!==W.EMPTY?"filled":""}"
          data-mini="${o}"
          data-cell="${u}"
          ${b?"":"disabled"}
        >
          ${m===W.EMPTY?"":m}
        </button>
      `}).join("");return`
      <section class="mini-grid ${c?"allowed":""} ${l?"resolved":""}">
        <div class="mini-cells">${d}</div>
        ${l?`<div class="mini-winner">${a===W.TIE?"T":a}</div>`:""}
      </section>
    `}).join("")}function Xh(){var n,i;const t=_.room;if(t.status===x.WAITING)return"Waiting for a second player to join this room.";if(t.status===x.ACTIVE){if(t.currentTurnUid===_.playerId)return`Your turn (${((n=t.players[_.playerId])==null?void 0:n.symbol)||"?"}). Play in highlighted mini-grid.`;const r=t.players[t.currentTurnUid];return`${(r==null?void 0:r.nickname)||"Opponent"}'s turn.`}if(t.winReason===J.DRAW)return"Match ended in a draw.";const e=t.winnerUid===_.playerId?"You":((i=t.players[t.winnerUid])==null?void 0:i.nickname)||"Opponent";return t.winReason===J.FORFEIT?`${e} won by forfeit.`:`${e} won the match.`}function Jh(){const t=_.room;if(!t||t.status!==x.ACTIVE)return"";const e=nn(t,_.playerId);if(!e)return"";const n=t.presence[e];if(!n||n.connected||!n.disconnectedAt)return"";const i=tn-(Date.now()-n.disconnectedAt);return i<=0?"Opponent disconnected. Claiming forfeit...":`Opponent disconnected. Forfeit in ${Math.ceil(i/1e3)}s.`}async function Zh(){const t=_.room;if(!t||!_.roomCode||t.status!==x.ACTIVE)return;const e=nn(t,_.playerId);if(!e)return;const n=t.presence[e];if(!n||n.connected||!n.disconnectedAt)return;if(Date.now()-n.disconnectedAt<tn){Se();return}_.lastForfeitAttemptVersion===t.version||_.busy||(_.lastForfeitAttemptVersion=t.version,await Rt(async()=>{await ee.claimForfeit(_.roomCode,_.playerId)}))}async function Eo(){if(!(!_.roomCode||!De))try{await ee.markPresence(_.roomCode,_.playerId,!1)}catch{}}async function Rt(t){_.busy=!0;try{await t()}catch(e){_e((e==null?void 0:e.message)||"Operation failed.")}finally{_.busy=!1,Se()}}function wo(){return _.nickname.trim().slice(0,22)||"Player"}function _e(t){_.notice=t,Se()}function ed(){const t="uttt.playerId",e=localStorage.getItem(t);if(e)return e;const n=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`player-${Date.now()}-${Math.random().toString(16).slice(2)}`;return localStorage.setItem(t,n),n}function td(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
