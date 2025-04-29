
function not_found() {
  return (
    <section id="not_found-section">
        <h1>Rota nao valida!</h1>
        <p>Parece que voce acessou a rota errada.</p>
        <p>Verifique se a URL esta certa, ou contate o provedor do servico.</p>
        <div id="not_found-image"><img src="/imgs/erro-404.png"/></div>
    </section>
  )
}

export default not_found