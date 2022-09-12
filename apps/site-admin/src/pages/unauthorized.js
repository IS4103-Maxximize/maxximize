function Unauthorized() {
  return (
    <div className="container" style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <main className="textField">
            <h1 style={{fontSize: 30}}>You are unauthorized! Please go back.</h1>
        </main>
    </div>
  )
}

export default Unauthorized