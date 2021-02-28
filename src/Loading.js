import {useEffect, useRef} from 'react'

let timer = 0
let index = 0

export let Loading = (props) => {
  let indicator = ['🌑','🌒','🌓','🌔','🌝','🌕','🌖','🌗','🌘','🌚']
  const ref = useRef({})
  useEffect(() => {
    timer = setInterval(() => {
      index = (index+1)%indicator.length
      ref.current.innerHTML = indicator[index] + ' ' + props.text
    }, 300);
    return () => {
      clearInterval(timer)
    };
  })
  return <div ref={ref} className="loading">{indicator[index]} {props.text}</div>
}

export default Loading;