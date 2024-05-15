
import React from 'react';
import Image from 'next/image';
function About() {
  return (
    <div className="aboutMain">
      <Image className="aboutImage" 
        src="/images/about.jpg"
        alt="Picture of the founder of NoiseBloc"
        width={324}
        height={405}
      />
<div>
      <h1>About</h1>
      <p className="info">
  Alfred Jimenez Ph.D. is a contemporary music composer and thinker whose artistic approach often stems from the foundation of silence, which he views as a physical material that requires great effort to transform into sound. He strives to create music that showcases the performer's struggle between freedom and strain, generating a universe of contrasting emotions. Alfred received his master's degree from Malmö Academy of Music under the guidance of Prof. Luca Francesconi and later completed his studies at Universität fur Musik und Darstellende Kunst in Vienna under the tutelage of Prof. Detlev Müller-Siemens.
      </p>
</div>
    </div>
  );
}

export default About;
