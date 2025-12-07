import React, { useCallback, useState } from 'react'

function App() {
  const [page, setPage] = useState(0);

  const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

  const skip = 10;
  const totalPages = Math.ceil(items.length / skip);

  const paginated = items.slice(page * skip, (page + 1) * skip);

  const prev = useCallback(() => {
  setPage(p => Math.max(0, p - 1));
  }, []);

  const next = useCallback(() => {
    setPage(p => Math.min(totalPages - 1, p + 1));
  }, [totalPages]);


  return (
    <div className='container'>
      <div className='item'>
        {paginated.map((item, i) => (
        <p key={i}>{item}</p>
      ))}
      </div>

      <div className='btns'>
        <button  onClick={prev} disabled={page === 0}>Prev</button>
      <button onClick={next} disabled={page === totalPages - 1}>Next</button>
      </div>
    </div>
  );
}


export default App
