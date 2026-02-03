/* Hyper Globe, https://hyper.ac/globe/ */
export class Color{constructor(r=0,g=0,b=0,a=255){if(typeof r==='string'){this.parse(r)}else{this.r=r;this.g=g;this.b=b;this.a=a}}
clone(){return new Color(this.r,this.g,this.b,this.a)}
parse(str){str=str.trim();if(str.indexOf('#')===0){if(str.match(/^#([a-f0-9]{3,8})$/i)){let len=RegExp.$1.length;if(len===3||len===4){let[r,g,b,a='f']=RegExp.$1;this.parseHex(r+r+g+g+b+b+a+a)}else if(len===6||len===8){this.parseHex(RegExp.$1)}else{this.clear()}}else{this.clear()}}else if(str.match(/^rgba?\(\s*([0-9.%]{1,4})[\s,]+([0-9.%]{1,4})[\s,]+([0-9.%]{1,4})[\s,\/]*([0-9.%]{1,4})?\s*\)$/i)){let r=Math.min(this.parseComponent(RegExp.$1),255);let g=Math.min(this.parseComponent(RegExp.$2),255);let b=Math.min(this.parseComponent(RegExp.$3),255);let a=Math.min(this.parseAlpha(RegExp.$4),255);if(isNaN(r)||isNaN(g)||isNaN(b)||isNaN(a)){this.clear()}else{this.r=r;this.g=g;this.b=b;this.a=a}}else{this.clear()}
return this}
parseHex(hex){this.r=parseInt(hex.substr(0,2),16);this.g=parseInt(hex.substr(2,2),16);this.b=parseInt(hex.substr(4,2),16);this.a=parseInt(hex.substr(6,2)||'ff',16)}
get rgba(){return[this.r/255,this.g/255,this.b/255,this.a/255]}
get rgb(){return[this.r/255,this.g/255,this.b/255]}
get alpha(){return this.a/255}
clear(){this.r=0;this.g=0;this.b=0;this.a=255}
parseComponent(str){if(str.endsWith('%')){return Math.round(parseFloat(str)/100*255)}else{return parseInt(str)}}
parseAlpha(str){if(str==='')return 255;if(str.endsWith('%')){return Math.round(parseFloat(str)/100*255)}else{return Math.round(parseFloat(str)*255)}}
toHex(){return'#'+this.r.toString(16).padStart(2,'0')+this.g.toString(16).padStart(2,'0')+this.b.toString(16).padStart(2,'0')+((this.a<255)?(this.a).toString(16).padStart(2,'0'):'')}
lerp(c,t){this.r=Math.round(Utils.lerp(this.r,c.r,t));this.g=Math.round(Utils.lerp(this.g,c.g,t));this.b=Math.round(Utils.lerp(this.b,c.b,t));this.a=Math.round(Utils.lerp(this.a,c.a,t));return this}*[Symbol.iterator](){yield this.r;yield this.g;yield this.b;yield this.a}}
export class Bounds{constructor(x=0,y=0,w=0,h=0){this.x=x;this.y=y;this.w=w;this.h=h}
get r(){return this.x+this.w}
get b(){return this.y+this.h}
clone(){return new Bounds(this.x,this.y,this.w,this.h)}
copy(v){this.x=v.x;this.y=v.y;this.w=v.w;this.h=v.h;return this}
resize(f){this.x-=f;this.y-=f;this.w+=f;this.h+=f}
within(v){return v.x>=this.x&&v.x<=this.r&&v.y>=this.y&&v.y<=this.b}*[Symbol.iterator](){yield this.x;yield this.y;yield this.w;yield this.h}}
export class V2{constructor(x=0,y=0){this.x=x;this.y=y}
get w(){return this.x}
set w(x){this.x=x}
get h(){return this.y}
set h(y){this.y=y}
clone(){return new V2(this.x,this.y)}
copy(v){this.x=v.x;this.y=v.y;return this}
multiply(f){this.x*=f;this.y*=f;return this}
divide(f){this.x/=f;this.y/=f;return this}
dot(v){return this.x*v.x+this.y*v.y}
normalize(){return this.divide(this.length()||1)}
lerp(v,t){this.x+=(v.x-this.x)*t;this.y+=(v.y-this.y)*t;return this}
lengthSq(){return this.x*this.x+this.y*this.y}
length(){return Math.sqrt(this.lengthSq())}
distanceTo(v){let dx=this.x-v.x,dy=this.y-v.y;return Math.sqrt(dx*dx+dy*dy)}
equals(v){return this.x===v.x&&this.y===v.y}*[Symbol.iterator](){yield this.x;yield this.y}}
export class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
get xyz(){return[this.x,this.y,this.z]}
set xyz(v){this.x=v[0];this.y=v[1];this.z=v[2]}
clone(){return new V3(this.x,this.y,this.z)}
copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this}
fromLocation(location,offsetFrom){let phi=Utils.PI05-location.v*Math.PI;let cos_phi=Math.cos(phi);let theta=location.u*Utils.PI2;let o=1;if(offsetFrom)o=offsetFrom.getOffset(location);this.x=o*Math.cos(theta)*cos_phi;this.y=o*Math.sin(phi);this.z=o*Math.sin(theta)*cos_phi;return this}
multiply(f){this.x*=f;this.y*=f;this.z*=f;return this}
divide(f){this.x/=f;this.y/=f;this.z/=f;return this}
add(f){this.x+=f;this.y+=f;this.z+=f;return this}
sub(f){this.x-=f;this.y-=f;this.z-=f;return this}
dot(v){return this.x*v.x+this.y*v.y+this.z*v.z}
normalize(){return this.divide(this.length()||1)}
lerp(v,t){this.x+=(v.x-this.x)*t;this.y+=(v.y-this.y)*t;this.z+=(v.z-this.z)*t;return this}
lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}
length(){return Math.sqrt(this.lengthSq())}
distanceTo(v){let dx=this.x-v.x,dy=this.y-v.y,dz=this.z-v.z;return Math.sqrt(dx*dx+dy*dy+dz*dz)}
angleTo(v){let denominator=Math.sqrt(this.lengthSq()*v.lengthSq());if(denominator===0)return Math.PI/2;let theta=this.dot(v)/denominator;return Math.acos(Utils.clamp(theta,-1,1))}
equals(v){return this.x===v.x&&this.y===v.y&&this.z===v.z}*[Symbol.iterator](){yield this.x;yield this.y;yield this.z}}
export class Matrix{constructor(v3){this.m=new Float32Array(16);this.m[0]=1;this.m[5]=1;this.m[10]=1;this.m[15]=1;if(v3){this.xyz=[...v3]}}
reset(){this.m[0]=1;this.m[1]=0;this.m[2]=0;this.m[3]=0;this.m[4]=0;this.m[5]=1;this.m[6]=0;this.m[7]=0;this.m[8]=0;this.m[9]=0;this.m[10]=1;this.m[11]=0;this.m[12]=0;this.m[13]=0;this.m[14]=0;this.m[15]=1}
get x(){return this.m[12]}
get y(){return this.m[13]}
get z(){return this.m[14]}
get xyz(){return[this.m[12],this.m[13],this.m[14]]}
set xyz(v){this.m[12]=v[0];this.m[13]=v[1];this.m[14]=v[2]}
setOrthoProjection(left,right,bottom,top,near,far){let lr=1/(left-right);let bt=1/(bottom-top);let nf=1/(near-far);this.m[0]=-2*lr;this.m[5]=-2*bt;this.m[10]=2*nf;this.m[12]=(left+right)*lr;this.m[13]=(top+bottom)*bt;this.m[14]=(far+near)*nf}
multiply(ma,mb){let a=ma.m,b=mb.m;let a00=a[0],a01=a[1],a02=a[2],a03=a[3];let a10=a[4],a11=a[5],a12=a[6],a13=a[7];let a20=a[8],a21=a[9],a22=a[10],a23=a[11];let a30=a[12],a31=a[13],a32=a[14],a33=a[15];let b0=b[0],b1=b[1],b2=b[2],b3=b[3];this.m[0]=b0*a00+b1*a10+b2*a20+b3*a30;this.m[1]=b0*a01+b1*a11+b2*a21+b3*a31;this.m[2]=b0*a02+b1*a12+b2*a22+b3*a32;this.m[3]=b0*a03+b1*a13+b2*a23+b3*a33;b0=b[4];b1=b[5];b2=b[6];b3=b[7];this.m[4]=b0*a00+b1*a10+b2*a20+b3*a30;this.m[5]=b0*a01+b1*a11+b2*a21+b3*a31;this.m[6]=b0*a02+b1*a12+b2*a22+b3*a32;this.m[7]=b0*a03+b1*a13+b2*a23+b3*a33;b0=b[8];b1=b[9];b2=b[10];b3=b[11];this.m[8]=b0*a00+b1*a10+b2*a20+b3*a30;this.m[9]=b0*a01+b1*a11+b2*a21+b3*a31;this.m[10]=b0*a02+b1*a12+b2*a22+b3*a32;this.m[11]=b0*a03+b1*a13+b2*a23+b3*a33;b0=b[12];b1=b[13];b2=b[14];b3=b[15];this.m[12]=b0*a00+b1*a10+b2*a20+b3*a30;this.m[13]=b0*a01+b1*a11+b2*a21+b3*a31;this.m[14]=b0*a02+b1*a12+b2*a22+b3*a32;this.m[15]=b0*a03+b1*a13+b2*a23+b3*a33}
translate(v){let a=this.m;this.m[12]=a[0]*v.x+a[4]*v.y+a[8]*v.z+a[12];this.m[13]=a[1]*v.x+a[5]*v.y+a[9]*v.z+a[13];this.m[14]=a[2]*v.x+a[6]*v.y+a[10]*v.z+a[14];this.m[15]=a[3]*v.x+a[7]*v.y+a[11]*v.z+a[15]}
rotateX(rad){let a=this.m;let s=Math.sin(rad);let c=Math.cos(rad);let a10=a[4],a11=a[5],a12=a[6],a13=a[7];let a20=a[8],a21=a[9],a22=a[10],a23=a[11];this.m[4]=a10*c+a20*s;this.m[5]=a11*c+a21*s;this.m[6]=a12*c+a22*s;this.m[7]=a13*c+a23*s;this.m[8]=a20*c-a10*s;this.m[9]=a21*c-a11*s;this.m[10]=a22*c-a12*s;this.m[11]=a23*c-a13*s}
rotateY(rad){let a=this.m;let s=Math.sin(rad);let c=Math.cos(rad);let a00=a[0],a01=a[1],a02=a[2],a03=a[3];let a20=a[8],a21=a[9],a22=a[10],a23=a[11];this.m[0]=a00*c-a20*s;this.m[1]=a01*c-a21*s;this.m[2]=a02*c-a22*s;this.m[3]=a03*c-a23*s;this.m[8]=a00*s+a20*c;this.m[9]=a01*s+a21*c;this.m[10]=a02*s+a22*c;this.m[11]=a03*s+a23*c}
rotateZ(rad){let a=this.m;let s=Math.sin(rad);let c=Math.cos(rad);let a00=a[0],a01=a[1],a02=a[2],a03=a[3];let a10=a[4],a11=a[5],a12=a[6],a13=a[7];this.m[0]=a00*c+a10*s;this.m[1]=a01*c+a11*s;this.m[2]=a02*c+a12*s;this.m[3]=a03*c+a13*s;this.m[4]=a10*c-a00*s;this.m[5]=a11*c-a01*s;this.m[6]=a12*c-a02*s;this.m[7]=a13*c-a03*s}}
export class Location{constructor(lat=0,lng=0,offset=0){this.lat=lat;this.lng=lng;this.offset=offset}
get u(){return(this.lng+180)/360}
set u(x){this.lng=-180+x*360}
get v(){return 1-(this.lat+90)/180}
set v(y){this.lat=90-y*180}
get uv(){return[this.u,this.v]}
clone(){return new Location(this.lat,this.lng,this.offset)}
copyLatLng(v){this.lat=v.lat;this.lng=v.lng;return this}
copy(v){this.lat=v.lat;this.lng=v.lng;this.offset=v.offset;return this}
parse(s,offset=0){let n=Utils.condenseWhiteSpace(String(s)).split(' ');this.lat=parseFloat(n[0])||0;this.lng=parseFloat(n[1])||0;this.offset=offset||0;return this.fix()}
fix(){this.lat=Utils.roll(this.lat);this.lng=Utils.wrap(this.lng);return this}
fromV3(v3){v3=v3.clone().normalize();let theta=0;let phi=0;theta=Math.atan2(v3.x,v3.z);phi=Math.acos(Utils.clamp(v3.y,-1,1));this.u=theta/Utils.PI2;this.lng+=180+90;this.lng*=-1;this.v=(Utils.PI05-phi)/Math.PI;this.lat=90-this.lat;this.fix();return this}
lerp(v,t,shortestPath=!1){if(shortestPath){let fromV3=new V3().fromLocation(this);let toV3=new V3().fromLocation(v);this.copyLatLng(new Location().fromV3(fromV3.lerp(toV3,t)))}else{this.lat=Utils.lerp(this.lat,v.lat,t);let lng=v.lng;if(Math.abs(lng-this.lng)>180){lng=(lng<0)?lng+360:lng-360}
this.lng=Utils.lerp(this.lng,lng,t)}
return this}
distanceTo(v){let sinLat=Math.sin(Utils.deg2Rad(v.lat-this.lat)/2);let sinLng=Math.sin(Utils.deg2Rad(v.lng-this.lng)/2);let a=sinLat*sinLat+Math.cos(Utils.deg2Rad(this.lat))*Math.cos(Utils.deg2Rad(v.lat))*sinLng*sinLng;let c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));return 6378.137*c}
approx(v){return Utils.approx(this.lat,v.lat)&&Utils.approx(this.lng,v.lng)}
equals(v){return this.lat===v.lat&&this.lng===v.lng}
toString(){return this.lat+' '+this.lng}*[Symbol.iterator](){yield this.lat;yield this.lng}}
export class Utils{static PI05=Math.PI/2;static PI2=Math.PI*2;static waitFor(condition,cancelCondition=!1,complete){if(cancelCondition&&cancelCondition())return;if(condition()){complete();return}
let checkComplete=()=>{if(cancelCondition&&cancelCondition())return;if(condition()){complete()}else{requestAnimationFrame(checkComplete)}};requestAnimationFrame(checkComplete)}
static camelCase(name){if(name.startsWith('--'))name=name.substr(2);if(!name.includes('-'))return name;let[str,...others]=name.split('-');for(let part of others){str+=part.charAt(0).toUpperCase()+part.substr(1)}
return str}
static condenseWhiteSpace(str){return str.trim().replaceAll(/\s+/g,' ')}
static format(raw,opt){if(opt.type==='int'){let val=parseInt(raw);if(isNaN(val))return(opt.default!==undefined)?opt.default:0;if(opt.min!==undefined&&val<opt.min)val=opt.min;if(opt.max!==undefined&&val>opt.max)val=opt.max;return val}else if(opt.type==='float'){let val=parseFloat(raw);if(isNaN(val))return(opt.default!==undefined)?opt.default:0;if(opt.min!==undefined&&val<opt.min)val=opt.min;if(opt.max!==undefined&&val>opt.max)val=opt.max;return val}else if(opt.type==='bool'){let val=raw.trim().toLowerCase();if(val==='')return(opt.default!==undefined)?opt.default:!1;if(val==='1'||val==='true')return!0;else if(val==='0'||val==="false")return!1;return(opt.default!==undefined)?opt.default:!1}else if(opt.type==='keyword'){let val=String(raw||'').trim().toLowerCase();if(val==='')return(opt.default!==undefined)?opt.default:'';return val}else if(opt.type==='string'){let val=String(raw||'').trim();if(val==='')return(opt.default!==undefined)?opt.default:'';return val}else if(opt.type==='url'){let val=raw.trim();if(val==='')return(opt.default!==undefined)?opt.default:'';let m=val.match(/^url\(\s*(["']?)([^"'].+)\1\s*\)$/i);if(!m)return(opt.default!==undefined)?opt.default:'';return m[2].trim().replaceAll('\\','')}else if(opt.type==='color'){if(!raw)return(opt.default!==undefined)?opt.default:new Color();return new Color().parse(raw)}else if(opt.type==='location'){if(!raw)return(opt.default!==undefined)?opt.default:new Location();return new Location().parse(raw)}else if(opt.type==='locations'){if(!raw)return(opt.default!==undefined)?opt.default:[];let locations=[];let strs=raw.split(',');for(let s of strs)locations.push(new Location().parse(s));return locations}else if(opt.type==='array'){let clone={...opt};clone.type=clone.subtype;let val=this.condenseWhiteSpace(String(raw||''));if(val==='')return[];let parts=val.split(' ');for(let i=0;i<parts.length;i++){parts[i]=this.format(parts[i],clone)}
return parts}
return raw}
static rad2Deg(rad){return rad*57.2957795}
static deg2Rad(deg){return deg/57.2957795}
static roll(num,min=-90,max=90){if(num<min){return min-(num-min)}else if(num>max){return max-(num-max)}else{return num}}
static wrap(num,min=-180,max=180){let range=max-min;return min+((((num-min)%range)+range)%range)}
static clamp(num,min,max){if(num<min)return min;else if(num>max)return max;return num}
static snap(num,resolution){return Math.round(num/resolution)*resolution}
static approx(a,b,diff=0.001){return Math.abs(a-b)<diff}
static lerp(start,end,t){return start+((end-start)*t)}
static distance(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
static normalizeVector(x,y){let sum=Math.abs(x)+Math.abs(y);let f=1/sum;return[x*f,y*f]}
static normalizeVector3(x,y,z){let sum=Math.abs(x)+Math.abs(y)+Math.abs(z);let f=1/sum;return[x*f,y*f,z*f]}
static angle(dx,dy){return this.rad2Deg(Math.atan2(dy,dx))}
static linear(t){return t}
static easeIn(t){return t*t}
static easeOut(t){return t*(2-t)}
static easeInOut(t){return t<.5?2*t*t:-1+(4-2*t)*t}
static easeInCubic(t){return t*t*t}
static easeOutCubic(t){return 1-Math.pow(1-t,3)}
static arc(t){return t<.5?this.easeOut(t*2):this.easeOut(2-t*2)}
static back(t){return(t=t-1)*t*(2.70158*t+1.70158)+1}
static elastic(t){let p=.3;if(t==0)return 0;if(t==1)return 1;let s=p/(2*Math.PI)*Math.asin(1);return Math.pow(2,-10*t)*Math.sin((t-s)*(2*Math.PI)/p)+1}
static bounce(t){if(t<(1/2.75)){return(7.5625*t*t)}else if(t<(2/2.75)){return(7.5625*(t-=(1.5/2.75))*t+.75)}else if(t<(2.5/2.75)){return(7.5625*(t-=(2.25/2.75))*t+.9375)}else{return(7.5625*(t-=(2.625/2.75))*t+.984375)}}
static dispatch(element,type,options={}){let event=new CustomEvent(type,options);let onattr=element.getAttribute('on'+type);if(onattr&&this.isCustomEventType(element,type)){let func=new Function('event',onattr);func.call(element,event)}
element.dispatchEvent(event,element)}
static isCustomEventType(element,type){return typeof element['on'+type]==='undefined'}
static createTexture(gl){let texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));gl.activeTexture(gl.TEXTURE0);return texture}
static updateTexture(gl,texture,image,callback){if(image.complete&&image.width){this.setupTexture(gl,texture,image,callback)}else{image.addEventListener('load',()=>this.setupTexture(gl,texture,image,callback))}}
static setupTexture(gl,texture,image,callback){gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);if(callback)callback()}
static isPowerOf2(value){return(value&(value-1))===0}
static initShaderProgram(gl,vsSource,fsSource){const vertexShader=this.loadShader(gl,gl.VERTEX_SHADER,vsSource);const fragmentShader=this.loadShader(gl,gl.FRAGMENT_SHADER,fsSource);const shaderProgram=gl.createProgram();gl.attachShader(shaderProgram,vertexShader);gl.attachShader(shaderProgram,fragmentShader);gl.linkProgram(shaderProgram);return shaderProgram}
static loadShader(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);return shader}}
export class Vars{constructor(element,observed){this.element=element;this.cs=getComputedStyle(this.element);this.map=new Map(observed);for(let[name,v]of this.map){v.name=name;v.prop=Utils.camelCase(name.replace('data-',''))}
this.animations=new Set();this.changed=!1}
init(){this.update(0,!0)}
update(delta=0,is_init=!1){this.changed=!1;for(let[name,v]of this.map){let raw=(v.attr)?this.element.getAttribute(name):this.cs.getPropertyValue(name);if(v.raw===raw)continue;this.changed=!0;v.raw=raw;this[v.prop]=Utils.format(raw,v);if((!is_init||v.init)&&v.callback)v.callback(this[v.prop])}
this.updateAnimations(delta)}
getConf(name,fromStyle){if(fromStyle){return this.element.style.getPropertyValue(name).trim()}
if(!this.map.has(name)){return this.cs.getPropertyValue(name).trim()}
let v=this.map.get(name);if(v.type==='location'){return(this[v.prop]&&this[v.prop].toString)?this[v.prop].toString():''}else if(v.type==='color'){return(this[v.prop]&&this[v.prop].toHex)?this[v.prop].toHex():(this[v.prop]||'')}else if(v.type==='url'){return(this[v.prop])?"url('"+this[v.prop].replaceAll("'","\\'")+"')":''}else if(v.type==='array'){return(this[v.prop]&&this[v.prop].join)?this[v.prop].join(' '):''}else{return this[v.prop]}}
fullAttrName(name){if(name==='location')return'data-location';else if(name==='destination')return'data-destination';return name}
get(name){name=this.fullAttrName(name);if(this.map.has(name)&&this.map.get(name).attr){return this.element.getAttribute(name)}else{return this.cs.getPropertyValue(name).trim()}}
set(name,value=''){name=this.fullAttrName(name);if(!this.map.has(name)){this.element.style.setProperty(name,value);return}
let v=this.map.get(name);if(v.attr){if(value){this.element.setAttribute(name,value)}else{this.element.removeAttribute(name)}}else{this.element.style.setProperty(name,value)}}
animate(values,options){this.update();let vars=[];for(let name in values){let val=values[name];name=this.fullAttrName(name);if(!this.map.has(name))continue;let v=this.map.get(name);if(v.type!=='float'&&v.type!=='int'&&v.type!=='location')continue;v.from=this[v.prop];v.to=Utils.format(val,v);vars.push(v)}
let ani=new Animation(this,vars,options);this.animations.add(ani);return ani}
updateAnimations(delta){for(let ani of this.animations)ani.update(delta)}
dispose(){for(let ani of this.animations)ani.dispose();this.animations.clear()}}
class Animation{constructor(manager,vars,options={}){this.manager=manager;this.vars=vars;this.time=0;this.duration=options.duration||500;this.locationVar=this.getVar('data-location');if(this.locationVar){this.distance=this.locationVar.from.distanceTo(this.locationVar.to);if(this.manager.element.globe){this.lerpH=!0;this.locationStartH=this.manager.element.globe.points.heightAt(this.locationVar.from);this.locationEndH=this.manager.element.globe.points.heightAt(this.locationVar.to)}}
this.toLocationVar=this.getVar('data-destination');if(this.toLocationVar){this.distance=Math.max(this.toLocationVar.from.distanceTo(this.toLocationVar.to),this.distance||0);if(this.manager.element.globe){this.lerpH=!0;this.toLocationStartH=this.manager.element.globe.points.heightAt(this.toLocationVar.from);this.toLocationEndH=this.manager.element.globe.points.heightAt(this.toLocationVar.to)}}
if(!options.fixedDuration&&this.distance!==undefined){this.duration*=this.distance/1000}
this.shortestPath=options.shortestPath;this.easing=Utils.camelCase(options.easing||'easeInOut');if(!Utils[options.easing])options.easing='easeInOut';this.onfinish=options.onfinish;this.oncancel=options.oncancel}
update(delta=0){this.time+=delta*1000;let t=this.time/this.duration;if(t>=1){t=1}else{t=Utils[this.easing](t)}
for(let v of this.vars){if(v.type==='float'||v.type==='int'){this.manager.set(v.name,Utils.lerp(v.from,v.to,t))}else if(v.type==='location'){this.manager.set(v.name,v.from.clone().lerp(v.to,t,this.shortestPath).toString());if(v.name==='location'&&this.lerpH){this.manager.location.forceMapHeight=Utils.lerp(this.locationStartH,this.locationEndH,t)}else if(v.name==='destination'&&this.lerpH){this.manager.toLocation.forceMapHeight=Utils.lerp(this.toLocationStartH,this.toLocationEndH,t)}}}
if(t===1){this.manager.animations.delete(this);if(typeof this.onfinish==='function')this.onfinish.bind(this.manager.element)();this.dispose()}}
getVar(name){for(let v of this.vars)if(v.name===name)return v;return undefined}
finish(){if(!this.manager)return;this.time=this.duration;this.update()}
cancel(){if(!this.manager)return;this.manager.animations.delete(this);if(typeof this.oncancel==='function')this.oncancel.bind(this.manager.element)();this.dispose()}
dispose(){this.manager=null;this.vars=null;this.onfinish=null;this.oncancel=null}}
export const ShadowDOM=`

<style>
:host {
	position: relative;
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	z-index: 0;
	-webkit-user-drag: none;
	user-drag: none;
	-webkit-user-select: none;
	user-select: none;
	aspect-ratio: 1;
}

@supports not (aspect-ratio: 1) {
	:host::before {
		content: "";
		display: block;
		padding-top: 100%;
	}
}

:host([hidden]) {
	display: none;
}

::slotted([slot=overlays]) {
	position: absolute;
	left: 0;
	top: 0;
	cursor: default;
}

::slotted(.globe-title) {
	--text-position: var(--title-position, '0 -1');
	--text-padding: var(--title-padding, 0.5);
}


#wrap {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 0;
	transition: opacity 0.3s ease;
}
#wrap.contextlost,
#wrap:not(.complete) {
	opacity: 0;
	pointer-events: none;
}
#wrap.contextlost {
	visibility: hidden;
}

#wrap.draggable {
	touch-action: pinch-zoom;
}
#wrap.pan-x {
	touch-action: pan-y pinch-zoom;
}

#wrap.draggable {
	cursor: -webkit-grab;
	cursor: grab;
}
#wrap.clickable {
	cursor: pointer !important;
}
#wrap.dragging {
	cursor: -webkit-grabbing !important;
	cursor: grabbing !important;
}
#wrap > canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	z-index: 100;
	pointer-events: none;
}

#background,
#foreground {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-repeat: no-repeat;
	background-position: center center;
	background-size: auto calc( 100% * var(--globe-scale, 0.8) * 1.25 );
	pointer-events: none;
}
#foreground {
	background-image: var(--globe-foreground, none);
	z-index: 101;
}

#data-slots {
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	visibility: hidden;
	overflow: hidden;
}
</style>

<div id="wrap">
	<div id="background"></div>
	<canvas id="back"></canvas>
	<canvas id="points"></canvas>
	<canvas id="front"></canvas>
	<slot name="overlays"></slot>
	<div id="foreground"></div>
</div>
<div id="data-slots">
	<slot name="markers"></slot>
	<slot name="texts"></slot>
	<slot name="lines"></slot>
</div>

`;const DELTA_MAX=0.0625;export class Timer{constructor(){this.t=Date.now()}
get delta(){let d=(Date.now()-this.t)/1000;this.t=Date.now();if(d>DELTA_MAX)d=DELTA_MAX;return d}}
const PAN_MIN_SHIFT=3;export class Pointer{constructor(element){this.element=element;this.x=0;this.y=0;this.persistent=!1;this.downTime=0;this.isOver=!1;this.captured=!1;this.grabbing=!1;this.speedometer=new Speedometer();this.element.addEventListener('pointerdown',e=>this.handleDown(e));this.element.addEventListener('pointermove',e=>this.handleMove(e));this.element.addEventListener('pointerup',e=>this.handleUp(e));this.element.addEventListener('pointercancel',e=>this.handleCancel(e));this.element.addEventListener('pointerover',e=>this.handleOver(e));this.element.addEventListener('pointerout',e=>this.handleOut(e))}
handleDown(e){e.preventDefault();if(!e.isPrimary||e.button!==0)return;if(this.captured){this.cancel()}
this.x=e.clientX;this.y=e.clientY;this.downTime=Date.now();this.element.setPointerCapture(e.pointerId);this.pointerId=e.pointerId;this.captured=!0;this.originX=e.clientX;this.originY=e.clientY;this.speedometer.start(e.clientX,e.clientY);if(this.down)this.down(e)}
handleMove(e){if(!e.isPrimary)return;this.x=e.clientX;this.y=e.clientY;if(this.captured){if(!this.grabbing){if(Math.abs(this.originX-e.clientX)>PAN_MIN_SHIFT||Math.abs(this.originY-e.clientY)>PAN_MIN_SHIFT){this.grabbing=!0;if(this.panStart)this.panStart(e)}}
this.speedometer.sample(e.clientX,e.clientY);if(this.grabbing&&this.panMove)this.panMove(e)}
if(this.move)this.move(e)}
handleUp(e){if(!e.isPrimary||e.button!==0)return;this.x=e.clientX;this.y=e.clientY;if(this.grabbing){if(this.panEnd)this.panEnd(e,...this.speedometer.end())}
this.release();if(this.up)this.up(e)}
handleCancel(e){if(!e.isPrimary)return;this.release();if(this.cancel)this.cancel(e)}
handleOver(e){if(!e.isPrimary)return;this.isOver=!0;this.persistent=e.pointerType==='mouse';if(this.over)this.over(e)}
handleOut(e){if(!e.isPrimary)return;this.isOver=!1;if(this.out)this.out(e)}
release(){if(this.captured){this.element.releasePointerCapture(this.pointerId);this.captured=!1;this.grabbing=!1}}
get local(){return new V2(...this.toLocalPosition(this.x,this.y))}
dispose(){this.release()}}
const MIN_POINTER_SPEED=50;const MAX_POINTER_SPEED=1000;const MAX_DELTA_GAP=0.08;export class Speedometer{constructor(){this.samples=[]}
start(x,y){this.samples.length=0;this.sample(x,y)}
sample(x,y){if(this.samples.unshift([Date.now(),x,y])>4){this.samples.pop()}}
end(){if(this.samples.length<2)return[0,0];let lt,lx,ly;let sx=0,sy=0,count=0;let first=!0;for(let[t,x,y]of this.samples){if(first){first=!1;if((Date.now()-t)/1000>MAX_DELTA_GAP)break;lt=t,lx=x,ly=y;continue}
let dt=(lt-t)/1000,dx=x-lx,dy=y-ly;lt=t,lx=x,ly=y;if(dt>MAX_DELTA_GAP){break}else if(dt<=0){continue}
sx+=dx/dt;sy+=dy/dt;count++}
if(count===0)return[0,0];sx/=count;sy/=count;if(Math.abs(sx)<MIN_POINTER_SPEED)sx=0;if(Math.abs(sy)<MIN_POINTER_SPEED)sy=0;return[Utils.clamp(sx,-MAX_POINTER_SPEED,MAX_POINTER_SPEED),Utils.clamp(sy,-MAX_POINTER_SPEED,MAX_POINTER_SPEED)]}}
const SLIDE_MIN=0.75;const DAMPING_SCALE=8;export class Panning{constructor(globe){this.globe=globe}
enable(){this.enabled=!0}
disable(){this.enabled=!1;this.globe.wrap.classList.remove('dragging');this.stop()}
start(e){if(!this.enabled)return;this.globe.wrap.classList.add('dragging');this.x=e.clientX;this.y=e.clientY;this.origin=this.globe.center.clone();this.slide=!1}
move(e){if(!this.enabled)return;let lat=this.offsetY(e.clientY);if(this.globe.vars.globeLatitudeLimit===0)lat=0;let lng=this.offsetX(e.clientX);this.globe.center.lat=Utils.clamp(this.origin.lat-lat,-90,90);this.globe.center.lng=Utils.wrap(this.origin.lng+lng,-180,180);this.globe.updateCenter()}
end(e,sx,sy){if(!this.enabled)return;this.globe.wrap.classList.remove('dragging');if(this.globe.vars.globeDamping<1&&(sx||sy)){this.slide=!0;this.speedX=-sx/5;this.speedY=sy*0.66/5}}
stop(){this.slide=!1}
offsetX(x){return(this.x-x)/this.globe.view.diameter*150}
offsetY(y){return(this.y-y)/this.globe.view.diameter*150}
update(delta){if(!this.slide)return;let speedFactor=1-this.globe.vars.globeDamping*delta*DAMPING_SCALE;this.speedX*=speedFactor;this.speedY*=speedFactor;this.globe.center.lat=Utils.clamp(this.globe.center.lat-this.speedY*delta,-90,90);this.globe.center.lng=Utils.wrap(this.globe.center.lng-this.speedX*delta,-180,180);this.globe.updateCenter();if(Math.abs(this.speedX)<SLIDE_MIN&&Math.abs(this.speedY)<SLIDE_MIN){this.slide=!1}}}
const AR_FADE_TIME=2.5;const AR_LNG_SCALE=15;const AR_LAT_SCALE=2;export class Autorotate{constructor(globe){this.globe=globe;this.enabled=!1}
start(){this.enabled=!0;this.waiting=!0;this.timeWaiting=0;this.fadeIn=!0;this.timeFading=0}
stop(){this.enabled=!1}
update(delta){if(this.waiting){this.timeWaiting+=delta;if(this.timeWaiting>=this.globe.vars.autorotateDelay){this.waiting=!1}}else{let speed=this.globe.vars.autorotateSpeed;if(this.fadeIn){this.timeFading+=delta;if(this.timeFading>=AR_FADE_TIME){this.fadeIn=!1}else{speed*=Utils.easeIn(this.timeFading/AR_FADE_TIME)}}
let targetLat=this.globe.vars.autorotateLatitude;if(targetLat!==null&&this.globe.center.lat!==targetLat){let dir=Math.sign(targetLat-this.globe.center.lat);let lat=this.globe.center.lat+dir*Math.abs(speed)*AR_LAT_SCALE*delta;if(dir===1){if(lat>targetLat)lat=targetLat}else{if(lat<targetLat)lat=targetLat}
this.globe.center.lat=lat}
this.globe.center.lng=Utils.wrap(this.globe.center.lng+speed*AR_LNG_SCALE*delta);this.globe.updateCenter()}}}
export class Obj{constructor(globe,element){this.globe=globe;this.view=globe.view;this.element=element}
click(){this.element.click()}}
const OFFSET_SCALE=0.2;export class Line extends Obj{constructor(globe,element){super(globe,element);this.r=new V3();this.vars=new Vars(element,[['data-location',{attr:!0,type:'location',callback:()=>this.regenerate=!0}],['data-destination',{attr:!0,type:'location',default:null,callback:()=>this.regenerate=!0}],['z-index',{type:'int',default:1}],['--line-color',{type:'color',default:'#999999'}],['--line-thickness',{type:'float',min:0,max:10,default:1}],['--line-offset',{type:'float',min:0,default:1,callback:()=>this.regenerate=!0}],['--line-start',{type:'float',min:0,max:1,default:0,callback:()=>this.regenerate=!0}],['--line-end',{type:'float',min:0,max:1,default:1,callback:()=>this.regenerate=!0}],]);this.vars.init();this.regenerate=!0}
generate(){this.points=[];this.spike=this.vars.destination?!1:!0;if(!this.spike){if(this.vars.lineStart>=this.vars.lineEnd)return;let _sV3=new V3().fromLocation(this.vars.location,this.globe);let sV3=_sV3.clone();let sO=this.vars.location.o;let _eV3=new V3().fromLocation(this.vars.destination,this.globe);let eV3=_eV3.clone();let eO=this.vars.destination.o;if(this.vars.lineStart>0){let o=Utils.lerp(this.vars.location.o,this.vars.destination.o,this.vars.lineStart);sV3.lerp(_eV3,this.vars.lineStart).normalize().multiply(o);sO=o}
if(this.vars.lineEnd<1){let o=Utils.lerp(this.vars.location.o,this.vars.destination.o,this.vars.lineEnd);eV3.lerp(_sV3,1-this.vars.lineEnd).normalize().multiply(o);eO=o}
let clipScale=this.vars.lineEnd-this.vars.lineStart;this.s=new LinePoint(sV3,sO);this.points.push(this.s);this.e=new LinePoint(eV3,eO);this.points.push(this.e);let dist=this.s.v.distanceTo(this.e.v)*2.5*clipScale;let splits_per_dist=(this.globe.vars.globeQuality==='low')?2:3;splits_per_dist+=Utils.clamp(this.vars.lineOffset,0,2)/2;this.points=this.subdevide(this.points[0],this.points[1]);let min_splits=2;if(dist>0.05&&this.vars.lineOffset>0.5)min_splits=5;else if(dist>0.04&&this.vars.lineOffset>0.4)min_splits=4;else if(dist>0.03&&this.vars.lineOffset>0.3)min_splits=3;let splits=Math.max(Math.round(dist*splits_per_dist),min_splits);this.points=[...this.subdevide(this.points[0],this.points[1],splits,!0),...this.subdevide(this.points[1],this.points[2],splits)];if(this.vars.lineOffset){let o=this.vars.lineOffset;if(clipScale===1&&dist<1)o*=Utils.easeOut(dist);for(let i=0;i<this.points.length;i++){let t=i/(this.points.length-1);let ct=Utils.lerp(this.vars.lineStart,this.vars.lineEnd,t);this.points[i].v.multiply(1+Utils.arc(ct)*o*OFFSET_SCALE);this.points[i].m.xyz=this.points[i].v.xyz}}}else{this.spike=!0;this.s=new LinePoint(new V3().fromLocation(this.vars.location,this.globe),this.vars.location.o);this.points.push(this.s);this.r.copy(this.s);let end=this.vars.location.clone();end.offset=this.vars.lineOffset||0.01;this.e=new LinePoint(new V3().fromLocation(end,this.globe));this.points.push(this.e)}}
subdevide(s,e,splits=1,omitEnd=!1){let points=[];points.push(s);for(var i=1;i<=splits;i++){let t=1/(splits+1)*i;let o=Utils.lerp(s.o,e.o,t);points.push(new LinePoint(s.v.clone().lerp(e.v,t).normalize().multiply(o),o))}
if(!omitEnd)points.push(e);return points}
update(delta){this.vars.update(delta);if(this.regenerate||this.lastQuality!==this.globe.vars.globeQuality||this.lastMapHeight!==this.globe.vars.mapHeight){this.generate();this.lastQuality=this.globe.vars.globeQuality;this.lastMapHeight=this.globe.vars.mapHeight;this.regenerate=!1}
if(!this.points.length)return;for(let p of this.points){this.view.rotateMatrix(p.m,p.q,p.r);this.view.projectMatrix(p.q,p.p,p.c)}
if(this.spike){this.r.copy(this.points[0].r)}else{this.r.copy(this.points[Math.round((this.points.length-1)/2)].r)}}
draw(){if(!this.points.length)return;if(this.spike){this.drawSpike()}else{this.drawArc()}}
drawSpike(){let ctx=(this.r.z>0)?this.view.frontCtx:this.view.backCtx;ctx.globalAlpha=this.globe.getBackOpacity(this.r)*this.vars.cs.opacity;this.stroke(ctx,this.points)}
drawArc(){if(this.s.r.z>=this.globe.vars.backsideTransition&&this.e.r.z>=this.globe.vars.backsideTransition){let ctx=this.view.frontCtx;ctx.globalAlpha=this.vars.cs.opacity;this.stroke(ctx,this.points)}else if(this.s.r.z<-this.globe.vars.backsideTransition&&this.e.r.z<-this.globe.vars.backsideTransition){let ctx=this.view.backCtx;ctx.globalAlpha=this.vars.cs.opacity*this.globe.vars.backsideOpacity;this.stroke(ctx,this.points)}else{if(this.points[0].r.z<this.points[this.points.length-1].r.z){this.points.reverse()}
let front_points=[],back_points=[];let front=!0;let a_sum=0;for(let p of this.points){if(p.r.z<0)front=!1;a_sum+=this.globe.getBackOpacity(p.r);if(front){front_points.push(p)}else{back_points.push(p)}}
if(front_points.length>1){let ctx=this.view.frontCtx;ctx.globalAlpha=a_sum/this.points.length*this.vars.cs.opacity;this.stroke(ctx,front_points)}
if(front_points.length){back_points.unshift(front_points[front_points.length-1])}
if(back_points.length>1){let ctx=this.view.backCtx;ctx.globalAlpha=a_sum/this.points.length*this.vars.cs.opacity;this.stroke(ctx,back_points)}}}
stroke(ctx,points){if(ctx.globalAlpha<0.03)return;let lineColor=this.vars.lineColor;ctx.strokeStyle=(lineColor.toHex)?lineColor.toHex():(lineColor||'#999999');ctx.lineWidth=this.vars.lineThickness*this.view.pxScale;ctx.lineJoin='bevel';let first=!0;for(let p of points){if(first){ctx.beginPath();ctx.moveTo(...p.c);first=!1}else{ctx.lineTo(...p.c)}}
ctx.stroke()}}
class LinePoint{constructor(v,o){this.v=v;this.o=o;this.r=new V3();this.c=new V2();this.m=new Matrix(v);this.q=new Matrix();this.p=new Matrix()}}
export class Marker extends Obj{constructor(globe,element){super(globe,element);this.v=new V3();this.r=new V3();this.m=new Matrix();this.q=new Matrix();this.p=new Matrix();this.c=new V2();this.rel=new V2();this.position=new V2();this.shift=new V2();this.bounds=new Bounds();this.showTitleHandler=()=>this.showTitle();this.hideTitleHandler=()=>this.hideTitle();this.vars=new Vars(element,[['data-location',{attr:!0,type:'location'}],['title',{attr:!0,type:'string',init:!0,callback:()=>this.updateTitle()}],['z-index',{type:'int',default:2}],['--marker-image',{type:'url',default:'data:image/svg+xml;name=default;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNy41IiBmaWxsPSIjZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIvPjwvc3ZnPg',init:!0,callback:v=>{this.imgreq=this.globe.imgloader.get(v)}},],['--marker-rotation',{type:'float',min:-360,max:360,default:0,init:!0,callback:v=>this.rotation=Utils.deg2Rad(v)}],['--marker-size',{type:'float',min:0,max:10,default:1}],['--marker-position',{type:'array',subtype:'float',init:!0,callback:v=>{[this.position.x=0,this.position.y=0]=v||[]}}],['--marker-offset',{type:'float'}],['--marker-depth',{type:'float',min:0,max:1,default:0}],['pointer-events',{type:'keyword'}],]);this.vars.init()}
over(){this.element.classList.add('marker-hover');Utils.dispatch(this.element,'pointerover')}
out(){this.element.classList.remove('marker-hover');Utils.dispatch(this.element,'pointerout')}
update(delta){this.vars.update(delta);this.events=this.vars.pointerEvents==='all'||(this.vars.pointerEvents!=='none'&&(this.element.getAttribute('href')||this.element.getAttribute('title')));this.vars.location.offset=this.vars.markerOffset;this.v.fromLocation(this.vars.location,this.globe);this.m.xyz=this.v.xyz;this.view.rotateMatrix(this.m,this.q,this.r);this.view.projectMatrix(this.q,this.p,this.c);let s=this.vars.markerSize*40*this.view.pxScale;if(this.vars.markerDepth)s*=1+this.r.z*this.vars.markerDepth/2;this.bounds.w=s;this.bounds.h=this.bounds.w*(this.imgreq.ratio||1);this.bounds.x=this.c.x+(this.position.x/2-0.5)*this.bounds.w;this.bounds.y=this.c.y+(this.position.y/2-0.5)*this.bounds.h;this.rel.x=this.bounds.x+this.bounds.w/2-this.view.hw;this.rel.y=this.bounds.y+this.bounds.h/2-this.view.hh;this.relSq=this.rel.lengthSq()}
draw(){if(!this.imgreq.ready)return;let ctx=(this.r.z>0)?this.view.frontCtx:this.view.backCtx;let a=this.globe.getBackOpacity(this.r)*this.vars.cs.opacity;if(a<0.03)return;ctx.globalAlpha=a;if(this.rotation){this.shift.x=this.bounds.x+this.bounds.w/2;this.shift.y=this.bounds.y+this.bounds.h/2;ctx.translate(...this.shift);ctx.rotate(this.rotation);ctx.translate(...this.shift.multiply(-1))}
ctx.drawImage(this.imgreq.img,...this.bounds);if(this.rotation){ctx.resetTransform()}}
updateTitle(){let hasTitle=this.vars.title;if(hasTitle&&!this.titleEvents){this.titleEvents=!0;this.element.addEventListener('pointerover',this.showTitleHandler);this.element.addEventListener('pointerout',this.hideTitleHandler)}else if(!hasTitle&&this.titleEvents){this.titleEvents=!1;this.element.removeEventListener('pointerover',this.showTitleHandler);this.element.removeEventListener('pointerout',this.hideTitleHandler)}}
createMarkerTitle(){this.globe.insertAdjacentHTML('beforeend','<div slot="texts" class="globe-text globe-title"></div>');this.globe.markerTitle=this.globe.querySelector('.globe-title')}
showTitle(){if(!this.globe.markerTitle)this.createMarkerTitle();let t=this.globe.markerTitle;this.globe.set(t,'data-location',this.globe.getConf(this.element,'data-location'));this.globe.set(t,'--text-offset',this.globe.getConf(this.element,'--marker-offset'));this.globe.set(t,'--title-position',this.globe.getConf(this.element,'--title-position'));this.globe.set(t,'--title-padding',this.globe.getConf(this.element,'--title-padding'));this.globe.set(t,'title',this.vars.title);t.style.display='block';this.globe.currentMarker=this}
hideTitle(){if(this.globe.currentMarker!==this)return;this.globe.markerTitle.style.display='none';this.globe.currentMarker=null}}
export class Text extends Obj{constructor(globe,element){super(globe,element);this.v=new V3();this.r=new V3();this.m=new Matrix();this.q=new Matrix();this.p=new Matrix();this.c=new V2();this.rel=new V2();this.position=new V2();this.margin=new V2();this.bounds=new Bounds();this.vars=new Vars(element,[['data-location',{attr:!0,type:'location'}],['title',{attr:!0,type:'string',init:!0,callback:()=>this.changed=!0}],['font-family',{type:'string',default:'sans-serif',callback:()=>this.changed=!0}],['font-weight',{type:'string',callback:()=>this.changed=!0}],['font-style',{type:'string',callback:()=>this.changed=!0}],['z-index',{type:'int',default:3}],['--text-color',{type:'color',default:'#999999'}],['--text-outline',{type:'color',default:null}],['--text-size',{type:'float',min:0.1,max:10,default:1},],['--text-height',{type:'float',min:0.1,max:2,default:1.1},],['--text-padding',{type:'float',min:0,default:0},],['--text-position',{type:'array',subtype:'float',init:!0,callback:v=>{[this.position.x=0,this.position.y=0]=v||[];if(this.position.x===0){this.textAlign='center'}else{this.textAlign=(this.position.x>0)?'left':'right'}}}],['--text-offset',{type:'float'}],['--text-depth',{type:'float',min:0,max:1,default:0}],['pointer-events',{type:'keyword'}],]);this.vars.init();this.changed=!0}
over(){this.element.classList.add('text-hover');Utils.dispatch(this.element,'pointerover')}
out(){this.element.classList.remove('text-hover');Utils.dispatch(this.element,'pointerout')}
measureText(){this.changed=!1;this.view.frontCtx.font=`${this.vars.fontWeight} ${this.vars.fontStyle} 20px/20px ${this.vars.fontFamily}`;this.t=[];let text=this.vars.title||'';let lines=text.trim().split(/\r?\n/i);this.lineWidth=0;for(let l of lines){let text=Utils.condenseWhiteSpace(l);this.t.push(text);this.lineWidth=Math.max(this.view.frontCtx.measureText(text).width,this.lineWidth)}}
update(delta){this.vars.update(delta);this.events=this.vars.pointerEvents==='all'||(this.vars.pointerEvents!=='none'&&this.element.getAttribute('href'));this.vars.location.offset=this.vars.textOffset;this.v.fromLocation(this.vars.location,this.globe);this.m.xyz=this.v.xyz;this.view.rotateMatrix(this.m,this.q,this.r);this.view.projectMatrix(this.q,this.p,this.c);if(this.changed)this.measureText();this.fontSize=this.vars.textSize*20*this.view.pxScale;if(this.vars.textDepth)this.fontSize*=1+this.r.z*this.vars.textDepth/2;this.fontScale=this.fontSize/20;this.fontStr=`${this.vars.fontWeight} ${this.vars.fontStyle} ${this.fontSize}px/${this.fontSize}px ${this.vars.fontFamily}`;this.view.frontCtx.font=this.fontStr;this.view.backCtx.font=this.fontStr;this.padding=this.fontSize*this.vars.textPadding;this.lineHeight=this.fontSize*this.vars.textHeight;this.bounds.w=this.padding+this.lineWidth*this.fontScale+this.padding;this.bounds.h=this.padding+this.lineHeight*this.t.length+this.padding;this.bounds.x=this.c.x+(this.position.x/2-0.5)*this.bounds.w;this.bounds.y=this.c.y+(this.position.y/2-0.5)*this.bounds.h;if(this.textAlign==='left')this.alignShift=this.padding;else if(this.textAlign==='right')this.alignShift=this.bounds.w-this.padding;else this.alignShift=this.bounds.w/2;this.rel.x=this.bounds.x+this.bounds.w/2-this.view.hw;this.rel.y=this.bounds.y+this.bounds.h/2-this.view.hh;this.relSq=this.rel.lengthSq()}
draw(){let a=this.globe.getBackOpacity(this.r)*this.vars.cs.opacity;if(a<0.03)return;let ctx=(this.r.z>0)?this.view.frontCtx:this.view.backCtx;ctx.globalAlpha=a;ctx.font=this.fontStr;let textColor=this.vars.textColor;ctx.fillStyle=(typeof textColor==='object')?textColor.toHex():(textColor||'#999999');ctx.textAlign=this.textAlign;if(this.vars.textOutline){ctx.strokeStyle=this.vars.textOutline.toHex();ctx.lineWidth=this.fontSize/7;ctx.lineJoin='bevel';let i=1;for(let t of this.t){ctx.strokeText(t,this.bounds.x+this.alignShift,this.bounds.y+this.padding+this.lineHeight*i-this.lineHeight*0.15);i++}}
let i=1;for(let t of this.t){ctx.fillText(t,this.bounds.x+this.alignShift,this.bounds.y+this.padding+this.lineHeight*i-this.lineHeight*0.15);i++}}}
export class View{constructor(globe){this.globe=globe;this.frontCtx=this.globe.frontCanvas.getContext('2d');this.backCtx=this.globe.backCanvas.getContext('2d');this.cacheLocation=new Location();this.rotation=new V3();this.pxRatioLimit=2;this.maxCanvas=4096;this.hitObjs=[]}
updateBounds(bounds){let pxRatio=this.getPxRatio(bounds.width,bounds.height);let needsResize=!this.bounds||this.bounds.width!==bounds.width||this.bounds.height!==bounds.height||this.pxRatio!==pxRatio;this.bounds=bounds;if(needsResize||this.globeScale!==this.globe.vars.globeScale){this.globeScale=this.globe.vars.globeScale;this.pxRatio=pxRatio;this.w=Math.round(bounds.width*pxRatio);this.h=Math.round(bounds.height*pxRatio);this.hw=this.w/2;this.hh=this.h/2;this.pxScale=this.h/500*this.globeScale;this.diameter=this.bounds.height*this.globeScale;this.radius=this.diameter/2;this.radiusSq=this.radius*this.radius}
if(needsResize){this.resizeCanvas(this.globe.frontCanvas);this.resizeCanvas(this.globe.backCanvas);this.resizeCanvas(this.globe.glCanvas);this.needsUpdate=!0}}
getPxRatio(w,h){let r=Math.min(window.devicePixelRatio,this.pxRatioLimit);if(w*r>this.maxCanvas||h*r>this.maxCanvas){let canvasRatio=h/w;if(canvasRatio<=1){r*=this.maxCanvas/(w*r)}else{r*=this.maxCanvas/(h*r)}}
return r}
resizeCanvas(c){c.setAttribute('width',this.w);c.setAttribute('height',this.h)}
isHidden(bounds){return!bounds||bounds.width===0||bounds.height===0}
outOfBounds(bounds){return!bounds||bounds.right<0||bounds.bottom<0||bounds.left>window.innerWidth||bounds.top>window.innerHeight}
rotateMatrix(m,q,r){q.multiply(this.renderer.modelViewMatrix,m);[r.x,r.y,r.z]=q.xyz}
projectMatrix(q,p,c){p.multiply(this.renderer.projectionMatrix,q);c.x=p.x*this.hw+this.hw;c.y=-p.y*this.hh+this.hh}
hitTest(){let pos=this.globe.pointer.local;for(let m of this.hitObjs){if(!m.events)continue;if(m.r.z<0&&m.relSq<this.radiusSq)continue;if(m.bounds.within(pos))return m}
return null}
draw(delta){if(this.needsUpdate||this.globe.vars.changed||this.globe.points.regenerate||!this.renderer.drawn||this.globe.vars.animation!=='none'||!this.cacheLocation.equals(this.globe.center)){this.needsUpdate=!1;this.cacheLocation.copy(this.globe.center);this.globe.points.draw(delta)}
this.objs=[];for(let n of this.globe.markers){let o=this.globe.getObj(n);if(o.vars.cs.display==='none')continue;o.update(delta);this.objs.push(o)}
for(let n of this.globe.texts){let o=this.globe.getObj(n);if(o.vars.cs.display==='none')continue;o.update(delta);this.objs.push(o)}
for(let n of this.globe.lines){let o=this.globe.getObj(n);if(o.vars.cs.display==='none')continue;o.update(delta);this.objs.push(o)}
this.objs.sort((a,b)=>(b.vars.zIndex===a.vars.zIndex)?b.r.z-a.r.z:b.vars.zIndex-a.vars.zIndex);this.hitObjs=[...this.objs];this.objs.reverse();this.frontCtx.clearRect(0,0,this.w,this.h);this.backCtx.clearRect(0,0,this.w,this.h);for(let o of this.objs)o.draw()}}
export const POINTS_VS=`

attribute vec4 aPosition;
attribute vec2 aLocation;
attribute vec4 aColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uPointSize;

uniform float uEdgeOpacity;
uniform vec4 uBacksideColor;
uniform float uBacksideOpacity;
uniform float uBacksideTransition;

uniform int uAni;
uniform float uAniIntensity;
uniform float uAniScale;
uniform float uTime;

varying vec4 vColor;


float easeIn(float t) {
	return t*t;
}	
float easeOut(float t) {
	return t*(2.0-t);
}

float getEdgeOpacity( float z ) {
	if ( uEdgeOpacity < 1.0 && abs(z) < 0.6 ) {
		return mix( uEdgeOpacity, 1.0, easeIn( abs(z) / 0.6 ) );
	} else {
		return 1.0;
	}
}

float getBackOpacity( float z ) {
	if ( abs(z) < uBacksideTransition )  {
		return mix( uBacksideOpacity, 1.0, (z + uBacksideTransition) / (uBacksideTransition*2.0) );
	} else if ( z < 0.0 ) {
		return uBacksideOpacity;
	} else {
		return 1.0;
	}		
}

float getBackTransition( float z ) {
	if ( abs(z) < uBacksideTransition )  {
		return mix( 1.0, 0.0, (z + uBacksideTransition) / (uBacksideTransition*2.0) );
	} else if ( z < 0.0 ) {
		return 1.0;
	} else {
		return 0.0;
	}		
}

vec4 perm(vec4 x){
	x = ((x * 34.0) + 1.0) * x;
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float noiseV3(vec3 p){
	vec3 a = floor(p);
	vec3 d = p - a;
	d = d * d * (3.0 - 2.0 * d);
	vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
	vec4 k1 = perm(b.xyxy);
	vec4 k2 = perm(k1.xyxy + b.zzww);
	vec4 c = k2 + a.zzzz;
	vec4 k3 = perm(c);
	vec4 k4 = perm(c + 1.0);
	vec4 o1 = fract(k3 * (1.0 / 41.0));
	vec4 o2 = fract(k4 * (1.0 / 41.0));
	vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
	vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
	return -1.0 + (o4.y * d.y + o4.x * (1.0 - d.y)) * 2.0;
}

float noiseT( vec2 loc, float t ) {
	t += noiseV3( vec3(loc,t*0.63) ) * 0.75;
	return noiseV3( vec3(loc,t) );
}

float noise( float offset ) {
	float s = 1.0 / easeIn(uAniScale);
	float t = (uTime * 3.0) + offset;
	vec2 loc = aLocation;
	loc.x *= 2.0; // same res as y
	
	float n = noiseT( loc*s, t );

	// patch seams
	float blend_dist = uAniScale/3.0;
	
	if ( loc.x > 2.0-blend_dist ) {
		float n0 = noiseT( vec2(0.0,loc.y)*s, t );
		n = mix( n0, n, (2.0-loc.x) * (1.0/blend_dist) );
	}
	
	if ( loc.y > 1.0-blend_dist ) {
		float n1 = noiseT( vec2(0.0,1.0)*s, t );
		n = mix( n1, n, (1.0-loc.y) * (1.0/blend_dist) );
	}	
	
	return n * uAniIntensity;
}

	

void main() {

// position

	vec4 pos = uModelViewMatrix * aPosition;
	
	if ( uAni == 1 ) { // offset
		pos.xyz *= 1.0 + noise(0.0)/10.0;
	} else if ( uAni == 2 ) { // position
		pos.x += noise(0.0)/18.0;
		pos.y += noise(83.3)/18.0;
		pos.z += noise(17.9)/18.0;			
	}
	
	gl_Position = uProjectionMatrix * pos;
	
		
// point size

	float size = uPointSize; 	// * ( 1.0 + (pos.z / 10.0) );
	
	if ( uAni == 3 ) { // size
		size *= 1.0 + noise(0.0);
	}
	
	gl_PointSize = size;

	
// color
	
	vColor = aColor;
	
	if ( uAni == 5 ) { // color
		vColor.r = clamp(vColor.r + noise(0.0), 0.0, 1.0);
		vColor.g = clamp(vColor.g + noise(83.3), 0.0, 1.0);
		vColor.b = clamp(vColor.b + noise(17.9), 0.0, 1.0);			
	}
	
	if ( uBacksideColor.a > 0.0 ) {
		vColor.rgb = mix( vColor.rgb, uBacksideColor.rgb, getBackTransition( pos.z ) * uBacksideColor.a );
	}
	
	
// alpha
	
	
	if ( uAni == 4 ) { // opacity
		vColor.a = clamp(vColor.a + noise(0.0), 0.0, 1.0);
	}
	
	if ( uBacksideOpacity < 1.0 ) {
		vColor.a *= getBackOpacity( pos.z ); // depth fade
	}
	
	if ( uEdgeOpacity < 1.0 ) {
		vColor.a *= getEdgeOpacity( pos.z ); // edge fade
	}		

}
`;export const POINTS_FS=`

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

varying vec4 vColor;

uniform bool uUseTexture;
uniform int uColorBlend;
uniform sampler2D uPointTexture;


void main() {
	
	vec4 c = vColor;
	
	if ( c.a < 0.03 ) discard;
	
	
	if ( uUseTexture ) {
		
		vec4 t = texture2D(uPointTexture, gl_PointCoord);

		c.a *= t.a;
		
		// blend texture color
		
		//   uColorBlend == 1 				// replace - discard texture color
		if ( uColorBlend == 0 ) {			// none - only texture color 
			c.rgb = t.rgb;
		} else if ( uColorBlend == 2 ) {	// multiply
			c.rgb = c.rgb * t.rgb;
		} else if ( uColorBlend == 3 ) {	// average
			c.rgb = mix( c.rgb, t.rgb, 0.5 );
		} else if ( uColorBlend == 4 ) {	// high alpha
			c.rgb = mix( t.rgb, c.rgb, c.a );
		} else if ( uColorBlend == 5 ) {	// low alpha
			c.rgb = mix( c.rgb, t.rgb, c.a );
		}			
		
	}
	

	if ( c.a < 0.03 ) discard;
	
	// premultiply alpha
	c.rgb = c.rgb * c.a; 
	
	gl_FragColor = c;
	
}
`;const BLEND_MODES={none:0,replace:1,multiply:2,average:3,'high-alpha':4,'low-alpha':5,};const ANI_MODES={none:0,offset:1,position:2,size:3,opacity:4,color:5,};export class Renderer{constructor(globe){this.globe=globe;this.view=globe.view;this.canvas=this.globe.glCanvas;this.canvas.addEventListener('webglcontextlost',e=>{if(this.disposed)return;console.log('context lost');this.globe.wrap.classList.add('contextlost');this.programReady=!1;this.dataReady=!1;e.preventDefault()});this.canvas.addEventListener('webglcontextrestored',e=>{if(this.disposed)return;requestAnimationFrame(()=>this.restore())});this.projectionMatrix=new Matrix();this.modelViewMatrix=new Matrix();this.time=0;this.initGl()}
initGl(){this.drawn=!1;let options={alpha:!0,premultipliedAlpha:!0};this.gl=this.canvas.getContext('webgl',options);if(!this.gl){console.error(`Unable to initialize WebGL.`);this.globe.fail();return}
this.program=Utils.initShaderProgram(this.gl,POINTS_VS,POINTS_FS);let ext=this.gl.getExtension('KHR_parallel_shader_compile');if(ext){Utils.waitFor(()=>this.gl.getProgramParameter(this.program,ext.COMPLETION_STATUS_KHR),()=>this.globe.disposed||this.gl.isContextLost(),()=>this.initProgram())}else{this.initProgram()}}
initProgram(){let gl=this.gl;if(gl.getProgramParameter(this.program,gl.LINK_STATUS)){gl.useProgram(this.program)}else{console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);globe.fail();return}
this.info={};this.addAttributes('aPosition','aLocation','aColor');this.addUniforms('uProjectionMatrix','uModelViewMatrix','uPointSize','uUseTexture','uPointTexture','uColorBlend','uEdgeOpacity','uBacksideColor','uBacksideOpacity','uBacksideTransition','uAni','uAniIntensity','uAniScale','uTime');this.initBuffers();this.useTexture=!1;this.pointTexture=Utils.createTexture(gl);gl.clearColor(0,0,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);this.programReady=!0}
restore(){if(this.disposed)return;this.initGl();this.globe.points.regenerate=!0}
addAttributes(...names){for(let name of names)this.info[name]=this.gl.getAttribLocation(this.program,name)}
addUniforms(...names){for(let name of names)this.info[name]=this.gl.getUniformLocation(this.program,name)}
setDataAsync(points){Utils.waitFor(()=>this.programReady,()=>this.globe.disposed||this.gl.isContextLost(),()=>this.setData(points))}
setData(points){this.indices=new Uint16Array(points.length);let data=new Float32Array(points.length*9);let i=0;for(let p of points){data[i++]=p.v.x;data[i++]=p.v.y;data[i++]=p.v.z;data[i++]=p.l.u;data[i++]=p.l.v;data[i++]=p.f[0];data[i++]=p.f[1];data[i++]=p.f[2];data[i++]=p.f[3]*p.a}
this.updateBuffers(data);this.dataReady=!0;this.globe.complete();this.globe.wrap.classList.remove('contextlost')}
initBuffers(){let gl=this.gl;this.dataBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.dataBuffer);const stride=9*Float32Array.BYTES_PER_ELEMENT;gl.vertexAttribPointer(this.info.aPosition,3,gl.FLOAT,!1,stride,0);gl.enableVertexAttribArray(this.info.aPosition);gl.vertexAttribPointer(this.info.aLocation,2,gl.FLOAT,!1,stride,3*Float32Array.BYTES_PER_ELEMENT);gl.enableVertexAttribArray(this.info.aLocation);gl.vertexAttribPointer(this.info.aColor,4,gl.FLOAT,!1,stride,5*Float32Array.BYTES_PER_ELEMENT);gl.enableVertexAttribArray(this.info.aColor);this.indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer)}
updateBuffers(data){this.gl.bufferData(this.gl.ARRAY_BUFFER,data,this.gl.STATIC_DRAW);this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,this.indices,this.gl.DYNAMIC_DRAW)}
updateTexture(image){Utils.waitFor(()=>this.programReady,()=>this.globe.disposed||this.gl.isContextLost(),()=>Utils.updateTexture(this.gl,this.pointTexture,image,()=>{this.useTexture=!0;this.view.needsUpdate=!0}))}
updateProjectionMatrix(){let extent=1/this.globe.vars.globeScale;let ratio=this.view.h/this.view.w;let w=1,h=1;if(ratio<1){w=1/ratio}else{h=ratio}
this.projectionMatrix.setOrthoProjection(extent*w,-extent*w,-extent*h,extent*h,-10,10);this.gl.uniformMatrix4fv(this.info.uProjectionMatrix,!1,this.projectionMatrix.m)}
updateModelViewMatrix(){this.modelViewMatrix.reset();this.modelViewMatrix.rotateX(this.view.rotation.x);if(this.view.rotation.z!==0){this.modelViewMatrix.rotateZ(this.view.rotation.z)}
this.modelViewMatrix.rotateY(this.view.rotation.y);this.gl.uniformMatrix4fv(this.info.uModelViewMatrix,!1,this.modelViewMatrix.m)}
get ready(){return this.programReady&&this.dataReady&&!this.gl.isContextLost()}
get lost(){return this.gl.isContextLost()}
updateView(){if(!this.ready)return;this.updateProjectionMatrix();this.updateModelViewMatrix()}
draw(delta){if(!this.ready)return;let gl=this.gl;gl.viewport(0,0,gl.canvas.width,gl.canvas.height);gl.clear(gl.COLOR_BUFFER_BIT);gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER,0,this.indices);gl.uniform1f(this.info.uPointSize,this.globe.vars.pointSize*3*this.view.pxScale);gl.uniform1i(this.info.uUseTexture,this.useTexture);gl.uniform1i(this.info.uPointTexture,this.pointTexture);gl.uniform1i(this.info.uColorBlend,BLEND_MODES[this.globe.vars.pointColorBlend]||0);gl.uniform1f(this.info.uEdgeOpacity,this.globe.vars.pointEdgeOpacity);if(this.globe.vars.backsideColor&&this.globe.vars.backsideColor.rgba){gl.uniform4f(this.info.uBacksideColor,...this.globe.vars.backsideColor.rgba)}else{gl.uniform4f(this.info.uBacksideColor,0,0,0,0)}
gl.uniform1f(this.info.uBacksideOpacity,this.globe.vars.backsideOpacity);gl.uniform1f(this.info.uBacksideTransition,this.globe.vars.backsideTransition);let ani=ANI_MODES[this.globe.vars.animation]||0;gl.uniform1i(this.info.uAni,ani);if(ani){gl.uniform1f(this.info.uAniIntensity,this.globe.vars.animationIntensity);gl.uniform1f(this.info.uAniScale,Math.max(0.001,this.globe.vars.animationScale));this.time+=delta*this.globe.vars.animationSpeed;gl.uniform1f(this.info.uTime,this.time)}
gl.drawElements(gl.POINTS,this.indices.length,gl.UNSIGNED_SHORT,0);this.drawn=!0}
dispose(){this.disposed=!0;this.programReady=!1;this.dataReady=!1;if(this.gl.getExtension('WEBGL_lose_context'))this.gl.getExtension('WEBGL_lose_context').loseContext()}}export const MAP="!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#>&67'54!#~!#~!#~!#G&'(96>8<;6,:8).?58-'!#.&#&&,#&28&4&;<=1:6644244001-((!#~!#~!#~!#4&&'.'-1-;<CB?=6,?-72232'/&(###&),12*+&6:.(+2/2)1=DFEECB>;30-2071'&./-8.&'&&&(,0!#i)###&&!#~!#~!#5&+(241(###!&(#&(03BAFDB@&6##-/01/,'(.6<?ABCCDDEEFGHIIJJJHHGFFEEDCA?:1(&.15*<5&!#G&!#<&&&'(&##&&&#&#',&!#A&.43,&!#~!#n')1.4.A/*.)(/8//<7,&2-&!#+)07:=?ABBCEFGGIJKKLLLMLMLLLKJIHGFDBA><:86-&&&!#B2(&5#70)#)),.-!#V&&!#/!&(4')6,!#~!#[!&'!#''&'((&&(&&##&286&&/.02'3<E82'&##&*,0/5;>ABCEEFGHIJJKLLMMNN!O)NNMLLKJHGFDB@=;:9:1,##&!#@&(/&)./-&')!#q'.**(&!#~!#Q&&##&&&!#'&!#,''&##'##&+&&&.&71)!#(&#&&#&&.7>DFHJKKKLMMOOPPPQQRR!Q'POONLLKJIHFECA>93,'&&!#D&*('###&!#s&''(&!#~!#K&'&&'&&&!#''&###&&#&('(##'+&(!&('1*/=,,5/!#+&)/74536;<?ACFHJLMNPQQRSSTTSSSRRQPPONNMLLLKHI85&&&!#G&!#S(11'!#=&###&&&'')'&&''&&&!#~!#H&#&).,+!&'('&##&&&('&&&(#&'+*(&&,/<A41&!#7&6<AEGJLNOQRSTUUVUUTTTS!R'QQPOLJHEC3&2'!#p+74/'&!#<&&)'*,)(''&&((*)'++.24.)&!#:&'&&&#!&'!#|&&'!#*'(&!#0&#&!#(&&*'!&)!#9'&5?CGJLNPQSTUU!V)UUUTTSRPMICE=;A,(,!#n05&&!#6&!#'&&&!'(+*)+,+)'&&!'')'''&#&&!#~!#B&''())''&!#+*'&##&('(&#'+++(##&*+&&+,(34)2!#7&&9?DHKMOQRTUVVWW!X)WWUMG@B:A&/7&)!#m',,&!#/&!#'&&###&!''&&&'&(&&&'''&&!'(&'&##!&)'&&&!#'!&(!#/!&'!#}&&&)*)'&'(*&'(&&+&((&###&&'&&'&*&###''((()+2*&&'06,!#60'6FFKMOPRSTUVWWYYZYXWVUTQLF;E6&/0!#n).'!#0!&'##&#&###'''&'&&'&'&''&&(!&-!''&''!&*''*'!&(!#,!&+!#D&&!#Y.,&&#&&'&)+*++(&&&'&!#'&&&#&(&###'(')&'',+,2162)9&)&!#2)/&>&AFKMOQSTUVWWXYXWVUSPLA;*&:&3&!#m&()&!#/!&'#!&0''!&''!&('&'&&))()**)(''('&&('&&&))+'+,+&##&&#!&3!#S!&/!#B&&&##&')'('(''&&#&!#'),/'###''(+')(''&++,/112?*''!#18<&/>FILNPRTUVWWXXWWVTRI6&6&##&&&!#N&),#'-&-'!#<&&!#+!&*#&'!&+'&&'&&',/0+''(*+/+,+(,-,211*('''((*)&('(('''-(-'''+(&''!&8!#H&')!'*('')(+1?4/0,*&###!&+'+&&&..&###&'()+)('''!&(###!&)(&&!#'&,)&&##&#&'+.,.'/4&!#/&6'&):@EHKMOQSUVWWUTQNOQNOOIF9/!#L'46'03//),*'()+&!#3&!#+&#&''(&##!&)#&&'&'&'!&('&-'/'<67@9/205,*(/12/-)...*(('''**+'(&'0:672)'*'/135,)+**''&&'*(!&.',''&&##&(.&'*,'&#*&!#.&()1539466.1214576>A<>=?341241)&&'()((('(*+.0321+)'''!&'#&'&&&!#(!&'#&')&'(##++*&&##&###&&(*,0'&!#0&&)/:@DGJLOPRTTUUUSME&?85)&!#M0&&/240,-,++)'((&*)+*)(!#(&'&!#(&&&#&'&'#&&')(''&#!&/''&''&*('3/67);>8<:+,),*)+))*-*')('('+)*('&'+01C546('((,/>/6,&'&&&+'''!&.+*+01,,,&&'/.62836+)('&&!#-'&2/,-37BA7885627.3/.,,-,,0:,&')'))***+)+,.--.++*,-,++)&'(!''&''!&'((,)++-#&.-+)'!#'&&##&''+.8@@2!#-(+0(9@DHKMOQPOOPRWPB1!#S&1?62/,)())()),,*'()-()*+(###&###('&'&&!'*('(((6&'&'&&&'!&,!'',-3+*1;44341+*,+.---,,+!-'*)+*,,+''(.5AB;30'.(')097*1,)''&+,)'&&&'''))+7'()-+-..:1/0+..-76..)-*+'/2'!#)&&#&&&'(-(,)()11)('''*).22-320-'''&'('(++*(((+++,/,.0//+,'++))!(('&'+++*-+-(&&)'&!#+&'&&&)'.(<<:&!#*'1'86AGJLNPNLJE7A:>&!#.&!#(&!#?&096012-(,!''()*+'('&&''(((&#&#!&''('(&&'''&'&&''3)&&''!&)''!&)'''&&(+,-1157/734.-0//.212,*,.---++))(((&'(;8=861-1.4/76<B3*6=<-(''&&'(('*,.')/-+.+1961+-+(),,/.8!&'-'+'&###(',)+(,-+,&&),0/.',-1<:)126==376460=62)')*))*((-**+--00.//1/!+')(((''((())!+'&'#&&!#)&&#&&'&(++'#&,&&!#,&11>DIMOPNJC=&&!#0&'&+&,</0/'!#=&/:.1.-,+&&&#&''))()''&!#('''&&'&!''&''&'''(-+8'''!&+!''!&)'''&&'.-/-,3/.-2/0,021./1/2321.,+,+)()(('&)1,;=9/42966659AE<9<;193+&&+--(*4.*,827587,-1(''&.&&&((!#)+'!#)!&((2('+-''*))''()32849/6G?@=B:BFGFE;200+((,,,)++,./...!,'+((!''(&!'(&'(##'***!#')(&&&((')132+!#0&53FLOQTQJ@)!#5*033C@3&!#;&')/1,//-+(&##&''(())('''##''&&''&&!'')-(('('''(7)!''&&!'(&&!''!&'''&'&&*/./,-)-.12.-/010.1-///0-,,+)()(''(('',-1>1B>?B:68;7;9743;>:91,)//*3+-8315653,20.-&*'(&+&&!#-&'!#*&&-&&&'-1(+.;AA=CNF34643728=586=?B<@;3-+/++,*+()++11/1-,,+)+++)+)'(('!&'!#''&##&##&!#(&&.1&&1,&!#/&.@FLORTPC&!#8&&!#=))&010-+'+)&##&'(''(('())''')'&''&'(('''('(')('(')*+'&&'&&&!'*&'&'&''(&&''&&()0,--,.15'0.1.0*+*,,+,,-,*)'(!')('''&''(()+1/2<A<:39B<;8:612/1)//6;81676/46&'*))+-','&&!#3&&(*&&')+)+,81-:>65158C461A:83A>=<?BD:B@6'-)+-())'*)+(+++,,!+(*+('(''&&!#+&&!#'+&!#(&&,1)#'!#12@GNOLK&!#S'36>8750,)*&###'''()!'((('&&('(&(''&'!(('''((('()0'&'(&&!',&!'*('(')'(+'.3//00.0**/,.-,,+,,,+,+))'***,,++*!)''()))+,58BEG8>@E71;63/-).65>/-'(&&#+&')892,/,'&&)&!#1!&*'0'*/>S+&&6WG;-9GRAAA><879B==6>G>7C0+(()'!(()+,,...-,+,+++*(''&!#3&(+,/-&!#9&=>6E>&!#R'C??;86/10+-&###&''(''&''&&'((&')''))&)'('''(''()'''+*.(!'(&&'!&''&!''&'&'''((('))'.020**.,+,/---,+,+--,-+++,+)),+,,*()*(())*).-47=@<@BE8767B87678?,###.3&#'+,3,3,8-&!#8!&'(0,--)3/9#'95#&&,9;FLCKCA@569A?6=6<4?)1/2-++)(+)))+-/0.0,,,-+++('&!#4&'(!+'(!#(&!#5&&&!#S(9>76/*,/+''&&#&&&''!&-)''!(('(!''(')('(''(,,!')!&''&!''&&&!')(!''),*/),/+0--,+,--,-.-.,..)/(+-,+,/.)/.//,)),,))+/8435.454113237<34&!#)*&',&-#,-!#>'*!''&'&#&&!#-&.77>>=A=?;868:2-30.52,-63+*)+),.-.-.--!+'('!#1&##&'''())(!#'&0&!#g''=72&)('(!&(!#'!&('''&')('(!'(()()()!('*')(*,*(!'(&&&!'-&!'*(!''1/.02--,),---/!.(,,/6693,,-..2/+,0/.-))+--261137(&)1&&)#&&)-,!#(&-'!#J&',.#)!#1&'&@:;E@>C>BHE2/.-1.,++*)))+,//..-.---+*+('&&!#1&''((***((&#'+3+&!#\\''!#,&-)##'&'''&!#(&&&'&&'''&''(((''(!''(''('('()*!(',*('''&''&&!'0&&&!'((('),)*+,)),++/0/0.0-,267:3211101316-41)4/12126063/&!#4'+(#&!#I&'#'5'!#3*&(DK<@CBF@JD;65563/-045*/1///0/.,-,+**)(('&!#0&#'))*++''*)*-13&'!#X&(,(,'!#/&#&),(&#&###'#&''(')''))((('((!'(('(!''((''()+,*(!''&'&''&!'2(('()))(*+-,+--1./.1./039,7//3=2;A986696A816:645,348,!#4''/7)'!#H'+###&!#7*&<*6=;B=3?6433621/410./.../0--,,+*+*)((!'(&!#+&#&())),-.-),,.0.(&!#Y&&*'!#.&&&##'('&!#'&'&&!''(')***((')(!'/)''))+)/+)(!'9))'((),,).,*++//,/1220.2;<E3C=3>AHB7.>=78<57>38;21/3-!#5'(39&)&!#E&&&!#=(&&((EB9=A388766211733311..-.,-+,+*))(('(!'*&!#*&**,,.-/.+-01/1/.'!#Y&'-'&!#,!&'#&!#*&'''(''('(!)'+((!'(((''(!''(('&*-*,*)('(!'5(((*./,-*21,,-0..0-/10-84@.>=@=;B8>856643463789;><658!#6&(=9'3(!#D.#&!#B&+(?3;367AB<7679233111./2/0,+++*)))(()((('(!''&&##&''+*,...0122//1//+)*)&!#T'&&#(+&&!#+&&##&&##&''#&&''')()(!)*!(''''('(()&'')+'))'340,)(('((!'0()(*+*)(86-.07?>>68210227474E/1AC<;939::6:;537.+,-/:,/',+!#6(8)3&&!#A&!#E-#&.8=?<96796KH;86433322310/.+,+**))!*'+**))('''&&###&((++-.10213/1//1-**/('!#Q'&''#&#&'&!#(!&+!'*(''(''(((''(()))())'((())*++&&'&()+),03-+))(()()*(((!'*(('''))+.:20,/6BGIKCE:0/0398/.6>>8886694210-..-,+,.02-8>.!'(#&!#0),7(!#g(##(.@<>;54DBNKG<87543340011104+*))*+!,(++)(('&&&##&()*-/-/234200/1..-.,,+!#Q'''&##)('&&###!&)''!&'!'+(!''(''(((!)''''(()**!'')'')))3.,+*))'))+,-.*)!'*)*)))(-6978<>=B7<CLLG;6./6.>=<989;;7673555361-**++),;9A.'.(&(#'!#0&3&!#l)FFEE9<?216EO=77554411022/2-*)))+---.-,**(('&'!&'))+,//141,5436/1//*(&&&!#P&!#(&''!#'!&''-+++!')()('!(''((!''())((!'(('+&''&'&&'(((+-,,**)'++*++-,,,+)''(())/219JCLCG56974>KHBCMFB.;936:=<8375166568865-,*'*+2-3@-&**&.#'&!#/&&!#m.&)=D@A>;@KWKA975443541112.1.)+)+-,--.,,,+('('')))+*,..0101+1.*(''('&#&*!#V)&!#'&&&(*0)*..23*,..)*.)'())(())(!')()(('''(''!&*'()*++,**((')*+++,-20/1-+))*-.=<I<ILKLA568HTHKKG<D>6;88:6><;623433255421-/)(**163B4,'.0&#..!#|*?&'983=<;G8B<87;996653110.-.)+,,--../*.,++*))+*+**,---,/.-*###''!#'0)&&!#Y&('''),,'+./3/130)652/0*,,,+*))!''(''!(')''!&,(()+,*)('''(,00-.//33552//./213@LSVOASAKCFEDHJ@>;<<88<AED:67514622652-,*1))'*/7,)&&'86'#6&!#~&(&'H*B=799B=98653561230.//*+,,,-,/-(((-,,,+*+,,.--1+(1(&)3-(!#(&-+')'!#T)'&'(!''+)(45/./.00*)1,-)'/7+)'*'(('((''((&'''&'!&,'())/)!''(*-//--/257:456856.-7;DALJS=@<@BKGJJCF@=7;@LED;<;6431236886+()*/.,)/'&&''6=/##,!#~##<&@./349A<H@:B978!4'221/.++/-./1!(),0.-.),,,-0--5(-()*(###&!#('&'!#U&&&'')(+)/,-->E5G4=*')('''*7;+'')!''&'()''&&&''!&,''(()((!'').,+,.3421012202A<6457/8PZR?<ABFUTWIG?==AAC@>>:9;742246A8,!('*,/'&&'&(/6/###(!#~##/,B+(-41>EFH=I>9875666302.++---+,+./-*)(,-+),,-,)/-&'-,)(''#&&#+!#]&'')+*-/,HFQW;>;><''(''',3,8.(''!&-'&&('!&(##&&&)&'''&'''('))*+./2.!,(--,./C63237BMVOPAGILIRTHFDA>?A??;8896486;50*!''**'*'&/'-8:!#((!#~#.'=-2<?CGGGCIN?=9=:976311-1,-,*,/./-)(()('((,/.'&'&(+/,'''+'(''!#_&(-19//4A('''&&?('/!''39D<7&'&###&&##&&''(('!&(###&&&'''(&&!'(())*+,/.,,,-.19V8G6+,06:>;=CHGRLK>AHAA?A@;;9877=A=66793.('''(.(3,+''(21!#.&&!#y/.=C9F=9KRPOKPI@S@=E96301-11++,+,+,)((*,)(()*)(''/'.,+'&&#(&&!#a'')/9*<K/->3&##'180(*))&()''&'&###&###&-'.1/+(&&###(&&(''((&&&!')+(*,++.0-.8@JWO/3---.0159:38F@BALB>J:=>=<=77;==<:8;>41((()((*;/0)&'1.!#)/###&!#|'=?A>C<6CLDBGXKLJCA=<6632/...---,+*+((+))(*,!''0/(,)&!#'&!#\\,/+&&#&())/'&+'###'-0'##&=<:4*;('',*'!#-&AGL3-(&&###&''))('&!'(!('-2-.11<333>6=E67W_RBCUW7YHC.?866AACBABA978;:9<<<?G2/+)('(++11-6,'.+!#)*,7(!#~+8?HB=BF?=BHLULLGHDA@<:7421,-,,++)++'(*++'(''.-+..))'!#a0,9578-3<<>G!#+)+C!#'0C-08://'&!#0&:BSMD?!#'&'('&'&&'''.+)(()-9AA`__CCHZWcW[T[OEC)14)18>C@;979=<A?8;;<;=<<<=>E://*'((-0447'!#,&&-&!#~#37B?F=?FGE@FSJJJOQPCA;;762.,--)*(!)(+)((,,/1-22))&&&!#`(323698-('0&!#,&*/&###&165/=/&'###&,797&&###&LF53)C.###&&+*)&!''()1)*+,2SDJ]IKQ\\c@AB98878LD==:;=AGKF><988757AA=CAAC??A;3<4*(&'1008?*!#-&!#~!#'C)QA?AM@TE>CDSDIHQS@?=9642/.,,++(((*))**+,*,,3(+)&&!#c&=49<26?A&!#*+0!#(.&(#'D9'/#'&&&(9@@@52B@NBR=MBNN;&&'###'))!'(((()0?**2,.5IY\\cQF::998877666596;9<@>A>;;?>@D9;;999=A97<5--&#')-/6A1!#.,&!#~###/-'JF=GHKE@AFDMOKXRGC>:72.--+*!)'()(**)*+),6)/'&&!#c&',-24362&!#+/)!#):###/;(###&-67<?<<8<DD<MIKGMIE;'&&###!&''''()(()+68UZaaVmdE=<!;':::98766ACLQP[igG?CB@>>;A@@A><=KA/&&&##&&##&,&!#/&1!#~!#'(&=HBDKFGDUUDERVTNB@<:730/.,+**)('''))**)*353'&&!#e&*,146<3*!#2&*!#',9&#&0737>897@KC<3?7KCON:H6F!#'&&+5!''(((),7I6IW_rqceE===!<);?V[cSSTYcmfc[MQ@??>;@>=<G=9'&&&!#*&&/!#.&7&!#~!#'&6'QAKBAHJMGACM[[PGA>8641-.+*+,,+'(')++*,291(&&!#f'')(-8>'!#1'+&!#(&2&##&&7<:<;9@-280798?FP>K?M&###&&'A9H)()!*'0.,.MKhinoUF?>>>??DLeenbg_USTY^b_c_XXFC<@@C=:B5A'!&'#+&!#'&&9!#-4-!#~!#)&,'U<390DHHJCCIM]FE=972.++)+-,)'''(+)//-6.)'&&!#i.&!#(*'43?/)(')!#.&!#)F'#H(#&'/1,,.-,DI@GJ<RH&8U<9@A92+.43/7@4>\\kVgtocxe[XGndkmorpnpl^ZTSTTdW_TOHAJH?B=2:<:'&&-'&'!#(''(&!#)&B9-&!#~!#*-'@49=;@EEDJJJGKB=::62/-*()'((''(+)1+94+)'!&'!#h.!#'(-436-2988,&!#<.,,2)*)(/5DIFLE9G;@68>FJ=309OOJZOdhRNQ>mmtxnzppnnpqnmpnolikihhmicj^KJGH>@7,3/6''&*'&!#)&+'&###'3&4,/&&!#~!#*&41:7)+9FHHGKHHH@@<92.,+*(*+''&''((*-,)''&&&!#i&'394?=!:'.'&+-/&!#<01--*()''1B?JG?68!4'6<6A7>QUPX[[K334GW_\\muwvtrnqrqqnqpmlljmkhfmfb^YPD94/,65))&'&''&!#)&&#&#*&&#''!#~!#0&,@4(/,39GOHEH;>;82-,+)'''&&&''')-+(('&&!#j(16F7<;;>=66/(''&'&!#;123442-('&&>=BGFR8?=47=?E38?GZKLXKQ:./2^Urktmnnppqvtppnnrlklndkjeh_\\[KBA>K553+'!&*!#('##&')&&#&!#~!#36''(426:H@CG=;8642++'('&'&'''&''(''&&!#j)+.JCC9<87522,'''())''-&!#(&2-!#/&78564/+'&&&')?QCA<E99<AF@37?>CMKLR+!)'4Zoqutsjloqpomonnqrmjiijdgc`cG4B>6A2('('&&''&&!#,&,!#~!#7,;#'2;CA@=>A@6561./*!'(&!'+&&!#j-/;_=6:454211.)''((*/11-&&!#''''((&&###&&##'&51574/*+!&(*FRICA:E.3>=/1578?II>)((())4Peakut|npskknojkhhjkiej_h_S100/49E9&''+'!&(!#+&!#~!#96##)0?>E@>B?=:342-(''!&1!#j.6GB7641210/.,!)'*+.12/+'('&#&'''((()('&&'+3@74164/-,)''&&&.MKNGJLE(7</039<ALD?0'((()*.EPurousm|pvpsnkshnakhda]`/-,.-76C'&&&'&',-&!#,&!#~!#:6.&,/3EIFH6<8/-,)''&&#!&'!#)&&!#j/7-/1000.-,-.,,+++,02221.+/()'&&''&'&&()&.&18:7:43431/-**'##&1ABHEUL1.F36A@7F,/4'''(()))*=GRmomskuepuiqnhHijdckhL/.-)=211'&&)+''2+0&!#~!#D0#&).EJF;@BB4*('&&!#0&&&!#h,),0//..,,*--2/0,-/0221-101/)((!'+*'',4'&>48887542/-,)&##'=;9D?<G4@<2184O'&!''))*)!('4GMkpiemrqsl_IL`jWUhZN?.09=02,)&)0&&'(22&!#~!#C-&/#&(2KB>B>>8*''&!#1&'&!#f()//..,---++(,0.-/0.!/'0/,,/24+)(''!(')')')/)#&2<897?53/.-)&!#'289)-,.7AA48@A!''((+,//((!'(0OVX;ZKNFA''/1JR\\NGKD>68;66/''-'18*9&!#~!#F)(##(@TG@<7C/('&!#2&&!#e')*,0.-,-..++)(()-.:/31122/0./.2+*)((*)+*)(+*+/2##'99=:99421/-)&!#'&&#759<=87811&&&(*,*.+*+(!'-&&'&1-2)1QbKEHLIF=;5.9''),-03))!#~!#H+##&1NLF=A>L((&!#3&!#d'',.-,-,.-,)+**+)+/>59C=86941/01-+,+*+.,-.-()'.'++##-+7<9664630,'#&###&##&'&''&)'&-&&''(+.+).)(!'(!&(2C:0:)+(LEMJEIG@788,7).2()5-4&!#~!#H&###&6QLHEQG/(!#v(+))*++-,(++)*++,/26A;=9:8:62/0/../.*.,.12/,,'.()/##')35;78847/-)'&##&)&!#-!&(*1..,/-.,,))*,*'!&''7(+'9>FA8LC;:7,('*(,-2+.'&##E!#~!#H'##&KJRILHB2!#u')-+**)!+**+,-/25AD:966752342016/2/./45/+)(,(,0&##&389988591+)'&'''(3)'!#,&&'&'(+/./2-/06452(!&(2D+((<B?CCJI@@:**'&&'&&+&##&''!#~!#L&3LMKE9&!#1!&)!#`&)+++***!+')(+,,,-/04;756424841:435521/1160,**))+*.*###+8788643/+((!'()+-'!#,&&'&'-0++11.1,0,-'!&('K+':5;H>7A>*-.''.(+&&)!#(&!#~!#L&#/KFKI6'&!#+&&!#'&&##&&!#_&'()!,'+,+)*+,+,,-013311320030/3@@C73/12133-++**2,/10##.A=97833-+)(!'+&!#-3'#)'2+9-,++-(*3'#&###.:('.?3AC6>;<&*4!&'!#~&!#U&>BBDHKK'!#)!&'!#-'2!#]&'''1.*--,++*++,,.13310/142/.../16HC31013542/.-+,-,//2###,C;7420.,+)(!'(&&!#1,.3/.)),,4'0'&!#(&+'*?:6688.B1'&###&!#~##W!#U5?@MA\\SN'!#(&'&&!#1,'6!#X&&''(,--,,,+**+,.-23/.--/53/--..1123-/2434110,+)-,,-04!#'3A;852/-,*)(('(('!#2(0/--.*+02-,!#+&0)664257<>2(###''!#~!#Y'@*-H@E'&#&&&'*&!#0&'2&0&&!#W&&''/.-+,,++**+-,.0.,,,/48.-.//--.,-./283011.+**---04&###'KH=751/-,,,**)&!#32012-2((+7'!#-)&&2D1/-(21(###-!#-&&!#~!#P&F?FNT'&'(&''&&!#2&!#Z&'''!)''**!+)-,,+,,.62.-//.,+))*-7;8211.-,+,---/0(*###'L<8653254302!#5'3./21**)&!#.!&'A(-3)(((&!#0'(!#~!#S&/B'&4?<'-&!#j!&'''()))+!*(+*,-+,-/./0..--,+)(*,./963442.,.-..--.2>&###6K<!:'41&!#7(10/,-'&&!#/'&&&2'&:(()(-&!#/6(!#~!#YM^D,14*8&!#f&&&'&'()**+***+++*+*+,1//0..-,,,+*++,.2766;65.10.-./.01>&&#&@O97=9:2(!#932.-)(!#55'&*''')1<'!#.'&!#~!#Z)E48I10'&!#e!&''&)+*+***/*+**+**+--..//,,*,,*+,,.677<94400/.-..028AK&##+PG;36!#<&22.)&!#58'&0*))''49!#.0,!#~!#\\&?&46'&!#e&&&!''++.+++*,,,*+***,,..,,,+++*++,-/458;33211/.-..12DFM&4#(6/'!#?6445)!#5''&''&(('(-!#.2#'*!#~!#]'3'&!#e&&&('(,,1,+,/+*+++*)))+.0.,,,++*+++,..23<721/120/-/.05KAP..3&!#B'54.'!#5&*#!&'''50!#/&&&'!#~!#]&'!#.&##&!#X&&,<7--,,,+,,++)*(+*)-131.-,-,++,,/../331/..1341-//3<DEU2,1&!#(&7!#<=)-&!#5&&###*&&&)3!#-&##'#)&!#~!#\\&'&!#*&&F4&4/&)<##'&&!#Q&'/5..-,,+*-+(*'0,+(-.251/)-8,+,,---.!/'.-../.-/@86L<L156/&')B9/+&!#;+*(&!#5&!#'!&(!#.&##&&#&!#~!#]&_&##(###&&'&&,?'')'('&&!#R&'-/20-/,++*(''.,,())214)))!,(---.121//!-*@H@NIT6CGB<:5573*!#<&(&!#6&!#)&&!#.&###&&#&!#~!#^-':)#'1)'&A';)'&&!''&&&!#R&,,02.++,+)''(*)-,+&)(('*,-,0.---136652//!-):>AETAD@?>;763./!#>0!#7&&!#4&!#('''!#~!#a*##+5,2'K(''!&'''*('&&!#P&',,/0*)((**')'''),),')(17;41/--./3454420.!-(/ODBBLF95:720/-'!#A+'!#4&&!#8&&/)-!#~!#d*N(CO(!'',7+*/(((&!#R'(*)(''((+1)'&&&''(&-==779:3./202!3'21/..-.-1?6>SI<6..10,)'!#B6&!#5'&!#1&&!#)7'!#~!#d)'E2Q6(!''2)+-2;0'(!&''!#N')(!')&!#(&&'():45475321//1223223121//..16=@A8221*.)(&!#Q)!#'&8'!#/'9'&!#)&!#~!#e>Y4@((('''(<869;51!')&&!#N&!#0!&'4.2!3'2,2-1011324365/1</529@:8-+0/+',!#S9)###>)&!#-&5,)&!#~!#l87N*()((''(273+'''(())'((&!#^&#(334220.,---1.022446;36;60233:2.'/-'*!#UO'##&&&!#,&,A'&!#~!#k&0K7.*)((('''(.6*('')),,))''!#`.52210/,!-'../1246:?2:;=56..-..)*''!#U&#C'##'&&!#)&*(27;'!#-.!#~!#`'6G)**)))('''01''&')*),,*+('&!#^&330/3/!,'-/--//11692<9;;797+*('''&!#W&#)!&'!#(&&&.+833,&!#+&,!#~!#_*RU*)))(()('''5''&&&'(*),+*,'&!#^&2-011-,+,,,-/1/.027<?><<?PH:1('&&!#[-'!&'!#'&'&'18'&&##&&&,&##&'!#~!#^&([A*))(*('(!''&&&'')(((,-'(!&'!#\\'&,,3/,++,,,-.-..1697A><<=NOA2*'&&!#Z&#4'&&'!#'&''(2)''&!#'&!#'*##'#-!#~!#Z.&Q.*))'(!'*!&'!')(!&,!#Y&'51.//+,+,-.-///22=X@!<'G;=0(&&!#^+'&&&!#',('&&(&##'HA#'###,###&'6!#~!#Y'&\\++((!'.&&'''&&'&'&'&&&''&&&!#X+(224..+,+-.0.//16BJD@;<@EF<0'&!#_.(!&'###!&('&##*17!#.&'#'(6)D!#~!#R&Z7)((!'.!&)!'(*'''&((&''&(/'!#U2'//20+-,..0.1027AK>=@<>=>47)!#a2'&&!#)&#&'#&#'#/&###0#&&+##&1(L6R')',&!#~!#O(=3(!'-&&&'!&''''+)()((&*(')'''/)2'!#U)*0,,/-/..10200165=:>=AC<7-&!#b4'&!#2&&!#/&&)1BE(!&'!#~!#M'P>G)(''(!'+&''&&'()()+)(((''*))''*,*&''&!#R(+,2/21441202437;5C:;=@:A9-!#d&'!#0&&#&!#.&###&&&+CL2.##&&()!#~!#G&4RC+)')())!'+&''(',)**))*(()+--+)//*,'0'!#R&+0657832353583495>=;>=86-'&!#e(&&!#.&!#0&###!&'(7>E'5!#*1!#~!#D&PY0())())((!'+()(+)*)+*.*-(,,-*()48.201!#S*.<24;956778743;C56@@=64('!#g())9&&!#'&!#,&!#-!&+=!#-&&!#~!#B3d6+())*)()(!'+)'.**+++)()*--//-//,,02(!#S&6>729;6868;;1@:=5G7A:E+*(&!#l&#&3&**9&(+&&&!#0!&'##&H!#.&!#~!#B\\f-9,**)))'(('((('')**+/**,)))*/.-/0.-.1)*&!#S))7<58;!:'94CA7=@?>>K1-0-&!#r.!#'-!#91(&&!#,&&!#~!#@FdK=,-+,+)(('()(*(**,-*+,++((*,05//.:6..)&!#T&7?;;:?<;::=><79>>=>>/:63.,&!#u&!#='!#-&!#~!#Aih;3-.-+)('(()+)+-++,,-+,*()*.75..:31+*&!#V<>A=>?=;;;@@@><=<C4>/21-)7&!#|'&&&##&!#((!#~!#T7i^[Q7**)(((''*..,,,+,,+,+)*+,.45.09,)&!#V&>CD?@@>;;@===?>=>35=/74-,-&!#+'!#s&&&)''&!#(&!#~!#UFhKQdH0*((''()()10/,...,)).5=142.6@6)!#V&1@CC@@?>;:;<=<<=A908;/9341,&!#*&4!#s&''.('!#(&'&!#~!#T-cjjceh=)!(()112+),.0,**-395620526,!#V/;@A@AA>><9:<=;;<<0:4=A<60--'!#*B=!#n&&'#&*'('(&!#(&''(!#~!#T8\\mbkaO1-((),+)))()4311+/13;830/84++!#V,;><!>'=;:;;<99>2.4--6363-)&!#(&'+/&!#l'.,(&(&((('&&!#'&&''!#~!#V8OlfbLE)))*.-(')'()0/3.577134331.'!#V.>!<(=<:!9'></<;:1*(/+*'&!#'&(&)9.!#l'&./.''))*)+''&#&#&''+&!#8'!#.-!#~!#5GeacVc<,+*,+!''/147133704936/+'!#V1:;;<<;;;:9989=027><64,+'&!#)'-.55&!#k)&'*-/+.+()))*+)'&#&').;!#9&!#+&&!#~!#7]a``LH6,+,))''(+160..75722922(!#W.A<;;<<<;:988:68=;>AA/&'&!#*(8:<<!#l(''')-,-,!))*'&'&)-22!#~!#XKa_l\\L7-+)!'(31-///47734=*,'!#X6;==A>=;988899:<@A;2.&&!#+&+9B,!#k''(')*,,-,***+))*))'')34-0&!#~!#V9a_bRH;.*('''()2--+,.08;66:5.'!#X+48A??><989879>?=554)&!#,'+>=&!#e&&#&&(**)+++,,--.,,/+*))-('(+1,*'&!#2(!#~!#E8jdf^O0+)(''',1,---.-149796*'!#Z1;CBC@><:989;9631.)''&!#*&,1:1!#f&)+(++*!+',,,.///./.+)).-)(*,-*)*&!#2&!#~!#D>Uhf_;,))(''()1.*--///587/.'!#[&8AE@A=<:99;;7561*''(&!#*'363(!#e&'*13.0/+,+,..,-122200+)()((())+)+(&&!#3&!#~!#A&GMgb`/))!'((-,.+24/2264!#^'5E>>==<<;::879;2,'''&!#+'17&!#e'),+/110,,--,--/33632-)('(''())*,0('&!#~!#RAGm]ePC*((!''*)+/2159*&!#a7A><<;;:;<;7:@6=-'&&!#,(.-!#e&'),/131///...!/'1/.-)('&''')()+/-)')/!#~!#Q.Rda_;3+)(!'()*-1:67&!#b6@<;!9(;>=;>@I,&!#/)!#f&')-/02010..-/11320/.+(''&'&'')+--10)-('!#~!#P8YsWh@,)('''&&',(36;89!#c->;99789;>@@AEDB0'!#s&&)+.011/00//...1121.*'!&''''()+,-,,,-)!#~!#P4cmLC,)(('''&&'*(/4470'!#b'67A778=?>>?AAEA2&!#t)*,./0/.1//,/,../.-+*'!&(''!))++-&&!#~!#OFdL?4=(''&&&!''+.049)!#d'06167=A;=?AE<93&!#t&*+,/..00/.,,,+,+++))'!&('''!())/-&!#~!#OZo96,*'*'''&''&'*(,,5!#f-9:799;<>AHPB1!#w*,+.-.-.-,!))()('('&'&'('(!''((.6/!#~!#O'^V:87)5!''&&'(((.,'&!#f'877:<;A>@HC>(!#w(,,.-/,-,()))((''(('('&,'&'(''')''*49-!#~!#O*_E220+6)''&'&'('','&!#h(7:;A?B<@A5+!#x&)*,-.,**(!'*&''(''4''*)'')*()1+<(!#~!#O&B[1/173)''&&&'''(&&!#i)2A5662<>6'!#z-*+,++,(''!#+&,('/,)!''(*++/+'&!#~!#O(A]8//3,('''&&''(&&!#j,/93/7/(*!#{&*,++''('!#.'+&+''&!''()+41&!#~!#P+YW6/4-)'''!&)'!#l(&!#~!#')*'!#3&#&&'''&&''*+/84!#~!#P*(R?L-,,(!''&&&!#~!#~!#0'&!'*/=:!#:/&!#~!#8'CJ@;1++)!'(&&!#~!#~!#2'(')''(0;;!#;'&!#~!#6('CC71,)**(*)))'&!#~!#~!#2&(*-/411+(!#<&!#~!#6()B60,.*))&')'&&!#~!#~!#6)#'+!#?112!#~!#5)><.7,*'''&!#~!#~!#Y'2+!#~!#5)-E2>;1(''&&!#~!#~!#Z''!#~!#5'7;<9:<7)!#~!#~!#?2(-!#;=.#&!#~!#6'/08887-'&!#~!#~!#>'31!#:*9'!#~!#9A25>0+))!#~!#~!#@)!#:>@&!#~!#80&<<2>7*-(!#~!#~!#V=@>!#~!#:.+7813,0!#~!#~!#W(.7-!#~!#9&&5A)10,'!#~!#~!#X&)!#~!#;&5:)44,('!#~!#~!#~!#p&&AA;-1('&!#~!#~!#~!#p&'I-,('&!#~!#~!#~!#r&&<63,+!#~!#~!#~!#t&.*/((!#~!#~!#~!#t'+4''&!#~!#~!#~!#u'-0&&'!#~!#~!#~!#u&)3),.(!#~!#~!#~!#v'&!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#~!#i&&!#~!#~!#~!#z-'&!#~!#~!#~!#r.&&B&#&!#~!#~!#~!#q&#83&&!#~!#c&&&##*&#&&!#@&!#~!#g2E&&&!#~!#7+6:<?7.!#<!&*##!&*''+7==;7/&##&6=:,&&!#'!&',)###2686*4/1'&!#~!#_;')'!&(!#~!#2-&)3;<<A>97<8&-&&'&!#3&&'459;;>?ABBBCDDE;CCEGHFDA?<;86...02//69=AA?<<8:?A!E)DB@>;:&&!#~!#[D2&)!&'!#~!#,(5<@>><8@CHLNKJKLJFFEDB@><:7/!#+'8>??ACEFFFGIJKKKLMLJIIJLMMLLKJHGEDCBCABBCEFGIJJIHHGHIKMNMNMLJGDA;991-)1)&'&!#~!#M*)<&**4@C;&&&!#^&!#1&&!#0!&'./'!&'9@BFIKLLJJLNPRRSSRQPOMKIGA>9-'&''&#&/:>BEGIKLLLMNNPPQ!R'PPONOOPPPOONMML!K+LMM!O*NPPQPOPPOOMLHFCA??>=<:::<>9.6'!#~!#E!&'-/)4<EC61'!#V!&''!&*'&&'&'(-'')+,+('''&('!&))0259>@A@=<@EHJLNPPQQRSTTUVVUUSRPOLF@8,&&'''9@ABDGKLMOPQQRRSTUUVVVUUTT!S(TTSRRQRQPPO!P'QQQRSSTTSSRSTTSR!Q'PNLKJHGGEEEDCCCDEFEGE5&2&'&&!#~!#=&&&.263+)7<EE6'&!#S,*1&+.13)/)',47<=<><;@AAAFB@BB?;87667558;>?@BCEEIJJKLLMOPQRTUUV!W(VTRPOMJGC>9;'''*7=AEHKNPRSTUUVV!W'XXXYXXXWWW!V'UU!T'SSTTTSSTTTUUVV!W(VVVUTSRQPPOMLLLK!J'IIHHIJJKLM=3+@=:@FA,*!#x!&()',!#'!&'!#-,!#')./)&&3@GE>*'!#L&#!&''(16;?CHCE==@HOORUWWTSTUUVVUQRQPNMJLPSVPMJJIKLMOQ!S)TTUVVWW!X'WVVTTROLIFC@91((.39=AEIMOQRTUVWWXYYZZ![,ZYYXWWVVV!U'!V*!W'!X(YYXWWVUTS!Q'OONNMM!L,!M'JA@ELKJ83'!#c&&&!#1&!#)&'&132229625741/*!&'1.&+&&+&)0359>BDF@:*&!#K''&'58379<@CFHIJMMPNNORTVVW!Y'!Z'YY!X*YZYWUSRTTUVVWXX!Y+Z!Y'WWUTSQOLKIC@<613A<>BDGJLPRTUVWXXYZZ[\\\\]]^^^]]]\\\\[ZZYXX!W+XWXXX!Y-XXWWWVUTSSRQQPP!O'!N)MMMLLLKSNQHB0&&&!#Z&&'(&&'+!'+)''&/'&*/#!&'###&&(59:77789:<=>?<;<<<;999<;<AFFEFHJIF<24(!#H&&&'&')2.158<CILQWV!U'TTTUVWWXYZZ[[!\\,]\\]]\\\\[[ZYYYZZZ[!\\']!\\)[[ZZXWUSQPOLLIHEC!A(CFHILORTUVWXYZZ[\\\\]^^^!_'^^^]\\\\[[ZZZYYY!X(YYX!Y'!Z'YYYXXWWVVVUTTTRRRQ!P'OONMMLKJHGFDB?H(+&!#V*''66978<=?>>AABBAACBBA@A>:86421510-,/112--.023445668:=>><986553.-,-./268=@@;83'&&&'!#C!&)''*168=BHJLNOPQQRRSTTUVVWWXYYYZ[[[\\\\\\]]!^(___!^7]]\\[[ZYXWVUTSQPNLLKJJJKKKLMOPQTUVWWYYZ[[\\]^^__!`'___^^]]!\\'[[[ZZZYZ!Y'!Z)!Y'XWWVVUUTTTSRRRQQQPPPONMMLJHFDA=73&&&!#N&&&'').89@CCEGHJK!L*MNPNLLIHFCBBA@?>=<;:::;<<===<<;;<<<!>'=<;:9876784'(')++-)!'.&'&&&!#;&269<=@AA@>=>ADGIKKLMMNOPPQQRRSTUUVWWXYYYZZZ[[!\\']]^^^___!`2___^^]]\\[[ZYYXWWVTSRQQQ!P(QQSSTUUVWXYZ[\\\\]]^^__``a```__!^)]\\\\\\![(!Z(!Y)XXWWWVVUUUTTSSRRRQQ!P'OOONNMLKJIE@=+!#I&(/432)+''')('168<=?@BCEF!G'HHG!H)GFEECCBAA@?>>??>>??@@AA!B(!A'@?@411/,542/*((!'*&!''&&&''&&!'(&&!#0&05:=!>'@AACCCEFFGHHIIIJJKKLMNOOPPRRRSTUUVWWWXXYYZ!['\\\\\\]]]!^'!_'!`'aaa!`'__^^]]\\\\[[[ZYYX!W1VVWWXYZZ[\\\\]^___`_``aa```___^^]^^]]\\\\\\[[[!Z'YY!X)WWVVUUTTS!R'QQ!P(OPOOONNNMNMMMF8;.##0?C!&)!#(!&9'&')-1468!7)66678:<<=>?@ABBCB!C)DEFFFEEED!C'!D'!E'FFEEDDEEFGGJKP5)(.33/!'.&!''&''&!'(&'').121.!'*&19964212257:;=>@AABBEDFGGIJJLLMMNNOOPQQRRSTTUUVWWWXYY!Z'[[[\\\\\\]]!^)!_'!`(!_(!^'!]'\\\\\\[[!\\/[!\\)]^^___!`)aaa!`'_!^(]]\\\\\\[[[ZZZYYYXXX!W'VVVUTTSRRQQQPPPOOP!O'NMMLKKIFDB>:)AK.(!&)'!&*''&&''&'''&&&'&&&+/.'&!'++.010//-..//003579:<=>@@A@AAABBCDEE!F'GGGHHHIJIIJIIHHHIIJJJIGGGB<;0,(04/*!''()!'*&&!'*&'''+036750!'012345566789;>@AACCEFGIKKLLLMNNOOPPQRSSTUUVVVWWWXXYYZZZ!['!\\']]]!^'!_(!`)!_+^!_)!`(!a'!b'ccbbb!a-!`(__^^^]]]\\\\!['ZZZYYYXXWWW!V'UUUTSSRRQQPOOONNNMMMLLL!K'JGHC<0'&!'(&&'''&''!&)!')&'&&''&&''&!'4*,.011/012367799:;<<=>?@@AABBCCDEEFGGHHIJKKKLLLM!L'KIHFECA@?=;8631-('(!'+(('())!'))./-+*,*!'1,+1;E<>==?@;<?@ABDFGGHIJJKK!L'MMOOPQQRRRSSTTTUUVVWWWXXXYYZZZ!['\\\\]]!^'___!`+a!`(!a)!b)!c(!d(!c(bb!a'```!_)^^^]]\\\\![(ZZZYYXXWWWVVV!U'TTSRRQPPOON!M'LLKKIGFDB@=70,1,-!&'''&'&''&&!'(&&'&'&&'&'&''&&'&!'(&''&'*-02111/-,+,,-..///22234667678::;<=>?@ABCEFFGHIIJKK!L(!K'JHFFECBA?=<97621-++*+,---,*!'9(''(,03444667899;<<>?>=>>@@BDFFFGFGGGHHIIJJJKLMM!O'!P(QQQRRRSTTUUVVVWWWXYYYZZ[[[\\\\]]!^'!_'!`(!a)bbbcb!c)!d'!c*bbbaaa!`'___!^']]]\\]\\\\[[[!Z'YYYX!W'VVUUUTTTSSRQQPPOOOMMMLLKKKJIHFDCBCGIB-.'!&*''&&!'(&&'''!&)!''&!''&'&!'*!(*))*+,-.01112234455!6)779;<>?AACCFFHIKLQOLKKJJIHHGEEEDCBA@?>=<:8754100/..-,+*)(!'(('''+-13:86/(()*289<=?@@?@ABB!C'DEEECCCEEFGHHIJKKJKKK!L(MMMNN!O'!P(!Q)!R'TTUUVVWWWYYYZZ[[\\\\\\]]]!^(!_(!`'!a(!b'cbccc!b'!a'!`'!_(!^(!]'\\\\\\![)ZZYYXXX!W'!V'UU!T)SRQPQPPOOONNNMMNNMMLLLMGA=;7-0-+9'!&'!'.&!'*&!'+&'&!'*()+,-,**++!,'--.!/'0123446679:<<>?@AAABCEFGHHJJKKKJJJIHGGFFEDCCBA@?>>=<;9987766655421.+**))-/4:>A@><:899:<=>@@ABB!C'DDD!E'FGHI!H(!I(JKLLL!M(NMN!O'!P(!Q'PPQQQRRQRRSSTTUUVVWWWXY!Z'[[!\\*]]!^(!_'`_!`._`!_*!^)!](!\\(![(!Z(!Y'XXX!W)!V'!U(TTSRRR!Q'!P+OOMMMLLLKHHJOPGFGH,2;'&!')&&02,)')(!'7!(''()**++,-./012345667778899:;;<=>@ABCDEGHHIJLLMMLMMLLLKJJHHFEECBBAA@>>>=<::888764334320456689<<=>>??@@@!A'BCEEEGGHHI!J'K!J'!K'LL!M*N!O+!P)!Q*R!Q'RRRQ!R'SS!T'UVVWWWXXYY!Z'![+!\\']]\\!]'^]]!^-!])\\]]!\\)[\\![)!Z)YZ!Y'!X'!W)!V*UUU!T)!S'!R-!Q'P!O'NLKLOIK@=;88ITPZH:28LKLLMPTTSQQTRLG762.,++,.*(+,*,-/12334663675556669;;>=?NNOLIHHJKLLMMNNOOO!P-OONNMMLKEEDB!A(!@-AABCB!C(BB!C'!D'!E)FEFGFGGGHHHJJJKKLLMMMNN!O(!P)QQP!Q*!R,SRSRS!R'!S)TTT!U'!V'WWWX!Y(!Z,![0!\\)![5!Z+YYYZ!Y*!X(!W.!V.UVV!U)TTTU!T)SRRQPPPOONPPPOLLLMTRQQRQQO!U'TTSRQQPOMMNJ!I'JWWQPIHIECCDFFHLONMN!O'MLKJJJIIIJKLLLNNOO!P(QQQRQRQQQPPONLLKJIIIHHH!G+HHHIHHHGGGHHHII!J*KJJ!I(JJIJJJKJ!K*LKKK!L+!M'NNNONOOO!P(!Q*RQ!R,SSRR!S(!T,!U'!V'!W(!X(Y!X'!YCXY!X2WXWXWXXWXXXWXXWX!W2!V2UUUV!U'V!U*V!U(V!U-V!W)!V,UVUUV!U)T!R)QQ!R*SR!S(!T.ST!S(!R*QQQPQ!P)!O-PPOPOPPOPOPOOPPPO!P,!O(NOO!N.M!N+ON!O(!P-QPPP!Q0!R'SR!S*T!S)TS!T,!U(!V(!W6!X'WW!X)W!X)WXWW!X*W!X3WXWXXXWWXWX!W^!X.W!X'W!X'!W1!V3!U'V!U1TU!T/!S)T!S*RRRSRRRS!R=QRR!Q'RR!Q:!R'QRQ!R/SRSRRR!S2!T,UT!U'VUU!V,!W7XWXXX!Wd!XJ!U)V!U?TTUTTUTU!T)U!TKSTST!S)TSSTTSTTSTT!SOTSTST!S+TTTSS!TEUUTTUUTT!UEV!U-V!U@V!U/VVU!VXU";const MAP_W=360,MAP_H=180;const ANTARCTICA_BELOW=0.83;const ISLANDS=[new Location(28.19,-16.04),new Location(32.74,-16.99),new Location(37.88,-25.90),new Location(15.22,-23.74),new Location(0.24,6.59),new Location(62.14,-6.96),new Location(39.59,2.98),new Location(37.44,13.95),new Location(34.76,32.88),new Location(-12.24,44.16),new Location(-20.69,56.58),new Location(-4.63,55.34),new Location(-0.40,73.07),new Location(12.51,53.90),new Location(12.55,92.88),new Location(-21.31,165.44),new Location(-17.82,178.02),new Location(-15.19,166.81),new Location(-8.43,159.23),new Location(19.42,-155.44),new Location(21.45,-157.97),new Location(33.32,126.45),new Location(30.26,130.53),new Location(28.32,129.57),new Location(26.55,127.93),new Location(-6.27,134.38),new Location(2.32,128.42),new Location(4.00,107.99),new Location(6.21,81.14),new Location(-42.42,146.35),new Location(-44.08,170.96),new Location(-41.63,173.16),new Location(-38.82,176.06),new Location(-51.64,-59.20),new Location(-0.70,-90.60),new Location(18.02,-77.82),new Location(10.85,-60.94),new Location(13.17,-61.10),new Location(15.43,-61.34),new Location(17.66,-63.36),new Location(18.25,-66.76),new Location(24.40,-77.58)];export class Points{constructor(globe){this.globe=globe;this.view=globe.view;this.renderer=globe.renderer;this.heights=this.decode(MAP);this.all=[];this.addPoints=[];this.removePoints=[];this.regenerate=!0}
generate(){let density=Math.round(this.globe.vars.mapDensity*118+40);this.rings=density;this.ring_resolution=1/this.rings;this.eq_ring=Math.round(this.rings/2);this.slices=2*this.rings;this.slices_of_ring=[];this.slice_resolution=[];for(let lat=0;lat<=this.rings;lat++){let pos=1-Math.abs((lat-this.rings/2)/(this.rings/2));let latDensity=Utils.easeOut(pos)*0.7+pos*0.39;this.slices_of_ring[lat]=Math.round(this.slices*latDensity+1);this.slice_resolution[lat]=1/this.slices_of_ring[lat]}
this.addPoints=this.cloneLocations(this.globe.vars.addPoints);if(this.globe.vars.islands){this.addPoints=[...this.addPoints,...this.cloneLocations(ISLANDS)]}
this.snapLocationsToPoints(this.addPoints);this.removePoints=this.cloneLocations(this.globe.vars.removePoints);this.snapLocationsToPoints(this.removePoints);let location=new Location();this.all=[];for(let lat=0;lat<=this.rings;lat++){for(let lng=0;lng<this.slices_of_ring[lat];lng++){location.u=lng/this.slices_of_ring[lat];location.v=lat/this.rings;if(!this.globe.vars.antarctica&&location.v>ANTARCTICA_BELOW)continue;let h=this.heightAt(location);if(this.inArray(location,this.addPoints)&&h===0)h=0.01;let eq=this.globe.vars.equator&&h===0&&lat===this.eq_ring;if(this.inArray(location,this.removePoints)&&!eq)continue;if(!eq&&h===0)continue;let p=new GlobePoint(this.all.length,new V3().fromLocation(location,this.globe));p.l.copy(location);this.all.push(p)}}
if(this.colors){this.setColor()}else{this.clearColor()}
if(this.alphas){this.setOpacity()}else{this.clearOpacity()}
this.renderer.setDataAsync(this.all);this.regenerate=!1}
cloneLocations(locations){let clones=[];for(let l of locations){clones.push(l.clone())}
return clones}
snapLocationsToPoints(locations){for(let l of locations){l.v=Utils.snap(l.v,this.ring_resolution);let ring=Math.round(l.v*this.rings);l.u=Utils.snap(l.u,this.slice_resolution[ring])}}
inArray(find,locations){for(let l of locations){if(l.approx(find))return!0}
return!1}
sort(modelViewMatrix,indices){for(let p of this.all){this.view.rotateMatrix(p.m,p.q,p.r)}
this.all.sort((a,b)=>a.r.z-b.r.z);for(let i=0;i<this.all.length;i++)indices[i]=this.all[i].i}
draw(delta){if(this.regenerate){this.generate()}
if(this.renderer.ready){this.renderer.updateView();this.sort(this.renderer.modelViewMatrix,this.renderer.indices);this.renderer.draw(delta)}
if(this.renderer.lost){this.globe.wrap.classList.add('contextlost')}}
loadColorMap(src,callback){this.globe.imgloader.get(src,r=>{if(callback)callback();if(r.failed){this.clearColor();return}
this.provideMapCtx();this.mapCtx.drawImage(r.img,0,0,MAP_W,MAP_H);this.colors=this.mapCtx.getImageData(0,0,MAP_W,MAP_H).data;this.setColor()})}
colorAt(location){let col=Math.round(location.u*MAP_W);let row=Math.round(location.v*MAP_H);let index=0;if(row>=1){index+=(row-1)*MAP_W*4}
index+=col*4;return[this.colors[index]/255,this.colors[index+1]/255,this.colors[index+2]/255,this.colors[index+3]/255]}
setColor(){for(let p of this.all){p.f=this.colorAt(p.l)}
this.regenerate=!0}
clearColor(){delete this.colors;let rgba=[0.6,0.6,0.6,1];if(this.globe.vars.pointColor&&this.globe.vars.pointColor.rgba)rgba=this.globe.vars.pointColor.rgba;for(let p of this.all){p.f=rgba}
this.regenerate=!0}
loadOpacityMap(src,callback){this.globe.imgloader.get(src,r=>{if(callback)callback();if(r.failed){this.clearOpacity();return}
this.provideMapCtx();this.mapCtx.drawImage(r.img,0,0,MAP_W,MAP_H);this.alphas=this.mapCtx.getImageData(0,0,MAP_W,MAP_H).data;this.setOpacity()})}
alphaAt(location){let col=Math.round(location.u*MAP_W);let row=Math.round(location.v*MAP_H);let index=0;if(row>=1){index+=(row-1)*MAP_W*4}
index+=col*4;return this.alphas[index]/255}
setOpacity(){for(let p of this.all){p.a=this.alphaAt(p.l)}
this.regenerate=!0}
clearOpacity(){delete this.alphas;let alpha=this.globe.vars.pointOpacity;for(let p of this.all){p.a=alpha}
this.regenerate=!0}
provideMapCtx(){if(!this.mapCanvas){this.mapCanvas=document.createElement('canvas');this.mapCanvas.setAttribute('width',MAP_W);this.mapCanvas.setAttribute('height',MAP_H);this.mapCtx=this.mapCanvas.getContext('2d',{willReadFrequently:!0})}else{this.mapCtx.clearRect(0,0,MAP_W,MAP_H)}}
heightAt(location){let col=Math.round(location.u*MAP_W);let row=Math.round(location.v*MAP_H);let index=0;if(row>=1){index+=(row-1)*MAP_W}
index+=col;return this.heights[index]}
decode(str){const START=35;const END=126;const RANGE=END-START;str=str.replaceAll(/!(.)(.)/g,(m,c,r)=>c.repeat(r.charCodeAt(0)-START));let floats=new Float32Array(str.length);for(let i=0;i<str.length;i++)floats[i]=(str.charCodeAt(i)-START)/RANGE;return floats}}
class GlobePoint{constructor(i,v){this.i=i;this.v=v;this.r=new V3();this.l=new Location();this.m=new Matrix(v);this.q=new Matrix();this.p=new Matrix();this.c=new V2()}}
export class ImgLoader{constructor(baseurl){this.baseurl=baseurl;this.images=new Map()}
get(src,callback){let imgreq;if(this.baseurl&&this.baseurl.startsWith('http')){src=new URL(src,this.baseurl).href}
if(this.images.has(src)){imgreq=this.images.get(src);if(callback){if(imgreq.ready){callback(imgreq)}else if(!imgreq.failed){imgreq.callbacks.push(callback)}}}else{imgreq=new ImgRequest(src,callback);this.images.set(src,imgreq)}
return imgreq}
dispose(){for(let imgreq of this.images){delete imgreq.callbacks;if(imgreq.img){imgreq.img.onload=null;imgreq.img.onerror=null;imgreq.img=null}}
this.images.clear()}}
class ImgRequest{constructor(src,callback){this.ready=!1;this.src=src;this.callbacks=[];if(callback)this.callbacks.push(callback);this.img=new Image();this.img.crossOrigin="anonymous";this.img.onload=()=>{this.ready=!0;this.ratio=this.img.naturalHeight/this.img.naturalWidth;for(let callback of this.callbacks){callback(this)}
delete this.callbacks};this.img.onerror=()=>{this.failed=!0;console.warn(`Loading of ${this.src} failed.`);for(let callback of this.callbacks){callback(this)}
delete this.callbacks};this.img.src=this.src}}
export class Overlay extends Obj{constructor(globe,element){super(globe,element);this.v=new V3();this.r=new V3();this.m=new Matrix();this.q=new Matrix();this.p=new Matrix();this.c=new V2();this.rel=new V2();this.origin='-50%, -50%';this.vars=new Vars(element,[['data-location',{attr:!0,type:'location'}],['--overlay-position',{type:'array',subtype:'float',init:!0,callback:v=>{if(v.length!==2){this.origin='-50%, -50%'}else{this.origin=(v[0]*50-50)+'%, '+(v[1]*50-50)+'%'}}}],['--overlay-offset',{type:'float'}],['--overlay-depth',{type:'float',min:0,max:1,default:0}],]);this.vars.init();element.addEventListener('pointerdown',e=>e.stopPropagation());element.addEventListener('click',e=>e.stopPropagation())}
generate(){}
update(delta){this.vars.update(delta);this.vars.location.offset=this.vars.overlayOffset;this.v.fromLocation(this.vars.location,this.globe);this.m.xyz=this.v.xyz;this.view.rotateMatrix(this.m,this.q,this.r);this.view.projectMatrix(this.q,this.p,this.c);this.c.divide(this.view.pxRatio);let a=this.globe.getBackOpacity(this.r);this.element.style.opacity=a;let s=1;if(this.vars.overlayDepth)s*=1+this.r.z*this.vars.overlayDepth/2;this.element.style.transform=`translate(${this.c.x}px, ${this.c.y}px) translate(${this.origin})`+((s!==1)?` scale(${s})`:'');let bounds=this.element.getBoundingClientRect();this.rel.x=(bounds.left+bounds.width/2-this.view.bounds.left)*this.view.pxRatio-this.view.hw;this.rel.y=(bounds.top+bounds.height/2-this.view.bounds.top)*this.view.pxRatio-this.view.hh;this.relSq=this.rel.lengthSq();this.element.style.pointerEvents=(this.r.z<0&&this.relSq<this.view.radiusSq)?'none':''}}
export class HyperGlobe extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});this.shadowRoot.innerHTML=ShadowDOM;this.wrap=this.shadowRoot.querySelector('#wrap');this.frontCanvas=this.wrap.querySelector('#front');this.backCanvas=this.wrap.querySelector('#back');this.glCanvas=this.wrap.querySelector('#points');this.background=this.wrap.querySelector('#background');this.foreground=this.wrap.querySelector('#foreground');this.completionConditions=0;this.imgloader=new ImgLoader(this.getAttribute('data-baseurl'));this.timer=new Timer();this.center=new Location();this.autorotation=new Autorotate(this);this.view=new View(this);this.renderer=new Renderer(this);this.view.renderer=this.renderer;this.points=new Points(this);this.slotMarkers=this.shadowRoot.querySelector('slot[name=markers]');this.slotTexts=this.shadowRoot.querySelector('slot[name=texts]');this.slotLines=this.shadowRoot.querySelector('slot[name=lines]');this.slotOverlays=this.shadowRoot.querySelector('slot[name=overlays]');this.panning=new Panning(this);this.pointer=new Pointer(this.wrap);this.overMarker=null;this.downMarker=null;this.setOverMarker=m=>{if(this.overMarker===m)return;if(m){if(this.overMarker)this.overMarker.out();this.overMarker=m;this.overMarker.over()}else if(this.overMarker){this.overMarker.out();this.overMarker=null}};this.pointer.toLocalPosition=(x,y)=>{return[(x-this.view.bounds.x)*this.view.pxRatio,(y-this.view.bounds.y)*this.view.pxRatio]};this.pointer.down=e=>{if(this.panning.enabled)this.autorotation.stop();this.panning.stop();let hit=this.view.hitTest();this.downMarker=hit;this.setOverMarker(hit)};this.pointer.move=e=>{if(!this.pointer.grabbing){this.setOverMarker(this.view.hitTest())}};this.pointer.up=e=>{let hit=this.view.hitTest();if(hit&&this.downMarker&&this.downMarker===hit&&(this.persistent||Date.now()-this.pointer.downTime<400))hit.click();this.downMarker=null;if(this.persistent){this.setOverMarker(hit)}};this.pointer.cancel=e=>{this.downMarker=null;this.setOverMarker(null)};this.pointer.out=e=>{this.setOverMarker(null)};this.pointer.panStart=e=>{this.panning.start(e);this.downMarker=null;this.setOverMarker(null)};this.pointer.panMove=e=>{this.panning.move(e)};this.pointer.panEnd=(e,sx,sy)=>{this.panning.end(e,sx,sy)};this.vars=new Vars(this,[['data-location',{type:'location',attr:!0,init:!0,callback:v=>this.location=v}],['data-comment',{type:'string',attr:!0}],['--globe-scale',{type:'float',min:0.001,max:10,default:0.8}],['--globe-draggable',{type:'bool',default:!0,init:!0,callback:v=>{if(v){this.wrap.classList.add('draggable');this.wrap.classList.toggle('pan-x',this.vars.globeLatitudeLimit===0);this.panning.enable()}else{this.wrap.classList.remove('draggable');this.wrap.classList.remove('pan-x');this.panning.disable()}}}],['--globe-latitude-limit',{type:'float',min:0,max:90,default:90,callback:v=>{this.wrap.classList.toggle('pan-x',this.vars.globeDraggable&&v===0)}}],['--globe-damping',{type:'float',min:0.01,max:1,default:0.5}],['--globe-axial-tilt',{type:'float',min:-45,max:45,init:!0,callback:v=>{this.view.rotation.z=Utils.deg2Rad(v)}}],['--globe-quality',{type:'keyword',default:'high',init:!0,callback:()=>this.updateQuality()}],['--globe-background',{type:'url',init:!0,callback:v=>{if(v){let callback=null;if(!this.ready){this.completionConditions++;callback=()=>this.completionConditions--}
this.imgloader.get(v,r=>{if(callback)callback();if(r.failed){this.background.style.backgroundImage='';return}
this.background.style.backgroundImage=`url("${r.img.src}")`})}else{this.background.style.backgroundImage=''}}}],['--globe-foreground',{type:'url',init:!0,callback:v=>{if(v){let callback=null;if(!this.ready){this.completionConditions++;callback=()=>this.completionConditions--}
this.imgloader.get(v,r=>{if(callback)callback();if(r.failed){this.foreground.style.backgroundImage='';return}
this.foreground.style.backgroundImage=`url("${r.img.src}")`})}else{this.foreground.style.backgroundImage=''}}}],['--map-density',{type:'float',min:0.01,max:1,default:0.5,callback:()=>this.points.regenerate=!0}],['--map-height',{type:'float',min:0,max:2,callback:()=>this.points.regenerate=!0}],['--antarctica',{type:'bool',callback:()=>this.points.regenerate=!0}],['--equator',{type:'bool',callback:()=>this.points.regenerate=!0}],['--islands',{type:'bool',callback:()=>this.points.regenerate=!0}],['--add-points',{type:'locations',callback:()=>this.points.regenerate=!0}],['--remove-points',{type:'locations',callback:()=>this.points.regenerate=!0}],['--autorotate',{type:'bool',callback:v=>{if(!v)this.autorotation.stop()}}],['--autorotate-speed',{type:'float',min:-10,max:10,default:1}],['--autorotate-delay',{type:'float',min:0,default:1}],['--autorotate-latitude',{type:'float',min:-90,max:90,default:null}],['--animation',{type:'keyword',default:'none'}],['--animation-speed',{type:'float',min:0,max:1,default:0.25}],['--animation-scale',{type:'float',min:0,max:1,default:0.25}],['--animation-intensity',{type:'float',min:0,max:1,default:0.25}],['--point-color',{type:'color',default:'#999999',init:!0,callback:v=>{if(!this.vars.pointColorMap)this.points.clearColor()}}],['--point-color-map',{type:'url',init:!0,callback:v=>{if(v){let callback=null;if(!this.ready){this.completionConditions++;callback=()=>this.completionConditions--}
this.points.loadColorMap(v,callback)}else{this.points.clearColor()}}}],['--point-color-blend',{type:'keyword',default:'replace'}],['--point-opacity',{type:'float',min:0,max:1,default:1,init:!0,callback:v=>{if(!this.vars.pointOpacityMap)this.points.clearOpacity()}}],['--point-opacity-map',{type:'url',init:!0,callback:v=>{if(v){let callback=null;if(!this.ready){this.completionConditions++;callback=()=>this.completionConditions--}
this.points.loadOpacityMap(v,callback)}else{this.points.clearOpacity()}}}],['--point-edge-opacity',{type:'float',min:0,max:1,default:1}],['--point-image',{type:'url',init:!0,callback:v=>{if(v){let callback=null;if(!this.ready){this.completionConditions++;callback=()=>this.completionConditions--}
this.imgloader.get(v,r=>{if(callback)callback();if(r.failed)return;this.renderer.updateTexture(r.img)})}else{this.renderer.useTexture=!1}}}],['--point-size',{type:'float',min:0.1,max:10,default:1}],['--backside-color',{type:'color',default:''}],['--backside-opacity',{type:'float',min:0,max:1,default:0.2}],['--backside-transition',{type:'float',min:0,max:1,default:0.1}],]);this.vars.init();this.view.updateBounds(this.getBoundingClientRect());this.setAttribute('data-state','loading');this.ready=!0;Utils.dispatch(this,'init')}
complete(){if(this.completed)return;this.completed=!0;Utils.waitFor(()=>this.completionConditions===0,()=>this.disposed,()=>{this.setAttribute('data-state','complete');this.wrap.classList.add('complete');Utils.dispatch(this,'complete')})}
connectedCallback(){this.requestUpdate()}
disconnectedCallback(){this.cancelUpdate();this.pointer.cancel();this.panning.stop()}
set location(v){this.center.parse(v);this.updateCenter();this.autorotation.stop();this.pointer.cancel();this.panning.stop()}
get location(){return this.center.toString()}
updateCenter(){if(this.vars.globeLatitudeLimit<90){this.center.lat=Utils.clamp(this.center.lat,-this.vars.globeLatitudeLimit,this.vars.globeLatitudeLimit)}
this.vars.location=this.center.clone();this.view.rotation.x=Utils.deg2Rad(this.center.lat);this.view.rotation.y=Utils.deg2Rad(this.center.lng+90);if(this.completed){Utils.dispatch(this,'change')}}
getObj(n){if(!n instanceof HTMLElement)return null;let slot=n.getAttribute('slot');if(slot==='markers'){if(!n.markerObj)n.markerObj=new Marker(this,n);return n.markerObj}else if(slot==='texts'){if(!n.textObj)n.textObj=new Text(this,n);return n.textObj}else if(slot==='lines'){if(!n.lineObj)n.lineObj=new Line(this,n);return n.lineObj}else if(slot==='overlays'){if(!n.overlayObj)n.overlayObj=new Overlay(this,n);return n.overlayObj}
return null}
getConf(p1,p2,p3){if(p1 instanceof HTMLElement){let obj=this.getObj(p1);if(!obj)return'';return obj.vars.getConf(p2,p3)}else{return this.vars.getConf(p1,p2)}}
get(p1,p2){if(p1 instanceof HTMLElement){let obj=this.getObj(p1);if(!obj)return'';return obj.vars.get(p2)}else{return this.vars.get(p1)}}
set(p1,p2,p3){if(p1 instanceof HTMLElement){let obj=this.getObj(p1);if(!obj)return;return obj.vars.set(p2,p3)}else{return this.vars.set(p1,p2)}}
ani(p1,p2,p3){if(p1 instanceof HTMLElement){let obj=this.getObj(p1);if(!obj)return null;return obj.vars.animate(p2,p3)}else{return this.vars.animate(p1,p2)}}
getDistance(from,to){return new Location().parse(from).distanceTo(new Location().parse(to))}
getLocation(clientX=0,clientY=0,tolerance=32){for(let p of this.points.all){this.view.projectMatrix(p.q,p.p,p.c)}
let c=new V2(clientX-this.view.bounds.left,clientY-this.view.bounds.top);c.multiply(this.view.pxRatio);tolerance*=this.view.pxRatio;let nearest,nd=Infinity;for(let p of this.points.all){if(p.r.z<0)continue;let d=Utils.distance(c.x-p.c.x,c.y-p.c.y);if(d<=tolerance&&d<nd){nd=d;nearest=p}}
if(nearest){return nearest.l.toString()}
return''}
getPosition(location,offset=0){let l=new Location().parse(location);l.offset=offset;let v=new V3().fromLocation(l,this.globe);let r=new V3();let m=new Matrix(v);let q=new Matrix();let p=new Matrix();let c=new V2();this.view.rotateMatrix(m,q,r);this.view.projectMatrix(q,p,c);c.divide(this.view.pxRatio);return[...c]}
get markers(){return this.slotMarkers.assignedElements()}
get texts(){return this.slotTexts.assignedElements()}
get lines(){return this.slotLines.assignedElements()}
get overlays(){return this.slotOverlays.assignedElements()}
dispose(){this.disposed=!0;this.ready=!1;this.cancelUpdate();this.vars.dispose();this.imgloader.dispose();this.pointer.dispose();this.renderer.dispose();delete this.points.colors;delete this.points.alphas;delete this.points.heights;this.shadowRoot.innerHTML='';this.outerHTML=''}
fail(){this.dispose()}
getOffset(location){location.o=1+location.offset*0.2;if(location.forceMapHeight===undefined){location.o+=this.points.heightAt(location)*this.vars.mapHeight*0.2}else if(location.forceMapHeight!==0){location.o+=location.forceMapHeight*this.vars.mapHeight*0.2}
return location.o}
getBackOpacity(r){if(Math.abs(r.z)<this.vars.backsideTransition){return Utils.lerp(this.vars.backsideOpacity,1,(r.z+this.vars.backsideTransition)/(this.vars.backsideTransition*2))}else if(r.z<0){return this.vars.backsideOpacity}else{return 1}}
getBackTransition(r){if(Math.abs(r.z)<this.vars.backsideTransition){return Utils.lerp(1,0,(r.z+this.vars.backsideTransition)/(this.vars.backsideTransition*2))}else if(r.z<0){return 1}else{return 0}}
requestUpdate(){if(!this.ready)return;if(this.updateId)return;this.updateId=requestAnimationFrame(()=>this.update())}
cancelUpdate(){if(!this.updateId)return;cancelAnimationFrame(this.updateId);delete this.updateId}
update(){delete this.updateId;this.requestUpdate();let bounds=this.getBoundingClientRect();if(this.view.isHidden(bounds)||this.view.outOfBounds(bounds)){this.pointer.cancel();this.panning.stop();return}
let delta=this.timer.delta;this.vars.update(delta);this.view.updateBounds(bounds);if(this.completed){if(this.pointer.persistent&&!this.pointer.grabbing){this.setOverMarker(this.view.hitTest())}
this.panning.update(delta);if(this.autorotation.enabled){this.autorotation.update(delta)}else if(this.vars.autorotate&&!this.pointer.captured&&!this.panning.slide){this.autorotation.start()}}
this.view.draw(delta);this.updateOverlays(delta);if(this.overMarker&&!this.wrap.classList.contains('clickable')){this.wrap.classList.add('clickable')}else if(!this.overMarker&&this.wrap.classList.contains('clickable')){this.wrap.classList.remove('clickable')}}
updateOverlays(delta){let overlays=[];for(let n of this.overlays){let o=this.getObj(n);if(o.vars.cs.display==='none')continue;o.update(delta);overlays.push(o)}
overlays.sort((a,b)=>a.r.z-b.r.z);let z=1;for(let o of overlays){if(z<102&&o.r.z>=0)z=102;o.element.style.zIndex=z++}}
updateQuality(){if(this.vars.globeQuality==='low'){this.view.frontCtx.imageSmoothingEnabled=!1;this.view.backCtx.imageSmoothingEnabled=!1;this.view.pxRatioLimit=1;this.view.maxCanvas=2048}else{this.view.frontCtx.imageSmoothingEnabled=!0;this.view.backCtx.imageSmoothingEnabled=!0;this.view.pxRatioLimit=2;this.view.maxCanvas=4096}}}
if(customElements&&!customElements.get('hyper-globe'))customElements.define('hyper-globe',HyperGlobe)