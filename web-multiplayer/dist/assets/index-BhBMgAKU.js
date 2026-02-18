(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const Ee={X:"X",O:"O"};function Bn(t){return t==="X"?Ee.X:t==="O"?Ee.O:null}const F={WAITING:"WAITING",ACTIVE:"ACTIVE",FINISHED:"FINISHED"},ee={NONE:"NONE",NORMAL:"NORMAL",FORFEIT:"FORFEIT",DRAW:"DRAW"},H={EMPTY:".",TIE:"T",EMPTY_CELLS:".".repeat(81),EMPTY_MINI_WINNERS:".".repeat(9)};function ft(t={}){const e={cells:H.EMPTY_CELLS,miniWinners:H.EMPTY_MINI_WINNERS,nextMiniGrid:-1,moveCount:0,...t};if(e.cells.length!==81)throw new Error("cells must contain 81 characters");if(e.miniWinners.length!==9)throw new Error("miniWinners must contain 9 characters");return e}const Lo=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];function Zs(t){const e=t.nextMiniGrid;if(e>=0&&e<=8&&Un(t,e))return new Set([e]);const n=new Set;for(let i=0;i<=8;i+=1)Un(t,i)&&n.add(i);return n}function Un(t,e){return e<0||e>8||t.miniWinners[e]!==H.EMPTY?!1:!er(t.cells,e)}function er(t,e){for(let n=0;n<=8;n+=1)if(t[ln(e,n)]===H.EMPTY)return!1;return!0}function ln(t,e){if(t<0||t>8)throw new Error("miniGridIndex out of bounds");if(e<0||e>8)throw new Error("cellIndex out of bounds");const n=Math.floor(t/3),i=t%3,s=Math.floor(e/3),r=e%3,o=n*3+s,a=i*3+r;return o*9+a}function Fo(t,e,n,i){if(e<0||e>8||n<0||n>8)return tt(t,null,!1,"Move indices out of bounds");const s=Zs(t);if(s.size===0)return tt(t,null,!1,"No playable mini-grids left");if(!s.has(e))return tt(t,null,!1,"Move must be played in the highlighted mini-grid");const r=ln(e,n);if(t.cells[r]!==H.EMPTY)return tt(t,null,!1,"Cell is already occupied");const o=t.cells.split(""),a=t.miniWinners.split("");o[r]=i;const l=Wo(o,e);l!==null?a[e]=l:er(o.join(""),e)&&(a[e]=H.TIE);const c=Bo(a),d=Bn(c),h=d===null&&a.every(w=>w!==H.EMPTY),u=n,_=ft({cells:o.join(""),miniWinners:a.join(""),nextMiniGrid:u,moveCount:t.moveCount+1}),m=u>=0&&u<=8&&Un(_,u)?u:-1,y=ft({cells:o.join(""),miniWinners:a.join(""),nextMiniGrid:m,moveCount:t.moveCount+1});return tt(y,d,h,null)}function tt(t,e,n,i){return{board:t,globalWinner:e,isDraw:n,error:i,isValid:i===null}}function Wo(t,e){const n=Array.from({length:9},(i,s)=>t[ln(e,s)]);return tr(n)}function Bo(t){return tr(t)}function tr(t){for(const e of Lo){const n=t[e[0]],i=t[e[1]],s=t[e[2]];if(n!==H.EMPTY&&n!==H.TIE&&n===i&&i===s)return n}return null}const cn=45e3;function Uo(t,e,n,i){const s={uid:e,nickname:n,symbol:Ee.X,joinedAt:i};return{code:t,hostUid:e,players:{[e]:s},status:F.WAITING,board:ft(),currentTurnUid:e,winnerUid:null,winnerSymbol:null,winReason:ee.NONE,startedAt:i,updatedAt:i,version:0,presence:{[e]:{uid:e,connected:!0,lastSeen:i,disconnectedAt:null}},rematchHostReady:!1,rematchGuestReady:!1,rematchNonce:0}}function Ho(t,e,n,i){if(t.players[e])return Ve(t);if(Object.keys(t.players).length>=2)return U("Room is already full");const r=new Set(Object.values(t.players).map(l=>l.symbol)).has(Ee.X)?Ee.O:Ee.X,o={...t.players,[e]:{uid:e,nickname:n,symbol:r,joinedAt:i}},a={...t.presence,[e]:{uid:e,connected:!0,lastSeen:i,disconnectedAt:null}};return Ve({...t,players:o,presence:a,status:F.ACTIVE,updatedAt:i,version:t.version+1})}function Vo(t,e,n){if(t.status!==F.ACTIVE)return U("Match is not active");const i=t.players[e.playerUid];if(!i)return U("Player is not part of this room");if(t.currentTurnUid!==e.playerUid)return U("It is not your turn");const s=Fo(t.board,e.miniGridIndex,e.cellIndex,i.symbol);if(!s.isValid)return U(s.error||"Invalid move");const r=s.globalWinner,o=s.isDraw,a=r!==null||o,l=a?t.currentTurnUid:un(t,e.playerUid)||t.currentTurnUid;return Ve({...t,board:s.board,status:a?F.FINISHED:F.ACTIVE,currentTurnUid:l,winnerUid:r!==null?e.playerUid:null,winnerSymbol:r,winReason:r!==null?ee.NORMAL:o?ee.DRAW:ee.NONE,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1})}function $o(t,e,n){if(t.status!==F.FINISHED)return U("Rematch is only available after a finished game");if(!t.players[e])return U("Only participants can request rematch");if(Object.keys(t.players).length<2)return U("Need two players for a rematch");let i=t.rematchHostReady,s=t.rematchGuestReady;return e===t.hostUid?i=!0:s=!0,Ve(i&&s?{...t,board:ft(),status:F.ACTIVE,currentTurnUid:t.hostUid,winnerUid:null,winnerSymbol:null,winReason:ee.NONE,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1,rematchNonce:t.rematchNonce+1}:{...t,rematchHostReady:i,rematchGuestReady:s,updatedAt:n,version:t.version+1})}function jo(t,e,n,i=cn){if(t.status!==F.ACTIVE)return U("Forfeit can only be claimed during an active match");if(!t.players[e])return U("Only participants can claim forfeit");const s=un(t,e);if(!s)return U("Opponent is missing");const r=t.presence[s];if(!r)return U("Opponent presence not found");if(r.connected)return U("Opponent is still connected");if(!r.disconnectedAt)return U("No disconnect timestamp found");if(n-r.disconnectedAt<i)return U("Grace period has not elapsed yet");const o=qo(t,e);return o?Ve({...t,status:F.FINISHED,winnerUid:e,winnerSymbol:o,winReason:ee.FORFEIT,updatedAt:n,version:t.version+1,rematchHostReady:!1,rematchGuestReady:!1}):U("Could not determine winner symbol")}function qo(t,e){var n;return((n=t.players[e])==null?void 0:n.symbol)||null}function un(t,e){return Object.keys(t.players).find(n=>n!==e)||null}function Go(t,e,n){return{miniGridIndex:t,cellIndex:e,playerUid:n,timestamp:Date.now()}}function Ve(t){return{ok:!0,roomState:t}}function U(t){return{ok:!1,reason:t}}const zo=()=>{};var Ji={};/**
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
 */const nr={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
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
 */const p=function(t,e){if(!t)throw Ye(e)},Ye=function(t){return new Error("Firebase Database ("+nr.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
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
 */const ir=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let s=t.charCodeAt(i);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&i+1<t.length&&(t.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++i)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},Yo=function(t){const e=[];let n=0,i=0;for(;n<t.length;){const s=t[n++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=t[n++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=t[n++],o=t[n++],a=t[n++],l=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[i++]=String.fromCharCode(55296+(l>>10)),e[i++]=String.fromCharCode(56320+(l&1023))}else{const r=t[n++],o=t[n++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},hi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<t.length;s+=3){const r=t[s],o=s+1<t.length,a=o?t[s+1]:0,l=s+2<t.length,c=l?t[s+2]:0,d=r>>2,h=(r&3)<<4|a>>4;let u=(a&15)<<2|c>>6,_=c&63;l||(_=64,o||(u=64)),i.push(n[d],n[h],n[u],n[_])}return i.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ir(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Yo(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<t.length;){const r=n[t.charAt(s++)],a=s<t.length?n[t.charAt(s)]:0;++s;const c=s<t.length?n[t.charAt(s)]:64;++s;const h=s<t.length?n[t.charAt(s)]:64;if(++s,r==null||a==null||c==null||h==null)throw new Ko;const u=r<<2|a>>4;if(i.push(u),c!==64){const _=a<<4&240|c>>2;if(i.push(_),h!==64){const m=c<<6&192|h;i.push(m)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ko extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const sr=function(t){const e=ir(t);return hi.encodeByteArray(e,!0)},$t=function(t){return sr(t).replace(/\./g,"")},Hn=function(t){try{return hi.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Qo(t){return rr(void 0,t)}function rr(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!Xo(n)||(t[n]=rr(t[n],e[n]));return t}function Xo(t){return t!=="__proto__"}/**
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
 */function Jo(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Zo=()=>Jo().__FIREBASE_DEFAULTS__,ea=()=>{if(typeof process>"u"||typeof Ji>"u")return;const t=Ji.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ta=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Hn(t[1]);return e&&JSON.parse(e)},or=()=>{try{return zo()||Zo()||ea()||ta()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},na=t=>{var e,n;return(n=(e=or())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},ia=t=>{const e=na(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),i]:[e.substring(0,n),i]},ar=()=>{var t;return(t=or())===null||t===void 0?void 0:t.config};/**
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
 */class Z{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,i)=>{n?this.reject(n):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,i))}}}/**
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
 */function di(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function sa(t){return(await fetch(t,{credentials:"include"})).ok}/**
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
 */function ra(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},i=e||"demo-project",s=t.iat||0,r=t.sub||t.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},t);return[$t(JSON.stringify(n)),$t(JSON.stringify(o)),""].join(".")}const at={};function oa(){const t={prod:[],emulator:[]};for(const e of Object.keys(at))at[e]?t.emulator.push(e):t.prod.push(e);return t}function aa(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let Zi=!1;function la(t,e){if(typeof window>"u"||typeof document>"u"||!di(window.location.host)||at[t]===e||at[t]||Zi)return;at[t]=e;function n(u){return`__firebase__banner__${u}`}const i="__firebase__banner",r=oa().prod.length>0;function o(){const u=document.getElementById(i);u&&u.remove()}function a(u){u.style.display="flex",u.style.background="#7faaf0",u.style.position="fixed",u.style.bottom="5px",u.style.left="5px",u.style.padding=".5em",u.style.borderRadius="5px",u.style.alignItems="center"}function l(u,_){u.setAttribute("width","24"),u.setAttribute("id",_),u.setAttribute("height","24"),u.setAttribute("viewBox","0 0 24 24"),u.setAttribute("fill","none"),u.style.marginLeft="-6px"}function c(){const u=document.createElement("span");return u.style.cursor="pointer",u.style.marginLeft="16px",u.style.fontSize="24px",u.innerHTML=" &times;",u.onclick=()=>{Zi=!0,o()},u}function d(u,_){u.setAttribute("id",_),u.innerText="Learn more",u.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",u.setAttribute("target","__blank"),u.style.paddingLeft="5px",u.style.textDecoration="underline"}function h(){const u=aa(i),_=n("text"),m=document.getElementById(_)||document.createElement("span"),y=n("learnmore"),w=document.getElementById(y)||document.createElement("a"),k=n("preprendIcon"),W=document.getElementById(k)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(u.created){const R=u.element;a(R),d(w,y);const O=c();l(W,k),R.append(W,m,w,O),document.body.appendChild(R)}r?(m.innerText="Preview backend disconnected.",W.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(W.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,m.innerText="Preview backend running in this workspace."),m.setAttribute("id",_)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",h):h()}/**
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
 */function ca(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function lr(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ca())}function ua(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ha(){return nr.NODE_ADMIN===!0}function da(){try{return typeof indexedDB=="object"}catch{return!1}}function fa(){return new Promise((t,e)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(i),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var r;e(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(n){e(n)}})}/**
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
 */const pa="FirebaseError";class St extends Error{constructor(e,n,i){super(n),this.code=e,this.customData=i,this.name=pa,Object.setPrototypeOf(this,St.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,cr.prototype.create)}}class cr{constructor(e,n,i){this.service=e,this.serviceName=n,this.errors=i}create(e,...n){const i=n[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?_a(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new St(s,a,i)}}function _a(t,e){return t.replace(ma,(n,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const ma=/\{\$([^}]+)}/g;/**
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
 */function pt(t){return JSON.parse(t)}function L(t){return JSON.stringify(t)}/**
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
 */const ur=function(t){let e={},n={},i={},s="";try{const r=t.split(".");e=pt(Hn(r[0])||""),n=pt(Hn(r[1])||""),s=r[2],i=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:i,signature:s}},ga=function(t){const e=ur(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},ya=function(t){const e=ur(t).claims;return typeof e=="object"&&e.admin===!0};/**
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
 */function J(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function we(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function Vn(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function jt(t,e,n){const i={};for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(i[s]=e.call(n,t[s],s,t));return i}function qt(t,e){if(t===e)return!0;const n=Object.keys(t),i=Object.keys(e);for(const s of n){if(!i.includes(s))return!1;const r=t[s],o=e[s];if(es(r)&&es(o)){if(!qt(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!n.includes(s))return!1;return!0}function es(t){return t!==null&&typeof t=="object"}/**
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
 */function va(t){const e=[];for(const[n,i]of Object.entries(t))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}/**
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
 */class Ca{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const i=this.W_;if(typeof e=="string")for(let h=0;h<16;h++)i[h]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let h=0;h<16;h++)i[h]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let h=16;h<80;h++){const u=i[h-3]^i[h-8]^i[h-14]^i[h-16];i[h]=(u<<1|u>>>31)&4294967295}let s=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,d;for(let h=0;h<80;h++){h<40?h<20?(c=a^r&(o^a),d=1518500249):(c=r^o^a,d=1859775393):h<60?(c=r&o|a&(r|o),d=2400959708):(c=r^o^a,d=3395469782);const u=(s<<5|s>>>27)+c+l+d+i[h]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=s,s=u}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const i=n-this.blockSize;let s=0;const r=this.buf_;let o=this.inbuf_;for(;s<n;){if(o===0)for(;s<=i;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<n;)if(r[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}else for(;s<n;)if(r[o]=e[s],++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=n&255,n/=256;this.compress_(this.buf_);let i=0;for(let s=0;s<5;s++)for(let r=24;r>=0;r-=8)e[i]=this.chain_[s]>>r&255,++i;return e}}function $e(t,e){return`${t} failed: ${e} argument `}/**
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
 */const Ea=function(t){const e=[];let n=0;for(let i=0;i<t.length;i++){let s=t.charCodeAt(i);if(s>=55296&&s<=56319){const r=s-55296;i++,p(i<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(i)-56320;s=65536+(r<<10)+o}s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):s<65536?(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},hn=function(t){let e=0;for(let n=0;n<t.length;n++){const i=t.charCodeAt(n);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,n++):e+=3}return e};/**
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
 */function Ne(t){return t&&t._delegate?t._delegate:t}class _t{constructor(e,n,i){this.name=e,this.instanceFactory=n,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const ge="[DEFAULT]";/**
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
 */class wa{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const i=new Z;if(this.instancesDeferred.set(n,i),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ia(e))try{this.getOrInitializeService({instanceIdentifier:ge})}catch{}for(const[n,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=ge){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ge){return this.instances.has(e)}getOptions(e=ge){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:n});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(e,n){var i;const s=this.normalizeInstanceIdentifier(n),r=(i=this.onInitCallbacks.get(s))!==null&&i!==void 0?i:new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const i=this.onInitCallbacks.get(n);if(i)for(const s of i)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:ba(e),options:n}),this.instances.set(e,i),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=ge){return this.component?this.component.multipleInstances?e:ge:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ba(t){return t===ge?void 0:t}function Ia(t){return t.instantiationMode==="EAGER"}/**
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
 */class Ta{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new wa(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var S;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(S||(S={}));const Sa={debug:S.DEBUG,verbose:S.VERBOSE,info:S.INFO,warn:S.WARN,error:S.ERROR,silent:S.SILENT},Ra=S.INFO,Na={[S.DEBUG]:"log",[S.VERBOSE]:"log",[S.INFO]:"info",[S.WARN]:"warn",[S.ERROR]:"error"},Aa=(t,e,...n)=>{if(e<t.logLevel)return;const i=new Date().toISOString(),s=Na[e];if(s)console[s](`[${i}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class hr{constructor(e){this.name=e,this._logLevel=Ra,this._logHandler=Aa,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in S))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Sa[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,S.DEBUG,...e),this._logHandler(this,S.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,S.VERBOSE,...e),this._logHandler(this,S.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,S.INFO,...e),this._logHandler(this,S.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,S.WARN,...e),this._logHandler(this,S.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,S.ERROR,...e),this._logHandler(this,S.ERROR,...e)}}const ka=(t,e)=>e.some(n=>t instanceof n);let ts,ns;function Da(){return ts||(ts=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Pa(){return ns||(ns=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const dr=new WeakMap,$n=new WeakMap,fr=new WeakMap,Sn=new WeakMap,fi=new WeakMap;function Oa(t){const e=new Promise((n,i)=>{const s=()=>{t.removeEventListener("success",r),t.removeEventListener("error",o)},r=()=>{n(he(t.result)),s()},o=()=>{i(t.error),s()};t.addEventListener("success",r),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&dr.set(n,t)}).catch(()=>{}),fi.set(e,t),e}function xa(t){if($n.has(t))return;const e=new Promise((n,i)=>{const s=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",o),t.removeEventListener("abort",o)},r=()=>{n(),s()},o=()=>{i(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",r),t.addEventListener("error",o),t.addEventListener("abort",o)});$n.set(t,e)}let jn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return $n.get(t);if(e==="objectStoreNames")return t.objectStoreNames||fr.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return he(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ma(t){jn=t(jn)}function La(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const i=t.call(Rn(this),e,...n);return fr.set(i,e.sort?e.sort():[e]),he(i)}:Pa().includes(t)?function(...e){return t.apply(Rn(this),e),he(dr.get(this))}:function(...e){return he(t.apply(Rn(this),e))}}function Fa(t){return typeof t=="function"?La(t):(t instanceof IDBTransaction&&xa(t),ka(t,Da())?new Proxy(t,jn):t)}function he(t){if(t instanceof IDBRequest)return Oa(t);if(Sn.has(t))return Sn.get(t);const e=Fa(t);return e!==t&&(Sn.set(t,e),fi.set(e,t)),e}const Rn=t=>fi.get(t);function Wa(t,e,{blocked:n,upgrade:i,blocking:s,terminated:r}={}){const o=indexedDB.open(t,e),a=he(o);return i&&o.addEventListener("upgradeneeded",l=>{i(he(o.result),l.oldVersion,l.newVersion,he(o.transaction),l)}),n&&o.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),s&&l.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Ba=["get","getKey","getAll","getAllKeys","count"],Ua=["put","add","delete","clear"],Nn=new Map;function is(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Nn.get(e))return Nn.get(e);const n=e.replace(/FromIndex$/,""),i=e!==n,s=Ua.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!(s||Ba.includes(n)))return;const r=async function(o,...a){const l=this.transaction(o,s?"readwrite":"readonly");let c=l.store;return i&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),s&&l.done]))[0]};return Nn.set(e,r),r}Ma(t=>({...t,get:(e,n,i)=>is(e,n)||t.get(e,n,i),has:(e,n)=>!!is(e,n)||t.has(e,n)}));/**
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
 */class Ha{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Va(n)){const i=n.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(n=>n).join(" ")}}function Va(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const qn="@firebase/app",ss="0.13.2";/**
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
 */const oe=new hr("@firebase/app"),$a="@firebase/app-compat",ja="@firebase/analytics-compat",qa="@firebase/analytics",Ga="@firebase/app-check-compat",za="@firebase/app-check",Ya="@firebase/auth",Ka="@firebase/auth-compat",Qa="@firebase/database",Xa="@firebase/data-connect",Ja="@firebase/database-compat",Za="@firebase/functions",el="@firebase/functions-compat",tl="@firebase/installations",nl="@firebase/installations-compat",il="@firebase/messaging",sl="@firebase/messaging-compat",rl="@firebase/performance",ol="@firebase/performance-compat",al="@firebase/remote-config",ll="@firebase/remote-config-compat",cl="@firebase/storage",ul="@firebase/storage-compat",hl="@firebase/firestore",dl="@firebase/ai",fl="@firebase/firestore-compat",pl="firebase",_l="11.10.0";/**
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
 */const Gn="[DEFAULT]",ml={[qn]:"fire-core",[$a]:"fire-core-compat",[qa]:"fire-analytics",[ja]:"fire-analytics-compat",[za]:"fire-app-check",[Ga]:"fire-app-check-compat",[Ya]:"fire-auth",[Ka]:"fire-auth-compat",[Qa]:"fire-rtdb",[Xa]:"fire-data-connect",[Ja]:"fire-rtdb-compat",[Za]:"fire-fn",[el]:"fire-fn-compat",[tl]:"fire-iid",[nl]:"fire-iid-compat",[il]:"fire-fcm",[sl]:"fire-fcm-compat",[rl]:"fire-perf",[ol]:"fire-perf-compat",[al]:"fire-rc",[ll]:"fire-rc-compat",[cl]:"fire-gcs",[ul]:"fire-gcs-compat",[hl]:"fire-fst",[fl]:"fire-fst-compat",[dl]:"fire-vertex","fire-js":"fire-js",[pl]:"fire-js-all"};/**
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
 */const Gt=new Map,gl=new Map,zn=new Map;function rs(t,e){try{t.container.addComponent(e)}catch(n){oe.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function zt(t){const e=t.name;if(zn.has(e))return oe.debug(`There were multiple attempts to register component ${e}.`),!1;zn.set(e,t);for(const n of Gt.values())rs(n,t);for(const n of gl.values())rs(n,t);return!0}function yl(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function vl(t){return t==null?!1:t.settings!==void 0}/**
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
 */const Cl={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},de=new cr("app","Firebase",Cl);/**
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
 */class El{constructor(e,n,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new _t("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw de.create("app-deleted",{appName:this._name})}}/**
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
 */const wl=_l;function pr(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const i=Object.assign({name:Gn,automaticDataCollectionEnabled:!0},e),s=i.name;if(typeof s!="string"||!s)throw de.create("bad-app-name",{appName:String(s)});if(n||(n=ar()),!n)throw de.create("no-options");const r=Gt.get(s);if(r){if(qt(n,r.options)&&qt(i,r.config))return r;throw de.create("duplicate-app",{appName:s})}const o=new Ta(s);for(const l of zn.values())o.addComponent(l);const a=new El(n,i,o);return Gt.set(s,a),a}function bl(t=Gn){const e=Gt.get(t);if(!e&&t===Gn&&ar())return pr();if(!e)throw de.create("no-app",{appName:t});return e}function We(t,e,n){var i;let s=(i=ml[t])!==null&&i!==void 0?i:t;n&&(s+=`-${n}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),oe.warn(a.join(" "));return}zt(new _t(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const Il="firebase-heartbeat-database",Tl=1,mt="firebase-heartbeat-store";let An=null;function _r(){return An||(An=Wa(Il,Tl,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(mt)}catch(n){console.warn(n)}}}}).catch(t=>{throw de.create("idb-open",{originalErrorMessage:t.message})})),An}async function Sl(t){try{const n=(await _r()).transaction(mt),i=await n.objectStore(mt).get(mr(t));return await n.done,i}catch(e){if(e instanceof St)oe.warn(e.message);else{const n=de.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});oe.warn(n.message)}}}async function os(t,e){try{const i=(await _r()).transaction(mt,"readwrite");await i.objectStore(mt).put(e,mr(t)),await i.done}catch(n){if(n instanceof St)oe.warn(n.message);else{const i=de.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});oe.warn(i.message)}}}function mr(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Rl=1024,Nl=30;class Al{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Dl(n),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=as();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>Nl){const o=Pl(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){oe.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=as(),{heartbeatsToSend:i,unsentEntries:s}=kl(this._heartbeatsCache.heartbeats),r=$t(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return oe.warn(n),""}}}function as(){return new Date().toISOString().substring(0,10)}function kl(t,e=Rl){const n=[];let i=t.slice();for(const s of t){const r=n.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),ls(n)>e){r.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),ls(n)>e){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}class Dl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return da()?fa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Sl(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return os(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return os(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function ls(t){return $t(JSON.stringify({version:2,heartbeats:t})).length}function Pl(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let i=1;i<t.length;i++)t[i].date<n&&(n=t[i].date,e=i);return e}/**
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
 */function Ol(t){zt(new _t("platform-logger",e=>new Ha(e),"PRIVATE")),zt(new _t("heartbeat",e=>new Al(e),"PRIVATE")),We(qn,ss,t),We(qn,ss,"esm2017"),We("fire-js","")}Ol("");var xl="firebase",Ml="11.10.0";/**
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
 */We(xl,Ml,"app");var cs={};const us="@firebase/database",hs="1.0.20";/**
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
 */let gr="";function Ll(t){gr=t}/**
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
 */class Fl{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),L(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:pt(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
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
 */class Wl{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return J(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
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
 */const yr=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Fl(e)}}catch{}return new Wl},ve=yr("localStorage"),Bl=yr("sessionStorage");/**
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
 */const Be=new hr("@firebase/database"),vr=function(){let t=1;return function(){return t++}}(),Cr=function(t){const e=Ea(t),n=new Ca;n.update(e);const i=n.digest();return hi.encodeByteArray(i)},Rt=function(...t){let e="";for(let n=0;n<t.length;n++){const i=t[n];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=Rt.apply(null,i):typeof i=="object"?e+=L(i):e+=i,e+=" "}return e};let lt=null,ds=!0;const Ul=function(t,e){p(!0,"Can't turn on custom loggers persistently."),Be.logLevel=S.VERBOSE,lt=Be.log.bind(Be)},B=function(...t){if(ds===!0&&(ds=!1,lt===null&&Bl.get("logging_enabled")===!0&&Ul()),lt){const e=Rt.apply(null,t);lt(e)}},Nt=function(t){return function(...e){B(t,...e)}},Yn=function(...t){const e="FIREBASE INTERNAL ERROR: "+Rt(...t);Be.error(e)},ae=function(...t){const e=`FIREBASE FATAL ERROR: ${Rt(...t)}`;throw Be.error(e),new Error(e)},q=function(...t){const e="FIREBASE WARNING: "+Rt(...t);Be.warn(e)},Hl=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&q("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},dn=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},Vl=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},je="[MIN_NAME]",be="[MAX_NAME]",Ae=function(t,e){if(t===e)return 0;if(t===je||e===be)return-1;if(e===je||t===be)return 1;{const n=fs(t),i=fs(e);return n!==null?i!==null?n-i===0?t.length-e.length:n-i:-1:i!==null?1:t<e?-1:1}},$l=function(t,e){return t===e?0:t<e?-1:1},nt=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+L(e))},pi=function(t){if(typeof t!="object"||t===null)return L(t);const e=[];for(const i in t)e.push(i);e.sort();let n="{";for(let i=0;i<e.length;i++)i!==0&&(n+=","),n+=L(e[i]),n+=":",n+=pi(t[e[i]]);return n+="}",n},Er=function(t,e){const n=t.length;if(n<=e)return[t];const i=[];for(let s=0;s<n;s+=e)s+e>n?i.push(t.substring(s,n)):i.push(t.substring(s,s+e));return i};function V(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const wr=function(t){p(!dn(t),"Invalid JSON number");const e=11,n=52,i=(1<<e-1)-1;let s,r,o,a,l;t===0?(r=0,o=0,s=1/t===-1/0?1:0):(s=t<0,t=Math.abs(t),t>=Math.pow(2,1-i)?(a=Math.min(Math.floor(Math.log(t)/Math.LN2),i),r=a+i,o=Math.round(t*Math.pow(2,n-a)-Math.pow(2,n))):(r=0,o=Math.round(t/Math.pow(2,1-i-n))));const c=[];for(l=n;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(s?1:0),c.reverse();const d=c.join("");let h="";for(l=0;l<64;l+=8){let u=parseInt(d.substr(l,8),2).toString(16);u.length===1&&(u="0"+u),h=h+u}return h.toLowerCase()},jl=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ql=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function Gl(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const i=new Error(t+" at "+e._path.toString()+": "+n);return i.code=t.toUpperCase(),i}const zl=new RegExp("^-?(0*)\\d{1,10}$"),Yl=-2147483648,Kl=2147483647,fs=function(t){if(zl.test(t)){const e=Number(t);if(e>=Yl&&e<=Kl)return e}return null},Ke=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw q("Exception was thrown by user callback.",n),e},Math.floor(0))}},Ql=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},ct=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
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
 */class Xl{constructor(e,n){this.appCheckProvider=n,this.appName=e.name,vl(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((n,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,i):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)===null||n===void 0||n.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){q(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
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
 */class Jl{constructor(e,n,i){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(B("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,i):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',q(e)}}class Ut{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Ut.OWNER="owner";/**
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
 */const _i="5",br="v",Ir="s",Tr="r",Sr="f",Rr=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,Nr="ls",Ar="p",Kn="ac",kr="websocket",Dr="long_polling";/**
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
 */class Pr{constructor(e,n,i,s,r=!1,o="",a=!1,l=!1,c=null){this.secure=n,this.namespace=i,this.webSocketOnly=s,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=ve.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&ve.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function Zl(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function Or(t,e,n){p(typeof e=="string","typeof type must == string"),p(typeof n=="object","typeof params must == object");let i;if(e===kr)i=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===Dr)i=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);Zl(t)&&(n.ns=t.namespace);const s=[];return V(n,(r,o)=>{s.push(r+"="+o)}),i+s.join("&")}/**
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
 */class ec{constructor(){this.counters_={}}incrementCounter(e,n=1){J(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return Qo(this.counters_)}}/**
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
 */const kn={},Dn={};function mi(t){const e=t.toString();return kn[e]||(kn[e]=new ec),kn[e]}function tc(t,e){const n=t.toString();return Dn[n]||(Dn[n]=e()),Dn[n]}/**
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
 */class nc{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<i.length;++s)i[s]&&Ke(()=>{this.onMessage_(i[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
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
 */const ps="start",ic="close",sc="pLPCommand",rc="pRTLPCB",xr="id",Mr="pw",Lr="ser",oc="cb",ac="seg",lc="ts",cc="d",uc="dframe",Fr=1870,Wr=30,hc=Fr-Wr,dc=25e3,fc=3e4;class Me{constructor(e,n,i,s,r,o,a){this.connId=e,this.repoInfo=n,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Nt(e),this.stats_=mi(n),this.urlFn=l=>(this.appCheckToken&&(l[Kn]=this.appCheckToken),Or(n,Dr,l))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new nc(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(fc)),Vl(()=>{if(this.isClosed_)return;this.scriptTagHolder=new gi((...r)=>{const[o,a,l,c,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===ps)this.id=a,this.password=l;else if(o===ic)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const i={};i[ps]="t",i[Lr]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[oc]=this.scriptTagHolder.uniqueCallbackIdentifier),i[br]=_i,this.transportSessionId&&(i[Ir]=this.transportSessionId),this.lastSessionId&&(i[Nr]=this.lastSessionId),this.applicationId&&(i[Ar]=this.applicationId),this.appCheckToken&&(i[Kn]=this.appCheckToken),typeof location<"u"&&location.hostname&&Rr.test(location.hostname)&&(i[Tr]=Sr);const s=this.urlFn(i);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Me.forceAllow_=!0}static forceDisallow(){Me.forceDisallow_=!0}static isAvailable(){return Me.forceAllow_?!0:!Me.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!jl()&&!ql()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=L(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const i=sr(n),s=Er(i,hc);for(let r=0;r<s.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[r]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const i={};i[uc]="t",i[xr]=e,i[Mr]=n,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=L(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class gi{constructor(e,n,i,s){this.onDisconnect=i,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=vr(),window[sc+this.uniqueCallbackIdentifier]=e,window[rc+this.uniqueCallbackIdentifier]=n,this.myIFrame=gi.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){B("frame writing exception"),a.stack&&B(a.stack),B(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||B("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[xr]=this.myID,e[Mr]=this.myPW,e[Lr]=this.currentSerial;let n=this.urlFn(e),i="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Wr+i.length<=Fr;){const o=this.pendingSegs.shift();i=i+"&"+ac+s+"="+o.seg+"&"+lc+s+"="+o.ts+"&"+cc+s+"="+o.d,s++}return n=n+i,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,i){this.pendingSegs.push({seg:e,ts:n,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const i=()=>{this.outstandingRequests.delete(n),this.newRequest_()},s=setTimeout(i,Math.floor(dc)),r=()=>{clearTimeout(s),i()};this.addTag(e,r)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const s=i.readyState;(!s||s==="loaded"||s==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),n())},i.onerror=()=>{B("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
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
 */const pc=16384,_c=45e3;let Yt=null;typeof MozWebSocket<"u"?Yt=MozWebSocket:typeof WebSocket<"u"&&(Yt=WebSocket);class K{constructor(e,n,i,s,r,o,a){this.connId=e,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Nt(this.connId),this.stats_=mi(n),this.connURL=K.connectionURL_(n,o,a,s,i),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,i,s,r){const o={};return o[br]=_i,typeof location<"u"&&location.hostname&&Rr.test(location.hostname)&&(o[Tr]=Sr),n&&(o[Ir]=n),i&&(o[Nr]=i),s&&(o[Kn]=s),r&&(o[Ar]=r),Or(e,kr,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,ve.set("previous_websocket_failure",!0);try{let i;ha(),this.mySock=new Yt(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){K.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(n);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&Yt!==null&&!K.forceDisallow_}static previouslyFailed(){return ve.isInMemoryStorage||ve.get("previous_websocket_failure")===!0}markConnectionHealthy(){ve.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const i=pt(n);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(p(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const i=this.extractFrameCount_(n);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const n=L(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const i=Er(n,pc);i.length>1&&this.sendString_(String(i.length));for(let s=0;s<i.length;s++)this.sendString_(i[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(_c))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}K.responsesRequiredToBeHealthy=2;K.healthyTimeout=3e4;/**
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
 */class gt{static get ALL_TRANSPORTS(){return[Me,K]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const n=K&&K.isAvailable();let i=n&&!K.previouslyFailed();if(e.webSocketOnly&&(n||q("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[K];else{const s=this.transports_=[];for(const r of gt.ALL_TRANSPORTS)r&&r.isAvailable()&&s.push(r);gt.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}gt.globalTransportInitialized_=!1;/**
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
 */const mc=6e4,gc=5e3,yc=10*1024,vc=100*1024,Pn="t",_s="d",Cc="s",ms="r",Ec="e",gs="o",ys="a",vs="n",Cs="p",wc="h";class bc{constructor(e,n,i,s,r,o,a,l,c,d){this.id=e,this.repoInfo_=n,this.applicationId_=i,this.appCheckToken_=s,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Nt("c:"+this.id+":"),this.transportManager_=new gt(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,i)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=ct(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>vc?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>yc?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Pn in e){const n=e[Pn];n===ys?this.upgradeIfSecondaryHealthy_():n===ms?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===gs&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=nt("t",e),i=nt("d",e);if(n==="c")this.onSecondaryControl_(i);else if(n==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Cs,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:ys,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:vs,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=nt("t",e),i=nt("d",e);n==="c"?this.onControl_(i):n==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=nt(Pn,e);if(_s in e){const i=e[_s];if(n===wc){const s=Object.assign({},i);this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(n===vs){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===Cc?this.onConnectionShutdown_(i):n===ms?this.onReset_(i):n===Ec?Yn("Server Error: "+i):n===gs?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Yn("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,i=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),_i!==i&&q("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,i),ct(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(mc))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):ct(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(gc))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Cs,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(ve.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
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
 */class Br{put(e,n,i,s){}merge(e,n,i,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,i){}onDisconnectMerge(e,n,i){}onDisconnectCancel(e,n){}reportStats(e){}}/**
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
 */class Ur{constructor(e){this.allowedEvents_=e,this.listeners_={},p(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let s=0;s<i.length;s++)i[s].callback.apply(i[s].context,n)}}on(e,n,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:i});const s=this.getInitialEvent(e);s&&n.apply(i,s)}off(e,n,i){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let r=0;r<s.length;r++)if(s[r].callback===n&&(!i||i===s[r].context)){s.splice(r,1);return}}validateEventType_(e){p(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
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
 */class Kt extends Ur{static getInstance(){return new Kt}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!lr()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return p(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
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
 */const Es=32,ws=768;class I{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let i=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[i]=this.pieces_[s],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function b(){return new I("")}function v(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function pe(t){return t.pieces_.length-t.pieceNum_}function T(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new I(t.pieces_,e)}function yi(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function Ic(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function yt(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function Hr(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new I(e,0)}function P(t,e){const n=[];for(let i=t.pieceNum_;i<t.pieces_.length;i++)n.push(t.pieces_[i]);if(e instanceof I)for(let i=e.pieceNum_;i<e.pieces_.length;i++)n.push(e.pieces_[i]);else{const i=e.split("/");for(let s=0;s<i.length;s++)i[s].length>0&&n.push(i[s])}return new I(n,0)}function C(t){return t.pieceNum_>=t.pieces_.length}function $(t,e){const n=v(t),i=v(e);if(n===null)return e;if(n===i)return $(T(t),T(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function Tc(t,e){const n=yt(t,0),i=yt(e,0);for(let s=0;s<n.length&&s<i.length;s++){const r=Ae(n[s],i[s]);if(r!==0)return r}return n.length===i.length?0:n.length<i.length?-1:1}function vi(t,e){if(pe(t)!==pe(e))return!1;for(let n=t.pieceNum_,i=e.pieceNum_;n<=t.pieces_.length;n++,i++)if(t.pieces_[n]!==e.pieces_[i])return!1;return!0}function z(t,e){let n=t.pieceNum_,i=e.pieceNum_;if(pe(t)>pe(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[i])return!1;++n,++i}return!0}class Sc{constructor(e,n){this.errorPrefix_=n,this.parts_=yt(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=hn(this.parts_[i]);Vr(this)}}function Rc(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=hn(e),Vr(t)}function Nc(t){const e=t.parts_.pop();t.byteLength_-=hn(e),t.parts_.length>0&&(t.byteLength_-=1)}function Vr(t){if(t.byteLength_>ws)throw new Error(t.errorPrefix_+"has a key path longer than "+ws+" bytes ("+t.byteLength_+").");if(t.parts_.length>Es)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Es+") or object contains a cycle "+ye(t))}function ye(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
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
 */class Ci extends Ur{static getInstance(){return new Ci}constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return p(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
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
 */const it=1e3,Ac=60*5*1e3,bs=30*1e3,kc=1.3,Dc=3e4,Pc="server_kill",Is=3;class re extends Br{constructor(e,n,i,s,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=i,this.onConnectStatus_=s,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=re.nextPersistentConnectionId_++,this.log_=Nt("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=it,this.maxReconnectDelay_=Ac,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Ci.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Kt.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,i){const s=++this.requestNumber_,r={r:s,a:e,b:n};this.log_(L(r)),p(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),i&&(this.requestCBHash_[s]=i)}get(e){this.initConnection_();const n=new Z,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?n.resolve(a):n.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),n.promise}listen(e,n,i,s){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),p(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),p(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:s,hashFn:n,query:e,tag:i};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(i)})}sendListen_(e){const n=e.query,i=n._path.toString(),s=n._queryIdentifier;this.log_("Listen on "+i+" for "+s);const r={p:i},o="q";e.tag&&(r.q=n._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;re.warnOnListenWarnings_(l,n),(this.listens.get(i)&&this.listens.get(i).get(s))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(i,s),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&J(e,"w")){const i=we(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const s='".indexOn": "'+n._queryParams.getIndex().toString()+'"',r=n._path.toString();q(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||ya(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=bs)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=ga(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(n,i,s=>{const r=s.s,o=s.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,i=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,i)})}unlisten(e,n){const i=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+s),p(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,s)&&this.connected_&&this.sendUnlisten_(i,s,e._queryObject,n)}sendUnlisten_(e,n,i,s){this.log_("Unlisten on "+e+" for "+n);const r={p:e},o="n";s&&(r.q=i,r.t=s),this.sendRequest(o,r)}onDisconnectPut(e,n,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:i})}onDisconnectMerge(e,n,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:i})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,i,s){const r={p:n,d:i};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,n,i,s){this.putInternal("p",e,n,i,s)}merge(e,n,i,s){this.putInternal("m",e,n,i,s)}putInternal(e,n,i,s,r){this.initConnection_();const o={p:n,d:i};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,i,r=>{this.log_(n+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(r.s,r.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,i=>{if(i.s!=="ok"){const r=i.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+L(e));const n=e.r,i=this.requestCBHash_[n];i&&(delete this.requestCBHash_[n],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):Yn("Unrecognized action received from server: "+L(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){p(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=it,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=it,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Dc&&(this.reconnectDelay_=it),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*kc)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+re.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,i())},c=function(h){p(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(h)};this.realtime_={close:l,sendRequest:c};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[h,u]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?B("getToken() completed but was canceled"):(B("getToken() completed. Creating connection."),this.authToken_=h&&h.accessToken,this.appCheckToken_=u&&u.token,a=new bc(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,i,_=>{q(_+" ("+this.repoInfo_.toString()+")"),this.interrupt(Pc)},r))}catch(h){this.log_("Failed to get token: "+h),o||(this.repoInfo_.nodeAdmin&&q(h),l())}}}interrupt(e){B("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){B("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Vn(this.interruptReasons_)&&(this.reconnectDelay_=it,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let i;n?i=n.map(r=>pi(r)).join("$"):i="default";const s=this.removeListen_(e,i);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,n){const i=new I(e).toString();let s;if(this.listens.has(i)){const r=this.listens.get(i);s=r.get(n),r.delete(n),r.size===0&&this.listens.delete(i)}else s=void 0;return s}onAuthRevoked_(e,n){B("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Is&&(this.reconnectDelay_=bs,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){B("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Is&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+gr.replace(/\./g,"-")]=1,lr()?e["framework.cordova"]=1:ua()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Kt.getInstance().currentlyOnline();return Vn(this.interruptReasons_)&&e}}re.nextPersistentConnectionId_=0;re.nextConnectionId_=0;/**
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
 */class fn{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const i=new E(je,e),s=new E(je,n);return this.compare(i,s)!==0}minPost(){return E.MIN}}/**
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
 */let Mt;class $r extends fn{static get __EMPTY_NODE(){return Mt}static set __EMPTY_NODE(e){Mt=e}compare(e,n){return Ae(e.name,n.name)}isDefinedOn(e){throw Ye("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return E.MIN}maxPost(){return new E(be,Mt)}makePost(e,n){return p(typeof e=="string","KeyIndex indexValue must always be a string."),new E(e,Mt)}toString(){return".key"}}const Ue=new $r;/**
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
 */class Lt{constructor(e,n,i,s,r=null){this.isReverse_=s,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?i(e.key,n):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class M{constructor(e,n,i,s,r){this.key=e,this.value=n,this.color=i??M.RED,this.left=s??j.EMPTY_NODE,this.right=r??j.EMPTY_NODE}copy(e,n,i,s,r){return new M(e??this.key,n??this.value,i??this.color,s??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,i){let s=this;const r=i(e,s.key);return r<0?s=s.copy(null,null,null,s.left.insert(e,n,i),null):r===0?s=s.copy(null,n,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,n,i)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return j.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let i,s;if(i=this,n(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),n(e,i.key)===0){if(i.right.isEmpty())return j.EMPTY_NODE;s=i.right.min_(),i=i.copy(s.key,s.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,M.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,M.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}M.RED=!0;M.BLACK=!1;class Oc{copy(e,n,i,s,r){return this}insert(e,n,i){return new M(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class j{constructor(e,n=j.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new j(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,M.BLACK,null,null))}remove(e){return new j(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,M.BLACK,null,null))}get(e){let n,i=this.root_;for(;!i.isEmpty();){if(n=this.comparator_(e,i.key),n===0)return i.value;n<0?i=i.left:n>0&&(i=i.right)}return null}getPredecessorKey(e){let n,i=this.root_,s=null;for(;!i.isEmpty();)if(n=this.comparator_(e,i.key),n===0){if(i.left.isEmpty())return s?s.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else n<0?i=i.left:n>0&&(s=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Lt(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new Lt(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new Lt(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new Lt(this.root_,null,this.comparator_,!0,e)}}j.EMPTY_NODE=new Oc;/**
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
 */function xc(t,e){return Ae(t.name,e.name)}function Ei(t,e){return Ae(t,e)}/**
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
 */let Qn;function Mc(t){Qn=t}const jr=function(t){return typeof t=="number"?"number:"+wr(t):"string:"+t},qr=function(t){if(t.isLeafNode()){const e=t.val();p(typeof e=="string"||typeof e=="number"||typeof e=="object"&&J(e,".sv"),"Priority must be a string or number.")}else p(t===Qn||t.isEmpty(),"priority of unexpected type.");p(t===Qn||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
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
 */let Ts;class x{static set __childrenNodeConstructor(e){Ts=e}static get __childrenNodeConstructor(){return Ts}constructor(e,n=x.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,p(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),qr(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new x(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:x.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return C(e)?this:v(e)===".priority"?this.priorityNode_:x.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:x.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const i=v(e);return i===null?n:n.isEmpty()&&i!==".priority"?this:(p(i!==".priority"||pe(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,x.__childrenNodeConstructor.EMPTY_NODE.updateChild(T(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+jr(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=wr(this.value_):e+=this.value_,this.lazyHash_=Cr(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===x.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof x.__childrenNodeConstructor?-1:(p(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,i=typeof this.value_,s=x.VALUE_TYPE_ORDER.indexOf(n),r=x.VALUE_TYPE_ORDER.indexOf(i);return p(s>=0,"Unknown leaf type: "+n),p(r>=0,"Unknown leaf type: "+i),s===r?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}x.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
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
 */let Gr,zr;function Lc(t){Gr=t}function Fc(t){zr=t}class Wc extends fn{compare(e,n){const i=e.node.getPriority(),s=n.node.getPriority(),r=i.compareTo(s);return r===0?Ae(e.name,n.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return E.MIN}maxPost(){return new E(be,new x("[PRIORITY-POST]",zr))}makePost(e,n){const i=Gr(e);return new E(n,new x("[PRIORITY-POST]",i))}toString(){return".priority"}}const A=new Wc;/**
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
 */const Bc=Math.log(2);class Uc{constructor(e){const n=r=>parseInt(Math.log(r)/Bc,10),i=r=>parseInt(Array(r+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const s=i(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Qt=function(t,e,n,i){t.sort(e);const s=function(l,c){const d=c-l;let h,u;if(d===0)return null;if(d===1)return h=t[l],u=n?n(h):h,new M(u,h.node,M.BLACK,null,null);{const _=parseInt(d/2,10)+l,m=s(l,_),y=s(_+1,c);return h=t[_],u=n?n(h):h,new M(u,h.node,M.BLACK,m,y)}},r=function(l){let c=null,d=null,h=t.length;const u=function(m,y){const w=h-m,k=h;h-=m;const W=s(w+1,k),R=t[w],O=n?n(R):R;_(new M(O,R.node,y,null,W))},_=function(m){c?(c.left=m,c=m):(d=m,c=m)};for(let m=0;m<l.count;++m){const y=l.nextBitIsOne(),w=Math.pow(2,l.count-(m+1));y?u(w,M.BLACK):(u(w,M.BLACK),u(w,M.RED))}return d},o=new Uc(t.length),a=r(o);return new j(i||e,a)};/**
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
 */let On;const Pe={};class se{static get Default(){return p(Pe&&A,"ChildrenNode.ts has not been loaded"),On=On||new se({".priority":Pe},{".priority":A}),On}constructor(e,n){this.indexes_=e,this.indexSet_=n}get(e){const n=we(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof j?n:null}hasIndex(e){return J(this.indexSet_,e.toString())}addIndex(e,n){p(e!==Ue,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let s=!1;const r=n.getIterator(E.Wrap);let o=r.getNext();for(;o;)s=s||e.isDefinedOn(o.node),i.push(o),o=r.getNext();let a;s?a=Qt(i,e.getCompare()):a=Pe;const l=e.toString(),c=Object.assign({},this.indexSet_);c[l]=e;const d=Object.assign({},this.indexes_);return d[l]=a,new se(d,c)}addToIndexes(e,n){const i=jt(this.indexes_,(s,r)=>{const o=we(this.indexSet_,r);if(p(o,"Missing index implementation for "+r),s===Pe)if(o.isDefinedOn(e.node)){const a=[],l=n.getIterator(E.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),Qt(a,o.getCompare())}else return Pe;else{const a=n.get(e.name);let l=s;return a&&(l=l.remove(new E(e.name,a))),l.insert(e,e.node)}});return new se(i,this.indexSet_)}removeFromIndexes(e,n){const i=jt(this.indexes_,s=>{if(s===Pe)return s;{const r=n.get(e.name);return r?s.remove(new E(e.name,r)):s}});return new se(i,this.indexSet_)}}/**
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
 */let st;class g{static get EMPTY_NODE(){return st||(st=new g(new j(Ei),null,se.Default))}constructor(e,n,i){this.children_=e,this.priorityNode_=n,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&qr(this.priorityNode_),this.children_.isEmpty()&&p(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||st}updatePriority(e){return this.children_.isEmpty()?this:new g(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?st:n}}getChild(e){const n=v(e);return n===null?this:this.getImmediateChild(n).getChild(T(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(p(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const i=new E(e,n);let s,r;n.isEmpty()?(s=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(i,this.children_)):(s=this.children_.insert(e,n),r=this.indexMap_.addToIndexes(i,this.children_));const o=s.isEmpty()?st:this.priorityNode_;return new g(s,o,r)}}updateChild(e,n){const i=v(e);if(i===null)return n;{p(v(e)!==".priority"||pe(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(i).updateChild(T(e),n);return this.updateImmediateChild(i,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let i=0,s=0,r=!0;if(this.forEachChild(A,(o,a)=>{n[o]=a.val(e),i++,r&&g.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):r=!1}),!e&&r&&s<2*i){const o=[];for(const a in n)o[a]=n[a];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+jr(this.getPriority().val())+":"),this.forEachChild(A,(n,i)=>{const s=i.hash();s!==""&&(e+=":"+n+":"+s)}),this.lazyHash_=e===""?"":Cr(e)}return this.lazyHash_}getPredecessorChildName(e,n,i){const s=this.resolveIndex_(i);if(s){const r=s.getPredecessorKey(new E(e,n));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const i=n.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new E(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const i=n.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new E(n,this.children_.get(n)):null}forEachChild(e,n){const i=this.resolveIndex_(e);return i?i.inorderTraversal(s=>n(s.name,s.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const i=this.resolveIndex_(n);if(i)return i.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,E.Wrap);let r=s.peek();for(;r!=null&&n.compare(r,e)<0;)s.getNext(),r=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const i=this.resolveIndex_(n);if(i)return i.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,E.Wrap);let r=s.peek();for(;r!=null&&n.compare(r,e)>0;)s.getNext(),r=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===At?-1:0}withIndex(e){if(e===Ue||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new g(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===Ue||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const i=this.getIterator(A),s=n.getIterator(A);let r=i.getNext(),o=s.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=i.getNext(),o=s.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Ue?null:this.indexMap_.get(e.toString())}}g.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Hc extends g{constructor(){super(new j(Ei),g.EMPTY_NODE,se.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return g.EMPTY_NODE}isEmpty(){return!1}}const At=new Hc;Object.defineProperties(E,{MIN:{value:new E(je,g.EMPTY_NODE)},MAX:{value:new E(be,At)}});$r.__EMPTY_NODE=g.EMPTY_NODE;x.__childrenNodeConstructor=g;Mc(At);Fc(At);/**
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
 */const Vc=!0;function D(t,e=null){if(t===null)return g.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),p(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new x(n,D(e))}if(!(t instanceof Array)&&Vc){const n=[];let i=!1;if(V(t,(o,a)=>{if(o.substring(0,1)!=="."){const l=D(a);l.isEmpty()||(i=i||!l.getPriority().isEmpty(),n.push(new E(o,l)))}}),n.length===0)return g.EMPTY_NODE;const r=Qt(n,xc,o=>o.name,Ei);if(i){const o=Qt(n,A.getCompare());return new g(r,D(e),new se({".priority":o},{".priority":A}))}else return new g(r,D(e),se.Default)}else{let n=g.EMPTY_NODE;return V(t,(i,s)=>{if(J(t,i)&&i.substring(0,1)!=="."){const r=D(s);(r.isLeafNode()||!r.isEmpty())&&(n=n.updateImmediateChild(i,r))}}),n.updatePriority(D(e))}}Lc(D);/**
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
 */class $c extends fn{constructor(e){super(),this.indexPath_=e,p(!C(e)&&v(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const i=this.extractChild(e.node),s=this.extractChild(n.node),r=i.compareTo(s);return r===0?Ae(e.name,n.name):r}makePost(e,n){const i=D(e),s=g.EMPTY_NODE.updateChild(this.indexPath_,i);return new E(n,s)}maxPost(){const e=g.EMPTY_NODE.updateChild(this.indexPath_,At);return new E(be,e)}toString(){return yt(this.indexPath_,0).join("/")}}/**
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
 */class jc extends fn{compare(e,n){const i=e.node.compareTo(n.node);return i===0?Ae(e.name,n.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return E.MIN}maxPost(){return E.MAX}makePost(e,n){const i=D(e);return new E(n,i)}toString(){return".value"}}const qc=new jc;/**
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
 */function Yr(t){return{type:"value",snapshotNode:t}}function qe(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function vt(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function Ct(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function Gc(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
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
 */class wi{constructor(e){this.index_=e}updateChild(e,n,i,s,r,o){p(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(n);return a.getChild(s).equals(i.getChild(s))&&a.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(n)?o.trackChildChange(vt(n,a)):p(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(qe(n,i)):o.trackChildChange(Ct(n,i,a))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(n,i).withIndex(this.index_)}updateFullNode(e,n,i){return i!=null&&(e.isLeafNode()||e.forEachChild(A,(s,r)=>{n.hasChild(s)||i.trackChildChange(vt(s,r))}),n.isLeafNode()||n.forEachChild(A,(s,r)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(r)||i.trackChildChange(Ct(s,r,o))}else i.trackChildChange(qe(s,r))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?g.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
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
 */class Et{constructor(e){this.indexedFilter_=new wi(e.getIndex()),this.index_=e.getIndex(),this.startPost_=Et.getStartPost_(e),this.endPost_=Et.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&i}updateChild(e,n,i,s,r,o){return this.matches(new E(n,i))||(i=g.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,i,s,r,o)}updateFullNode(e,n,i){n.isLeafNode()&&(n=g.EMPTY_NODE);let s=n.withIndex(this.index_);s=s.updatePriority(g.EMPTY_NODE);const r=this;return n.forEachChild(A,(o,a)=>{r.matches(new E(o,a))||(s=s.updateImmediateChild(o,g.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,i)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
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
 */class zc{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=n=>{const i=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new Et(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,i,s,r,o){return this.rangedFilter_.matches(new E(n,i))||(i=g.EMPTY_NODE),e.getImmediateChild(n).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,i,s,r,o):this.fullLimitUpdateChild_(e,n,i,r,o)}updateFullNode(e,n,i){let s;if(n.isLeafNode()||n.isEmpty())s=g.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){s=g.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=n.withIndex(this.index_),s=s.updatePriority(g.EMPTY_NODE);let r;this.reverse_?r=s.getReverseIterator(this.index_):r=s.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,g.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,i)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,i,s,r){let o;if(this.reverse_){const h=this.index_.getCompare();o=(u,_)=>h(_,u)}else o=this.index_.getCompare();const a=e;p(a.numChildren()===this.limit_,"");const l=new E(n,i),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),d=this.rangedFilter_.matches(l);if(a.hasChild(n)){const h=a.getImmediateChild(n);let u=s.getChildAfterChild(this.index_,c,this.reverse_);for(;u!=null&&(u.name===n||a.hasChild(u.name));)u=s.getChildAfterChild(this.index_,u,this.reverse_);const _=u==null?1:o(u,l);if(d&&!i.isEmpty()&&_>=0)return r!=null&&r.trackChildChange(Ct(n,i,h)),a.updateImmediateChild(n,i);{r!=null&&r.trackChildChange(vt(n,h));const y=a.updateImmediateChild(n,g.EMPTY_NODE);return u!=null&&this.rangedFilter_.matches(u)?(r!=null&&r.trackChildChange(qe(u.name,u.node)),y.updateImmediateChild(u.name,u.node)):y}}else return i.isEmpty()?e:d&&o(c,l)>=0?(r!=null&&(r.trackChildChange(vt(c.name,c.node)),r.trackChildChange(qe(n,i))),a.updateImmediateChild(n,i).updateImmediateChild(c.name,g.EMPTY_NODE)):e}}/**
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
 */class bi{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=A}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return p(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return p(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:je}hasEnd(){return this.endSet_}getIndexEndValue(){return p(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return p(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:be}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return p(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===A}copy(){const e=new bi;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Yc(t){return t.loadsAllData()?new wi(t.getIndex()):t.hasLimit()?new zc(t):new Et(t)}function Ss(t){const e={};if(t.isDefault())return e;let n;if(t.index_===A?n="$priority":t.index_===qc?n="$value":t.index_===Ue?n="$key":(p(t.index_ instanceof $c,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=L(n),t.startSet_){const i=t.startAfterSet_?"startAfter":"startAt";e[i]=L(t.indexStartValue_),t.startNameSet_&&(e[i]+=","+L(t.indexStartName_))}if(t.endSet_){const i=t.endBeforeSet_?"endBefore":"endAt";e[i]=L(t.indexEndValue_),t.endNameSet_&&(e[i]+=","+L(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function Rs(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==A&&(e.i=t.index_.toString()),e}/**
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
 */class Xt extends Br{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(p(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,n,i,s){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=i,this.appCheckTokenProvider_=s,this.log_=Nt("p:rest:"),this.listens_={}}listen(e,n,i,s){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Xt.getListenId_(e,i),a={};this.listens_[o]=a;const l=Ss(e._queryParams);this.restRequest_(r+".json",l,(c,d)=>{let h=d;if(c===404&&(h=null,c=null),c===null&&this.onDataUpdate_(r,h,!1,i),we(this.listens_,o)===a){let u;c?c===401?u="permission_denied":u="rest_error:"+c:u="ok",s(u,null)}})}unlisten(e,n){const i=Xt.getListenId_(e,n);delete this.listens_[i]}get(e){const n=Ss(e._queryParams),i=e._path.toString(),s=new Z;return this.restRequest_(i+".json",n,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(i,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,n={},i){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,r])=>{s&&s.accessToken&&(n.auth=s.accessToken),r&&r.token&&(n.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+va(n);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(i&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=pt(a.responseText)}catch{q("Failed to parse JSON response for "+o+": "+a.responseText)}i(null,l)}else a.status!==401&&a.status!==404&&q("Got unsuccessful REST response for "+o+" Status: "+a.status),i(a.status);i=null}},a.open("GET",o,!0),a.send()})}}/**
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
 */class Kc{constructor(){this.rootNode_=g.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
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
 */function Jt(){return{value:null,children:new Map}}function Qe(t,e,n){if(C(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const i=v(e);t.children.has(i)||t.children.set(i,Jt());const s=t.children.get(i);e=T(e),Qe(s,e,n)}}function Xn(t,e){if(C(e))return t.value=null,t.children.clear(),!0;if(t.value!==null){if(t.value.isLeafNode())return!1;{const n=t.value;return t.value=null,n.forEachChild(A,(i,s)=>{Qe(t,new I(i),s)}),Xn(t,e)}}else if(t.children.size>0){const n=v(e);return e=T(e),t.children.has(n)&&Xn(t.children.get(n),e)&&t.children.delete(n),t.children.size===0}else return!0}function Jn(t,e,n){t.value!==null?n(e,t.value):Qc(t,(i,s)=>{const r=new I(e.toString()+"/"+i);Jn(s,r,n)})}function Qc(t,e){t.children.forEach((n,i)=>{e(i,n)})}/**
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
 */class Xc{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n=Object.assign({},e);return this.last_&&V(this.last_,(i,s)=>{n[i]=n[i]-s}),this.last_=e,n}}/**
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
 */const Ns=10*1e3,Jc=30*1e3,Zc=5*60*1e3;class eu{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new Xc(e);const i=Ns+(Jc-Ns)*Math.random();ct(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),n={};let i=!1;V(e,(s,r)=>{r>0&&J(this.statsToReport_,s)&&(n[s]=r,i=!0)}),i&&this.server_.reportStats(n),ct(this.reportStats_.bind(this),Math.floor(Math.random()*2*Zc))}}/**
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
 */var Q;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Q||(Q={}));function Kr(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Ii(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Ti(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
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
 */class Zt{constructor(e,n,i){this.path=e,this.affectedTree=n,this.revert=i,this.type=Q.ACK_USER_WRITE,this.source=Kr()}operationForChild(e){if(C(this.path)){if(this.affectedTree.value!=null)return p(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new I(e));return new Zt(b(),n,this.revert)}}else return p(v(this.path)===e,"operationForChild called for unrelated child."),new Zt(T(this.path),this.affectedTree,this.revert)}}/**
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
 */class wt{constructor(e,n){this.source=e,this.path=n,this.type=Q.LISTEN_COMPLETE}operationForChild(e){return C(this.path)?new wt(this.source,b()):new wt(this.source,T(this.path))}}/**
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
 */class Ie{constructor(e,n,i){this.source=e,this.path=n,this.snap=i,this.type=Q.OVERWRITE}operationForChild(e){return C(this.path)?new Ie(this.source,b(),this.snap.getImmediateChild(e)):new Ie(this.source,T(this.path),this.snap)}}/**
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
 */class bt{constructor(e,n,i){this.source=e,this.path=n,this.children=i,this.type=Q.MERGE}operationForChild(e){if(C(this.path)){const n=this.children.subtree(new I(e));return n.isEmpty()?null:n.value?new Ie(this.source,b(),n.value):new bt(this.source,b(),n)}else return p(v(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new bt(this.source,T(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
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
 */class Te{constructor(e,n,i){this.node_=e,this.fullyInitialized_=n,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(C(e))return this.isFullyInitialized()&&!this.filtered_;const n=v(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
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
 */class tu{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function nu(t,e,n,i){const s=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(Gc(o.childName,o.snapshotNode))}),rt(t,s,"child_removed",e,i,n),rt(t,s,"child_added",e,i,n),rt(t,s,"child_moved",r,i,n),rt(t,s,"child_changed",e,i,n),rt(t,s,"value",e,i,n),s}function rt(t,e,n,i,s,r){const o=i.filter(a=>a.type===n);o.sort((a,l)=>su(t,a,l)),o.forEach(a=>{const l=iu(t,a,r);s.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,t.query_))})})}function iu(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function su(t,e,n){if(e.childName==null||n.childName==null)throw Ye("Should only compare child_ events.");const i=new E(e.childName,e.snapshotNode),s=new E(n.childName,n.snapshotNode);return t.index_.compare(i,s)}/**
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
 */function pn(t,e){return{eventCache:t,serverCache:e}}function ut(t,e,n,i){return pn(new Te(e,n,i),t.serverCache)}function Qr(t,e,n,i){return pn(t.eventCache,new Te(e,n,i))}function Zn(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function Se(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
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
 */let xn;const ru=()=>(xn||(xn=new j($l)),xn);class N{static fromObject(e){let n=new N(null);return V(e,(i,s)=>{n=n.set(new I(i),s)}),n}constructor(e,n=ru()){this.value=e,this.children=n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:b(),value:this.value};if(C(e))return null;{const i=v(e),s=this.children.get(i);if(s!==null){const r=s.findRootMostMatchingPathAndValue(T(e),n);return r!=null?{path:P(new I(i),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(C(e))return this;{const n=v(e),i=this.children.get(n);return i!==null?i.subtree(T(e)):new N(null)}}set(e,n){if(C(e))return new N(n,this.children);{const i=v(e),r=(this.children.get(i)||new N(null)).set(T(e),n),o=this.children.insert(i,r);return new N(this.value,o)}}remove(e){if(C(e))return this.children.isEmpty()?new N(null):new N(null,this.children);{const n=v(e),i=this.children.get(n);if(i){const s=i.remove(T(e));let r;return s.isEmpty()?r=this.children.remove(n):r=this.children.insert(n,s),this.value===null&&r.isEmpty()?new N(null):new N(this.value,r)}else return this}}get(e){if(C(e))return this.value;{const n=v(e),i=this.children.get(n);return i?i.get(T(e)):null}}setTree(e,n){if(C(e))return n;{const i=v(e),r=(this.children.get(i)||new N(null)).setTree(T(e),n);let o;return r.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,r),new N(this.value,o)}}fold(e){return this.fold_(b(),e)}fold_(e,n){const i={};return this.children.inorderTraversal((s,r)=>{i[s]=r.fold_(P(e,s),n)}),n(e,this.value,i)}findOnPath(e,n){return this.findOnPath_(e,b(),n)}findOnPath_(e,n,i){const s=this.value?i(n,this.value):!1;if(s)return s;if(C(e))return null;{const r=v(e),o=this.children.get(r);return o?o.findOnPath_(T(e),P(n,r),i):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,b(),n)}foreachOnPath_(e,n,i){if(C(e))return this;{this.value&&i(n,this.value);const s=v(e),r=this.children.get(s);return r?r.foreachOnPath_(T(e),P(n,s),i):new N(null)}}foreach(e){this.foreach_(b(),e)}foreach_(e,n){this.children.inorderTraversal((i,s)=>{s.foreach_(P(e,i),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,i)=>{i.value&&e(n,i.value)})}}/**
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
 */class X{constructor(e){this.writeTree_=e}static empty(){return new X(new N(null))}}function ht(t,e,n){if(C(e))return new X(new N(n));{const i=t.writeTree_.findRootMostValueAndPath(e);if(i!=null){const s=i.path;let r=i.value;const o=$(s,e);return r=r.updateChild(o,n),new X(t.writeTree_.set(s,r))}else{const s=new N(n),r=t.writeTree_.setTree(e,s);return new X(r)}}}function As(t,e,n){let i=t;return V(n,(s,r)=>{i=ht(i,P(e,s),r)}),i}function ks(t,e){if(C(e))return X.empty();{const n=t.writeTree_.setTree(e,new N(null));return new X(n)}}function ei(t,e){return ke(t,e)!=null}function ke(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild($(n.path,e)):null}function Ds(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(A,(i,s)=>{e.push(new E(i,s))}):t.writeTree_.children.inorderTraversal((i,s)=>{s.value!=null&&e.push(new E(i,s.value))}),e}function fe(t,e){if(C(e))return t;{const n=ke(t,e);return n!=null?new X(new N(n)):new X(t.writeTree_.subtree(e))}}function ti(t){return t.writeTree_.isEmpty()}function Ge(t,e){return Xr(b(),t.writeTree_,e)}function Xr(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let i=null;return e.children.inorderTraversal((s,r)=>{s===".priority"?(p(r.value!==null,"Priority writes must always be leaf nodes"),i=r.value):n=Xr(P(t,s),r,n)}),!n.getChild(t).isEmpty()&&i!==null&&(n=n.updateChild(P(t,".priority"),i)),n}}/**
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
 */function Si(t,e){return to(e,t)}function ou(t,e,n,i,s){p(i>t.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),t.allWrites.push({path:e,snap:n,writeId:i,visible:s}),s&&(t.visibleWrites=ht(t.visibleWrites,e,n)),t.lastWriteId=i}function au(t,e){for(let n=0;n<t.allWrites.length;n++){const i=t.allWrites[n];if(i.writeId===e)return i}return null}function lu(t,e){const n=t.allWrites.findIndex(a=>a.writeId===e);p(n>=0,"removeWrite called with nonexistent writeId.");const i=t.allWrites[n];t.allWrites.splice(n,1);let s=i.visible,r=!1,o=t.allWrites.length-1;for(;s&&o>=0;){const a=t.allWrites[o];a.visible&&(o>=n&&cu(a,i.path)?s=!1:z(i.path,a.path)&&(r=!0)),o--}if(s){if(r)return uu(t),!0;if(i.snap)t.visibleWrites=ks(t.visibleWrites,i.path);else{const a=i.children;V(a,l=>{t.visibleWrites=ks(t.visibleWrites,P(i.path,l))})}return!0}else return!1}function cu(t,e){if(t.snap)return z(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&z(P(t.path,n),e))return!0;return!1}function uu(t){t.visibleWrites=Jr(t.allWrites,hu,b()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function hu(t){return t.visible}function Jr(t,e,n){let i=X.empty();for(let s=0;s<t.length;++s){const r=t[s];if(e(r)){const o=r.path;let a;if(r.snap)z(n,o)?(a=$(n,o),i=ht(i,a,r.snap)):z(o,n)&&(a=$(o,n),i=ht(i,b(),r.snap.getChild(a)));else if(r.children){if(z(n,o))a=$(n,o),i=As(i,a,r.children);else if(z(o,n))if(a=$(o,n),C(a))i=As(i,b(),r.children);else{const l=we(r.children,v(a));if(l){const c=l.getChild(T(a));i=ht(i,b(),c)}}}else throw Ye("WriteRecord should have .snap or .children")}}return i}function Zr(t,e,n,i,s){if(!i&&!s){const r=ke(t.visibleWrites,e);if(r!=null)return r;{const o=fe(t.visibleWrites,e);if(ti(o))return n;if(n==null&&!ei(o,b()))return null;{const a=n||g.EMPTY_NODE;return Ge(o,a)}}}else{const r=fe(t.visibleWrites,e);if(!s&&ti(r))return n;if(!s&&n==null&&!ei(r,b()))return null;{const o=function(c){return(c.visible||s)&&(!i||!~i.indexOf(c.writeId))&&(z(c.path,e)||z(e,c.path))},a=Jr(t.allWrites,o,e),l=n||g.EMPTY_NODE;return Ge(a,l)}}}function du(t,e,n){let i=g.EMPTY_NODE;const s=ke(t.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(A,(r,o)=>{i=i.updateImmediateChild(r,o)}),i;if(n){const r=fe(t.visibleWrites,e);return n.forEachChild(A,(o,a)=>{const l=Ge(fe(r,new I(o)),a);i=i.updateImmediateChild(o,l)}),Ds(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const r=fe(t.visibleWrites,e);return Ds(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function fu(t,e,n,i,s){p(i||s,"Either existingEventSnap or existingServerSnap must exist");const r=P(e,n);if(ei(t.visibleWrites,r))return null;{const o=fe(t.visibleWrites,r);return ti(o)?s.getChild(n):Ge(o,s.getChild(n))}}function pu(t,e,n,i){const s=P(e,n),r=ke(t.visibleWrites,s);if(r!=null)return r;if(i.isCompleteForChild(n)){const o=fe(t.visibleWrites,s);return Ge(o,i.getNode().getImmediateChild(n))}else return null}function _u(t,e){return ke(t.visibleWrites,e)}function mu(t,e,n,i,s,r,o){let a;const l=fe(t.visibleWrites,e),c=ke(l,b());if(c!=null)a=c;else if(n!=null)a=Ge(l,n);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const d=[],h=o.getCompare(),u=r?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o);let _=u.getNext();for(;_&&d.length<s;)h(_,i)!==0&&d.push(_),_=u.getNext();return d}else return[]}function gu(){return{visibleWrites:X.empty(),allWrites:[],lastWriteId:-1}}function en(t,e,n,i){return Zr(t.writeTree,t.treePath,e,n,i)}function Ri(t,e){return du(t.writeTree,t.treePath,e)}function Ps(t,e,n,i){return fu(t.writeTree,t.treePath,e,n,i)}function tn(t,e){return _u(t.writeTree,P(t.treePath,e))}function yu(t,e,n,i,s,r){return mu(t.writeTree,t.treePath,e,n,i,s,r)}function Ni(t,e,n){return pu(t.writeTree,t.treePath,e,n)}function eo(t,e){return to(P(t.treePath,e),t.writeTree)}function to(t,e){return{treePath:t,writeTree:e}}/**
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
 */class vu{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,i=e.childName;p(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),p(i!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(i);if(s){const r=s.type;if(n==="child_added"&&r==="child_removed")this.changeMap.set(i,Ct(i,e.snapshotNode,s.snapshotNode));else if(n==="child_removed"&&r==="child_added")this.changeMap.delete(i);else if(n==="child_removed"&&r==="child_changed")this.changeMap.set(i,vt(i,s.oldSnap));else if(n==="child_changed"&&r==="child_added")this.changeMap.set(i,qe(i,e.snapshotNode));else if(n==="child_changed"&&r==="child_changed")this.changeMap.set(i,Ct(i,e.snapshotNode,s.oldSnap));else throw Ye("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
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
 */class Cu{getCompleteChild(e){return null}getChildAfterChild(e,n,i){return null}}const no=new Cu;class Ai{constructor(e,n,i=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=i}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new Te(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Ni(this.writes_,e,i)}}getChildAfterChild(e,n,i){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Se(this.viewCache_),r=yu(this.writes_,s,n,1,i,e);return r.length===0?null:r[0]}}/**
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
 */function Eu(t){return{filter:t}}function wu(t,e){p(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),p(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function bu(t,e,n,i,s){const r=new vu;let o,a;if(n.type===Q.OVERWRITE){const c=n;c.source.fromUser?o=ni(t,e,c.path,c.snap,i,s,r):(p(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!C(c.path),o=nn(t,e,c.path,c.snap,i,s,a,r))}else if(n.type===Q.MERGE){const c=n;c.source.fromUser?o=Tu(t,e,c.path,c.children,i,s,r):(p(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=ii(t,e,c.path,c.children,i,s,a,r))}else if(n.type===Q.ACK_USER_WRITE){const c=n;c.revert?o=Nu(t,e,c.path,i,s,r):o=Su(t,e,c.path,c.affectedTree,i,s,r)}else if(n.type===Q.LISTEN_COMPLETE)o=Ru(t,e,n.path,i,r);else throw Ye("Unknown operation type: "+n.type);const l=r.getChanges();return Iu(e,o,l),{viewCache:o,changes:l}}function Iu(t,e,n){const i=e.eventCache;if(i.isFullyInitialized()){const s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=Zn(t);(n.length>0||!t.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&n.push(Yr(Zn(e)))}}function io(t,e,n,i,s,r){const o=e.eventCache;if(tn(i,n)!=null)return e;{let a,l;if(C(n))if(p(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=Se(e),d=c instanceof g?c:g.EMPTY_NODE,h=Ri(i,d);a=t.filter.updateFullNode(e.eventCache.getNode(),h,r)}else{const c=en(i,Se(e));a=t.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=v(n);if(c===".priority"){p(pe(n)===1,"Can't have a priority with additional path components");const d=o.getNode();l=e.serverCache.getNode();const h=Ps(i,n,d,l);h!=null?a=t.filter.updatePriority(d,h):a=o.getNode()}else{const d=T(n);let h;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const u=Ps(i,n,o.getNode(),l);u!=null?h=o.getNode().getImmediateChild(c).updateChild(d,u):h=o.getNode().getImmediateChild(c)}else h=Ni(i,c,e.serverCache);h!=null?a=t.filter.updateChild(o.getNode(),c,h,d,s,r):a=o.getNode()}}return ut(e,a,o.isFullyInitialized()||C(n),t.filter.filtersNodes())}}function nn(t,e,n,i,s,r,o,a){const l=e.serverCache;let c;const d=o?t.filter:t.filter.getIndexedFilter();if(C(n))c=d.updateFullNode(l.getNode(),i,null);else if(d.filtersNodes()&&!l.isFiltered()){const _=l.getNode().updateChild(n,i);c=d.updateFullNode(l.getNode(),_,null)}else{const _=v(n);if(!l.isCompleteForPath(n)&&pe(n)>1)return e;const m=T(n),w=l.getNode().getImmediateChild(_).updateChild(m,i);_===".priority"?c=d.updatePriority(l.getNode(),w):c=d.updateChild(l.getNode(),_,w,m,no,null)}const h=Qr(e,c,l.isFullyInitialized()||C(n),d.filtersNodes()),u=new Ai(s,h,r);return io(t,h,n,s,u,a)}function ni(t,e,n,i,s,r,o){const a=e.eventCache;let l,c;const d=new Ai(s,e,r);if(C(n))c=t.filter.updateFullNode(e.eventCache.getNode(),i,o),l=ut(e,c,!0,t.filter.filtersNodes());else{const h=v(n);if(h===".priority")c=t.filter.updatePriority(e.eventCache.getNode(),i),l=ut(e,c,a.isFullyInitialized(),a.isFiltered());else{const u=T(n),_=a.getNode().getImmediateChild(h);let m;if(C(u))m=i;else{const y=d.getCompleteChild(h);y!=null?yi(u)===".priority"&&y.getChild(Hr(u)).isEmpty()?m=y:m=y.updateChild(u,i):m=g.EMPTY_NODE}if(_.equals(m))l=e;else{const y=t.filter.updateChild(a.getNode(),h,m,u,d,o);l=ut(e,y,a.isFullyInitialized(),t.filter.filtersNodes())}}}return l}function Os(t,e){return t.eventCache.isCompleteForChild(e)}function Tu(t,e,n,i,s,r,o){let a=e;return i.foreach((l,c)=>{const d=P(n,l);Os(e,v(d))&&(a=ni(t,a,d,c,s,r,o))}),i.foreach((l,c)=>{const d=P(n,l);Os(e,v(d))||(a=ni(t,a,d,c,s,r,o))}),a}function xs(t,e,n){return n.foreach((i,s)=>{e=e.updateChild(i,s)}),e}function ii(t,e,n,i,s,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;C(n)?c=i:c=new N(null).setTree(n,i);const d=e.serverCache.getNode();return c.children.inorderTraversal((h,u)=>{if(d.hasChild(h)){const _=e.serverCache.getNode().getImmediateChild(h),m=xs(t,_,u);l=nn(t,l,new I(h),m,s,r,o,a)}}),c.children.inorderTraversal((h,u)=>{const _=!e.serverCache.isCompleteForChild(h)&&u.value===null;if(!d.hasChild(h)&&!_){const m=e.serverCache.getNode().getImmediateChild(h),y=xs(t,m,u);l=nn(t,l,new I(h),y,s,r,o,a)}}),l}function Su(t,e,n,i,s,r,o){if(tn(s,n)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(i.value!=null){if(C(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return nn(t,e,n,l.getNode().getChild(n),s,r,a,o);if(C(n)){let c=new N(null);return l.getNode().forEachChild(Ue,(d,h)=>{c=c.set(new I(d),h)}),ii(t,e,n,c,s,r,a,o)}else return e}else{let c=new N(null);return i.foreach((d,h)=>{const u=P(n,d);l.isCompleteForPath(u)&&(c=c.set(d,l.getNode().getChild(u)))}),ii(t,e,n,c,s,r,a,o)}}function Ru(t,e,n,i,s){const r=e.serverCache,o=Qr(e,r.getNode(),r.isFullyInitialized()||C(n),r.isFiltered());return io(t,o,n,i,no,s)}function Nu(t,e,n,i,s,r){let o;if(tn(i,n)!=null)return e;{const a=new Ai(i,e,s),l=e.eventCache.getNode();let c;if(C(n)||v(n)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=en(i,Se(e));else{const h=e.serverCache.getNode();p(h instanceof g,"serverChildren would be complete if leaf node"),d=Ri(i,h)}d=d,c=t.filter.updateFullNode(l,d,r)}else{const d=v(n);let h=Ni(i,d,e.serverCache);h==null&&e.serverCache.isCompleteForChild(d)&&(h=l.getImmediateChild(d)),h!=null?c=t.filter.updateChild(l,d,h,T(n),a,r):e.eventCache.getNode().hasChild(d)?c=t.filter.updateChild(l,d,g.EMPTY_NODE,T(n),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=en(i,Se(e)),o.isLeafNode()&&(c=t.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||tn(i,b())!=null,ut(e,c,o,t.filter.filtersNodes())}}/**
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
 */class Au{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,s=new wi(i.getIndex()),r=Yc(i);this.processor_=Eu(r);const o=n.serverCache,a=n.eventCache,l=s.updateFullNode(g.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(g.EMPTY_NODE,a.getNode(),null),d=new Te(l,o.isFullyInitialized(),s.filtersNodes()),h=new Te(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=pn(h,d),this.eventGenerator_=new tu(this.query_)}get query(){return this.query_}}function ku(t){return t.viewCache_.serverCache.getNode()}function Du(t,e){const n=Se(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!C(e)&&!n.getImmediateChild(v(e)).isEmpty())?n.getChild(e):null}function Ms(t){return t.eventRegistrations_.length===0}function Pu(t,e){t.eventRegistrations_.push(e)}function Ls(t,e,n){const i=[];if(n){p(e==null,"A cancel should cancel all event registrations.");const s=t.query._path;t.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(n,s);o&&i.push(o)})}if(e){let s=[];for(let r=0;r<t.eventRegistrations_.length;++r){const o=t.eventRegistrations_[r];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(t.eventRegistrations_.slice(r+1));break}}t.eventRegistrations_=s}else t.eventRegistrations_=[];return i}function Fs(t,e,n,i){e.type===Q.MERGE&&e.source.queryId!==null&&(p(Se(t.viewCache_),"We should always have a full cache before handling merges"),p(Zn(t.viewCache_),"Missing event cache, even though we have a server cache"));const s=t.viewCache_,r=bu(t.processor_,s,e,n,i);return wu(t.processor_,r.viewCache),p(r.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=r.viewCache,so(t,r.changes,r.viewCache.eventCache.getNode(),null)}function Ou(t,e){const n=t.viewCache_.eventCache,i=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(A,(r,o)=>{i.push(qe(r,o))}),n.isFullyInitialized()&&i.push(Yr(n.getNode())),so(t,i,n.getNode(),e)}function so(t,e,n,i){const s=i?[i]:t.eventRegistrations_;return nu(t.eventGenerator_,e,n,s)}/**
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
 */let sn;class xu{constructor(){this.views=new Map}}function Mu(t){p(!sn,"__referenceConstructor has already been defined"),sn=t}function Lu(){return p(sn,"Reference.ts has not been loaded"),sn}function Fu(t){return t.views.size===0}function ki(t,e,n,i){const s=e.source.queryId;if(s!==null){const r=t.views.get(s);return p(r!=null,"SyncTree gave us an op for an invalid query."),Fs(r,e,n,i)}else{let r=[];for(const o of t.views.values())r=r.concat(Fs(o,e,n,i));return r}}function Wu(t,e,n,i,s){const r=e._queryIdentifier,o=t.views.get(r);if(!o){let a=en(n,s?i:null),l=!1;a?l=!0:i instanceof g?(a=Ri(n,i),l=!1):(a=g.EMPTY_NODE,l=!1);const c=pn(new Te(a,l,!1),new Te(i,s,!1));return new Au(e,c)}return o}function Bu(t,e,n,i,s,r){const o=Wu(t,e,i,s,r);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),Pu(o,n),Ou(o,n)}function Uu(t,e,n,i){const s=e._queryIdentifier,r=[];let o=[];const a=_e(t);if(s==="default")for(const[l,c]of t.views.entries())o=o.concat(Ls(c,n,i)),Ms(c)&&(t.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=t.views.get(s);l&&(o=o.concat(Ls(l,n,i)),Ms(l)&&(t.views.delete(s),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!_e(t)&&r.push(new(Lu())(e._repo,e._path)),{removed:r,events:o}}function ro(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function He(t,e){let n=null;for(const i of t.views.values())n=n||Du(i,e);return n}function oo(t,e){if(e._queryParams.loadsAllData())return _n(t);{const i=e._queryIdentifier;return t.views.get(i)}}function ao(t,e){return oo(t,e)!=null}function _e(t){return _n(t)!=null}function _n(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
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
 */let rn;function Hu(t){p(!rn,"__referenceConstructor has already been defined"),rn=t}function Vu(){return p(rn,"Reference.ts has not been loaded"),rn}let $u=1;class Ws{constructor(e){this.listenProvider_=e,this.syncPointTree_=new N(null),this.pendingWriteTree_=gu(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Di(t,e,n,i,s){return ou(t.pendingWriteTree_,e,n,i,s),s?kt(t,new Ie(Kr(),e,n)):[]}function Ce(t,e,n=!1){const i=au(t.pendingWriteTree_,e);if(lu(t.pendingWriteTree_,e)){let r=new N(null);return i.snap!=null?r=r.set(b(),!0):V(i.children,o=>{r=r.set(new I(o),!0)}),kt(t,new Zt(i.path,r,n))}else return[]}function mn(t,e,n){return kt(t,new Ie(Ii(),e,n))}function ju(t,e,n){const i=N.fromObject(n);return kt(t,new bt(Ii(),e,i))}function qu(t,e){return kt(t,new wt(Ii(),e))}function Gu(t,e,n){const i=Pi(t,n);if(i){const s=Oi(i),r=s.path,o=s.queryId,a=$(r,e),l=new wt(Ti(o),a);return xi(t,r,l)}else return[]}function si(t,e,n,i,s=!1){const r=e._path,o=t.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||ao(o,e))){const l=Uu(o,e,n,i);Fu(o)&&(t.syncPointTree_=t.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!s){const d=c.findIndex(u=>u._queryParams.loadsAllData())!==-1,h=t.syncPointTree_.findOnPath(r,(u,_)=>_e(_));if(d&&!h){const u=t.syncPointTree_.subtree(r);if(!u.isEmpty()){const _=Ku(u);for(let m=0;m<_.length;++m){const y=_[m],w=y.query,k=uo(t,y);t.listenProvider_.startListening(dt(w),on(t,w),k.hashFn,k.onComplete)}}}!h&&c.length>0&&!i&&(d?t.listenProvider_.stopListening(dt(e),null):c.forEach(u=>{const _=t.queryToTagMap.get(yn(u));t.listenProvider_.stopListening(dt(u),_)}))}Qu(t,c)}return a}function zu(t,e,n,i){const s=Pi(t,i);if(s!=null){const r=Oi(s),o=r.path,a=r.queryId,l=$(o,e),c=new Ie(Ti(a),l,n);return xi(t,o,c)}else return[]}function Yu(t,e,n,i){const s=Pi(t,i);if(s){const r=Oi(s),o=r.path,a=r.queryId,l=$(o,e),c=N.fromObject(n),d=new bt(Ti(a),l,c);return xi(t,o,d)}else return[]}function Bs(t,e,n,i=!1){const s=e._path;let r=null,o=!1;t.syncPointTree_.foreachOnPath(s,(u,_)=>{const m=$(u,s);r=r||He(_,m),o=o||_e(_)});let a=t.syncPointTree_.get(s);a?(o=o||_e(a),r=r||He(a,b())):(a=new xu,t.syncPointTree_=t.syncPointTree_.set(s,a));let l;r!=null?l=!0:(l=!1,r=g.EMPTY_NODE,t.syncPointTree_.subtree(s).foreachChild((_,m)=>{const y=He(m,b());y&&(r=r.updateImmediateChild(_,y))}));const c=ao(a,e);if(!c&&!e._queryParams.loadsAllData()){const u=yn(e);p(!t.queryToTagMap.has(u),"View does not exist, but we have a tag");const _=Xu();t.queryToTagMap.set(u,_),t.tagToQueryMap.set(_,u)}const d=Si(t.pendingWriteTree_,s);let h=Bu(a,e,n,d,r,l);if(!c&&!o&&!i){const u=oo(a,e);h=h.concat(Ju(t,e,u))}return h}function gn(t,e,n){const s=t.pendingWriteTree_,r=t.syncPointTree_.findOnPath(e,(o,a)=>{const l=$(o,e),c=He(a,l);if(c)return c});return Zr(s,e,r,n,!0)}function kt(t,e){return lo(e,t.syncPointTree_,null,Si(t.pendingWriteTree_,b()))}function lo(t,e,n,i){if(C(t.path))return co(t,e,n,i);{const s=e.get(b());n==null&&s!=null&&(n=He(s,b()));let r=[];const o=v(t.path),a=t.operationForChild(o),l=e.children.get(o);if(l&&a){const c=n?n.getImmediateChild(o):null,d=eo(i,o);r=r.concat(lo(a,l,c,d))}return s&&(r=r.concat(ki(s,t,i,n))),r}}function co(t,e,n,i){const s=e.get(b());n==null&&s!=null&&(n=He(s,b()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=n?n.getImmediateChild(o):null,c=eo(i,o),d=t.operationForChild(o);d&&(r=r.concat(co(d,a,l,c)))}),s&&(r=r.concat(ki(s,t,i,n))),r}function uo(t,e){const n=e.query,i=on(t,n);return{hashFn:()=>(ku(e)||g.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return i?Gu(t,n._path,i):qu(t,n._path);{const r=Gl(s,n);return si(t,n,null,r)}}}}function on(t,e){const n=yn(e);return t.queryToTagMap.get(n)}function yn(t){return t._path.toString()+"$"+t._queryIdentifier}function Pi(t,e){return t.tagToQueryMap.get(e)}function Oi(t){const e=t.indexOf("$");return p(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new I(t.substr(0,e))}}function xi(t,e,n){const i=t.syncPointTree_.get(e);p(i,"Missing sync point for query tag that we're tracking");const s=Si(t.pendingWriteTree_,e);return ki(i,n,s,null)}function Ku(t){return t.fold((e,n,i)=>{if(n&&_e(n))return[_n(n)];{let s=[];return n&&(s=ro(n)),V(i,(r,o)=>{s=s.concat(o)}),s}})}function dt(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new(Vu())(t._repo,t._path):t}function Qu(t,e){for(let n=0;n<e.length;++n){const i=e[n];if(!i._queryParams.loadsAllData()){const s=yn(i),r=t.queryToTagMap.get(s);t.queryToTagMap.delete(s),t.tagToQueryMap.delete(r)}}}function Xu(){return $u++}function Ju(t,e,n){const i=e._path,s=on(t,e),r=uo(t,n),o=t.listenProvider_.startListening(dt(e),s,r.hashFn,r.onComplete),a=t.syncPointTree_.subtree(i);if(s)p(!_e(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,d,h)=>{if(!C(c)&&d&&_e(d))return[_n(d).query];{let u=[];return d&&(u=u.concat(ro(d).map(_=>_.query))),V(h,(_,m)=>{u=u.concat(m)}),u}});for(let c=0;c<l.length;++c){const d=l[c];t.listenProvider_.stopListening(dt(d),on(t,d))}}return o}/**
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
 */class Mi{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new Mi(n)}node(){return this.node_}}class Li{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=P(this.path_,e);return new Li(this.syncTree_,n)}node(){return gn(this.syncTree_,this.path_)}}const Zu=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},Us=function(t,e,n){if(!t||typeof t!="object")return t;if(p(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return eh(t[".sv"],e,n);if(typeof t[".sv"]=="object")return th(t[".sv"],e);p(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},eh=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:p(!1,"Unexpected server value: "+t)}},th=function(t,e,n){t.hasOwnProperty("increment")||p(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const i=t.increment;typeof i!="number"&&p(!1,"Unexpected increment value: "+i);const s=e.node();if(p(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;const o=s.getValue();return typeof o!="number"?i:o+i},nh=function(t,e,n,i){return Wi(e,new Li(n,t),i)},Fi=function(t,e,n){return Wi(t,new Mi(e),n)};function Wi(t,e,n){const i=t.getPriority().val(),s=Us(i,e.getImmediateChild(".priority"),n);let r;if(t.isLeafNode()){const o=t,a=Us(o.getValue(),e,n);return a!==o.getValue()||s!==o.getPriority().val()?new x(a,D(s)):t}else{const o=t;return r=o,s!==o.getPriority().val()&&(r=r.updatePriority(new x(s))),o.forEachChild(A,(a,l)=>{const c=Wi(l,e.getImmediateChild(a),n);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
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
 */class Bi{constructor(e="",n=null,i={children:{},childCount:0}){this.name=e,this.parent=n,this.node=i}}function vn(t,e){let n=e instanceof I?e:new I(e),i=t,s=v(n);for(;s!==null;){const r=we(i.node.children,s)||{children:{},childCount:0};i=new Bi(s,i,r),n=T(n),s=v(n)}return i}function De(t){return t.node.value}function Ui(t,e){t.node.value=e,ri(t)}function ho(t){return t.node.childCount>0}function ih(t){return De(t)===void 0&&!ho(t)}function Cn(t,e){V(t.node.children,(n,i)=>{e(new Bi(n,t,i))})}function fo(t,e,n,i){n&&e(t),Cn(t,s=>{fo(s,e,!0)})}function sh(t,e,n){let i=t.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function Dt(t){return new I(t.parent===null?t.name:Dt(t.parent)+"/"+t.name)}function ri(t){t.parent!==null&&rh(t.parent,t.name,t)}function rh(t,e,n){const i=ih(n),s=J(t.node.children,e);i&&s?(delete t.node.children[e],t.node.childCount--,ri(t)):!i&&!s&&(t.node.children[e]=n.node,t.node.childCount++,ri(t))}/**
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
 */const oh=/[\[\].#$\/\u0000-\u001F\u007F]/,ah=/[\[\].#$\u0000-\u001F\u007F]/,Mn=10*1024*1024,Hi=function(t){return typeof t=="string"&&t.length!==0&&!oh.test(t)},po=function(t){return typeof t=="string"&&t.length!==0&&!ah.test(t)},lh=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),po(t)},Vi=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!dn(t)||t&&typeof t=="object"&&J(t,".sv")},oi=function(t,e,n,i){Pt($e(t,"value"),e,n)},Pt=function(t,e,n){const i=n instanceof I?new Sc(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+ye(i));if(typeof e=="function")throw new Error(t+"contains a function "+ye(i)+" with contents = "+e.toString());if(dn(e))throw new Error(t+"contains "+e.toString()+" "+ye(i));if(typeof e=="string"&&e.length>Mn/3&&hn(e)>Mn)throw new Error(t+"contains a string greater than "+Mn+" utf8 bytes "+ye(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,r=!1;if(V(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!Hi(o)))throw new Error(t+" contains an invalid key ("+o+") "+ye(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Rc(i,o),Pt(t,a,i),Nc(i)}),s&&r)throw new Error(t+' contains ".value" child '+ye(i)+" in addition to actual children.")}},ch=function(t,e){let n,i;for(n=0;n<e.length;n++){i=e[n];const r=yt(i);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!Hi(r[o]))throw new Error(t+"contains an invalid key ("+r[o]+") in path "+i.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(Tc);let s=null;for(n=0;n<e.length;n++){if(i=e[n],s!==null&&z(s,i))throw new Error(t+"contains a path "+s.toString()+" that is ancestor of another path "+i.toString());s=i}},uh=function(t,e,n,i){const s=$e(t,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(s+" must be an object containing the children to replace.");const r=[];V(e,(o,a)=>{const l=new I(o);if(Pt(s,a,P(n,l)),yi(l)===".priority"&&!Vi(a))throw new Error(s+"contains an invalid value for '"+l.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(l)}),ch(s,r)},hh=function(t,e,n){if(dn(e))throw new Error($e(t,"priority")+"is "+e.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Vi(e))throw new Error($e(t,"priority")+"must be a valid Firebase priority (a string, finite number, server value, or null).")},_o=function(t,e,n,i){if(!po(n))throw new Error($e(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},dh=function(t,e,n,i){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),_o(t,e,n)},Le=function(t,e){if(v(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},fh=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Hi(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!lh(n))throw new Error($e(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
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
 */class ph{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function $i(t,e){let n=null;for(let i=0;i<e.length;i++){const s=e[i],r=s.getPath();n!==null&&!vi(r,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:r}),n.events.push(s)}n&&t.eventLists_.push(n)}function mo(t,e,n){$i(t,n),go(t,i=>vi(i,e))}function te(t,e,n){$i(t,n),go(t,i=>z(i,e)||z(e,i))}function go(t,e){t.recursionDepth_++;let n=!0;for(let i=0;i<t.eventLists_.length;i++){const s=t.eventLists_[i];if(s){const r=s.path;e(r)?(_h(t.eventLists_[i]),t.eventLists_[i]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function _h(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const i=n.getEventRunner();lt&&B("event: "+n.toString()),Ke(i)}}}/**
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
 */const mh="repo_interrupt",gh=25;class yh{constructor(e,n,i,s){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=i,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new ph,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Jt(),this.transactionQueueTree_=new Bi,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function vh(t,e,n){if(t.stats_=mi(t.repoInfo_),t.forceRestClient_||Ql())t.server_=new Xt(t.repoInfo_,(i,s,r,o)=>{Hs(t,i,s,r,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>Vs(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{L(n)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}t.persistentConnection_=new re(t.repoInfo_,e,(i,s,r,o)=>{Hs(t,i,s,r,o)},i=>{Vs(t,i)},i=>{Eh(t,i)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(i=>{t.server_.refreshAuthToken(i)}),t.appCheckProvider_.addTokenChangeListener(i=>{t.server_.refreshAppCheckToken(i.token)}),t.statsReporter_=tc(t.repoInfo_,()=>new eu(t.stats_,t.server_)),t.infoData_=new Kc,t.infoSyncTree_=new Ws({startListening:(i,s,r,o)=>{let a=[];const l=t.infoData_.getNode(i._path);return l.isEmpty()||(a=mn(t.infoSyncTree_,i._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),ji(t,"connected",!1),t.serverSyncTree_=new Ws({startListening:(i,s,r,o)=>(t.server_.listen(i,r,s,(a,l)=>{const c=o(a,l);te(t.eventQueue_,i._path,c)}),[]),stopListening:(i,s)=>{t.server_.unlisten(i,s)}})}function Ch(t){const n=t.infoData_.getNode(new I(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function En(t){return Zu({timestamp:Ch(t)})}function Hs(t,e,n,i,s){t.dataUpdateCount++;const r=new I(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(s)if(i){const l=jt(n,c=>D(c));o=Yu(t.serverSyncTree_,r,l,s)}else{const l=D(n);o=zu(t.serverSyncTree_,r,l,s)}else if(i){const l=jt(n,c=>D(c));o=ju(t.serverSyncTree_,r,l)}else{const l=D(n);o=mn(t.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=In(t,r)),te(t.eventQueue_,a,o)}function Vs(t,e){ji(t,"connected",e),e===!1&&bh(t)}function Eh(t,e){V(e,(n,i)=>{ji(t,n,i)})}function ji(t,e,n){const i=new I("/.info/"+e),s=D(n);t.infoData_.updateSnapshot(i,s);const r=mn(t.infoSyncTree_,i,s);te(t.eventQueue_,i,r)}function qi(t){return t.nextWriteId_++}function wh(t,e,n,i,s){wn(t,"set",{path:e.toString(),value:n,priority:i});const r=En(t),o=D(n,i),a=gn(t.serverSyncTree_,e),l=Fi(o,a,r),c=qi(t),d=Di(t.serverSyncTree_,e,l,c,!0);$i(t.eventQueue_,d),t.server_.put(e.toString(),o.val(!0),(u,_)=>{const m=u==="ok";m||q("set at "+e+" failed: "+u);const y=Ce(t.serverSyncTree_,c,!m);te(t.eventQueue_,e,y),ze(t,s,u,_)});const h=Eo(t,e);In(t,h),te(t.eventQueue_,h,[])}function bh(t){wn(t,"onDisconnectEvents");const e=En(t),n=Jt();Jn(t.onDisconnect_,b(),(s,r)=>{const o=nh(s,r,t.serverSyncTree_,e);Qe(n,s,o)});let i=[];Jn(n,b(),(s,r)=>{i=i.concat(mn(t.serverSyncTree_,s,r));const o=Eo(t,s);In(t,o)}),t.onDisconnect_=Jt(),te(t.eventQueue_,b(),i)}function Ih(t,e,n){t.server_.onDisconnectCancel(e.toString(),(i,s)=>{i==="ok"&&Xn(t.onDisconnect_,e),ze(t,n,i,s)})}function $s(t,e,n,i){const s=D(n);t.server_.onDisconnectPut(e.toString(),s.val(!0),(r,o)=>{r==="ok"&&Qe(t.onDisconnect_,e,s),ze(t,i,r,o)})}function Th(t,e,n,i,s){const r=D(n,i);t.server_.onDisconnectPut(e.toString(),r.val(!0),(o,a)=>{o==="ok"&&Qe(t.onDisconnect_,e,r),ze(t,s,o,a)})}function Sh(t,e,n,i){if(Vn(n)){B("onDisconnect().update() called with empty data.  Don't do anything."),ze(t,i,"ok",void 0);return}t.server_.onDisconnectMerge(e.toString(),n,(s,r)=>{s==="ok"&&V(n,(o,a)=>{const l=D(a);Qe(t.onDisconnect_,P(e,o),l)}),ze(t,i,s,r)})}function Rh(t,e,n){let i;v(e._path)===".info"?i=Bs(t.infoSyncTree_,e,n):i=Bs(t.serverSyncTree_,e,n),mo(t.eventQueue_,e._path,i)}function js(t,e,n){let i;v(e._path)===".info"?i=si(t.infoSyncTree_,e,n):i=si(t.serverSyncTree_,e,n),mo(t.eventQueue_,e._path,i)}function Nh(t){t.persistentConnection_&&t.persistentConnection_.interrupt(mh)}function wn(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),B(n,...e)}function ze(t,e,n,i){e&&Ke(()=>{if(n==="ok")e(null);else{const s=(n||"error").toUpperCase();let r=s;i&&(r+=": "+i);const o=new Error(r);o.code=s,e(o)}})}function Ah(t,e,n,i,s,r){wn(t,"transaction on "+e);const o={path:e,update:n,onComplete:i,status:null,order:vr(),applyLocally:r,retryCount:0,unwatcher:s,abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null},a=Gi(t,e,void 0);o.currentInputSnapshot=a;const l=o.update(a.val());if(l===void 0)o.unwatcher(),o.currentOutputSnapshotRaw=null,o.currentOutputSnapshotResolved=null,o.onComplete&&o.onComplete(null,!1,o.currentInputSnapshot);else{Pt("transaction failed: Data returned ",l,o.path),o.status=0;const c=vn(t.transactionQueueTree_,e),d=De(c)||[];d.push(o),Ui(c,d);let h;typeof l=="object"&&l!==null&&J(l,".priority")?(h=we(l,".priority"),p(Vi(h),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):h=(gn(t.serverSyncTree_,e)||g.EMPTY_NODE).getPriority().val();const u=En(t),_=D(l,h),m=Fi(_,a,u);o.currentOutputSnapshotRaw=_,o.currentOutputSnapshotResolved=m,o.currentWriteId=qi(t);const y=Di(t.serverSyncTree_,e,m,o.currentWriteId,o.applyLocally);te(t.eventQueue_,e,y),bn(t,t.transactionQueueTree_)}}function Gi(t,e,n){return gn(t.serverSyncTree_,e,n)||g.EMPTY_NODE}function bn(t,e=t.transactionQueueTree_){if(e||Tn(t,e),De(e)){const n=vo(t,e);p(n.length>0,"Sending zero length transaction queue"),n.every(s=>s.status===0)&&kh(t,Dt(e),n)}else ho(e)&&Cn(e,n=>{bn(t,n)})}function kh(t,e,n){const i=n.map(c=>c.currentWriteId),s=Gi(t,e,i);let r=s;const o=s.hash();for(let c=0;c<n.length;c++){const d=n[c];p(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const h=$(e,d.path);r=r.updateChild(h,d.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;t.server_.put(l.toString(),a,c=>{wn(t,"transaction put response",{path:l.toString(),status:c});let d=[];if(c==="ok"){const h=[];for(let u=0;u<n.length;u++)n[u].status=2,d=d.concat(Ce(t.serverSyncTree_,n[u].currentWriteId)),n[u].onComplete&&h.push(()=>n[u].onComplete(null,!0,n[u].currentOutputSnapshotResolved)),n[u].unwatcher();Tn(t,vn(t.transactionQueueTree_,e)),bn(t,t.transactionQueueTree_),te(t.eventQueue_,e,d);for(let u=0;u<h.length;u++)Ke(h[u])}else{if(c==="datastale")for(let h=0;h<n.length;h++)n[h].status===3?n[h].status=4:n[h].status=0;else{q("transaction at "+l.toString()+" failed: "+c);for(let h=0;h<n.length;h++)n[h].status=4,n[h].abortReason=c}In(t,e)}},o)}function In(t,e){const n=yo(t,e),i=Dt(n),s=vo(t,n);return Dh(t,s,i),i}function Dh(t,e,n){if(e.length===0)return;const i=[];let s=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=$(n,l.path);let d=!1,h;if(p(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)d=!0,h=l.abortReason,s=s.concat(Ce(t.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=gh)d=!0,h="maxretry",s=s.concat(Ce(t.serverSyncTree_,l.currentWriteId,!0));else{const u=Gi(t,l.path,o);l.currentInputSnapshot=u;const _=e[a].update(u.val());if(_!==void 0){Pt("transaction failed: Data returned ",_,l.path);let m=D(_);typeof _=="object"&&_!=null&&J(_,".priority")||(m=m.updatePriority(u.getPriority()));const w=l.currentWriteId,k=En(t),W=Fi(m,u,k);l.currentOutputSnapshotRaw=m,l.currentOutputSnapshotResolved=W,l.currentWriteId=qi(t),o.splice(o.indexOf(w),1),s=s.concat(Di(t.serverSyncTree_,l.path,W,l.currentWriteId,l.applyLocally)),s=s.concat(Ce(t.serverSyncTree_,w,!0))}else d=!0,h="nodata",s=s.concat(Ce(t.serverSyncTree_,l.currentWriteId,!0))}te(t.eventQueue_,n,s),s=[],d&&(e[a].status=2,function(u){setTimeout(u,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(h==="nodata"?i.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):i.push(()=>e[a].onComplete(new Error(h),!1,null))))}Tn(t,t.transactionQueueTree_);for(let a=0;a<i.length;a++)Ke(i[a]);bn(t,t.transactionQueueTree_)}function yo(t,e){let n,i=t.transactionQueueTree_;for(n=v(e);n!==null&&De(i)===void 0;)i=vn(i,n),e=T(e),n=v(e);return i}function vo(t,e){const n=[];return Co(t,e,n),n.sort((i,s)=>i.order-s.order),n}function Co(t,e,n){const i=De(e);if(i)for(let s=0;s<i.length;s++)n.push(i[s]);Cn(e,s=>{Co(t,s,n)})}function Tn(t,e){const n=De(e);if(n){let i=0;for(let s=0;s<n.length;s++)n[s].status!==2&&(n[i]=n[s],i++);n.length=i,Ui(e,n.length>0?n:void 0)}Cn(e,i=>{Tn(t,i)})}function Eo(t,e){const n=Dt(yo(t,e)),i=vn(t.transactionQueueTree_,e);return sh(i,s=>{Ln(t,s)}),Ln(t,i),fo(i,s=>{Ln(t,s)}),n}function Ln(t,e){const n=De(e);if(n){const i=[];let s=[],r=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(p(r===o-1,"All SENT items should be at beginning of queue."),r=o,n[o].status=3,n[o].abortReason="set"):(p(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),s=s.concat(Ce(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&i.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Ui(e,void 0):n.length=r+1,te(t.eventQueue_,Dt(e),s);for(let o=0;o<i.length;o++)Ke(i[o])}}/**
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
 */function Ph(t){let e="";const n=t.split("/");for(let i=0;i<n.length;i++)if(n[i].length>0){let s=n[i];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function Oh(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const i=n.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):q(`Invalid query segment '${n}' in query '${t}'`)}return e}const qs=function(t,e){const n=xh(t),i=n.namespace;n.domain==="firebase.com"&&ae(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&n.domain!=="localhost"&&ae("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||Hl();const s=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new Pr(n.host,n.secure,i,s,e,"",i!==n.subdomain),path:new I(n.pathString)}},xh=function(t){let e="",n="",i="",s="",r="",o=!0,a="https",l=443;if(typeof t=="string"){let c=t.indexOf("//");c>=0&&(a=t.substring(0,c-1),t=t.substring(c+2));let d=t.indexOf("/");d===-1&&(d=t.length);let h=t.indexOf("?");h===-1&&(h=t.length),e=t.substring(0,Math.min(d,h)),d<h&&(s=Ph(t.substring(d,h)));const u=Oh(t.substring(Math.min(t.length,h)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const _=e.slice(0,c);if(_.toLowerCase()==="localhost")n="localhost";else if(_.split(".").length<=2)n=_;else{const m=e.indexOf(".");i=e.substring(0,m).toLowerCase(),n=e.substring(m+1),r=i}"ns"in u&&(r=u.ns)}return{host:e,port:l,domain:n,subdomain:i,secure:o,scheme:a,pathString:s,namespace:r}};/**
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
 */class Mh{constructor(e,n,i,s){this.eventType=e,this.eventRegistration=n,this.snapshot=i,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+L(this.snapshot.exportVal())}}class Lh{constructor(e,n,i){this.eventRegistration=e,this.error=n,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
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
 */class Fh{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return p(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
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
 */class Wh{constructor(e,n){this._repo=e,this._path=n}cancel(){const e=new Z;return Ih(this._repo,this._path,e.wrapCallback(()=>{})),e.promise}remove(){Le("OnDisconnect.remove",this._path);const e=new Z;return $s(this._repo,this._path,null,e.wrapCallback(()=>{})),e.promise}set(e){Le("OnDisconnect.set",this._path),oi("OnDisconnect.set",e,this._path);const n=new Z;return $s(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}setWithPriority(e,n){Le("OnDisconnect.setWithPriority",this._path),oi("OnDisconnect.setWithPriority",e,this._path),hh("OnDisconnect.setWithPriority",n);const i=new Z;return Th(this._repo,this._path,e,n,i.wrapCallback(()=>{})),i.promise}update(e){Le("OnDisconnect.update",this._path),uh("OnDisconnect.update",e,this._path);const n=new Z;return Sh(this._repo,this._path,e,n.wrapCallback(()=>{})),n.promise}}/**
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
 */class zi{constructor(e,n,i,s){this._repo=e,this._path=n,this._queryParams=i,this._orderByCalled=s}get key(){return C(this._path)?null:yi(this._path)}get ref(){return new le(this._repo,this._path)}get _queryIdentifier(){const e=Rs(this._queryParams),n=pi(e);return n==="{}"?"default":n}get _queryObject(){return Rs(this._queryParams)}isEqual(e){if(e=Ne(e),!(e instanceof zi))return!1;const n=this._repo===e._repo,i=vi(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return n&&i&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+Ic(this._path)}}class le extends zi{constructor(e,n){super(e,n,new bi,!1)}get parent(){const e=Hr(this._path);return e===null?null:new le(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class It{constructor(e,n,i){this._node=e,this.ref=n,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new I(e),i=ai(this.ref,e);return new It(this._node.getChild(n),i,A)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,s)=>e(new It(s,ai(this.ref,i),A)))}hasChild(e){const n=new I(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function Ht(t,e){return t=Ne(t),t._checkNotDeleted("ref"),e!==void 0?ai(t._root,e):t._root}function ai(t,e){return t=Ne(t),v(t._path)===null?dh("child","path",e):_o("child","path",e),new le(t._repo,P(t._path,e))}function Bh(t){return t=Ne(t),new Wh(t._repo,t._path)}function Gs(t,e){t=Ne(t),Le("set",t._path),oi("set",e,t._path);const n=new Z;return wh(t._repo,t._path,e,null,n.wrapCallback(()=>{})),n.promise}class Yi{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const i=n._queryParams.getIndex();return new Mh("value",this,new It(e.snapshotNode,new le(n._repo,n._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new Lh(this,e,n):null}matches(e){return e instanceof Yi?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function Uh(t,e,n,i,s){let r;if(typeof i=="object"&&(r=void 0,s=i),typeof i=="function"&&(r=i),s&&s.onlyOnce){const l=n,c=(d,h)=>{js(t._repo,t,a),l(d,h)};c.userCallback=n.userCallback,c.context=n.context,n=c}const o=new Fh(n,r||void 0),a=new Yi(o);return Rh(t._repo,t,a),()=>js(t._repo,t,a)}function wo(t,e,n,i){return Uh(t,"value",e,n,i)}Mu(le);Hu(le);/**
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
 */const Hh="FIREBASE_DATABASE_EMULATOR_HOST",li={};let Vh=!1;function $h(t,e,n,i){const s=e.lastIndexOf(":"),r=e.substring(0,s),o=di(r);t.repoInfo_=new Pr(e,o,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0,n),i&&(t.authTokenProvider_=i)}function jh(t,e,n,i,s){let r=i||t.options.databaseURL;r===void 0&&(t.options.projectId||ae("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),B("Using default host for project ",t.options.projectId),r=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=qs(r,s),a=o.repoInfo,l;typeof process<"u"&&cs&&(l=cs[Hh]),l?(r=`http://${l}?ns=${a.namespace}`,o=qs(r,s),a=o.repoInfo):o.repoInfo.secure;const c=new Jl(t.name,t.options,e);fh("Invalid Firebase Database URL",o),C(o.path)||ae("Database URL must point to the root of a Firebase Database (not including a child path).");const d=Gh(a,t,c,new Xl(t,n));return new zh(d,t)}function qh(t,e){const n=li[e];(!n||n[t.key]!==t)&&ae(`Database ${e}(${t.repoInfo_}) has already been deleted.`),Nh(t),delete n[t.key]}function Gh(t,e,n,i){let s=li[e.name];s||(s={},li[e.name]=s);let r=s[t.toURLString()];return r&&ae("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new yh(t,Vh,n,i),s[t.toURLString()]=r,r}class zh{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(vh(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new le(this._repo,b())),this._rootInternal}_delete(){return this._rootInternal!==null&&(qh(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&ae("Cannot call "+e+" on a deleted database.")}}function Yh(t=bl(),e){const n=yl(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const i=ia("database");i&&Kh(n,...i)}return n}function Kh(t,e,n,i={}){t=Ne(t),t._checkNotDeleted("useEmulator");const s=`${e}:${n}`,r=t._repoInternal;if(t._instanceStarted){if(s===t._repoInternal.repoInfo_.host&&qt(i,r.repoInfo_.emulatorOptions))return;ae("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&ae('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Ut(Ut.OWNER);else if(i.mockUserToken){const a=typeof i.mockUserToken=="string"?i.mockUserToken:ra(i.mockUserToken,t.app.options.projectId);o=new Ut(a)}di(e)&&(sa(e),la("Database",!0)),$h(r,s,i,o)}/**
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
 */function Qh(t){Ll(wl),zt(new _t("database",(e,{instanceIdentifier:n})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return jh(i,s,r,n)},"PUBLIC").setMultipleInstances(!0)),We(us,hs,t),We(us,hs,"esm2017")}/**
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
 */const Xh={".sv":"timestamp"};function Fn(){return Xh}/**
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
 */class Jh{constructor(e,n){this.committed=e,this.snapshot=n}toJSON(){return{committed:this.committed,snapshot:this.snapshot.toJSON()}}}function bo(t,e,n){var i;if(t=Ne(t),Le("Reference.transaction",t._path),t.key===".length"||t.key===".keys")throw"Reference.transaction failed: "+t.key+" is a read-only object.";const s=(i=n==null?void 0:n.applyLocally)!==null&&i!==void 0?i:!0,r=new Z,o=(l,c,d)=>{let h=null;l?r.reject(l):(h=new It(d,new le(t._repo,t._path),A),r.resolve(new Jh(c,h)))},a=wo(t,()=>{});return Ah(t._repo,t._path,e,o,a,s),r.promise}re.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};re.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};Qh();function ci(t,e){const n=ce(e);if(Object.keys(n).length===0)return null;const i=ie(n.code)||t,s=ce(n.players),r={};for(const[k,W]of Object.entries(s)){const R=ce(W),O=Bn(ie(R.symbol));O&&(r[k]={uid:k,nickname:ie(R.nickname)||"Player",symbol:O,joinedAt:xe(R.joinedAt)})}if(Object.keys(r).length===0)return null;const o=ce(n.meta),a=Object.values(r).find(k=>k.symbol===Ee.X),l=ie(o.hostUid)||(a==null?void 0:a.uid)||Object.keys(r)[0],c=ce(n.state),d=ie(c.cells),h=ie(c.miniWinners),u=ft({cells:d.length===81?d:H.EMPTY_CELLS,miniWinners:h.length===9?h:H.EMPTY_MINI_WINNERS,nextMiniGrid:Ft(c.nextMiniGrid,-1),moveCount:Ft(c.moveCount,0)}),_=Bn(ie(c.winnerSymbol)),m=ce(n.presence),y={};for(const[k,W]of Object.entries(m)){const R=ce(W),O=xe(R.disconnectedAt);y[k]={uid:k,connected:Wn(R.connected,!1),lastSeen:xe(R.lastSeen),disconnectedAt:O>0?O:null}}const w=ce(n.rematch);return{code:i,hostUid:l,players:r,status:zs(c.status,F,F.WAITING),board:u,currentTurnUid:ie(c.currentTurnUid)||l,winnerUid:ie(c.winnerUid)||null,winnerSymbol:_,winReason:zs(c.winReason,ee,ee.NONE),startedAt:xe(c.startedAt),updatedAt:xe(c.updatedAt),version:Ft(c.version,0),presence:y,rematchHostReady:Wn(w.hostReady,!1),rematchGuestReady:Wn(w.guestReady,!1),rematchNonce:Ft(w.nonce,0)}}function Io(t){const e={};for(const[i,s]of Object.entries(t.players))e[i]={uid:s.uid,nickname:s.nickname,symbol:s.symbol,joinedAt:s.joinedAt};const n={};for(const[i,s]of Object.entries(t.presence))n[i]={uid:s.uid,connected:s.connected,lastSeen:s.lastSeen,disconnectedAt:s.disconnectedAt??0};return{code:t.code,meta:{hostUid:t.hostUid,createdAt:t.startedAt},players:e,state:{cells:t.board.cells,miniWinners:t.board.miniWinners,nextMiniGrid:t.board.nextMiniGrid,moveCount:t.board.moveCount,currentTurnUid:t.currentTurnUid,status:t.status,winnerUid:t.winnerUid||"",winnerSymbol:t.winnerSymbol||"",winReason:t.winReason,startedAt:t.startedAt,updatedAt:t.updatedAt,version:t.version},presence:n,rematch:{hostReady:t.rematchHostReady,guestReady:t.rematchGuestReady,nonce:t.rematchNonce}}}function ce(t){return!t||typeof t!="object"?{}:Object.fromEntries(Object.entries(t))}function ie(t){return typeof t=="string"?t:""}function xe(t,e=0){if(typeof t=="number"&&Number.isFinite(t))return Math.trunc(t);if(typeof t=="string"){const n=Number.parseInt(t,10);return Number.isNaN(n)?e:n}return e}function Ft(t,e=0){return xe(t,e)}function Wn(t,e=!1){if(typeof t=="boolean")return t;if(typeof t=="string"){if(t==="true")return!0;if(t==="false")return!1}return e}function zs(t,e,n){return typeof t!="string"?n:Object.values(e).includes(t)?t:n}const Vt="webRooms",Fe={apiKey:"AIzaSyAqbxi4okk2sVSBYhmXzCIoDWEtl8nVCzE",authDomain:"uttt-android-260218-sak.firebaseapp.com",databaseURL:"https://uttt-android-260218-sak-default-rtdb.firebaseio.com",projectId:"uttt-android-260218-sak",storageBucket:"uttt-android-260218-sak.firebasestorage.app",appId:"1:827829215799:android:c11ca1f9f2bbc2b91095b2"};!Fe.authDomain&&Fe.projectId&&(Fe.authDomain=`${Fe.projectId}.firebaseapp.com`);const Zh=["apiKey","appId","databaseURL","projectId","storageBucket"],To=Zh.filter(t=>!Fe[t]).map(t=>t),me=To.length===0,So=me?"":`Missing Firebase config: ${To.join(", ")}`,Ys=me?pr(Fe):null,G=Ys?Yh(Ys):null,ue=()=>{throw new Error(So||"Firebase is not configured")},ne={async createRoom(t,e){G||ue();const n=Ks(e);for(let i=0;i<20;i+=1){const s=ed(),r=Ht(G,`${Vt}/${s}`),o=Date.now();if((await bo(r,l=>{if(l!=null)return;const c=Uo(s,t,n,o);return Io(c)},{applyLocally:!1})).committed)return await this.markPresence(s,t,!0),s}throw new Error("Unable to allocate a unique room code")},async joinRoom(t,e,n){G||ue();const i=Oe(t,{pad:!0}),s=Ks(n);let r=null;for(let o=0;o<5;o+=1){try{return await Wt(i,a=>a?Ho(a,e,s,Date.now()):Bt("Room not found")),await this.markPresence(i,e,!0),i}catch(a){if(r=a,(a==null?void 0:a.message)!=="Room not found")throw a}await td(250)}throw r||new Error("Room not found")},observeRoom(t,e,n){G||ue();const i=Oe(t),s=Ht(G,`${Vt}/${i}`);return wo(s,o=>{if(!o.exists()){n(new Error("Room was deleted"));return}const a=ci(i,o.val());if(!a){n(new Error("Failed to parse room state"));return}e(a)},o=>{n(o)})},async submitMove(t,e,n,i){return G||ue(),Wt(Oe(t),s=>s?Vo(s,Go(n,i,e),Date.now()):Bt("Room not found"))},async requestRematch(t,e){return G||ue(),Wt(Oe(t),n=>n?$o(n,e,Date.now()):Bt("Room not found"))},async claimForfeit(t,e){return G||ue(),Wt(Oe(t),n=>n?jo(n,e,Date.now(),cn):Bt("Room not found"))},async markPresence(t,e,n){G||ue();const i=Oe(t),s=Ht(G,`${Vt}/${i}/presence/${e}`);if(n){await Gs(s,{uid:e,connected:!0,lastSeen:Fn(),disconnectedAt:0}),await Bh(s).update({connected:!1,lastSeen:Fn(),disconnectedAt:Fn()});return}const r=Date.now();await Gs(s,{uid:e,connected:!1,lastSeen:r,disconnectedAt:r})}};async function Wt(t,e){G||ue();const n=Ht(G,`${Vt}/${t}`);let i=null;const s=await bo(n,o=>{const a=ci(t,o),l=e(a);if(!l.ok){i=l.reason;return}return Io(l.roomState)},{applyLocally:!1});if(!s.committed)throw new Error(i||"Operation aborted");const r=ci(t,s.snapshot.val());if(!r)throw new Error("Failed to parse room after transaction");return r}function Oe(t,e={}){const n=String(t||"").trim().replace(/\D/g,"").slice(0,4);return e.pad&&n.length>0?n.padStart(4,"0"):n}function Ks(t){return String(t||"").trim().slice(0,22)||"Player"}function ed(){const t=Math.floor(Math.random()*9e3)+1e3;return String(t)}function Bt(t){return{ok:!1,reason:t}}function td(t){return new Promise(e=>{setTimeout(e,t)})}function nd(){let t=null,e=null,n=null,i=0,s=0,r=!1;const o=75,a=.2,c=60/92/4,d=[[261.63,329.63,392],[220,277.18,329.63],[196,246.94,392],[233.08,293.66,349.23]],h=[523.25,587.33,659.25,587.33,523.25,659.25,783.99,659.25];function u(){if(t)return;const R=window.AudioContext||window.webkitAudioContext;t=new R,e=t.createGain(),e.gain.value=.18,e.connect(t.destination)}function _(R){const O=Math.floor(s/16)%d.length,Xe=d[O];if(s%4===0)for(const Je of Xe)m(Je,R,c*3.2,"triangle",.05,.03);if(s%2===0){const Je=h[s/2%h.length];m(Je,R,c*1.2,"sine",.03,.01)}s%4===0&&m(Xe[0]/2,R,c*.9,"sine",.04,.01),s=(s+1)%64}function m(R,O,Xe,Je,xo,Mo){const Ze=t.createOscillator(),et=t.createGain();Ze.type=Je,Ze.frequency.setValueAtTime(R,O),et.gain.setValueAtTime(1e-4,O),et.gain.linearRampToValueAtTime(xo,O+Mo),et.gain.exponentialRampToValueAtTime(1e-4,O+Xe),Ze.connect(et),et.connect(e),Ze.start(O),Ze.stop(O+Xe+.05)}function y(){for(;i<t.currentTime+a;)_(i),i+=c}async function w(){if(u(),r)return!0;try{await t.resume()}catch{return!1}return i=t.currentTime+.05,n=window.setInterval(y,o),r=!0,!0}function k(){n&&(window.clearInterval(n),n=null),r=!1}async function W(R){return R?w():(k(),!0)}return{isRunning:()=>r,start:w,stop:k,setEnabled:W}}const an=nd(),f={playerId:_d(),nickname:localStorage.getItem("uttt.nickname")||"",roomCodeInput:"",roomCode:null,room:null,unsubscribeRoom:null,busy:!1,notice:"",lastForfeitAttemptVersion:-1,musicEnabled:localStorage.getItem("uttt.musicEnabled")!=="false"},id=document.querySelector("#app");id.innerHTML=`
  <main class="shell">
    <section class="panel hero">
      <div class="hero-top">
        <p class="eyebrow">Ultimate Tic-Tac-Toe</p>
        <button id="music-toggle" class="btn btn-ghost"></button>
      </div>
      <h1>2-Player Neon Match</h1>
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
        <div class="room-actions">
          <button id="copy-code" class="btn btn-ghost">Copy code</button>
          <button id="copy-link" class="btn btn-ghost">Copy link</button>
        </div>
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
`;const Ro=document.querySelector("#nickname"),Tt=document.querySelector("#room-code"),sd=document.querySelector("#setup-panel"),rd=document.querySelector("#room-panel"),od=document.querySelector("#room-code-active"),Qs=document.querySelector("#status-text"),Xs=document.querySelector("#forfeit-text"),No=document.querySelector("#players"),Ki=document.querySelector("#board"),ui=document.querySelector("#rematch"),ad=document.querySelector("#leave"),ld=document.querySelector("#notice"),Js=document.querySelector("#firebase-warning"),Ao=document.querySelector("#music-toggle");Ro.value=f.nickname;Tt.value=f.roomCodeInput;me||(Js.classList.remove("hidden"),Js.textContent=So);const ot=Qi(new URLSearchParams(window.location.search).get("room"));ot&&(f.roomCodeInput=ot,Tt.value=ot,Y(`Invite code ${ot} loaded.`));Xi();Ro.addEventListener("input",t=>{f.nickname=t.target.value.slice(0,22),localStorage.setItem("uttt.nickname",f.nickname)});Tt.addEventListener("input",t=>{f.roomCodeInput=Qi(t.target.value),Tt.value=f.roomCodeInput});document.querySelector("#create-room").addEventListener("click",async()=>{!me||f.busy||await Ot(async()=>{await xt();const t=await ne.createRoom(f.playerId,Oo());await Do(t),Y(`Room ${t} created. Share this key or invite link.`)})});document.querySelector("#join-room").addEventListener("click",async()=>{!me||f.busy||await ko()});document.querySelector("#copy-code").addEventListener("click",async()=>{if(f.roomCode)try{await navigator.clipboard.writeText(f.roomCode),Y("Room code copied.")}catch{Y("Copy failed. Share the code manually.")}});document.querySelector("#copy-link").addEventListener("click",async()=>{if(!f.roomCode)return;const t=`${window.location.origin}/?room=${f.roomCode}`;try{await navigator.clipboard.writeText(t),Y("Invite link copied.")}catch{Y(`Share this link: ${t}`)}});ad.addEventListener("click",async()=>{await cd(),Y("Left room.")});ui.addEventListener("click",async()=>{!f.roomCode||!f.room||f.busy||await Ot(async()=>{await xt(),await ne.requestRematch(f.roomCode,f.playerId)})});Ki.addEventListener("click",async t=>{const e=t.target.closest("button[data-mini][data-cell]");if(!e||!f.roomCode||!f.room||f.busy)return;const n=Number(e.dataset.mini),i=Number(e.dataset.cell);await Ot(async()=>{await xt(),await ne.submitMove(f.roomCode,f.playerId,n,i)})});Ao.addEventListener("click",async()=>{f.musicEnabled=!f.musicEnabled,localStorage.setItem("uttt.musicEnabled",String(f.musicEnabled)),f.musicEnabled?await an.start()||(Y("Tap again to enable soundtrack."),f.musicEnabled=!1,localStorage.setItem("uttt.musicEnabled","false")):an.stop(),Xi()});window.addEventListener("pagehide",()=>{Po()});document.addEventListener("visibilitychange",()=>{f.roomCode&&(document.visibilityState==="hidden"?Po():ne.markPresence(f.roomCode,f.playerId,!0))});document.addEventListener("pointerdown",()=>{xt()},{once:!0});setInterval(()=>{pd()},1e3);Re();ot&&me&&ko();async function ko(){const t=Qi(f.roomCodeInput);if(!t){Y("Enter the room code.");return}await Ot(async()=>{await xt();const e=await ne.joinRoom(t,f.playerId,Oo());await Do(e),Y(`Joined room ${e}.`)})}async function Do(t){f.unsubscribeRoom&&(f.unsubscribeRoom(),f.unsubscribeRoom=null),f.roomCode=t,f.roomCodeInput=t,Tt.value=t;const e=new URL(window.location.href);e.searchParams.set("room",t),window.history.replaceState({},"",e),f.unsubscribeRoom=ne.observeRoom(t,n=>{f.room=n,Re()},n=>{Y(n.message||"Lost room updates.")}),await ne.markPresence(t,f.playerId,!0),Re()}async function cd(){if(f.unsubscribeRoom&&(f.unsubscribeRoom(),f.unsubscribeRoom=null),f.roomCode&&me)try{await ne.markPresence(f.roomCode,f.playerId,!1)}catch{}f.room=null,f.roomCode=null,f.lastForfeitAttemptVersion=-1;const t=new URL(window.location.href);t.searchParams.delete("room"),window.history.replaceState({},"",t),Re()}function Re(){const t=!!f.roomCode;if(sd.classList.toggle("hidden",t),rd.classList.toggle("hidden",!t),ld.textContent=f.notice,!t)return;if(od.textContent=f.roomCode||"----",!f.room){Qs.textContent="Connecting to room...",No.innerHTML="",Ki.innerHTML="",Xs.textContent="",ui.classList.add("hidden");return}ud(),hd(),Qs.textContent=dd(),Xs.textContent=fd();const e=f.room.status===F.FINISHED&&Object.keys(f.room.players).length===2;ui.classList.toggle("hidden",!e)}function ud(){const t=f.room,e=Object.values(t.players).slice().sort((n,i)=>n.symbol.localeCompare(i.symbol));No.innerHTML=e.map(n=>{const i=t.presence[n.uid],s=n.uid===f.playerId,r=(i==null?void 0:i.connected)??!1;return`
        <article class="player-card ${s?"mine":""}">
          <div>
            <p class="player-name">${md(n.nickname)} ${s?"(You)":""}</p>
            <p class="player-meta ${n.symbol==="X"?"mark-x":"mark-o"}">${n.symbol} ${n.uid===t.hostUid?"• Host":""}</p>
          </div>
          <span class="presence ${r?"online":"offline"}">${r?"Online":"Offline"}</span>
        </article>
      `}).join("")}function hd(){const t=f.room,n=!!t.players[f.playerId],i=t.status===F.ACTIVE&&t.currentTurnUid===f.playerId,s=Zs(t.board);Ki.innerHTML=Array.from({length:9},(r,o)=>{const a=t.board.miniWinners[o],l=a!==H.EMPTY,c=s.has(o),d=Array.from({length:9},(u,_)=>{const m=ln(o,_),y=t.board.cells[m],w=y===H.EMPTY,k=n&&i&&t.status===F.ACTIVE&&w&&!l&&c,W=y==="X"?"mark-x":y==="O"?"mark-o":"";return`
        <button
          class="cell ${k?"playable":""} ${y!==H.EMPTY?"filled":""} ${W}"
          data-mini="${o}"
          data-cell="${_}"
          ${k?"":"disabled"}
        >
          ${y===H.EMPTY?"":y}
        </button>
      `}).join("");return`
      <section class="mini-grid ${c?"allowed":""} ${l?"resolved":""}">
        <div class="mini-cells">${d}</div>
        ${l?`<div class="mini-winner ${a==="X"?"mark-x":a==="O"?"mark-o":""}">${a===H.TIE?"T":a}</div>`:""}
      </section>
    `}).join("")}function dd(){var n,i;const t=f.room;if(t.status===F.WAITING)return"Waiting for a second player to join this room.";if(t.status===F.ACTIVE){if(t.currentTurnUid===f.playerId)return`Your turn (${((n=t.players[f.playerId])==null?void 0:n.symbol)||"?"}). Play in highlighted mini-grid.`;const r=t.players[t.currentTurnUid];return`${(r==null?void 0:r.nickname)||"Opponent"}'s turn.`}if(t.winReason===ee.DRAW)return"Match ended in a draw.";const e=t.winnerUid===f.playerId?"You":((i=t.players[t.winnerUid])==null?void 0:i.nickname)||"Opponent";return t.winReason===ee.FORFEIT?`${e} won by forfeit.`:`${e} won the match.`}function fd(){const t=f.room;if(!t||t.status!==F.ACTIVE)return"";const e=un(t,f.playerId);if(!e)return"";const n=t.presence[e];if(!n||n.connected||!n.disconnectedAt)return"";const i=cn-(Date.now()-n.disconnectedAt);return i<=0?"Opponent disconnected. Claiming forfeit...":`Opponent disconnected. Forfeit in ${Math.ceil(i/1e3)}s.`}async function pd(){const t=f.room;if(!t||!f.roomCode||t.status!==F.ACTIVE)return;const e=un(t,f.playerId);if(!e)return;const n=t.presence[e];if(!n||n.connected||!n.disconnectedAt)return;if(Date.now()-n.disconnectedAt<cn){Re();return}f.lastForfeitAttemptVersion===t.version||f.busy||(f.lastForfeitAttemptVersion=t.version,await Ot(async()=>{await ne.claimForfeit(f.roomCode,f.playerId)}))}async function Po(){if(!(!f.roomCode||!me))try{await ne.markPresence(f.roomCode,f.playerId,!1)}catch{}}async function Ot(t){f.busy=!0;try{await t()}catch(e){Y((e==null?void 0:e.message)||"Operation failed.")}finally{f.busy=!1,Re()}}function Oo(){return f.nickname.trim().slice(0,22)||"Player"}function Y(t){f.notice=t,Re()}function Qi(t){return String(t||"").replace(/\D/g,"").slice(0,4)}async function xt(){if(!f.musicEnabled||an.isRunning())return;await an.start()||(f.musicEnabled=!1,localStorage.setItem("uttt.musicEnabled","false"),Xi())}function Xi(){Ao.textContent=f.musicEnabled?"Music: On":"Music: Off"}function _d(){const t="uttt.playerId",e=localStorage.getItem(t);if(e)return e;const n=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`player-${Date.now()}-${Math.random().toString(16).slice(2)}`;return localStorage.setItem(t,n),n}function md(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
