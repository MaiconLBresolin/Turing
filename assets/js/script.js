const transitions = {
  q0: {
    "*": ["q0", "*", "D"],
    a: ["q2", "X", "D"],
    b: ["q1", "X", "D"],
    X: ["q0", "X", "D"],
    β: ["q4", "β", "D"],
  },
  q1: {
    a: ["q3", "X", "E"],
    b: ["q1", "b", "D"],
    X: ["q1", "X", "D"],
  },
  q2: {
    a: ["q2", "a", "D"],
    b: ["q3", "X", "E"],
    X: ["q2", "X", "D"],
  },
  q3: {
    a: ["q3", "a", "E"],
    b: ["q3", "b", "E"],
    X: ["q0", "X", "D"],
  },
  q4: {},
}

let estAtual = "q0"
let posi = 0
let passos = []
let terminou = false
let fita = []

document.getElementById("entrada").addEventListener("input", function (event) {
  const ehValido = event.target.value.replace(/[^ab]/g, "")
  if (event.target.value !== ehValido) {
    event.target.value = ehValido
  }
})

function inicioAuto() {
  if (terminou) return

  const input = document.getElementById("entrada").value.trim()

  if (passos.length === 0) {
    if (!input) {
      alert("Sentença nula.")
      return
    }
    inicializarFita(input)
  }

  const char = fita[posi]
  const transicao = obterTransicao(char)

  if (!transicao) {
    error()
    return
  }

  atualizarFita(transicao)
  registrarPasso()
  atualizaTabela()

  if (estAtual === "q4") {
    exibirResultado()
    terminarExecucao()
    return
  }

  setTimeout(inicioAuto, 200)
}

function inicioManual() {
  if (terminou) return

  const input = document.getElementById("entrada").value.trim()

  if (passos.length === 0) {
    if (!input) {
      alert("Sentença nula.")
      return
    }
    inicializarFita(input)
  }

  const char = fita[posi]
  const transicao = obterTransicao(char)

  if (!transicao) {
    error()
    return
  }

  atualizarFita(transicao)
  registrarPasso()
  atualizaTabela()

  if (estAtual === "q4") {
    exibirResultado()
    terminarExecucao()
    return
  }
}

function obterTransicao(char) {
  return transitions[estAtual][char]
}

function inicializarFita(input) {
  fita = ["*", ...input.split(""), "β"]
  posi = 0
  estAtual = "q0"
  passos = []
  terminou = false
}

function atualizarFita(transicao) {
  const [proximoEst, escreve, direcao] = transicao
  fita[posi] = escreve
  estAtual = proximoEst

  if (direcao === "D") {
    posi++
  } else if (direcao === "E") {
    posi--
  }
}

function registrarPasso() {
  passos.push({
    step: passos.length + 1,
    state: estAtual,
    fita: fita.join(""),
    posi: posi,
    error: false,
  })
}

function exibirResultado() {
  document.getElementById(
    "resultado"
  ).innerText = `Aceita após ${passos.length} passos.`
}

function terminarExecucao() {
  resetaBotao()
  terminou = true
}

function error() {
  passos.push({
    step: passos.length + 1,
    state: estAtual,
    fita: fita.join(""),
    posi: posi,
    error: true,
  })

  atualizaTabela(true)
  document.getElementById(
    "resultado"
  ).innerText = `Rejeitada após ${passos.length} passos.`
  resetaBotao()
  terminou = true
}

function atualizaTabela(isError = false) {
  const tableBody = document.querySelector("#tabela tbody")
  const lastStep = passos[passos.length - 1]
  const row = document.createElement("tr")

  if (isError) {
    row.style.backgroundColor = "rgba(90, 2, 32)"
  } else {
    row.style.backgroundColor =
      estAtual === "q4" ? "rgb(2, 48, 32)" : "transparent"
  }

  const highlightedTape = fita
    .map((char, index) => {
      return index === posi
        ? `<strong style="color: #ffffff;">${char}</strong>`
        : char
    })
    .join("")

  row.innerHTML = `
        <td>${lastStep.step}</td>
        <td>${lastStep.state}</td>
        <td>${highlightedTape}</td>`
  tableBody.appendChild(row)
}

function resetaBotao() {
  document.querySelector('button[onclick="inicioAuto()"]').disabled = false
  document.querySelector('button[onclick="inicioManual()"]').disabled = false
}

function reseta() {
  fita = []
  estAtual = "q0"
  posi = 0
  passos = []
  terminou = false
  document.getElementById("entrada").value = ""
  document.getElementById("tabela").querySelector("tbody").innerHTML = ""
  document.getElementById("resultado").innerText = ""
  resetaBotao()
}
