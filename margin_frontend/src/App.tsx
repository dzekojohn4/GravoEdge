import './index.css';
import { Home } from './routes/index.tsx';
import Pool from './routes/pool.tsx';

function App() {
  return (
    <>
      <Home />
      <div className="w-screen min-h-screen bg-pageBg ">
        <Pool />
      </div>
    </>
  );
}

export default App;
