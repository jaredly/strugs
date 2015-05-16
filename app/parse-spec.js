
export default function parse(text) {
  const lines = text.split('\n')
  const system = {
    'interface': {},
    'enum': {}
  }

  let ctype = null
  let buff = []

  lines.forEach(line => {
    line = line.trim()
    if (line.match(/^interface/)) {
      ctype = 'interface'
      buff = [line]
    } else if (line.match(/^enum/)) {
      ctype = 'enum'
      buff = [line]
    } else if (line === '}') {
      const res = parseBlock[ctype](buff)
      system[ctype][res.name] = res
      buff = []
    } else {
      buff.push(line)
    }
  })
  // console.log(JSON.stringify(system['interface']['ArrowExpression'], null, 2))
  // console.dir(system['enum']['AssignmentOperator'])
  // console.log(system)
  return system
}

const parseBlock = {'interface': parseInterface, 'enum': parseEnum}

function parseEnum(buff) {
  // console.log('enum', buff)
  const name = buff[0].split(/\s/g)[1]
  const items = buff.slice(1).join('').trim().slice(1, -1).split(/"\s*\|\s*"/g)
  return {
    name,
    items,
  }
}

function parseInterface(buff) {
  // console.log('interface', buff)
  const [first, second] = buff.shift().split('<:')
  const name = first.split(/\s/g)[1].trim()
  const inherits = second.trim().slice(0, -1).split(',').map(t => t.trim())
  const renders = []
  while (!buff[0].match(/^\s*type: /)) {
    renders.push(parseRender(buff.shift().trim()))
  }
  const attrs = {
    type: buff.shift().split(':')[1].trim().slice(1, -2),
  }
  buff.forEach(line => {
    line = line.trim().replace(/\/\/.+/g, '')
    if (!line.trim()) return
    const [attr, val] = line.trim().slice(0, -1).split(':')
    attrs[attr] = parseIfaceVal(val.trim())
  })
  return {
    name,
    inherits,
    renders,
    attrs,
  }
}

function parseIfaceVal(val) {
  if (val === 'boolean') {
    return 'boolean'
  }
  const res = {}
  if (val[0] === '[' && val[val.length - 1] === ']') {
    res.isArray = true
    val = val.slice(1, -1).trim()
  }
  res.alts = val.split(/\s*\|\s*/g).map(t => t.trim())
  if (res.alts[0][0] === '"') {
    res.alts = res.alts.map(m => m.slice(1, -1))
    res.isEnum = true
  }
  return res
}

function parseRender(render) {
  let at = 0
  let parts = []
  let conditional = 'default'
  if (render[0] === '?') {
    conditional = render.split(' ')[0].slice(1)
    render = render.slice(conditional.length + 2)
  }
  render.replace(/\<\w+,?\>/g, function (matched, pos) {
    parts.push(render.slice(at, pos))
    at = pos + matched.length
    const sep = matched[matched.length - 2] === ',' ? ',' : ''
    const attr  = matched.slice(1, -1 - sep.length)
    const part = {attr}
    if (sep) part.sep = sep
    parts.push(part)
  })
  return {cond: conditional, render: parts}
}

