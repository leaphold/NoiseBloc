import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
<main className="main">
<div >
      <h2>Own what you Own</h2>

      <p className="info">NoiseBloc product aims to revolutionize the way composers, producers, and all creators of audio content protect and manage their intellectual property rights. By integrating watermarking technology with the Polygon network, a part of the Ethereum blockchain, this software allows for the secure watermarking of audio files, enabling the tracking of ownership, transfers of ownership, and rights associated with each piece of audio content.
<br></br>
The vision behind this technology is to create a robust watermarking system capable of withstanding compression, decompression, and even AI-generated alterations, ensuring that the original source of the audio can always be traced back with just a second of the watermarked original clip.
<br></br>
In essence, this product aims to preserve the value of human-created audio content amidst the rise of AI-generated music, preventing a potential devaluation of human creativity. Much like how natural diamonds are distinguished from synthetic ones, this technology adds a layer of authenticity and value to audio content created by humans.</p>
    </div>
    </main>
  )
}
