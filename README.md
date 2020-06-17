# react-es-hot-loader

react-hot-loader for esmodule.  
Only support FunctionComponent!!

## hot

triggle while you import the same module again, e:  
`import Btn from 'src/components/Btn.js?t=1'`  
(add params to avoid cache.)

```js
import { hot } from 'react-es-hot-loader';

function Btn() {
  ...
}

export default hot(import.meta, Btn);
```
