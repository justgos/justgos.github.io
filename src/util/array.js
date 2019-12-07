export function shuffle(a, stride=1, repeatIndices=null, repeatStride=1) {
  let ii = 0;
  let indices = [];
  for (let i = a.length - stride; i > 0; i -= stride) {
    const j = repeatIndices ? repeatIndices[ii++] / repeatStride * stride : Math.floor(Math.random() * (i / stride + 1)) * stride;
    indices.push(j);
    for(let k=0; k<stride; k++)
      [a[i+k], a[j+k]] = [a[j+k], a[i+k]];
  }
  return indices;
}
