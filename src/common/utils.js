export function debounce(func, delay) {
  let  timer = null
  return function (...args) {
    if(timer) clearTimeout(func)
    timer = setTimeout(() =>{
      func.apply(this, args)
    },delay)
  }
}
