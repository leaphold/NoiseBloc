
import React from 'react';
import Link from 'next/link';

function Header() {
  return (
      <nav className="navHeader">
        <Link href="/">
      <h1 className="h1noice">NoiseBloc</h1>
        </Link>
<div>

        <Link href="/contact"> <h2 className="h2noice">| Contact |</h2> </Link> 
        <Link href="/blox"> <h2 className="h2noice">| the Bloc |</h2> </Link> 
        <Link href="/noise"> <h2 className="h2noice">| the Noise |</h2> </Link>
        <Link href="/mark"> <h2 className="h2noice">| Make a NoiseBloc |</h2> </Link>
        <Link href="/about"> <h2 className="h2noice">| About |</h2> </Link>
  
  <div style={{ clear: 'both' }}></div>
</div>
      </nav>
  );
}

export default Header;
