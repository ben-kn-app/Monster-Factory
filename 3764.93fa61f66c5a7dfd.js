"use strict";(self.webpackChunkexample_app=self.webpackChunkexample_app||[]).push([[3764],{3764:(F,h,m)=>{m.r(h),m.d(h,{startTapClick:()=>M});var u=m(6536);const M=n=>{let i,s,E,d,o=10*-v,r=0;const P=n.getBoolean("animated",!0)&&n.getBoolean("rippleEffect",!0),p=new WeakMap,A=e=>{o=(0,u.o)(e),S(e)},D=()=>{clearTimeout(d),d=void 0,s&&(b(!1),s=void 0)},R=e=>{s||void 0!==i&&null!==i.parentElement||(i=void 0,g(_(e),e))},S=e=>{g(void 0,e)},g=(e,t)=>{if(e&&e===s)return;clearTimeout(d),d=void 0;const{x:l,y:a}=(0,u.p)(t);if(s){if(p.has(s))throw new Error("internal error");s.classList.contains(f)||w(s,l,a),b(!0)}if(e){const I=p.get(e);I&&(clearTimeout(I),p.delete(e));const x=T(e)?0:y;e.classList.remove(f),d=setTimeout(()=>{w(e,l,a),d=void 0},x)}s=e},w=(e,t,l)=>{r=Date.now(),e.classList.add(f);const a=P&&k(e);a&&a.addRipple&&(C(),E=a.addRipple(t,l))},C=()=>{void 0!==E&&(E.then(e=>e()),E=void 0)},b=e=>{C();const t=s;if(!t)return;const l=L-Date.now()+r;if(e&&l>0&&!T(t)){const a=setTimeout(()=>{t.classList.remove(f),p.delete(t)},L);p.set(t,a)}else t.classList.remove(f)},c=document;c.addEventListener("ionScrollStart",e=>{i=e.target,D()}),c.addEventListener("ionScrollEnd",()=>{i=void 0}),c.addEventListener("ionGestureCaptured",D),c.addEventListener("touchstart",e=>{o=(0,u.o)(e),R(e)},!0),c.addEventListener("touchcancel",A,!0),c.addEventListener("touchend",A,!0),c.addEventListener("mousedown",e=>{const t=(0,u.o)(e)-v;o<t&&R(e)},!0),c.addEventListener("mouseup",e=>{const t=(0,u.o)(e)-v;o<t&&S(e)},!0)},_=n=>{if(!n.composedPath)return n.target.closest(".ion-activatable");{const o=n.composedPath();for(let r=0;r<o.length-2;r++){const i=o[r];if(i.classList&&i.classList.contains("ion-activatable"))return i}}},T=n=>n.classList.contains("ion-activatable-instant"),k=n=>{if(n.shadowRoot){const o=n.shadowRoot.querySelector("ion-ripple-effect");if(o)return o}return n.querySelector("ion-ripple-effect")},f="ion-activated",y=200,L=200,v=2500}}]);