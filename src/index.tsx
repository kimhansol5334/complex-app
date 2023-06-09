import ReactDOM from 'react-dom'
import { useEffect, useState, useRef } from 'react';
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
        worker:true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    })
    // console.log(service)
  }

  useEffect(() => {
    startService()
  }, [])

  const onClick = async () => {
    if(!ref.current) {
        return
    }
    const result = await ref.current.build({
        entryPoints:['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(),
                  fetchPlugin(input)],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window'
        }
    })
    console.log(result)

 setCode(result.outputFiles[0].text)
  try{
   eval(result.outputFiles[0].text);
  } catch(err){
    alert(err)
  }
  }


    return <div>
        <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        <pre>{code}</pre>
        <iframe src='/test.html'/>
    </div>
};

ReactDOM.render(
    <App/>,
    document.querySelector('#root')
)