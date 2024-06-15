export const getSqlParams = (obj, orderText) => {
  const ks = orderText.split(',').map((v) => v.trim())
  const t = []
  for (let k of ks) {
    t.push(obj[k])
  }
  return t
}
