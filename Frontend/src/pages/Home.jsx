import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Vidnest</h1>
      <p>Your personal video library</p>
      <nav>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  )
}

export default Home
