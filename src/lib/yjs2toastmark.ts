export type Pos = {line: number, ch: number}
export type Change = {from: Pos, to: Pos, text: Array<string>}

export function delta2ChangeObj(rowLenList, deltaList, log) {
  log("ROWLENLIST", rowLenList)
  let pos = {line: 0, ch: 0}

  return [deltaList.map((delta) => {
    log("ROWLENLIST", rowLenList)
    log(delta)
    if (delta.insert) {
      let rowLen = delta.insert.split("\n").map((e) => e.length)
      let restLen = (rowLenList[pos.line] || 0) - pos.ch

      if (rowLen.length == 1) {
        rowLenList[pos.line] = (rowLenList[pos.line] || 0) + rowLen[0]
      } else if (rowLen.length > 1) {
        rowLenList[pos.line] = pos.ch + rowLen[0]
    log("ROWLENLIST", rowLenList)
        rowLenList.splice(pos.line+1, 0, ...rowLen.slice(1,-1))
    log("ROWLENLIST", rowLenList)
        rowLenList.splice(pos.line+rowLen.length-1, 0, rowLen[rowLen.length-1] + restLen)
      }
    log("ROWLENLIST", rowLenList)

      let oldpos = {...pos}
      pos = {line: pos.line+rowLen.length-1, ch: rowLen[rowLen.length-1]}
      log("POS:", pos)
      return {from: oldpos, to: oldpos, text: delta.insert.split("\n")}

    } else if (delta.retain) {
      let ch = delta.retain
      let line = 0
      for (; line < rowLenList.length; line++) {
        log(ch)
        if (ch <= rowLenList[line]) {
          pos = {line: line, ch: ch}
          break
        }
        ch -= rowLenList[line] + 1
      }
      log("POS:", pos)
      return
    } else if (delta.delete) {
      let remain = delta.delete
      let toPos = {...pos}

      while (remain > 0) {
        if (pos.line >= rowLenList.length) {
          break
        }
        let maxDelete = rowLenList[pos.line] - pos.ch
        log(remain, maxDelete)

        // inter-line delete
        if (remain > maxDelete) {
          remain -= maxDelete + 1
          // remove current line at all
          if (pos.ch == 0) {
            rowLenList.splice(pos.line, 1)
          } else {
            if (pos.line+1 >= rowLenList.length) {
              break
            }
            rowLenList[pos.line] += rowLenList[pos.line+1]
            rowLenList.splice(pos.line+1, 1)
          }
          toPos.line += 1
        } else {
          rowLenList[pos.line] -= remain
          toPos.ch += remain
          break
        }
      }
      log(remain)
      return {from: pos, to: toPos, text: []}
    }
  }).filter((e) => e), pos]
}

export function today(path: string) {
    let elems = path.split("/")
    let firstNonIntPos = elems.findIndex((e) => e.length > 0 && isNaN(parseInt(e)))
    let date = new Date()
    let dateArray = [
        String(date.getFullYear()).padStart(2, '0'),
        String(date.getMonth()+1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ]
    if (firstNonIntPos == -1) {
        dateArray.splice(0, 0, 'dia')
    }
    return elems.slice(0, firstNonIntPos+1).concat(dateArray).join('/')
}
