
import React from 'react'
import RCSS from 'rcss'

import makeFlux from './flux'
import App from './app'

const PT = React.PropTypes

let ex = `const a = 23
let b = a + 23 * 2
let c = "aweom"
`

const flux = makeFlux(ex)
window.flux = flux
React.render(flux.wrap(<App initial={ex}/>),
             document.getElementById('root'))

RCSS.injectAll()

